import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import BooksPage from "@/pages/BooksPage";
import BookPage from "@/pages/BookPage";

const router = createBrowserRouter([
  {
    path: '/',
    element: <BooksPage/>,
  },
  {
    path: '/:id',
    element: <BookPage/>,
  },
])

export function Router() {
  return <RouterProvider router={router}/>
}