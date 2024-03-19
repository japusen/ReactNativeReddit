import { StyleSheet, Image } from "react-native";

const styles = StyleSheet.create({
	fullImage: {
		flex: 1,
	},
});

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

export default RedditImage;
