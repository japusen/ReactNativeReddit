import Main from "./src/components/Main";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<PaperProvider>
				<Main />
			</PaperProvider>
		</QueryClientProvider>
	);
}
