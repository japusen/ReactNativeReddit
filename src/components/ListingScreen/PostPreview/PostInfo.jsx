import { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import Thumbnail from "./Thumbnail";
import PostIndicators from "./PostIndicators";
import Flair from "../../common/Flair";
import PostOptions from "./PostOptions";

const styles = StyleSheet.create({
	postHeader: {
		padding: 8,
		display: "flex",
		flexDirection: "row",
		gap: 10,
	},
	postInfo: {
		display: "flex",
		flex: 1,
		gap: 2,
	},
	row: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
});

const PostInfo = ({ post, onThumbnailClicked }) => {
	const navigation = useNavigation();
	const theme = useTheme();

	const [showMoreOptions, setShowMoreOptions] = useState(false);

	const titleStyle = {
		color: theme.colors.primary,
		fontSize: 16,
	};

	const subredditStyle = { color: theme.colors.onSurface };

	const authorStyle = { color: theme.colors.onSurface };

	const hasThumbnail = post.type !== "self" && post.type !== "cross-post";

	return (
		<Pressable
			onPress={() => {
				navigation.push("Post", {
					postID: post.id,
					subreddit: post.subreddit,
				});
			}}
			onLongPress={() => {
				setShowMoreOptions(!showMoreOptions);
			}}
			delayLongPress={300}
		>
			<View style={styles.postHeader}>
				{hasThumbnail && (
					<Thumbnail
						postType={post.type}
						url={post.thumbnail}
						domain={post.domain}
						onPress={onThumbnailClicked}
					/>
				)}

				<View style={styles.postInfo}>
					<Text style={titleStyle}>{post.title}</Text>

					<View style={styles.row}>
						<Text style={subredditStyle}>{post.subreddit}</Text>
						{post.flair && <Flair flair={post.flair} />}
						<PostIndicators
							isNsfw={post.isNsfw}
							isSpoiler={post.isSpoiler}
							isLocked={post.isLocked}
							isPinned={post.isPinned}
							isStickied={post.isStickied}
							isRemoved={post.isRemoved}
						/>
					</View>

					<Text style={authorStyle}>{post.author}</Text>

					<View style={styles.row}>
						<Text>{post.score}</Text>
						<Text>{post.numComments}</Text>
						<Text>{post.time}</Text>
					</View>
				</View>
			</View>

			{showMoreOptions && (
				<PostOptions
					onAccountPressed={() =>
						navigation.navigate("User", {
							username: post.author,
						})
					}
					onCommunityPressed={() =>
						navigation.navigate("Subreddit", {
							subreddit: post.subreddit,
						})
					}
					onBrowserPressed={() => console.log("web")}
					onSharePressed={() => console.log("share")}
					onFilterPressed={() => console.log("filter")}
				/>
			)}
		</Pressable>
	);
};

export default PostInfo;
