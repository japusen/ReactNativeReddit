import { StyleSheet, View, Image, Pressable } from "react-native";
import { Icon, IconButton } from "react-native-paper";

const styles = StyleSheet.create({
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
});

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

export default Thumbnail;
