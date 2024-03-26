import { StyleSheet, View } from "react-native";
import { Text, Icon } from "react-native-paper";

const colors = {
	sticky: "green",
	locked: "#c5a939",
	nsfw: "red",
	spoiler: "#fc6a03",
	removed: "red",
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
	removedIndicator: {
		...indicator,
		borderColor: colors.removed,
	},
	nsfwText: {
		color: colors.nsfw,
	},
	spoilerText: {
		color: colors.spoiler,
	},
});

export const StickyIndicator = ({ iconSize }) => {
	return (
		<View style={styles.stickyIndicator}>
			<Icon source="pin" color={colors.sticky} size={iconSize} />
		</View>
	);
};

export const LockedIndicator = ({ iconSize }) => {
	return (
		<View style={styles.lockedIndicator}>
			<Icon source="lock" color={colors.locked} size={iconSize} />
		</View>
	);
};

export const NsfwIndicator = ({ fontSize }) => {
	return (
		<View style={styles.nsfwIndicator}>
			<Text style={{ ...styles.nsfwText, fontSize }}>nsfw</Text>
		</View>
	);
};

export const SpoilerIndicator = ({ fontSize }) => {
	return (
		<View style={styles.spoilerIndicator}>
			<Text style={{ ...styles.spoilerText, fontSize }}>spoiler</Text>
		</View>
	);
};

export const RemovedIndicator = ({ iconSize }) => {
	return (
		<View style={styles.removedIndicator}>
			<Icon
				source="eye-remove-outline"
				color={colors.removed}
				size={iconSize}
			/>
		</View>
	);
};
