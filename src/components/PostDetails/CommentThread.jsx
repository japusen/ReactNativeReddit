import { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

const styles = StyleSheet.create({
	card: {
		padding: 10,
		display: "flex",
		gap: 8,
	},
	row: {
		display: "flex",
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
	},
	separator: {
		marginTop: 6,
	},
});

const ItemSeparator = () => <View style={styles.separator} />;

const CommentThread = ({ threadItems, children }) => {
	const theme = useTheme();
	return (
		<FlatList
			data={threadItems}
			ItemSeparatorComponent={ItemSeparator}
			renderItem={({ item }) =>
				item.type === "comment" ? (
					<CommentCard comment={item} />
				) : (
					<MoreButton more={item} />
				)
			}
			keyExtractor={(item) => item.id}
			ListHeaderComponent={() => children}
			ListEmptyComponent={() => <EmptyList />}
			contentContainerStyle={{
				paddingVertical: 10,
				paddingHorizontal: 8,
			}}
			ListHeaderComponentStyle={{
				marginBottom: 10,
			}}
			style={{
				backgroundColor: theme.colors.surfaceVariant,
			}}
		/>
	);
};

const CommentCard = ({ comment }) => {
	return (
		<ContentCard depth={comment.depth}>
			<View style={styles.row}>
				<Text variant="labelLarge">{comment.author}</Text>
				<Text variant="labelMedium">{comment.score}</Text>
				<Text variant="labelMedium">{comment.time}</Text>
			</View>
			<Text variant="bodyLarge">{comment.text}</Text>
		</ContentCard>
	);
};

const MoreButton = ({ more }) => {
	return (
		<ContentCard depth={more.depth}>
			<Text variant="bodySmall">
				more comments ({more.replies.length})
			</Text>
		</ContentCard>
	);
};

const ContentCard = ({ depth, children }) => {
	const margin = {
		marginLeft: depth * 8,
	};
	return (
		<Card style={margin} contentStyle={styles.card}>
			{children}
		</Card>
	);
};

const EmptyList = () => {
	const theme = useTheme();
	return (
		<View
			style={{
				display: "flex",
				alignItems: "center",
				marginTop: "10%",
			}}
		>
			<Text
				variant="bodyLarge"
				style={{ color: theme.colors.onBackground }}
			>
				There are no comments yet
			</Text>
		</View>
	);
};

export default CommentThread;
