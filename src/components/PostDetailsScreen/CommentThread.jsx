import { useState, useContext } from "react";
import { View, FlatList, StyleSheet, Pressable } from "react-native";
import {
	ActivityIndicator,
	Badge,
	Card,
	Text,
	useTheme,
} from "react-native-paper";

import { useManageThread } from "../../hooks/useManageThread";
import { getMoreComments } from "../../requests/MoreComments";
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

const CommentThread = ({ threadItems, children, linkID, sort, depth }) => {
	const theme = useTheme();

	const { thread, handleShowReplies, handleHideReplies, handleFetchMore } =
		useManageThread(threadItems, depth);

	return (
		<FlatList
			data={thread}
			ItemSeparatorComponent={ItemSeparator}
			renderItem={({ item }) =>
				item.type === "comment" ? (
					<CommentCard
						comment={item}
						showReplies={handleShowReplies}
						hideReplies={handleHideReplies}
					/>
				) : (
					<MoreButton
						more={item}
						replaceMore={handleFetchMore}
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
			<ContentCard depth={comment.depth}>
				<Pressable
					onLongPress={() => {
						if (comment.childrenIDs) {
							comment.repliesHidden
								? showReplies(comment.id, comment.childrenIDs)
								: hideReplies(comment.id, comment.depth);
						}
					}}
					delayLongPress={100}
				>
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
						{comment.childrenIDs && comment.repliesHidden && (
							<HiddenReplies count={comment.childrenIDs.length} />
						)}
					</View>
				</Pressable>
				<Text selectable variant="bodyLarge">
					{comment.text}
				</Text>
			</ContentCard>
		</View>
	);
};

const HiddenReplies = ({ count }) => {
	const theme = useTheme();

	const badgeStyle = {
		backgroundColor: theme.colors.onSurfaceVariant,
	};

	return (
		<View style={{ flex: 1 }}>
			<Badge size={16} style={badgeStyle}>
				+{count}
			</Badge>
		</View>
	);
};

const MoreButton = ({ more, replaceMore, linkID, sort }) => {
	const token = useContext(TokenContext);
	const [fetching, setFetching] = useState(false);

	const parentID = more.parentID;
	const childrenList = more.childrenIDs.join(", ");

	const fetchMore = async () => {
		setFetching(true);
		const { newComments, newChildrenIDs } = await getMoreComments(
			token,
			linkID,
			parentID,
			childrenList,
			sort
		);

		if (newComments) {
			replaceMore(
				more.id,
				more.depth,
				newComments,
				parentID,
				newChildrenIDs
			);
		}
	};

	if (fetching) {
		return <ActivityIndicator animating={true} />;
	}

	return (
		<Pressable onPress={fetchMore}>
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
