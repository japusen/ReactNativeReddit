import { StyleSheet, View, Image, Pressable, ScrollView } from "react-native";
import { Text, Card } from "react-native-paper";
import { memo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		//backgroundColor: "#fff",
		//alignItems: "center",
		justifyContent: "center",
	},
	separator: {
		marginTop: 10,
	},
	thumbnail: {
		height: 100,
		width: 100,
	},
	fullImage: {
		height: 400,
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
					<Text>Type: {item.type}</Text>
					<Text>{item.title}</Text>
					<Text>{item.subreddit}</Text>
					<Text>{item.author}</Text>
					<Text>{item.score}</Text>
					{item.over_18 && <Text>nsfw</Text>}
					{item.spoiler && <Text>spoiler</Text>}
					{item.locked && <Text>locked</Text>}
				</PreviewCard>
			);
		case "gallery":
			return (
				<PreviewCard>
					{item.thumbnail && (
						<Thumbnail
							url={item.thumbnail}
							onPress={toggleShowMedia}
						/>
					)}
					<Text>Type: {item.type}</Text>
					<Text>{item.title}</Text>
					<Text>{item.subreddit}</Text>
					<Text>{item.author}</Text>
					<Text>{item.score}</Text>
					{item.over_18 && <Text>nsfw</Text>}
					{item.spoiler && <Text>spoiler</Text>}
					{item.locked && <Text>locked</Text>}
				</PreviewCard>
			);
		case "image":
			return (
				<PreviewCard>
					<Thumbnail url={item.thumbnail} onPress={toggleShowMedia} />
					<Text>Type: {item.type}</Text>
					<Text>{item.title}</Text>
					<Text>{item.subreddit}</Text>
					<Text>{item.author}</Text>
					<Text>{item.score}</Text>
					{item.over_18 && <Text>nsfw</Text>}
					{item.spoiler && <Text>spoiler</Text>}
					{item.locked && <Text>locked</Text>}
					{showMedia && <RedditImage url={item.imageURL} />}
				</PreviewCard>
			);
		case "reddit_video":
			return (
				<PreviewCard>
					<Thumbnail url={item.thumbnail} onPress={toggleShowMedia} />
					<Text>Type: {item.type}</Text>
					<Text>{item.title}</Text>
					<Text>{item.subreddit}</Text>
					<Text>{item.author}</Text>
					<Text>{item.score}</Text>
					{item.over_18 && <Text>nsfw</Text>}
					{item.spoiler && <Text>spoiler</Text>}
					{item.locked && <Text>locked</Text>}
					{showMedia && <RedditVideo url={item.videoURL} />}
				</PreviewCard>
			);
		case "external_video":
			return (
				<PreviewCard>
					<Thumbnail url={item.thumbnail} onPress={toggleShowMedia} />
					<Text>Type: {item.type}</Text>
					<Text>{item.title}</Text>
					<Text>{item.subreddit}</Text>
					<Text>{item.author}</Text>
					<Text>{item.score}</Text>
					{item.over_18 && <Text>nsfw</Text>}
					{item.spoiler && <Text>spoiler</Text>}
					{item.locked && <Text>locked</Text>}
					{showMedia && <ExternalVideo url={item.videoURL} />}
				</PreviewCard>
			);
		case "link":
			return (
				<PreviewCard>
					<Thumbnail url={item.thumbnail} onPress={toggleShowMedia} />
					<Text>Type: {item.type}</Text>
					<Text>{item.title}</Text>
					<Text>{item.subreddit}</Text>
					<Text>{item.author}</Text>
					<Text>{item.score}</Text>
					{item.over_18 && <Text>nsfw</Text>}
					{item.spoiler && <Text>spoiler</Text>}
					{item.locked && <Text>locked</Text>}
					<Text>{item.link}</Text>
				</PreviewCard>
			);
		default:
			return (
				<PreviewCard>
					<Text>Type: ?</Text>
					<Text>{item.title}</Text>
					<Text>{item.subreddit}</Text>
					<Text>{item.author}</Text>
					<Text>{item.score}</Text>
					{item.over_18 && <Text>nsfw</Text>}
					{item.spoiler && <Text>spoiler</Text>}
					{item.locked && <Text>locked</Text>}
					<Text>{item.link}</Text>
				</PreviewCard>
			);
	}
};

const PreviewCard = ({ id, children }) => {
	const navigation = useNavigation();

	return (
		<Card style={{ marginHorizontal: 10 }}>
			<View
				onPress={() => {
					// navigation.navigate("Post", {
					// 	postID: id,
					// });
				}}
			>
				{children}
			</View>
		</Card>
	);
};

const Thumbnail = ({ url, onPress }) => {
	return (
		<Pressable onPress={onPress}>
			<Image
				resizeMode="contain"
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
