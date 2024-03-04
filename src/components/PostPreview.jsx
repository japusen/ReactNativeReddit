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
	thumbnail: {
		height: 100,
		width: 100,
		borderRadius: 10,
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
					{showMedia && <ExternalVideo url={item.videoURL} />}
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
			return <Header post={item} toggleShowMedia={() => {}} />;
	}
};

const PreviewCard = ({ id, children }) => {
	const navigation = useNavigation();
	const theme = useTheme();

	return (
		<Card
			style={[styles.card, { backgroundColor: theme.colors.surface }]}
			onPress={() => {
				// navigation.navigate("Post", {
				// 	postID: id,
				// });
			}}
		>
			{children}
		</Card>
	);
};

const Header = ({ post, toggleShowMedia }) => {
	const theme = useTheme();

	return (
		<View style={styles.postHeader}>
			{post.thumbnail && (
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
			</View>
		</View>
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
		<Pressable onPress={onPress}>
			<Image
				resizeMode="cover"
				style={styles.thumbnail}
				source={{
					uri: url,
				}}
			/>
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

const ExternalVideo = ({ url }) => {
	return (
		<WebView
			// originWhitelist={["*"]}
			allowsFullscreenVideo
			allowsInlineMediaPlayback
			mediaPlaybackRequiresUserAction
			// source={{ html: media.oembed.html }}
			source={{ uri: url }}
			style={styles.externalVideo}
		/>
	);
};

const ImgurVideo = () => {
	const [isMute, setIsMute] = useState(false);
	return (
		<VideoPlayer
			videoProps={{
				shouldPlay: true,
				resizeMode: ResizeMode.CONTAIN,
				source: {
					uri: item.url.replace(".gifv", ".mp4"),
				},
				isMuted: isMute,
			}}
			mute={{
				enterMute: () => setIsMute(!isMute),
				exitMute: () => setIsMute(!isMute),
				isMute,
			}}
			style={{ height: 500 }}
		/>
	);
};

export default memo(PostPreview);
