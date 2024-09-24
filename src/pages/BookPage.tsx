import {fetchBookById} from "@/api/books-api";
import {useQuery} from "@tanstack/react-query";
import {useLocation, useNavigate, useParams} from "react-router-dom";

const BookPage = () => {
    const {id = '0' } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const location = useLocation()

    const {data: book, isLoading, error} = useQuery({
      queryKey: ['book', id],
      queryFn: () => fetchBookById(+id),
    });

    console.log('book', book)

    if (isLoading) return <div style={{textAlign: "center"}}>Loading...</div>;
    if (error instanceof Error) return <div style={{textAlign: "center"}}>Error: {error.message}</div>;

    const handleReturnToAllBooks = () => {
      const searchParams = location.search;
      console.log(searchParams)
      navigate(`/${searchParams}`)
    }

    return (
      <>
        <button onClick={handleReturnToAllBooks}>return</button>

        {book && <div>
          <h2 style={{textAlign: "center"}}>{book.title}</h2>
          <img alt={book.title} src={book.formats["image/jpeg"]}/>
          {book.authors.map(a => <h3 key={a.name}>{`Author: ${a.name} ${a.birth_year}-${a.death_year}`}</h3>)}
          <h3>{`languages: ${book.languages}`}</h3>
          {book.translators.map(t => <h3 key={t.name}>{`Translator: ${t.name} ${t.birth_year}-${t.death_year}`}</h3>)}
          <h3>{`subjects: ${book.subjects}`}</h3>
          <h3>{`downloads: ${book.download_count}`}</h3>
          {book.bookshelves.map((bs, i) => <h3 key={i}>{`bookshelves: ${bs}`}</h3>)}

          {book.copyright && <h3>©</h3>}

        </div>}
      </>
    );
  }
;

export default BookPage;
