import { StyleSheet, View, Image, Pressable, Text } from "react-native";
import { Icon } from "react-native-paper";

const styles = StyleSheet.create({
	thumbnailContainer: {
		overflow: "hidden",
		borderRadius: 10,
		height: 100,
		width: 100,
		position: "relative",
	},
	thumbnailImage: { flex: 1 },
	iconContainer: {
		position: "absolute",
		bottom: 2,
		left: 4,
		padding: 2,
		backgroundColor: "black",
		borderRadius: 5,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 2,
	},
	domainText: { color: "white", fontSize: 10 },
});

const Thumbnail = ({ postType, url, domain, onPress }) => {
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

	const containerStyle = url
		? styles.thumbnailContainer
		: { ...styles.thumbnailContainer, backgroundColor: "black" };

	return (
		<Pressable onPress={onPress}>
			<View style={containerStyle}>
				{url && (
					<Image
						resizeMode="cover"
						style={styles.thumbnailImage}
						source={{
							uri: url,
						}}
					/>
				)}
				<View style={styles.iconContainer}>
					<Icon source={iconName()} size={18} color="white" />
					{(!url || postType === "link") && (
						<TruncatedDomain domain={domain} />
					)}
				</View>
			</View>
		</Pressable>
	);
};

const TruncatedDomain = ({ domain }) => {
	return (
		<Text
			style={styles.domainText}
			numberOfLines={1}
			ellipsizeMode="tail"
			maxWidth={70}
		>
			{domain}
		</Text>
	);
};

export default Thumbnail;
