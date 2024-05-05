import { Pressable, View, StyleSheet } from "react-native";
import { Card, Divider, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
	card: {
		marginHorizontal: 8,
		padding: 8,
		overflow: "hidden",
	},
	cardContent: { display: "flex", gap: 4 },
	commentInfo: {
		display: "flex",
		flexDirection: "row",
		gap: 8,
	},
	divider: {
		marginVertical: 4,
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
				<View style={styles.cardContent}>
					<Text
						variant="titleSmall"
						style={{ color: theme.colors.primary }}
					>
						{comment.title}
					</Text>
					<View style={styles.commentInfo}>
						<Text>{comment.subreddit}</Text>
						<Text>{comment.score}</Text>
						<Text>{comment.time}</Text>
					</View>
					<Divider
						bold
						style={{
							...styles.divider,
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
