import { useContext } from "react";

import { TokenContext } from "../contexts/TokenContext";
import { FeedContext } from "../contexts/FeedContext";
import { useSubredditListing } from "../hooks/useInfiniteListing";
import PostListingScreen from "./common/PostListingScreen";

const FeedScreen = () => {
	const token = useContext(TokenContext);
	const { feed, sort, topSort } = useContext(FeedContext);

	const {
		isPending,
		isError,
		content,
		error,
		isFetchingNextPage,
		fetchMore,
	} = useSubredditListing(token, feed, sort, topSort);

	return (
		<PostListingScreen
			isPending={isPending}
			isError={isError}
			error={error}
			posts={content}
			fetchMorePosts={fetchMore}
			isFetchingNextPage={isFetchingNextPage}
		/>
	);
};

export default FeedScreen;
