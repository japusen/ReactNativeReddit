import { useInfiniteQuery } from "@tanstack/react-query";
import { getSubredditListing } from "../requests/SubredditListing";
import { getUserComments, getUserSubmissions } from "../requests/UserContent";
import parsePost from "../utils/ParsePost";
import parseProfileComment from "../utils/ParseProfileComment";

const CONTENT_TYPE = Object.freeze({
	POST: 0,
	COMMENT: 1,
});

const getContentByPage = (contentType, data) => {
	const content = new Array();
	const uniqueIDs = new Set();

	data.pages.forEach((page) =>
		page.children.forEach((wrapper) => {
			const parsedContent =
				contentType === CONTENT_TYPE.POST
					? parsePost(wrapper.data)
					: parseProfileComment(wrapper.data);
			if (!uniqueIDs.has(parsedContent.id)) {
				uniqueIDs.add(parsedContent.id);
				content.push(parsedContent);
			}
		})
	);

	return content;
};

const useInfiniteListing = (
	token,
	contentType,
	requestFn,
	path,
	sort,
	topSort
) => {
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
		queryKey: ["infinitePosts", contentType, path, sort, topSort],
		queryFn: ({ pageParam }) =>
			requestFn(token, path, sort, topSort, pageParam),
		initialPageParam: null,
		getNextPageParam: (lastPage, _) => lastPage.after,
	});

	const fetchMore = () => {
		hasNextPage && !isFetching && fetchNextPage();
	};

	return {
		isPending,
		isError,
		content: data ? getContentByPage(contentType, data) : [],
		error,
		isFetchingNextPage,
		fetchMore,
	};
};

export const useSubredditListing = (token, feed, sort, topSort) => {
	return useInfiniteListing(
		token,
		CONTENT_TYPE.POST,
		getSubredditListing,
		feed,
		sort,
		topSort
	);
};

export const useProfilePostListing = (token, username, sort, topSort) => {
	return useInfiniteListing(
		token,
		CONTENT_TYPE.POST,
		getUserSubmissions,
		username,
		sort,
		topSort
	);
};

export const useProfileCommentListing = (token, username, sort, topSort) => {
	return useInfiniteListing(
		token,
		CONTENT_TYPE.COMMENT,
		getUserComments,
		username,
		sort,
		topSort
	);
};
