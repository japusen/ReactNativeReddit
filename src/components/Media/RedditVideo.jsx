import { useState } from "react";
import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";

const RedditVideo = ({ url, height }) => {
	const [isMute, setIsMute] = useState(false);
	return (
		<VideoPlayer
			videoProps={{
				shouldPlay: true,
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
		/>
	);
};

export default RedditVideo;
