import { StyleSheet, View } from "react-native";
import { Card, useTheme } from "react-native-paper";
import { memo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";

import { CrossPostContext } from "../../contexts/CrossPostContext";

import PostInfo from "./PostInfo";
import ImageCarousel from "../Media/ImageCarousel";
import RedditImage from "../Media/RedditImage";
import RedditVideo from "../Media/RedditVideo";
import ExternalVideo from "../Media/ExternalVideo";

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
});

export const PostPreview = ({ post }) => {
	switch (post.type) {
		case "self":
			return <SelfPost post={post} />;
		case "cross-post":
			return <CrossPost post={post} />;
		case "gallery":
			// card and mediaContainer each have horizontal margin of 8
			const margin = 2 * 8 + 2 * 8;
			return <GalleryPost post={post} margin={margin} />;
		case "image":
			return <ImagePost post={post} />;
		case "reddit_video":
			return <HostedVideoPost post={post} />;
		case "external_video":
			return <ExternalVideoPost post={post} />;
		case "link":
		default:
			return <LinkPost post={post} />;
	}
};

const SelfPost = ({ post }) => {
	return <PostCard post={post} onThumbnailClicked={() => {}} />;
};

const GalleryPost = ({ post, margin }) => {
	const height = calculateMediaHeight(post.aspectRatio);
	return (
		<MediaPost post={post} additionalStyle={{ height }}>
			<ImageCarousel images={post.gallery} margin={margin} />
		</MediaPost>
	);
};

const ImagePost = ({ post }) => {
	const height = calculateMediaHeight(post.aspectRatio);
	return (
		<MediaPost post={post} additionalStyle={{ height }}>
			<RedditImage url={post.imageURL} />
		</MediaPost>
	);
};

const HostedVideoPost = ({ post }) => {
	const height = calculateMediaHeight(post.aspectRatio);
	return (
		<MediaPost post={post} additionalStyle={{ height }}>
			<RedditVideo url={post.videoURL} height={height} />
		</MediaPost>
	);
};

const ExternalVideoPost = ({ post }) => {
	const height = calculateMediaHeight(post.aspectRatio);
	return (
		<MediaPost post={post} additionalStyle={{ height }}>
			<ExternalVideo url={post.videoURL} height={height} />
		</MediaPost>
	);
};

const LinkPost = ({ post }) => {
	const navigation = useNavigation();

	return (
		<PostCard
			post={post}
			onThumbnailClicked={() => {
				navigation.navigate("Link", {
					link: post.link,
				});
			}}
		/>
	);
};

const CrossPost = ({ post }) => {
	return (
		<PostCard post={post} onThumbnailClicked={() => {}}>
			<CrossPostContext.Provider value={true}>
				<PostPreview post={post.innerPost} />
			</CrossPostContext.Provider>
		</PostCard>
	);
};

const calculateMediaHeight = (aspectRatio) => {
	return Math.min(styles.mediaContainer.height / aspectRatio, 600);
};

const MediaPost = ({ post, children, additionalStyle = null }) => {
	const [showMedia, setShowMedia] = useState(false);

	const toggleShowMedia = () => {
		setShowMedia(!showMedia);
	};

	const mediaContainerStyle = additionalStyle
		? [styles.mediaContainer, additionalStyle]
		: styles.mediaContainer;

	return (
		<PostCard post={post} onThumbnailClicked={toggleShowMedia}>
			{showMedia && <View style={mediaContainerStyle}>{children}</View>}
		</PostCard>
	);
};

const PostCard = ({ post, onThumbnailClicked, children }) => {
	const theme = useTheme();

	const crossPostStyle = {
		...styles.crossPostContainer,
		backgroundColor: theme.colors.surfaceVariant,
		borderColor: theme.colors.primary,
	};

	const isCrossPost = useContext(CrossPostContext);

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

export default memo(PostPreview);
