import { useState, useEffect, useContext } from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator, Surface, Text } from "react-native-paper";

import { TokenContext } from "../../contexts/TokenContext";
import { usePostArticle } from "../../hooks/usePostArticle";
import CommentSortMenu from "../SortMenus/CommentsSortMenu";
import PostHeader from "./PostHeader";

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

const PostDetails = ({ route, navigation }) => {
	const token = useContext(TokenContext);
	const { postID, subreddit } = route.params;
	const [sort, setSort] = useState("confidence");

	const { post, comments, error, isLoading, isError } = usePostArticle(
		token,
		postID,
		subreddit,
		sort
	);

	const truncatedSubreddit =
		subreddit.length >= 25 ? subreddit.slice(0, 24) + "..." : subreddit;

	useEffect(() => {
		navigation.setOptions({
			title: truncatedSubreddit,
			headerRight: () => <CommentSortMenu setSort={setSort} />,
		});
	}, []);

	if (isLoading) {
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

	console.log(post.type);
	console.log(comments.length);

	return <PostHeader post={post} />;
};

export default PostDetails;
