import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native";
import { Text } from "react-native-paper";

import PostPreview from "./PostPreview";

const styles = StyleSheet.create({
	containerCentered: {
		flex: 1,
		//backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	separator: {
		marginTop: 10,
	},
});

const ItemSeparator = () => <View style={styles.separator} />;

const PostListing = ({ posts, onEndReached }) => {
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
			renderItem={({ item }) => <PostPreview item={item} />}
			keyExtractor={(item) => item.id}
			//ListHeaderComponent={header}
			//extraData={extraData}
			//style={{ padding: 5 }}
		/>
	);
};

export default PostListing;
