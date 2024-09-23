import {useInfiniteQuery} from "@tanstack/react-query";
import {fetchBooks} from "@/api/books-api";
import s from './BooksView.module.scss'
import BookItem from "@/sections/books/BookItem";
import {ChangeEvent, useEffect, useState} from "react";
import {useDebounce} from "@/common/hooks/use-debounce";
import {useNavigate, useSearchParams} from "react-router-dom";

const BooksView = () => {
  console.log('BooksView render')
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams();
  const [titleQuery, setTitleQuery] = useState<string>(searchParams.get('title') || '');
  const [authorQuery, setAuthorQuery] = useState<string>(searchParams.get('author') || '');
  const [languages, setLanguages] = useState<string[]>(searchParams.get('language') ? [searchParams.get('language')] : []);
  const debouncedTitleQuery = useDebounce(titleQuery, 1000);
  const debouncedAuthorQuery = useDebounce(authorQuery, 1000);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['books', debouncedTitleQuery, debouncedAuthorQuery, languages],
    queryFn: ({pageParam = 1}) => fetchBooks(pageParam, debouncedTitleQuery, debouncedAuthorQuery, languages),
    getNextPageParam: (lastPage) => {
      const nextUrl = lastPage.next;
      if (nextUrl) {
        const urlParams = new URLSearchParams(new URL(nextUrl).search);
        return parseInt(urlParams.get('page') || '1', 10);
      }
      return undefined;
    },
    enabled: true
  });

  console.log('data', data)
  console.log('err', isError)


  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitleQuery(value);
    updateSearchParams({title: value, author: authorQuery, language: languages.join(',')});
  };

  const handleAuthorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAuthorQuery(value);
    updateSearchParams({title: titleQuery, author: value, language: languages.join(',')});
  };

  const toggleLanguage = (lang: string) => {
   const updatedLanguages= setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );

    updateSearchParams({title: titleQuery, author: authorQuery, language: languages.join(',')});

    return updatedLanguages
  };

  const updateSearchParams = (newParams: Record<string, string>) => {
    const updatedParams = Object.fromEntries(searchParams.entries());
    Object.keys(newParams).forEach((key) => {
      if (newParams[key]) {
        updatedParams[key] = newParams[key];
      } else {
        delete updatedParams[key];
      }
    });

    if (Object.keys(updatedParams).length > 0) {
      setSearchParams(updatedParams);
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setTitleQuery('');
    setAuthorQuery('');
    setLanguages([]);
    setSearchParams({});
  };

  useEffect(() => {
    const title = searchParams.get('title') || '';
    const author = searchParams.get('author') || '';
    const language = searchParams.get('language') ? searchParams.get('language')?.split(',') : [];

    setTitleQuery(title);
    setAuthorQuery(author);
    setLanguages(language);

    // updateSearchParams({
    //   title: titleQuery,
    //   author: authorQuery,
    //   ...(languages.length && {language: languages.join(',')
    //   })
    // });
  }, [searchParams]);

  const handleScroll = () => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    if (bottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage]);


  const handleBookClick = (id: number) => {
    console.log("searchParams", ...searchParams)

    const currentParams = {
      title: titleQuery,
      author: authorQuery,
      language: languages.join(','),
    };

    navigate(`${id}?${new URLSearchParams(currentParams)}`)
  }

  if (isLoading) return <div style={{textAlign: "center"}}>Loading...</div>;
  if (error instanceof Error) return <div style={{textAlign: "center"}}>Error: {error.message}</div>;

  return (
    <>
      <button onClick={clearFilters}>Clear Filters</button>
      <input
        type="text"
        placeholder="Search by book title"
        value={titleQuery}
        onChange={handleTitleChange}
      />
      <input
        type="text"
        placeholder="Search by author name"
        value={authorQuery}
        onChange={handleAuthorChange}
      />
      <div>
        <label>
          <input
            type="checkbox"
            checked={languages.includes('en')}
            onChange={() => toggleLanguage('en')}
          />
          English
        </label>
        <label>
          <input
            type="checkbox"
            checked={languages.includes('fr')}
            onChange={() => toggleLanguage('fr')}
          />
          French
        </label>
        <label>
          <input
            type="checkbox"
            checked={languages.includes('de')}
            onChange={() => toggleLanguage('de')}
          />
          German
        </label>
      </div>


      <div className={s.bookGrid}>

        {data?.pages.map(p => p.results.map(b => <BookItem key={b.id} cover={b.formats['image/jpeg']}
                                                           title={b.title}
                                                           authors={b.authors}
                                                           onClick={handleBookClick}
                                                           downloads={b.download_count} id={b.id}/>))}
      </div>

      {isFetchingNextPage && <div style={{textAlign: "center"}}>Loading more...</div>}

    </>
  )
    ;
};

export default BooksView;