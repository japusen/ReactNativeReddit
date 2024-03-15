import { StyleSheet, View, Pressable, Image } from "react-native";
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
		//justifyContent: "flex-start",
		alignItems: "flex-start",
	},
	indicators: {
		display: "flex",
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
	},
	flairContainer: {
		paddingVertical: 2,
		paddingHorizontal: 4,
		borderRadius: 5,
	},
	richTextRow: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	flairEmoji: {
		height: 12,
		width: 12,
	},
	flairText: {
		fontSize: 10,
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
					<Text>{post.time}</Text>
					<Indicators
						isNsfw={post.isNsfw}
						isSpoiler={post.isSpoiler}
						isLocked={post.isLocked}
						isPinned={post.isPinned}
						isStickied={post.isStickied}
					/>
					<Text>Type: {post.type}</Text>
					{post.linkFlair && <Flair linkFlair={post.linkFlair} />}
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

const Flair = ({ linkFlair }) => {
	if (linkFlair.type === "text") {
		return (
			<View
				style={{
					...styles.flairContainer,
					backgroundColor: linkFlair.backgroundColor,
				}}
			>
				<Text
					style={{ color: linkFlair.textColor, ...styles.flairText }}
				>
					{linkFlair.text}
				</Text>
			</View>
		);
	} else {
		return (
			<View
				style={{
					...styles.flairContainer,
					...styles.richTextRow,
					backgroundColor: linkFlair.backgroundColor,
				}}
			>
				{linkFlair.richText.map((item, index) =>
					item.type === "emoji" ? (
						<Image
							key={index}
							style={styles.flairEmoji}
							source={{
								uri: item.value,
							}}
						/>
					) : (
						<Text
							style={{
								color: linkFlair.textColor,
								...styles.flairText,
							}}
							key={item.type + item.value}
						>
							{item.value}
						</Text>
					)
				)}
			</View>
		);
	}
};

export default PostInfo;
