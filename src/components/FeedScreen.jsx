import { StyleSheet } from "react-native";
import { useContext } from "react";
import { ActivityIndicator, Surface, Text } from "react-native-paper";

import { TokenContext } from "../contexts/TokenContext";
import PostListing from "./common/PostListing";
import { FeedContext } from "../contexts/FeedContext";
import { useSubredditListing } from "../hooks/usePostListing";

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

export default FeedScreen;
