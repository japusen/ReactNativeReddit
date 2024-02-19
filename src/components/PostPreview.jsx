import { StyleSheet, View } from "react-native";
import { Text, Card } from "react-native-paper";
import { useContext, useState } from "react";

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
		</Card>
	);
};

export default PostPreview;
