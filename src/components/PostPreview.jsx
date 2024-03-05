import { StyleSheet, View, Image, Pressable, ScrollView } from "react-native";
import { Text, Card, useTheme } from "react-native-paper";
import { memo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";

const styles = StyleSheet.create({
	card: {
		marginHorizontal: 8,
		overflow: "hidden",
	},
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
	separator: {
		marginTop: 10,
	},
	thumbnailContainer: {
		overflow: "hidden",
		borderRadius: 10,
		height: 100,
		width: 100,
	},
	thumbnail: { flex: 1 },
	thumbnailPlaceholder: {
		flex: 1,
		width: 100,
		height: 100,
	},
	fullImage: {
		height: 500,
		backgroundColor: "black",
	},
	redditVideo: { height: 500 },
	externalVideo: { height: 500, backgroundColor: "black" },
});

export const PostPreview = ({ item }) => {
	const [showMedia, setShowMedia] = useState(false);

	const toggleShowMedia = () => {
		setShowMedia(!showMedia);
	};

	switch (item.type) {
		case "self":
			return (
				<PreviewCard>
					<Header post={item} toggleShowMedia={toggleShowMedia} />
				</PreviewCard>
			);
		case "gallery":
			return (
				<PreviewCard>
					<Header post={item} toggleShowMedia={toggleShowMedia} />
					{showMedia && (
						<View style={{ display: "flex", gap: 10 }}>
							{item.gallery.map((data) => (
								<RedditImage key={data.id} url={data.url} />
							))}
						</View>
					)}
				</PreviewCard>
			);
		case "image":
			return (
				<PreviewCard>
					<Header post={item} toggleShowMedia={toggleShowMedia} />
					{showMedia && <RedditImage url={item.imageURL} />}
				</PreviewCard>
			);
		case "reddit_video":
			return (
				<PreviewCard>
					<Header post={item} toggleShowMedia={toggleShowMedia} />
					{showMedia && <RedditVideo url={item.videoURL} />}
				</PreviewCard>
			);
		case "external_video":
			return (
				<PreviewCard>
					<Header post={item} toggleShowMedia={toggleShowMedia} />
					{showMedia && <WebviewVideo url={item.videoURL} />}
				</PreviewCard>
			);
		case "link":
			return (
				<PreviewCard>
					<Header post={item} toggleShowMedia={() => {}} />
					<Text>{item.link}</Text>
				</PreviewCard>
			);
		default:
			return (
				<PreviewCard>
					<Header post={item} toggleShowMedia={() => {}} />
				</PreviewCard>
			);
	}
};

const PreviewCard = ({ id, children }) => {
	const theme = useTheme();

	return (
		<Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
			{children}
		</Card>
	);
};

const Header = ({ post, toggleShowMedia }) => {
	const navigation = useNavigation();
	const theme = useTheme();

	return (
		<Pressable
			onPress={() => {
				// navigation.navigate("Post", {
				// 	postID: id,
				// });
			}}
		>
			<View style={styles.postHeader}>
				{/* {post.thumbnail && (
					<Thumbnail url={post.thumbnail} onPress={toggleShowMedia} />
				)} */}
				{post.type !== "self" && (
					<Thumbnail url={post.thumbnail} onPress={toggleShowMedia} />
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
					<Text>url: {post.videoURL && post.videoURL}</Text>
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

const Thumbnail = ({ url, onPress }) => {
	return (
		<Pressable onPress={onPress} style={styles.thumbnailContainer}>
			{url ? (
				<Image
					resizeMode="cover"
					style={styles.thumbnail}
					source={{
						uri: url,
					}}
				/>
			) : (
				<Image
					resizeMode="contain"
					style={styles.thumbnailPlaceholder}
					source={require("../../assets/play-circle-outline.png")}
				/>
			)}
		</Pressable>
	);
};

const RedditImage = ({ url }) => {
	return (
		<Image
			resizeMode="contain"
			style={styles.fullImage}
			source={{
				uri: url,
			}}
		/>
	);
};

const RedditVideo = ({ url }) => {
	const [isMute, setIsMute] = useState(false);
	return (
		<VideoPlayer
			videoProps={{
				shouldPlay: true,
				resizeMode: ResizeMode.CONTAIN,
				source: {
					uri: url,
				},
				isMuted: isMute,
			}}
			mute={{
				enterMute: () => setIsMute(!isMute),
				exitMute: () => setIsMute(!isMute),
				isMute,
			}}
			style={styles.redditVideo}
		/>
	);
};

const WebviewVideo = ({ url }) => {
	return (
		<WebView
			allowsFullscreenVideo
			allowsInlineMediaPlayback
			mediaPlaybackRequiresUserAction
			source={{ uri: url }}
			style={styles.externalVideo}
		/>
	);
};

export default memo(PostPreview);
