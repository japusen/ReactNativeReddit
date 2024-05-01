import { FlatList, View, StyleSheet } from "react-native";
import {
	ActivityIndicator,
	Card,
	Divider,
	Surface,
	Text,
	useTheme,
} from "react-native-paper";

import { useProfileCommentListing } from "../../hooks/useInfiniteListing";

const styles = StyleSheet.create({
	card: {
		marginHorizontal: 8,
		padding: 8,
		overflow: "hidden",
	},
	container: {
		flex: 1,
	},
	containerCentered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	separator: {
		marginTop: 6,
	},
});

const ItemSeparator = () => <View style={styles.separator} />;

const UserComments = ({ token, username, sort, topSort }) => {
	const theme = useTheme();

	const {
		isPending,
		isError,
		content,
		error,
		isFetchingNextPage,
		fetchMore,
	} = useProfileCommentListing(token, username, sort, topSort);

	if (isPending) {
		return (
			<Surface style={styles.containerCentered}>
				<ActivityIndicator animating={true} size={"large"} />
			</Surface>
		);
	}

	if (isError) {
		return (
			<Surface style={styles.containerCentered}>
				<Text>Error: {error.message}</Text>
			</Surface>
		);
	}

	return (
		<Surface
			style={{
				...styles.container,
				backgroundColor: theme.colors.surfaceVariant,
			}}
		>
			{content.length === 0 ? (
				<View style={styles.containerCentered}>
					<Text>User has no comments</Text>
				</View>
			) : (
				<FlatList
					data={content}
					onEndReached={fetchMore}
					ItemSeparatorComponent={ItemSeparator}
					renderItem={({ item }) => <CommentCard comment={item} />}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{
						paddingVertical: 10,
					}}
				/>
			)}
			<ActivityIndicator
				animating={isFetchingNextPage}
				size={40}
				style={{
					position: "absolute",
					bottom: 10,
					left: "45%",
				}}
			/>
		</Surface>
	);
};

const CommentCard = ({ comment }) => {
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

export default UserComments;
