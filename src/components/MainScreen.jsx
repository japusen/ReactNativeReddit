import { useContext } from "react";
import { useTheme } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Appbar } from "react-native-paper";

import { FeedContext } from "../contexts/FeedContext";
import Feed from "./Feed";
import ListingSortMenu from "./ListingSortMenu";
import PostDetails from "./PostDetails";

const Stack = createNativeStackNavigator();

const MainScreen = (props) => {
	const theme = useTheme();
	const { feed } = useContext(FeedContext);

	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: theme.colors.primaryContainer,
				},
				headerTitleAlign: "center",
			}}
			initialRouteName="Feed"
		>
			<Stack.Screen
				name="Feed"
				component={Feed}
				options={{
					title: feed,
					headerStyle: {
						backgroundColor: theme.colors.primaryContainer,
					},
					headerLeft: () => (
						<Appbar.Action
							icon="menu"
							onPress={props.navigation.openDrawer}
							style={{ margin: 0 }}
						/>
					),
					headerRight: () => <ListingSortMenu />,
				}}
			/>
			<Stack.Screen name="Post" component={PostDetails} />
		</Stack.Navigator>
	);
};

export default MainScreen;
