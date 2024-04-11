import { useState, useEffect, useContext } from "react";

import { TokenContext } from "../contexts/TokenContext";
import { useProfilePostListing } from "../hooks/usePostListing";
import PostListingScreen from "./common/PostListingScreen";
import ListingSortMenu from "./SortMenus/ListingSortMenu";
import truncatedSubredditName from "../utils/TruncatedSubredditName";
import ProfileSortMenu from "./SortMenus/ProfileSortMenu";

const UserProfileScreen = ({ route, navigation }) => {
	const token = useContext(TokenContext);

	const { username } = route.params;
	const [type, setType] = useState("submitted");
	const [sort, setSort] = useState("hot");
	const [topSort, setTopSort] = useState(null);

	useEffect(() => {
		navigation.setOptions({
			title: truncatedSubredditName(username),
			headerRight: () => (
				<>
					<ProfileSortMenu setType={setType} />
					<ListingSortMenu
						setSort={setSort}
						setTopSort={setTopSort}
					/>
				</>
			),
		});
	}, []);

	if (type === "submitted") {
		return (
			<UserPosts
				token={token}
				username={username}
				sort={sort}
				topSort={topSort}
			/>
		);
	}

	return (
		<UserComments
			token={token}
			username={username}
			sort={sort}
			topSort={topSort}
		/>
	);
};

const UserPosts = ({ token, username, sort, topSort }) => {
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

const UserComments = ({ token, username, sort, topSort }) => {
	return null;
};

export default UserProfileScreen;