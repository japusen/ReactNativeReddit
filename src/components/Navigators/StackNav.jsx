import { useContext } from "react";
import { useTheme } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Appbar } from "react-native-paper";

import { FeedContext } from "../../contexts/FeedContext";
import FeedScreen from "../FeedScreen";
import ListingSortMenu from "../SortMenus/ListingSortMenu";
import PostDetails from "../PostDetails";
import LinkScreen from "../LinkScreen";

const Stack = createNativeStackNavigator();

const StackNav = ({ navigation }) => {
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
				component={FeedScreen}
				options={{
					title: feed,
					headerStyle: {
						backgroundColor: theme.colors.primaryContainer,
					},
					headerLeft: () => (
						<Appbar.Action
							icon="menu"
							onPress={navigation.openDrawer}
							style={{ margin: 0 }}
						/>
					),
					headerRight: () => <ListingSortMenu />,
				}}
			/>
			<Stack.Screen
				name="Link"
				options={{
					headerShown: false,
				}}
				component={LinkScreen}
			/>
			<Stack.Screen name="Post" component={PostDetails} />
		</Stack.Navigator>
	);
};

export default StackNav;
