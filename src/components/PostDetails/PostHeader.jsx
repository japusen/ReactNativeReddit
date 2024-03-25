import { View, Text } from "react-native";
import { WebView } from "react-native-webview";

const PostHeader = ({ post }) => {
	switch (post.type) {
		case "self":
			return <SelfPostHeader post={post} />;
		default:
			break;
	}
};

const SelfPostHeader = ({ post }) => {
	const parsedHtml = () => {
		if (post.html.startsWith("<!-- SC_OFF -->")) {
			return post.html.substring(15, post.html.length - 14);
		} else if (post.html.startsWith("<!-- SC_ON -->")) {
			return post.html.substring(14, post.html.length - 13);
		} else {
			return post.html;
		}
	};

	console.log(parsedHtml());

	return (
		<View style={{ flex: 1, backgroundColor: "red" }}>
			<Text>{post.title}</Text>
			{/* <Text>{post.text}</Text> */}
			<WebView
				originWhitelist={["*"]}
				source={{ html: parsedHtml() }}
				style={{ height: 800, width: 500, fontSize: 25 }}
				onShouldStartLoadWithRequest={(request) => {
					console.log(request.url);
					return false;
				}}
			/>
		</View>
	);
};

export default PostHeader;
