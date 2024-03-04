import { useInfiniteQuery } from "@tanstack/react-query";
import { getSubredditListing } from "../requests/SubredditListing";
import parsePost from "../utils/ParsePost";

const getPostsByPage = (data) => {
	const posts = new Array();
	const uniquePostIDs = new Set();

	data.pages.forEach((page) =>
		page.children.forEach((wrapper) => {
			const parsedPost = parsePost(wrapper.data);
			if (!uniquePostIDs.has(parsedPost.id)) {
				uniquePostIDs.add(parsedPost.id);
				posts.push(parsedPost);
			}
		})
	);

	return posts;
};

export const useInfinitePosts = (token, feed, sort, topSort) => {
	const {
		isPending,
		isError,
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["getSubredditListing", feed, sort, topSort],
		queryFn: ({ pageParam }) =>
			getSubredditListing(token, feed, sort, topSort, pageParam),
		initialPageParam: null,
		getNextPageParam: (lastPage, _) => lastPage.after,
	});

	const fetchMorePosts = () => {
		hasNextPage && !isFetching && fetchNextPage();
	};

	return {
		isPending,
		isError,
		posts: data ? getPostsByPage(data) : [],
		error,
		isFetchingNextPage,
		fetchMorePosts,
	};
};
