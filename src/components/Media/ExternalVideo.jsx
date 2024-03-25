import { WebView } from "react-native-webview";

const ExternalVideo = ({ url, height }) => {
	const videoStyle = { height, backgroundColor: "black" };

	return (
		<WebView
			allowsFullscreenVideo
			allowsInlineMediaPlayback
			mediaPlaybackRequiresUserAction
			source={{ uri: url }}
			style={videoStyle}
		/>
	);
};

export default ExternalVideo;
