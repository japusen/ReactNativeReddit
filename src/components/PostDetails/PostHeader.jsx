import { View, StyleSheet } from "react-native";
import { Text, Card, Button, useTheme } from "react-native-paper";

import RedditImage from "../Media/RedditImage";
import ImageCarousel from "../Media/ImageCarousel";
import RedditVideo from "../Media/RedditVideo";
import ExternalVideo from "../Media/ExternalVideo";
import calculateMediaContainerHeight from "../../utils/CalculateMediaContainerHeight";

const styles = StyleSheet.create({
	card: {
		marginHorizontal: 8,
		overflow: "hidden",
	},
	cardContent: { padding: 10, display: "flex", gap: 10 },
	cardInfo: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	linkButton: { color: "blue" },
	mediaContainer: {
		height: 500,
		backgroundColor: "black",
		overflow: "hidden",
		borderRadius: 10,
	},
});

const galleryMargin = 2 * 10 + 2 * 8; // outer view has margin of 8 and card has padding of 10

const mediaHeight = (aspectRatio) =>
	calculateMediaContainerHeight(
		aspectRatio,
		styles.mediaContainer.height,
		400
	);

const PostHeader = ({ post }) => {
	const theme = useTheme();

	return (
		<Card style={styles.card}>
			<View style={styles.cardContent}>
				<Text
					variant="titleLarge"
					style={{ color: theme.colors.primary }}
				>
					{post.title}
				</Text>

				<Media post={post} />

				{post.selfText && (
					<Text selectable variant="bodyLarge">
						{post.selfText}
					</Text>
				)}

				<View style={styles.cardInfo}>
					<Text>{post.author}</Text>
					<Text>{post.score}</Text>
					<Text>{post.numComments}</Text>
					<Text>{post.time}</Text>
				</View>
			</View>
		</Card>
	);
};

const Media = ({ post }) => {
	const height = mediaHeight(post.aspectRatio);

	switch (post.type) {
		case "self":
			return;
		case "image":
			return (
				<MediaContainer height={height}>
					<RedditImage url={post.imageURL} />
				</MediaContainer>
			);
		case "gallery":
			return (
				<MediaContainer height={height}>
					<ImageCarousel
						images={post.gallery}
						margin={galleryMargin}
					/>
				</MediaContainer>
			);
		case "reddit_video":
			return (
				<MediaContainer height={height}>
					<RedditVideo
						url={post.videoURL}
						height={height}
						autoplay={false}
						showControls={true}
					/>
				</MediaContainer>
			);
		case "external_video":
			return (
				<MediaContainer height={height}>
					<ExternalVideo url={post.videoURL} height={height} />
				</MediaContainer>
			);
		case "cross-post":
			return <Media post={post.innerPost} />;
		case "link":
		default:
			return (
				<Button
					mode="outlined"
					onPress={() => {
						console.log(post.link);
					}}
					style={styles.linkButton}
				>
					{post.link}
				</Button>
			);
	}
};

const MediaContainer = ({ children, height }) => (
	<View style={{ ...styles.mediaContainer, height }}>{children}</View>
);

export default PostHeader;
