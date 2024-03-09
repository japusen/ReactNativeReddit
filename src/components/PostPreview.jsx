import { StyleSheet, View, Image, Pressable, ScrollView } from "react-native";
import { Text, Card, useTheme, Icon, IconButton } from "react-native-paper";
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
		position: "relative",
	},
	thumbnailImage: { flex: 1 },
	thumbnailPlaceholder: {
		overflow: "hidden",
		borderRadius: 10,
		height: 50,
		width: 50,
		backgroundColor: "black",
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
					<Header post={item} onThumbnailClicked={toggleShowMedia} />
				</PreviewCard>
			);
		case "gallery":
			return (
				<PreviewCard>
					<Header post={item} onThumbnailClicked={toggleShowMedia} />
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
					<Header post={item} onThumbnailClicked={toggleShowMedia} />
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
					<Header post={item} onThumbnailClicked={toggleShowMedia} />
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
					<Header post={item} onThumbnailClicked={toggleShowMedia} />
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
					<Header post={item} onThumbnailClicked={() => {}} />
					<Text>{item.link}</Text>
				</PreviewCard>
			);
		default:
			return (
				<PreviewCard>
					<Header post={item} onThumbnailClicked={() => {}} />
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

const Header = ({ post, onThumbnailClicked }) => {
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

const Thumbnail = ({ postType, url, onPress }) => {
	const iconName = () => {
		switch (postType) {
			case "image":
				return "image-area";
			case "gallery":
				return "image-album";
			case "reddit_video":
			case "external_video":
				return "video-box";
			default:
				return "link";
		}
	};

	if (url) {
		return (
			<Pressable onPress={onPress}>
				<View style={styles.thumbnailContainer}>
					<Image
						resizeMode="cover"
						style={styles.thumbnailImage}
						source={{
							uri: url,
						}}
					/>
					<View
						style={{
							position: "absolute",
							top: 5,
							left: 5,
							backgroundColor: "black",
							borderRadius: 5,
							padding: 2,
						}}
					>
						<Icon
							source={iconName()}
							size={18}
							color="white"
						></Icon>
					</View>
				</View>
			</Pressable>
		);
	}

	return (
		<View style={styles.thumbnailPlaceholder}>
			<IconButton
				icon={iconName()}
				iconColor="white"
				size={20}
				onPress={onPress}
				style={{
					flex: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			/>
		</View>
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
