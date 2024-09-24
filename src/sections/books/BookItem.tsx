import {FC} from "react";
import s from './BooksView.module.scss'
import {Author} from "@/api/books-api";
import {useQueryClient} from "@tanstack/react-query";

const BookItem: FC<Props> = (props) => {
  const {authors, cover, downloads, title, id, onClick} = props
  const queryClient = useQueryClient()

  return (
    // <div key={id} className={`${s.bookItem} ${s.visited}`} onClick={() => onClick(() => onClick(id)}>
    <div key={id} className={`${s.bookItem} ${queryClient.getQueryData(['books', id])? s.visited: ''}`} onClick={() => onClick(id)}>
      <h3 className={s.bookTitle}>{title}</h3>
      <img alt={title} src={cover} className={s.bookCover}/>
      {authors.map(a => <h4 key={a.name} className={s.bookAuthor}>{`${a.name} ${a.birth_year} - ${a.death_year}`}</h4>)}

      <h5 className={s.downloads}>{`downloads: ${downloads}`}</h5>
    </div>
  );
};

export default BookItem;

type Props = {
  id: number
  cover: string
  title: string
  authors: Author[]
  downloads: number
  onClick: (id:number) => void
}