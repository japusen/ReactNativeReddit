import { useState, useEffect, useContext } from "react";

import { TokenContext } from "../contexts/TokenContext";
import { useProfilePostListing } from "../hooks/usePostListing";
import PostListingScreen from "./common/PostListingScreen";
import ListingSortMenu from "./SortMenus/ListingSortMenu";
import truncatedSubredditName from "../utils/TruncatedSubredditName";

const UserProfileScreen = ({ route, navigation }) => {
	const token = useContext(TokenContext);

	const { username } = route.params;
	const [sort, setSort] = useState("hot");
	const [topSort, setTopSort] = useState(null);

	useEffect(() => {
		navigation.setOptions({
			title: truncatedSubredditName(username),
			headerRight: () => (
				<ListingSortMenu setSort={setSort} setTopSort={setTopSort} />
			),
		});
	}, []);

	const {
		isPending,
		isError,
		posts,
		error,
		isFetchingNextPage,
		fetchMorePosts,
	} = useProfilePostListing(token, username, sort, topSort);

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

export default UserProfileScreen;
