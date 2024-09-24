import {fetchBookById} from "@/api/books-api";
import {useQuery} from "@tanstack/react-query";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import Button from "@/common/button/Button";
import s from './BookPage.module.scss'
import Spinner from "@/common/spinner/Spinner";

const BookPage = () => {
    const {id = '0'} = useParams<{ id: string }>()
    const navigate = useNavigate()
    const location = useLocation()

    const {data: book, isLoading, error} = useQuery({
      queryKey: ['book', id],
      queryFn: () => fetchBookById(Number(id)),
    });

    if (error instanceof Error) return <div style={{textAlign: "center", color: "red"}}>Error: {error.message}</div>;

    const handleReturnToAllBooks = () => {
      const searchParams = location.search;
      navigate(`/${searchParams}`)
    }

    return (
      <div className={s.bookDetailsContainer}>
        <Button onClick={handleReturnToAllBooks} disabled={isLoading}>Go Back</Button>

        {isLoading ? <Spinner/> : (book &&
          <div className={s.bookCard}>
            <h2 className={s.bookTitle}>{book.title}</h2>
            <img
              alt={book.title}
              src={book.formats["image/jpeg"]}
              className={s.bookCover}
            />
            <div className={s.bookInfo}>
              {book.authors.map((a) => (
                <h3 key={a.name} className={s.bookAuthor}>
                  {`Author: ${a.name} (${a.birth_year} - ${a.death_year || 'Present'})`}
                </h3>
              ))}
              <h3 className={s.bookLanguages}>{`Languages: ${book.languages.join(', ')}`}</h3>
              {book.translators.map((t) => (
                <h3 key={t.name} className={s.bookTranslator}>
                  {`Translator: ${t.name} (${t.birth_year} - ${t.death_year || 'Present'})`}
                </h3>
              ))}
              <h3 className={s.bookSubjects}>{`Subjects: ${book.subjects.join(', ')}`}</h3>
              <h3 className={s.bookDownloads}>{`Downloads: ${book.download_count}`}</h3>
              {book.bookshelves.length > 0 && (
                <h3 className={s.bookBookshelves}>{`Bookshelves: ${book.bookshelves.join(', ')}`}</h3>
              )}
              {book.copyright && <h3 className={s.bookCopyright}>©</h3>}
            </div>
          </div>
        )}
      </div>
    );
  }
;

export default BookPage;
