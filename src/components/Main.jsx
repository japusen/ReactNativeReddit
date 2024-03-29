import { StyleSheet, View, StatusBar } from "react-native";
import { Text } from "react-native-paper";

import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import { NavigationContainer } from "@react-navigation/native";

import { getAccessToken } from "../requests/AccessToken";
import { TokenContext } from "../contexts/TokenContext";
import DrawerNav from "./Navigators/DrawerNav";

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

const Main = () => {
	const {
		isPending,
		isError,
		data: token,
		error,
	} = useQuery({
		queryKey: ["accessToken"],
		queryFn: getAccessToken,
	});

	if (isPending) {
		return <View style={styles.container}></View>;
	}

	if (isError) {
		return (
			<View style={styles.container}>
				<Text>Error: {error.message}</Text>
			</View>
		);
	}

	return (
		<TokenContext.Provider value={token}>
			<StatusBar />
			<NavigationContainer>
				<DrawerNav />
			</NavigationContainer>
		</TokenContext.Provider>
	);
};

export default Main;
