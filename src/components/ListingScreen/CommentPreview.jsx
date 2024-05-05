import { Pressable, View, StyleSheet } from "react-native";
import { Card, Divider, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
	card: {
		marginHorizontal: 8,
		padding: 8,
		overflow: "hidden",
	},
});

const CommentPreview = ({ comment }) => {
	const theme = useTheme();
	const navigation = useNavigation();

	return (
		<Pressable
			onPress={() => {
				navigation.navigate("Post", {
					postID: comment.linkID,
					subreddit: comment.subreddit,
					specificComment: comment.id,
				});
			}}
		>
			<Card
				style={[styles.card, { backgroundColor: theme.colors.surface }]}
			>
				<View style={{ display: "flex", gap: 4 }}>
					<Text
						variant="titleSmall"
						style={{ color: theme.colors.primary }}
					>
						{comment.title}
					</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							gap: 8,
						}}
					>
						<Text>{comment.subreddit}</Text>
						<Text>{comment.score}</Text>
						<Text>{comment.time}</Text>
					</View>
					<Divider
						bold
						style={{
							marginVertical: 4,
							backgroundColor: theme.colors.secondary,
						}}
					/>
					<Text selectable variant="bodyLarge">
						{comment.body}
					</Text>
				</View>
			</Card>
		</Pressable>
	);
};

export default CommentPreview;
