import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchAccessToken } from "../requests/AccessToken";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

const Main = () => {
	const { isPending, isError, data, error } = useQuery({
		queryKey: [],
		queryFn: fetchAccessToken,
	});

	if (isPending) {
		return (
			<View style={styles.container}>
				<Text>Loading</Text>
			</View>
		);
	}

	if (isError) {
		return (
			<View style={styles.container}>
				<Text>Error: {error.message}</Text>
			</View>
		);
	}
	console.log(data);
	return (
		<View style={styles.container}>
			<Text>{data}</Text>
			<StatusBar style="auto" />
		</View>
	);
};

export default Main;
