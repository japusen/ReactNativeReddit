import { StyleSheet, View, Image, Pressable } from "react-native";
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
	image: {
		height: 100,
		width: 100,
	},
	fullImage: {
		height: 400,
		backgroundColor: "black",
	},
});

export const PostPreview = ({ item }) => {
	const navigation = useNavigation();
	const [showMedia, setShowMedia] = useState(false);

	const toggleShowMedia = () => {
		setShowMedia(!showMedia);
	};

	console.log(item.post_hint);
	return (
		<View style={{ marginHorizontal: 10 }}>
			<Card
				onPress={() => {
					// navigation.navigate("Post", {
					// 	postID: item.id,
					// });
					//console.log(item.media);
				}}
			>
				<Text>{item.title}</Text>
				<Text>{item.subreddit}</Text>
				<Text>{item.author}</Text>
				<Text>{item.score}</Text>
				{item.over_18 && <Text>nsfw</Text>}
				{item.spoiler && <Text>spoiler</Text>}
				{item.locked && <Text>locked</Text>}

				{!item.is_self && (
					<Pressable onPress={toggleShowMedia}>
						<Thumbnail
							preview={item.preview}
							thumbnail={item.thumbnail}
						/>
					</Pressable>
				)}
			</Card>
			{item.media && showMedia && <Media media={item.media} />}
			{item.post_hint === "link" &&
				item.domain === "i.imgur.com" &&
				showMedia && (
					<VideoPlayer
						videoProps={{
							shouldPlay: true,
							resizeMode: ResizeMode.CONTAIN,
							source: {
								uri: item.url.replace(".gifv", ".mp4"),
							},
						}}
						// style={{ flex: 1 }}
					/>
				)}
			{!item.media && item.post_hint !== "link" && showMedia && (
				<Image
					resizeMode="contain"
					style={styles.fullImage}
					source={{
						uri: item.url,
					}}
				/>
			)}
		</View>
	);
};

const Thumbnail = ({ preview, thumbnail }) => {
	const uri = preview ? preview.images.at(0).source.url : thumbnail;
	return (
		<Image
			style={styles.image}
			source={{
				uri,
			}}
		/>
	);
};

const Media = ({ media }) => {
	if (media.reddit_video) {
		// console.log("reddit_video", Object.keys(media.reddit_video));
		return (
			<VideoPlayer
				videoProps={{
					shouldPlay: true,
					resizeMode: ResizeMode.CONTAIN,
					source: {
						uri: media.reddit_video.dash_url,
					},
				}}
			/>
		);
	} else {
		if (media.oembed) {
			console.log("oembed");
			// console.log(media.oembed.html);
			const url = extractSrcFromHTML(media.oembed.html);
			console.log(url);
			return (
				<WebView
					// originWhitelist={["*"]}
					allowsFullscreenVideo
					allowsInlineMediaPlayback
					mediaPlaybackRequiresUserAction
					// source={{ html: media.oembed.html }}
					source={{ uri: url }}
					style={{ height: 500, backgroundColor: "black" }}
				/>
			);
		} else {
			console.log("media", Object.keys(media));
		}
	}
};

const extractSrcFromHTML = (htmlString) => {
	const regex = /src\s*=\s*["']([^"']+)["']/;
	const match = regex.exec(htmlString);

	if (match && match.length > 1) {
		return match[1];
	} else {
		return null; // Return null if no match is found
	}
};

export default memo(PostPreview);
