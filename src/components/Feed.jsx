import { StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState, useEffect } from "react";
import { ActivityIndicator, Surface, Appbar, Text } from "react-native-paper";

import { TokenContext } from "../contexts/TokenContext";
import { getSubreddit } from "../requests/Subreddit";
import SortMenu from "./SortMenu";
import PostListing from "./PostListing";

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

const TopAppBar = ({ subreddit, onSortChange, onTopSortChange }) => {
	return (
		<Appbar.Header>
			<Appbar.Action icon="menu" onPress={() => {}} />
			<Appbar.Content title={subreddit} />
			<SortMenu
				onSortChange={onSortChange}
				onTopSortChange={onTopSortChange}
			/>
		</Appbar.Header>
	);
};

const Feed = ({ navigation }) => {
	const token = useContext(TokenContext);

	const [subreddit, setSubreddit] = useState("all");
	const [sort, setSort] = useState("hot");
	const [topSort, setTopSort] = useState(null);

	useEffect(() => {
		navigation.setOptions({
			title: subreddit,
			headerRight: () => (
				<SortMenu onSortChange={setSort} onTopSortChange={setTopSort} />
			),
		});
	}, [navigation, subreddit]);

	const { isPending, isError, data, error } = useQuery({
		queryKey: ["getSubredditListing", subreddit, sort, topSort],
		queryFn: () => getSubreddit(token, subreddit, sort, topSort),
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
