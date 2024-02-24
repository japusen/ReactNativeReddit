import { StyleSheet } from "react-native";
import { useContext } from "react";
import {
	ActivityIndicator,
	Surface,
	Text,
	Banner,
	useTheme,
} from "react-native-paper";

import { TokenContext } from "../contexts/TokenContext";
import PostListing from "./PostListing";
import { FeedContext } from "../contexts/FeedContext";
import { useInfinitePosts } from "../hooks/useInfinitePosts";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		//backgroundColor: "#fff",
		//alignItems: "center",
		//justifyContent: "center",
	},
	containerCentered: {
		flex: 1,
		//backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

const Feed = () => {
	const theme = useTheme();
	const token = useContext(TokenContext);
	const { feed, sort, topSort } = useContext(FeedContext);

	const {
		isPending,
		isError,
		posts,
		error,
		isFetchingNextPage,
		fetchMorePosts,
	} = useInfinitePosts(token, feed, sort, topSort);

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
			<Banner
				visible={isFetchingNextPage}
				style={{ backgroundColor: theme.colors.primaryContainer }}
			>
				Loading more posts
			</Banner>
		</Surface>
	);
};

export default Feed;
