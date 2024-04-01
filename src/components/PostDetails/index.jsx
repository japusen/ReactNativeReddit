import { useState, useEffect, useContext } from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator, Surface, Text, useTheme } from "react-native-paper";

import { TokenContext } from "../../contexts/TokenContext";
import { usePostArticle } from "../../hooks/usePostArticle";
import CommentSortMenu from "../SortMenus/CommentsSortMenu";
import PostHeader from "./PostHeader";
import CommentThread from "./CommentThread";

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
	const theme = useTheme();
	const token = useContext(TokenContext);
	const { postID, subreddit } = route.params;
	const [sort, setSort] = useState("confidence");

	const { post, commentThread, error, isLoading, isError } = usePostArticle(
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

	return (
		<CommentThread
			threadItems={commentThread}
			linkID={post.fullname}
			sort={sort}
		>
			<PostHeader post={post} />
		</CommentThread>
	);
};

export default PostDetails;
