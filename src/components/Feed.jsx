import { StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ActivityIndicator, Surface, Text } from "react-native-paper";

import { TokenContext } from "../contexts/TokenContext";
import { getSubreddit } from "../requests/Subreddit";
import PostListing from "./PostListing";
import { FeedContext } from "../contexts/FeedContext";

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
	const token = useContext(TokenContext);
	const { feed, sort, topSort } = useContext(FeedContext);

	const { isPending, isError, data, error } = useQuery({
		queryKey: ["getSubredditListing", feed, sort, topSort],
		queryFn: () => getSubreddit(token, feed, sort, topSort),
	});

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

	const posts = data.children.map((post) => post.data);

	return (
		<Surface style={styles.container}>
			<PostListing posts={posts} />
		</Surface>
	);
};

export default Feed;
