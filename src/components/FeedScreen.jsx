import { useContext } from "react";

import { TokenContext } from "../contexts/TokenContext";
import { FeedContext } from "../contexts/FeedContext";
import { useSubredditListing } from "../hooks/usePostListing";
import PostListingScreen from "./common/PostListingScreen";

const FeedScreen = () => {
	const token = useContext(TokenContext);
	const { feed, sort, topSort } = useContext(FeedContext);

	const {
		isPending,
		isError,
		posts,
		error,
		isFetchingNextPage,
		fetchMorePosts,
	} = useSubredditListing(token, feed, sort, topSort);

	return (
		<PostListingScreen
			isPending={isPending}
			isError={isError}
			error={error}
			posts={posts}
			fetchMorePosts={fetchMorePosts}
			isFetchingNextPage={isFetchingNextPage}
		/>
	);
};

export default FeedScreen;
