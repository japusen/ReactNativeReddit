import { StyleSheet, View } from "react-native";
import { Text, Card } from "react-native-paper";
import { memo } from "react";

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
});

export const PostPreview = ({ item }) => {
	return (
		<Card style={{ marginHorizontal: 10 }}>
			<Text>{item.title}</Text>
			<Text>{item.subreddit}</Text>
			<Text>{item.author}</Text>
			<Text>{item.score}</Text>
			<Text>{item.thumbnail}</Text>
			{item.over_18 && <Text>nsfw</Text>}
			{item.spoiler && <Text>spoiler</Text>}
			{item.locked && <Text>locked</Text>}
		</Card>
	);
};

export default memo(PostPreview);
