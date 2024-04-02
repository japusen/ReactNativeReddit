import { useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Pressable } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

import { useManageThread } from "../../hooks/useManageThread";
import { useMoreComments } from "../../hooks/useMoreComments";
import { TokenContext } from "../../contexts/TokenContext";
import {
	LockedIndicator,
	StickyIndicator,
	SubmitterIndicator,
	DistinguishedIndicator,
} from "../common/Indicators";
import Flair from "../common/Flair";

const styles = StyleSheet.create({
	card: {
		padding: 10,
		display: "flex",
		gap: 6,
	},
	row: {
		display: "flex",
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
		flexWrap: "wrap",
	},
	separator: {
		marginTop: 6,
	},
	commentBar: {
		borderLeftWidth: 3,
	},
});

const iconSize = 14;
const fontSize = 10;
const borderColors = ["blueviolet", "blue", "green", "gold", "orange", "red"];

const ItemSeparator = () => <View style={styles.separator} />;

const CommentThread = ({ threadItems, children, linkID, sort }) => {
	const theme = useTheme();

	const { thread, initializeThread, showReplies, hideReplies, replaceMore } =
		useManageThread();

	useEffect(() => {
		if (threadItems) {
			initializeThread(threadItems);
		}
	}, [threadItems]);

	return (
		<FlatList
			data={thread}
			ItemSeparatorComponent={ItemSeparator}
			renderItem={({ item }) =>
				item.type === "comment" ? (
					<CommentCard
						comment={item}
						showReplies={showReplies}
						hideReplies={hideReplies}
					/>
				) : (
					<MoreButton
						more={item}
						replaceMore={replaceMore}
						linkID={linkID}
						sort={sort}
					/>
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

const CommentCard = ({ comment, showReplies, hideReplies }) => {
	return (
		<View style={{ display: "flex", gap: 8 }}>
			<Pressable
				onLongPress={() => {
					hideReplies(comment.id, comment.depth);
				}}
				delayLongPress={300}
			>
				<ContentCard depth={comment.depth}>
					<View style={styles.row}>
						{comment.isStickied && (
							<StickyIndicator iconSize={iconSize} />
						)}
						{comment.isLocked && (
							<LockedIndicator iconSize={iconSize} />
						)}
						{comment.isSubmitter && (
							<SubmitterIndicator fontSize={fontSize} />
						)}
						<Text variant="labelLarge">{comment.author}</Text>
						{comment.distinguished && (
							<DistinguishedIndicator
								distinguished={comment.distinguished}
							/>
						)}
						{comment.flair && <Flair flair={comment.flair} />}
						<Text variant="labelMedium">{comment.score}</Text>
						<Text variant="labelMedium">{comment.time}</Text>
					</View>
					<Text variant="bodyLarge">{comment.text}</Text>
				</ContentCard>
			</Pressable>

			{comment.childrenIDs && comment.repliesHidden && (
				<HiddenReplies
					depth={comment.depth}
					repliesLength={comment.childrenIDs.length}
					showReplies={() =>
						showReplies(comment.id, comment.childrenIDs)
					}
				/>
			)}
		</View>
	);
};

const HiddenReplies = ({ depth, showReplies, repliesLength }) => {
	return (
		<Pressable onPress={showReplies}>
			<ContentCard depth={depth + 1}>
				<Text>show replies ({repliesLength})</Text>
			</ContentCard>
		</Pressable>
	);
};

const MoreButton = ({ more, replaceMore, linkID, sort }) => {
	const token = useContext(TokenContext);
	const fetch = useMoreComments(
		token,
		linkID,
		more.childrenIDs,
		sort,
		more.depth
	);

	return (
		<Pressable
			onPress={async () => {
				const newComments = await fetch();
				if (newComments) {
					replaceMore(more.id, newComments);
				}
			}}
		>
			<ContentCard depth={more.depth}>
				<Text variant="bodySmall">
					more comments ({more.childrenIDs.length})
				</Text>
			</ContentCard>
		</Pressable>
	);
};

const ContentCard = ({ depth, children }) => {
	const marginLeft = depth * 8;

	const borderLeftColor = borderColors[depth % borderColors.length];

	const style =
		depth > 0
			? { ...styles.commentBar, marginLeft, borderLeftColor }
			: { marginLeft };
	return (
		<Card style={style} contentStyle={styles.card}>
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
