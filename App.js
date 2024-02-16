import Main from "./src/components/Main";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Main />
		</QueryClientProvider>
	);
}
