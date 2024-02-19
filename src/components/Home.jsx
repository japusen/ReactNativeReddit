import { StyleSheet, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { FlatList } from "react-native";
import { ActivityIndicator, Surface, Appbar, Text } from "react-native-paper";

import { TokenContext } from "../contexts/TokenContext";
import { getSubreddit } from "../requests/Subreddit";
import PostPreview from "./PostPreview";
import SortMenu from "./SortMenu";

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
	separator: {
		marginTop: 10,
	},
});

const ItemSeparator = () => <View style={styles.separator} />;

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

const Home = () => {
	const token = useContext(TokenContext);

	const [subreddit, setSubreddit] = useState("all");
	const [sort, setSort] = useState("hot");
	const [topSort, setTopSort] = useState(null);

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
			<TopAppBar
				subreddit={subreddit}
				onSortChange={setSort}
				onTopSortChange={setTopSort}
			/>
			{posts.length == 0 ? (
				<View style={styles.containerCentered}>
					<Text>There appears to be nothing here</Text>
				</View>
			) : (
				<FlatList
					data={posts}
					//onEndReached={onEndReach}
					ItemSeparatorComponent={ItemSeparator}
					renderItem={({ item }) => <PostPreview item={item} />}
					keyExtractor={(item) => item.id}
					//ListHeaderComponent={header}
					//extraData={extraData}
					//style={{ padding: 5 }}
				/>
			)}
		</Surface>
	);
};

export default Home;
