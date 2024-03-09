import { StyleSheet, View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import Thumbnail from "./Thumbnail";

const styles = StyleSheet.create({
	postHeader: {
		padding: 10,
		display: "flex",
		flexDirection: "row",
		gap: 10,
		alignItems: "flex-start",
	},
	postInfo: {
		display: "flex",
		flex: 1,
		justifyContent: "flex-start",
	},
	indicators: {
		display: "flex",
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
	},
});

const PostInfo = ({ post, onThumbnailClicked }) => {
	const navigation = useNavigation();
	const theme = useTheme();

	return (
		<Pressable
		// onPress={() => {
		// 	navigation.navigate("Post", {
		// 		postID: post.id,
		// 	});
		// }}
		>
			<View style={styles.postHeader}>
				{post.type !== "self" && (
					<Thumbnail
						postType={post.type}
						url={post.thumbnail}
						onPress={onThumbnailClicked}
					/>
				)}
				<View style={styles.postInfo}>
					<Text style={{ color: theme.colors.primary }}>
						{post.title}
					</Text>
					<Text>{post.subreddit}</Text>
					<Text>{post.author}</Text>
					<Text>{post.score}</Text>
					<Indicators
						isNsfw={post.isNsfw}
						isSpoiler={post.isSpoiler}
						isLocked={post.isLocked}
						isPinned={post.isPinned}
						isStickied={post.isStickied}
					/>
					<Text>Type: {post.type}</Text>
				</View>
			</View>
		</Pressable>
	);
};

const Indicators = ({ isNsfw, isSpoiler, isLocked, isPinned, isStickied }) => {
	return (
		<View style={styles.indicators}>
			{isPinned && <Text>pinned</Text>}
			{isStickied && <Text>stickied</Text>}
			{isLocked && <Text>locked</Text>}
			{isNsfw && <Text>nsfw</Text>}
			{isSpoiler && <Text>spoiler</Text>}
		</View>
	);
};

const Flair = () => {};

export default PostInfo;
