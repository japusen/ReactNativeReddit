import { StyleSheet, View } from "react-native";

import {
	StickyIndicator,
	LockedIndicator,
	NsfwIndicator,
	SpoilerIndicator,
	RemovedIndicator,
} from "../common/Indicators";

const iconSize = 14;
const fontSize = 10;

const styles = StyleSheet.create({
	indicators: {
		display: "flex",
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
	},
});

const PostIndicators = ({
	isNsfw,
	isSpoiler,
	isLocked,
	isPinned,
	isStickied,
	isRemoved,
}) => {
	return (
		<View style={styles.indicators}>
			{(isStickied || isPinned) && (
				<StickyIndicator iconSize={iconSize} />
			)}
			{isLocked && <LockedIndicator iconSize={iconSize} />}
			{isNsfw && <NsfwIndicator fontSize={fontSize} />}
			{isSpoiler && <SpoilerIndicator fontSize={fontSize} />}
			{isRemoved && <RemovedIndicator iconSize={iconSize} />}
		</View>
	);
};

export default PostIndicators;
