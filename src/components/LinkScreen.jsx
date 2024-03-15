import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const styles = StyleSheet.create({
	linkView: {
		flex: 1,
	},
});

const LinkScreen = ({ route }) => {
	const { link } = route.params;

	return <WebView source={{ uri: link }} style={styles.linkView} />;
};

export default LinkScreen;
