import { FlatList, View, StyleSheet } from "react-native";
import { ActivityIndicator, Surface, Text, useTheme } from "react-native-paper";
import PostPreview from "../PostPreview";

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

const PostListingScreen = ({
	isPending,
	isError,
	error,
	posts,
	fetchMorePosts,
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
			{posts.length === 0 ? (
				<View style={styles.containerCentered}>
					<Text>There appears to be nothing here</Text>
				</View>
			) : (
				<FlatList
					data={posts}
					onEndReached={fetchMorePosts}
					ItemSeparatorComponent={ItemSeparator}
					renderItem={({ item }) => <PostPreview post={item} />}
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

export default PostListingScreen;
