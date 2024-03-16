import { StyleSheet, View } from "react-native";
import { Text, Icon } from "react-native-paper";

const iconSize = 14;
const fontSize = 10;

const colors = {
	sticky: "green",
	locked: "#c5a939",
	nsfw: "red",
	spoiler: "#fc6a03",
};

const indicator = {
	padding: 1,
	borderRadius: 4,
	borderStyle: "solid",
	borderWidth: 1,
};

const styles = StyleSheet.create({
	indicators: {
		display: "flex",
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
	},
	nsfwIndicator: {
		...indicator,
		borderColor: colors.nsfw,
	},
	stickyIndicator: {
		...indicator,
		borderColor: colors.sticky,
	},
	lockedIndicator: {
		...indicator,
		borderColor: colors.locked,
	},
	spoilerIndicator: {
		...indicator,
		borderColor: colors.spoiler,
	},
	nsfwText: {
		color: colors.nsfw,
		fontSize,
	},
	spoilerText: {
		color: colors.spoiler,
		fontSize,
	},
});

const Indicators = ({ isNsfw, isSpoiler, isLocked, isPinned, isStickied }) => {
	return (
		<View style={styles.indicators}>
			{(isStickied || isPinned) && <StickyIndicator />}
			{isLocked && <LockedIndicator />}
			{isNsfw && <NsfwIndicator />}
			{isSpoiler && <SpoilerIndicator />}
		</View>
	);
};

const StickyIndicator = () => {
	return (
		<View style={styles.stickyIndicator}>
			<Icon source="pin" color={colors.sticky} size={iconSize} />
		</View>
	);
};

const LockedIndicator = () => {
	return (
		<View style={styles.lockedIndicator}>
			<Icon source="lock" color={colors.locked} size={iconSize} />
		</View>
	);
};

const NsfwIndicator = () => {
	return (
		<View style={styles.nsfwIndicator}>
			<Text style={styles.nsfwText}>nsfw</Text>
		</View>
	);
};

const SpoilerIndicator = () => {
	return (
		<View style={styles.spoilerIndicator}>
			<Text style={styles.spoilerText}>spoiler</Text>
		</View>
	);
};

export default Indicators;
