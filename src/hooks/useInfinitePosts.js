import { useInfiniteQuery } from "@tanstack/react-query";
import { getSubreddit } from "../requests/Subreddit";

const parsePosts = (data) => {
	const posts = new Array();
	const uniquePostIDs = new Set();

	data.pages.forEach((page) =>
		page.children.forEach((wrapper) => {
			const post = wrapper.data;
			if (!uniquePostIDs.has(post.id)) {
				uniquePostIDs.add(post.id);
				posts.push(post);
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
			getSubreddit(token, feed, sort, topSort, pageParam),
		initialPageParam: null,
		getNextPageParam: (lastPage, _) => lastPage.after,
	});

	const fetchMorePosts = () => {
		hasNextPage && !isFetching && fetchNextPage();
	};

	return {
		isPending,
		isError,
		posts: data ? parsePosts(data) : [],
		error,
		isFetchingNextPage,
		fetchMorePosts,
	};
};
