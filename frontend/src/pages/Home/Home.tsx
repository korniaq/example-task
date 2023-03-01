import APIProvider from "../../components/APIProvider";
import LogForm from "../../components/LogForm";
import LogList from "../../components/LogList";
import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api/";
const queryClient = new QueryClient();

export default function Home() {
  return (
    <div className="home-container">
      <QueryClientProvider client={queryClient}>
        <APIProvider>
          <LogForm />
          <LogList header="List of relevant lines sorted by timestamp" />
        </APIProvider>
      </QueryClientProvider>
    </div>
  );
}
