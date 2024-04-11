import { StyleSheet } from "react-native";
import { useState, useEffect, useContext } from "react";
import { ActivityIndicator, Surface, Text } from "react-native-paper";

import { TokenContext } from "../contexts/TokenContext";
import { useProfilePostListing } from "../hooks/usePostListing";
import PostListing from "./common/PostListing";
import ListingSortMenu from "./SortMenus/ListingSortMenu";
import truncatedSubredditName from "../utils/TruncatedSubredditName";

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	containerCentered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});

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

	if (isPending) {
		return (
			<Surface style={styles.containerCentered}>
				<ActivityIndicator animating={true} size={"large"} />
			</Surface>
		);
	}

	if (isError) {
		return (
			<Surface style={styles.containerCentered}>
				<Text>Error: {error.message}</Text>
			</Surface>
		);
	}

	return (
		<Surface style={styles.container}>
			<PostListing posts={posts} onEndReached={fetchMorePosts} />
			<ActivityIndicator
				animating={isFetchingNextPage}
				size={40}
				style={{
					position: "absolute",
					bottom: 10,
					left: "45%",
				}}
			/>
		</Surface>
	);
};

export default UserProfileScreen;
