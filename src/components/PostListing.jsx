import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native";
import { Text, useTheme } from "react-native-paper";

import PostPreview from "./PostPreview";

const styles = StyleSheet.create({
	containerCentered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	separator: {
		marginTop: 10,
	},
});

const ItemSeparator = () => <View style={styles.separator} />;

const PostListing = ({ posts, onEndReached }) => {
	const theme = useTheme();

	if (posts.length === 0) {
		return (
			<View style={styles.containerCentered}>
				<Text>There appears to be nothing here</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={posts}
			onEndReached={onEndReached}
			ItemSeparatorComponent={ItemSeparator}
			renderItem={({ item }) => <PostPreview post={item} />}
			keyExtractor={(item) => item.id}
			style={{
				paddingTop: 10,
				backgroundColor: theme.colors.surfaceVariant,
			}}
		/>
	);
};

export default PostListing;
