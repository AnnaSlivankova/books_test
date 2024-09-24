import {useInfiniteQuery} from "@tanstack/react-query";
import {fetchBooks} from "@/api/books-api";
import s from './BooksView.module.scss'
import BookItem from "@/sections/books/BookItem";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {useDebounce} from "@/common/hooks/use-debounce";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import TextField from "@/common/textfield/TextField";
import Button from "@/common/button/Button";
import CheckBox from "@/common/checkbox/CheckBox";
import Spinner from "@/common/spinner/Spinner";

const BooksView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [titleQuery, setTitleQuery] = useState<string>(searchParams.get('title') || '');
  const [authorQuery, setAuthorQuery] = useState<string>(searchParams.get('author') || '');
  const [languages, setLanguages] = useState<string[]>(searchParams.get('language') ? searchParams.get('language')!.split(',') : []);

  const currentPageRef = useRef<number>(parseInt(searchParams.get('page') || '1', 10));

  const debouncedTitleQuery = useDebounce(titleQuery, 1000);
  const debouncedAuthorQuery = useDebounce(authorQuery, 1000);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['books', debouncedTitleQuery, debouncedAuthorQuery, languages],
    queryFn: ({pageParam = 1}) => fetchBooks(pageParam, debouncedTitleQuery, debouncedAuthorQuery, languages),
    initialPageParam: 1,
    getNextPageParam: () => currentPageRef.current + 1,
  })

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitleQuery(value);
    updateSearchParams({title: value, author: authorQuery, language: languages.join(','), page: '1'});
  };

  const handleAuthorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAuthorQuery(value);
    updateSearchParams({title: titleQuery, author: value, language: languages.join(','), page: '1'});
  };

  const toggleLanguage = (lang: string) => {
    const updatedLanguages = languages.includes(lang) ? languages.filter((l) => l !== lang) : [...languages, lang];
    setLanguages(updatedLanguages);
    updateSearchParams({title: titleQuery, author: authorQuery, language: updatedLanguages.join(','), page: '1'});
  };

  const updateSearchParams = (newParams: Record<string, string>) => {
    const updatedParams = Object.fromEntries(searchParams.entries());
    let shouldUpdate = false;

    Object.keys(newParams).forEach((key) => {
      if (newParams[key] && updatedParams[key] !== newParams[key]) {
        updatedParams[key] = newParams[key];
        shouldUpdate = true; // Устанавливаем флаг, если есть изменения
      } else if (!newParams[key]) {
        delete updatedParams[key];
        shouldUpdate = true;
      }
    });

    if (shouldUpdate) {
      setSearchParams(updatedParams);
    }
  };

  const clearFilters = () => {
    setTitleQuery('');
    setAuthorQuery('');
    setLanguages([]);
    currentPageRef.current = 1;
    setSearchParams({});
  };

  useEffect(() => {
    const title = searchParams.get('title') || '';
    const author = searchParams.get('author') || '';
    const language = searchParams.get('language') ? searchParams.get('language')!.split(',') : [];
    const page = parseInt(searchParams.get('page') || '1', 10);

    if (title !== titleQuery) setTitleQuery(title);
    if (author !== authorQuery) setAuthorQuery(author);
    if (JSON.stringify(language) !== JSON.stringify(languages)) setLanguages(language);
    currentPageRef.current = page;
  }, [searchParams]);

  const handleScroll = () => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    if (bottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage().then(() => {
        const nextPage = currentPageRef.current + 1;
        currentPageRef.current = nextPage;
        updateSearchParams({
          title: titleQuery,
          author: authorQuery,
          language: languages.join(','),
          page: nextPage.toString(),
        });
      });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage]);


  const onBookClickHandler = (id: number) => {
    const serchParams = location.search
    navigate(`/${id}${serchParams}`)
  }

  if (isError && error instanceof Error) return <div
    style={{textAlign: "center", color: "red"}}>Error: {error.message}</div>;

  return (
    <>
      <div className={s.filtersWrapper}>
        <h3>Filters</h3>
        <div className={s.textInputsWrapper}>
        <TextField placeholder="Search by book title"
                   value={titleQuery}
                   onChange={handleTitleChange}
                   disabled={isLoading}/>
        <TextField placeholder="Search by author name"
                   value={authorQuery}
                   onChange={handleAuthorChange}
                   disabled={isLoading}/>
        </div>
        <div className={s.checkboxesWrapper}>
          <CheckBox
            checked={languages.includes('en')}
            onChange={() => toggleLanguage('en')}
            disabled={isLoading}
          >
            English
          </CheckBox>
          <CheckBox
            checked={languages.includes('de')}
            onChange={() => toggleLanguage('de')}
            disabled={isLoading}
          >
            German
          </CheckBox>
          <CheckBox
            checked={languages.includes('fr')}
            onChange={() => toggleLanguage('fr')}
            disabled={isLoading}
          >
            French
          </CheckBox>
        </div>
        <Button onClick={clearFilters} xType='red' disabled={isLoading}>Clear Filters</Button>
      </div>

      {isLoading ? <Spinner/> : (
        <div className={s.bookGrid}>
          {data?.pages.map((page) => page.results.map((book) => (
            <BookItem
              key={book.id}
              cover={book.formats['image/jpeg'] as string}
              title={book.title}
              authors={book.authors}
              downloads={book.download_count}
              id={book.id}
              onClick={onBookClickHandler}
            />
          )))}
        </div>
      )
      }

      {isFetchingNextPage && <Spinner/>}
    </>
  );
};

export default BooksView;
