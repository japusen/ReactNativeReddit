import { useState } from "react";
import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";
import { useIsFocused } from "@react-navigation/native";

const RedditVideo = ({
	url,
	height,
	autoplay = true,
	showControls = false,
}) => {
	const isFocused = useIsFocused();
	const [isMute, setIsMute] = useState(false);

	return (
		<VideoPlayer
			videoProps={{
				shouldPlay: autoplay && isFocused,
				resizeMode: ResizeMode.CONTAIN,
				source: {
					uri: url,
				},
				isMuted: isMute,
			}}
			mute={{
				enterMute: () => setIsMute(!isMute),
				exitMute: () => setIsMute(!isMute),
				isMute,
			}}
			fullscreen={{
				visible: false,
			}}
			style={{ height }}
			defaultControlsVisible={showControls}
		/>
	);
};

export default RedditVideo;
