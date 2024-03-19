import { StyleSheet, View, Pressable } from "react-native";
import { Icon, useTheme } from "react-native-paper";

const styles = StyleSheet.create({
	row: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	centeredRow: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
	},
	buttonContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		padding: 8,
	},
});

const PostOptions = ({
	onAccountPressed,
	onCommunityPressed,
	onBrowserPressed,
	onSharePressed,
	onFilterPressed,
}) => {
	return (
		<View style={styles.centeredRow}>
			<OptionButton iconName="account" onOptionPress={onAccountPressed} />
			<OptionButton
				iconName="google-circles-communities"
				onOptionPress={onCommunityPressed}
			/>
			<OptionButton iconName="web" onOptionPress={onBrowserPressed} />
			<OptionButton
				iconName="share-variant-outline"
				onOptionPress={onSharePressed}
			/>
			<OptionButton iconName="filter" onOptionPress={onFilterPressed} />
		</View>
	);
};

const OptionButton = ({ iconName, onOptionPress }) => {
	const theme = useTheme();
	const buttonSize = 22;
	const ripple = {
		color: theme.colors.primary,
		foreground: true,
	};

	return (
		<Pressable
			style={styles.buttonContainer}
			onPress={onOptionPress}
			android_ripple={ripple}
		>
			<Icon
				source={iconName}
				color={theme.colors.onSurface}
				size={buttonSize}
			/>
		</Pressable>
	);
};

export default PostOptions;
