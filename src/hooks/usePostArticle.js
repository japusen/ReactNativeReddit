import { useQuery } from "@tanstack/react-query";
import { getPostArticle } from "../requests/PostArticle";

export const usePostArticle = (
	token,
	article,
	subreddit,
	sort,
	specificComment
) => {
	const { data, error, isLoading, isError } = useQuery({
		queryKey: ["getArticle", article, sort, specificComment],
		queryFn: () =>
			getPostArticle(token, article, subreddit, sort, specificComment),
	});

	return {
		post: data ? data.post : null,
		commentThread: data ? data.comments : null,
		error,
		isLoading,
		isError,
	};
};
