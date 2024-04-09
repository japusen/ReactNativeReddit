import { StyleSheet } from "react-native";
import { useState, useEffect, useContext } from "react";
import { ActivityIndicator, Surface, Text } from "react-native-paper";

import { TokenContext } from "../contexts/TokenContext";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
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

const SubredditScreen = ({ route, navigation }) => {
	const token = useContext(TokenContext);
	const { subreddit } = route.params;
	const [sort, setSort] = useState("hot");
	const [topSort, setTopSort] = useState(null);

	useEffect(() => {
		navigation.setOptions({
			title: truncatedSubredditName(subreddit),
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
	} = useInfinitePosts(token, subreddit, sort, topSort);

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

export default SubredditScreen;
