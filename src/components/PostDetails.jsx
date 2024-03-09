import { useEffect } from "react";
import { Text } from "react-native-paper";

const PostDetails = ({ route, navigation }) => {
	const { postID } = route.params;

	useEffect(() => {}, []);
	return <Text>{postID}</Text>;
};

export default PostDetails;
