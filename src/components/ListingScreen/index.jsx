import { FlatList, View, StyleSheet } from "react-native";
import { ActivityIndicator, Surface, Text, useTheme } from "react-native-paper";
import PostPreview from "./PostPreview";
import CommentPreview from "./CommentPreview";

const styles = StyleSheet.create({
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

const ListingScreen = ({
	isPending,
	isError,
	error,
	isPostListing,
	content,
	fetchMore,
	isFetchingNextPage,
}) => {
	const theme = useTheme();

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
					<Text>There appears to be nothing here</Text>
				</View>
			) : (
				<FlatList
					data={content}
					onEndReached={fetchMore}
					ItemSeparatorComponent={ItemSeparator}
					renderItem={({ item }) =>
						isPostListing ? (
							<PostPreview post={item} />
						) : (
							<CommentPreview comment={item} />
						)
					}
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

export const PostListingScreen = ({
	isPending,
	isError,
	error,
	posts,
	fetchMorePosts,
	isFetchingNextPage,
}) => {
	return (
		<ListingScreen
			isPending={isPending}
			isError={isError}
			error={error}
			isPostListing={true}
			content={posts}
			fetchMore={fetchMorePosts}
			isFetchingNextPage={isFetchingNextPage}
		/>
	);
};

export const CommentListingScreen = ({
	isPending,
	isError,
	error,
	comments,
	fetchMoreComments,
	isFetchingNextPage,
}) => {
	return (
		<ListingScreen
			isPending={isPending}
			isError={isError}
			error={error}
			isPostListing={false}
			content={comments}
			fetchMore={fetchMoreComments}
			isFetchingNextPage={isFetchingNextPage}
		/>
	);
};
