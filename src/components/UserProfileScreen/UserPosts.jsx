import { useProfilePostListing } from "../../hooks/useInfiniteListing";
import { PostListingScreen } from "../ListingScreen";

const UserPosts = ({ token, username, sort, topSort }) => {
	const {
		isPending,
		isError,
		content,
		error,
		isFetchingNextPage,
		fetchMore,
	} = useProfilePostListing(token, username, sort, topSort);

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

export default UserPosts;
