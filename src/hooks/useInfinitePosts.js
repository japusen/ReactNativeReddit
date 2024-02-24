import { useInfiniteQuery } from "@tanstack/react-query";
import { getSubreddit } from "../requests/Subreddit";

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
		queryKey: ["getSubredditListing"],
		queryFn: ({ pageParam }) =>
			getSubreddit(token, feed, sort, topSort, pageParam),
		initialPageParam: null,
		getNextPageParam: (lastPage, _) => lastPage.after,
	});

	const posts = new Array();
	const uniquePostIDs = new Set();

	data &&
		data.pages.forEach((page) =>
			page.children.forEach((wrapper) => {
				const post = wrapper.data;
				if (!uniquePostIDs.has(post.id)) {
					uniquePostIDs.add(post.id);
					posts.push(post);
				}
			})
		);

	const fetchMorePosts = () => {
		hasNextPage && !isFetching && fetchNextPage();
	};

	return {
		isPending,
		isError,
		posts,
		error,
		isFetchingNextPage,
		fetchMorePosts,
	};
};
