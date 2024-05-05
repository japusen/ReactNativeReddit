import { useNavigation } from "@react-navigation/native";
import { Pressable, View, StyleSheet } from "react-native";
import { Text, Card, useTheme } from "react-native-paper";

const styles = StyleSheet.create({
	card: {
		overflow: "hidden",
		marginTop: 10,
	},
	cardContent: {
		padding: 10,
		display: "flex",
		alignItems: "center",
	},
});

const PartialThreadIndicator = ({ postID, subreddit }) => {
	const theme = useTheme();
	const navigation = useNavigation();

	return (
		<Pressable
			onPress={() => {
				navigation.push("Post", {
					postID,
					subreddit,
					specificComment: null,
				});
			}}
		>
			<Card style={styles.card}>
				<View style={styles.cardContent}>
					<Text
						variant="titleSmall"
						style={{ color: theme.colors.primary }}
					>
						View full thread
					</Text>
				</View>
			</Card>
		</Pressable>
	);
};

export default PartialThreadIndicator;
