import { StyleSheet, View, Image } from "react-native";
import { Card, useTheme } from "react-native-paper";
import { memo, useState } from "react";
import { WebView } from "react-native-webview";
import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";
import { useNavigation } from "@react-navigation/native";

import PostInfo from "./PostInfo";
import ImageCarousel from "./ImageCarousel";

const styles = StyleSheet.create({
	card: {
		marginHorizontal: 8,
		overflow: "hidden",
	},
	crossPostContainer: {
		marginHorizontal: 10,
		marginBottom: 10,
		borderRadius: 10,
		borderStyle: "solid",
		borderWidth: 1,
	},
	mediaContainer: {
		marginHorizontal: 8,
		marginBottom: 8,
		height: 500,
		backgroundColor: "black",
		overflow: "hidden",
		borderRadius: 10,
	},
	fullImage: {
		flex: 1,
	},
	redditVideo: { height: 500 },
	externalVideo: { height: 500, backgroundColor: "black" },
});

export const PostPreview = ({ post, isCrossPost = false }) => {
	const navigation = useNavigation();
	const [showMedia, setShowMedia] = useState(false);

	const toggleShowMedia = () => {
		setShowMedia(!showMedia);
	};

	switch (post.type) {
		case "self":
			return (
				<PostCard
					post={post}
					isCrossPost={isCrossPost}
					onThumbnailClicked={() => {}}
				/>
			);
		case "cross-post":
			return (
				<PostCard
					post={post}
					isCrossPost={isCrossPost}
					onThumbnailClicked={() => {}}
				>
					<PostPreview post={post.innerPost} isCrossPost={true} />
				</PostCard>
			);
		case "gallery":
			return (
				<PostCard
					post={post}
					isCrossPost={isCrossPost}
					onThumbnailClicked={toggleShowMedia}
				>
					{showMedia && <Gallery images={post.gallery} />}
				</PostCard>
			);
		case "image":
			return (
				<PostCard
					post={post}
					isCrossPost={isCrossPost}
					onThumbnailClicked={toggleShowMedia}
				>
					{showMedia && <RedditImage url={post.imageURL} />}
				</PostCard>
			);
		case "reddit_video":
			return (
				<PostCard
					post={post}
					isCrossPost={isCrossPost}
					onThumbnailClicked={toggleShowMedia}
				>
					{showMedia && <RedditVideo url={post.videoURL} />}
				</PostCard>
			);
		case "external_video":
			return (
				<PostCard
					post={post}
					isCrossPost={isCrossPost}
					onThumbnailClicked={toggleShowMedia}
				>
					{showMedia && <ExternalVideo url={post.videoURL} />}
				</PostCard>
			);
		case "link":
		default:
			return (
				<PostCard
					post={post}
					isCrossPost={isCrossPost}
					onThumbnailClicked={() => {
						navigation.navigate("Link", {
							link: post.link,
						});
					}}
				/>
			);
	}
};

const PostCard = ({ post, onThumbnailClicked, children, isCrossPost }) => {
	const theme = useTheme();

	const crossPostStyle = {
		...styles.crossPostContainer,
		backgroundColor: theme.colors.surfaceVariant,
		borderColor: theme.colors.primary,
	};

	if (isCrossPost) {
		return (
			<View style={crossPostStyle}>
				<PostInfo post={post} onThumbnailClicked={onThumbnailClicked} />
				{children}
			</View>
		);
	}

	return (
		<Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
			<PostInfo post={post} onThumbnailClicked={onThumbnailClicked} />
			{children}
		</Card>
	);
};

const MediaContainer = ({ children, additionalStyle = null }) => {
	const containerStyle = additionalStyle
		? [styles.mediaContainer, additionalStyle]
		: styles.mediaContainer;

	return <View style={containerStyle}>{children}</View>;
};

const RedditImage = ({ url }) => {
	return (
		<MediaContainer>
			<Image
				resizeMode="contain"
				style={styles.fullImage}
				source={{
					uri: url,
				}}
			/>
		</MediaContainer>
	);
};

const RedditVideo = ({ url }) => {
	const [isMute, setIsMute] = useState(false);
	return (
		<MediaContainer>
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
		</MediaContainer>
	);
};

const ExternalVideo = ({ url }) => {
	return (
		<MediaContainer>
			<WebView
				allowsFullscreenVideo
				allowsInlineMediaPlayback
				mediaPlaybackRequiresUserAction
				source={{ uri: url }}
				style={styles.externalVideo}
			/>
		</MediaContainer>
	);
};

const Gallery = ({ images }) => {
	// card and mediaContainer each have horizontal margin of 8
	const margin = 2 * 8 + 2 * 8;
	return (
		<MediaContainer additionalStyle={{ position: "relative" }}>
			<ImageCarousel images={images} margin={margin} />
		</MediaContainer>
	);
};

export default memo(PostPreview);
