import { useQuery } from "@tanstack/react-query";
import { getPostArticle } from "../requests/PostArticle";

export const usePostArticle = (token, article, subreddit, sort) => {
	const { data, error, isLoading, isError } = useQuery({
		queryKey: ["getArticle", article, sort],
		queryFn: () => getPostArticle(token, article, subreddit, sort),
	});

	return {
		post: data ? data.post : null,
		commentThread: data ? data.comments : null,
		error,
		isLoading,
		isError,
	};
};
