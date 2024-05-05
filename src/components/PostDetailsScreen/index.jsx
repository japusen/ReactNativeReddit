import { useState, useEffect, useContext } from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator, Surface, Text, useTheme } from "react-native-paper";

import { TokenContext } from "../../contexts/TokenContext";
import { usePostArticle } from "../../hooks/usePostArticle";
import CommentSortMenu from "../SortMenus/CommentsSortMenu";
import PostHeader from "./PostHeader";
import CommentThread from "./CommentThread";
import truncatedSubredditName from "../../utils/TruncatedSubredditName";
import PartialThreadIndicator from "./PartialThreadIndicator";

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

const PostDetailsScreen = ({ route, navigation }) => {
	const token = useContext(TokenContext);
	const { postID, subreddit, specificComment } = route.params;
	const [sort, setSort] = useState("confidence");

	useEffect(() => {
		navigation.setOptions({
			title: truncatedSubredditName(subreddit),
			headerRight: () => <CommentSortMenu setSort={setSort} />,
		});
	}, []);

	const { post, commentThread, error, isLoading, isError } = usePostArticle(
		token,
		postID,
		subreddit,
		sort,
		specificComment
	);

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
			depth={specificComment ? 99 : 1}
		>
			<PostHeader post={post} />
			{specificComment && (
				<PartialThreadIndicator postID={postID} subreddit={subreddit} />
			)}
		</CommentThread>
	);
};

export default PostDetailsScreen;
