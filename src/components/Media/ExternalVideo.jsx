import { Text } from "react-native-paper";
import { WebView } from "react-native-webview";

const ExternalVideo = ({ url, height }) => {
	const videoStyle = { height, backgroundColor: "black" };

	return (
		<>
			<WebView
				allowsFullscreenVideo
				allowsInlineMediaPlayback
				mediaPlaybackRequiresUserAction
				source={{ uri: url }}
				style={videoStyle}
			/>
			<Text>{height}</Text>
		</>
	);
};

export default ExternalVideo;
