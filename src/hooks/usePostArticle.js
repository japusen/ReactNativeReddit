import { useQuery } from "@tanstack/react-query";
import { getPostArticle } from "../requests/PostArticle";
import parsePost from "../utils/ParsePost";
import parseCommentTree from "../utils/ParseCommentThread";

export const usePostArticle = (token, article, subreddit, sort) => {
	const { data, error, isLoading, isError } = useQuery({
		queryKey: ["getArticle", article, sort],
		queryFn: () => getPostArticle(token, article, subreddit, sort),
	});

	return {
		post: data ? parsePost(data.post) : null,
		commentThread: data ? parseCommentTree(data.comments, 2) : null,
		error,
		isLoading,
		isError,
	};
};
