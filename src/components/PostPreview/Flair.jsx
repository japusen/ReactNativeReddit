import { StyleSheet, View, Image } from "react-native";
import { Text } from "react-native-paper";

const styles = StyleSheet.create({
	flairContainer: {
		paddingVertical: 2,
		paddingHorizontal: 4,
		borderRadius: 5,
	},
	richTextRow: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	flairEmoji: {
		height: 12,
		width: 12,
	},
	flairText: {
		fontSize: 10,
	},
});

const Flair = ({ linkFlair }) => {
	if (linkFlair.type === "text") {
		return (
			<FlairTextContainer
				text={linkFlair.text}
				color={linkFlair.textColor}
				backgroundColor={linkFlair.backgroundColor}
			/>
		);
	} else {
		return (
			<RichFlairContainer
				flairItems={linkFlair.richText}
				color={linkFlair.textColor}
				backgroundColor={linkFlair.backgroundColor}
			/>
		);
	}
};

const FlairTextContainer = ({ text, color, backgroundColor }) => {
	return (
		<View
			style={{
				...styles.flairContainer,
				backgroundColor,
			}}
		>
			<FlairText text={text} color={color} />
		</View>
	);
};

const RichFlairContainer = ({ flairItems, color, backgroundColor }) => {
	return (
		<View
			style={{
				...styles.flairContainer,
				...styles.richTextRow,
				backgroundColor,
			}}
		>
			{flairItems.map((item, index) =>
				item.type === "emoji" ? (
					<FlairEmoji key={index} source={item.value} />
				) : (
					<FlairText key={index} text={item.value} color={color} />
				)
			)}
		</View>
	);
};

const FlairEmoji = ({ source }) => {
	return (
		<Image
			style={styles.flairEmoji}
			source={{
				uri: source,
			}}
		/>
	);
};

const FlairText = ({ text, color }) => {
	return <Text style={{ color, ...styles.flairText }}>{text}</Text>;
};

export default Flair;
