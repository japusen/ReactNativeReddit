import { useInfiniteQuery } from "@tanstack/react-query";
import { getSubredditListing } from "../requests/SubredditListing";
import { getUserSubmissions } from "../requests/UserContent";
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

const useInfinitePosts = (token, requestFn, path, sort, topSort) => {
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
		queryKey: ["infinitePosts", path, sort, topSort],
		queryFn: ({ pageParam }) =>
			requestFn(token, path, sort, topSort, pageParam),
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

export const useSubredditListing = (token, feed, sort, topSort) => {
	return useInfinitePosts(token, getSubredditListing, feed, sort, topSort);
};

export const useProfilePostListing = (token, username, sort, topSort) => {
	return useInfinitePosts(token, getUserSubmissions, username, sort, topSort);
};
