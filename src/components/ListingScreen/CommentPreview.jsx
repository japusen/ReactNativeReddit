import { View, StyleSheet } from "react-native";
import { Card, Divider, Text, useTheme } from "react-native-paper";

const styles = StyleSheet.create({
	card: {
		marginHorizontal: 8,
		padding: 8,
		overflow: "hidden",
	},
});

const CommentPreview = ({ comment }) => {
	const theme = useTheme();
	return (
		<Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
			<View style={{ display: "flex", gap: 4 }}>
				<Text>{comment.title}</Text>
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
						backgroundColor: theme.colors.primary,
					}}
				/>
				<Text>{comment.body}</Text>
			</View>
		</Card>
	);
};

export default CommentPreview;
