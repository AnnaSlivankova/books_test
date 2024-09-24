export const fetchBooks = async (page: number, title?: string, author?: string, languages?: string[]): Promise<BooksResponse> => {
  const searchTerms = [title, author].filter(Boolean).join(' ');

  const params = new URLSearchParams({
    page: page.toString(),
    ...(searchTerms && {search: searchTerms}),
    ...(languages?.length && {languages: languages.join(',')}),
  })

  const res = await fetch(`https://gutendex.com/books/?${params}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};


export const fetchBookById = async (id: number): Promise<Book> => {
  const res = await fetch(`https://gutendex.com/books/${id}`);
  if (!res.ok) throw new Error('Failed to fetch book');
  return res.json();
};

export interface Book {
  id: number;
  title: string;
  authors: Author[];
  translators: Translator[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean;
  media_type: string;
  formats: {
    "text/html"?: string;
    "application/epub+zip"?: string;
    "application/x-mobipocket-ebook"?: string;
    "application/rdf+xml"?: string;
    "image/jpeg"?: string;
    "application/octet-stream"?: string;
    "text/plain; charset=us-ascii"?: string;
  };
  download_count: number;
}

export interface BooksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}

export type Author = {
  name: string
  birth_year: number
  death_year: number
}

type Translator = {
  name: string
  birth_year: number
  death_year: number
}