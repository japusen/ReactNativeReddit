import { StyleSheet, View, Image, Pressable, ScrollView } from "react-native";
import { Text, Card, useTheme } from "react-native-paper";
import { memo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";
import Carousel from "react-native-reanimated-carousel";
import { useWindowDimensions } from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";

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
						<MediaContainer
							additionalStyle={{ position: "relative" }}
						>
							<GalleryCarousel data={item.gallery} />
						</MediaContainer>
					)}
				</PreviewCard>
			);
		case "image":
			return (
				<PreviewCard>
					<Header post={item} toggleShowMedia={toggleShowMedia} />
					{showMedia && (
						<MediaContainer>
							<RedditImage url={item.imageURL} />
						</MediaContainer>
					)}
				</PreviewCard>
			);
		case "reddit_video":
			return (
				<PreviewCard>
					<Header post={item} toggleShowMedia={toggleShowMedia} />
					{showMedia && (
						<MediaContainer>
							<RedditVideo url={item.videoURL} />
						</MediaContainer>
					)}
				</PreviewCard>
			);
		case "external_video":
			return (
				<PreviewCard>
					<Header post={item} toggleShowMedia={toggleShowMedia} />
					{showMedia && (
						<MediaContainer>
							<WebviewVideo url={item.videoURL} />
						</MediaContainer>
					)}
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

const PreviewCard = ({ children }) => {
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

const MediaContainer = ({ children, additionalStyle = null }) => {
	return (
		<View style={[styles.mediaContainer, additionalStyle]}>{children}</View>
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

const GalleryCarousel = ({ data }) => {
	const progressValue = useSharedValue(0);
	const windowWidth = useWindowDimensions().width - (2 * 8 + 2 * 8); // card and mediaContainer each have horizontal margin of 8 on each side
	return (
		<>
			<Carousel
				loop={false}
				mode="normal"
				width={windowWidth}
				data={data}
				scrollAnimationDuration={1000}
				onProgressChange={(_, absoluteProgress) =>
					(progressValue.value = absoluteProgress)
				}
				panGestureHandlerProps={{
					activeOffsetX: [-10, 10],
				}}
				renderItem={({ index }) => (
					<RedditImage key={data[index].id} url={data[index].url} />
				)}
			/>
			{!!progressValue && (
				<View
					style={{
						position: "absolute",
						bottom: 8,
						backgroundColor: "black",
						padding: 5,
						borderRadius: 10,
						alignSelf: "center",
					}}
				>
					<View
						style={{
							flexDirection: "row",
							gap: 5,
						}}
					>
						{data.map((_, index) => {
							return (
								<PaginationItem
									animValue={progressValue}
									index={index}
									key={index}
									length={data.length}
								/>
							);
						})}
					</View>
				</View>
			)}
		</>
	);
};

const PaginationItem = (props) => {
	const theme = useTheme();
	const { animValue, index, length } = props;
	const width = 10;

	const animStyle = useAnimatedStyle(() => {
		let inputRange = [index - 1, index, index + 1];
		let outputRange = [-width, 0, width];

		if (index === 0 && animValue?.value > length - 1) {
			inputRange = [length - 1, length, length + 1];
			outputRange = [-width, 0, width];
		}

		return {
			transform: [
				{
					translateX: interpolate(
						animValue?.value,
						inputRange,
						outputRange
					),
				},
			],
		};
	}, [animValue, index, length]);

	return (
		<View
			style={{
				backgroundColor: "white",
				width,
				height: width,
				borderRadius: 50,
				borderColor: "white",
				borderStyle: "solid",
				borderWidth: 1,
				overflow: "hidden",
			}}
		>
			<Animated.View
				style={[
					{
						borderRadius: 50,
						backgroundColor: theme.colors.primary,
						flex: 1,
					},
					animStyle,
				]}
			/>
		</View>
	);
};

export default memo(PostPreview);
