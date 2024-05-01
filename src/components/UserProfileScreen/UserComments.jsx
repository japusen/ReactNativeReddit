import { useProfileCommentListing } from "../../hooks/useInfiniteListing";
import { CommentListingScreen } from "../ListingScreen";

const UserComments = ({ token, username, sort, topSort }) => {
	const {
		isPending,
		isError,
		content,
		error,
		isFetchingNextPage,
		fetchMore,
	} = useProfileCommentListing(token, username, sort, topSort);

	return (
		<CommentListingScreen
			isPending={isPending}
			isError={isError}
			error={error}
			comments={content}
			fetchMorePosts={fetchMore}
			isFetchingNextPage={isFetchingNextPage}
		/>
	);
};

export default UserComments;
