import {createRoot} from "react-dom/client";
import App from "@/App";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import './styles/global.scss'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App/>
  </QueryClientProvider>
)
