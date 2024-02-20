import { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
} from "@react-navigation/drawer";

import { FeedContext } from "../contexts/FeedContext";
import Feed from "./Feed";
import SortMenu from "./SortMenu";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		display: "flex",
		gap: 10,
	},
});

const Drawer = createDrawerNavigator();

const MyDrawer = () => {
	const theme = useTheme();

	const [feed, setFeed] = useState("All");
	const [sort, setSort] = useState("hot");
	const [topSort, setTopSort] = useState(null);

	return (
		<FeedContext.Provider
			value={{ feed, setFeed, sort, setSort, topSort, setTopSort }}
		>
			<Drawer.Navigator
				initialRouteName="Feed"
				drawerContent={(props) => <DrawerContent {...props} />}
			>
				<Drawer.Screen
					name="Feed"
					component={Feed}
					options={{
						title: feed,
						headerStyle: {
							backgroundColor: theme.colors.primaryContainer,
						},
						headerRight: () => <SortMenu />,
					}}
					initialParams={{ feed, sort, topSort }}
				/>
			</Drawer.Navigator>
		</FeedContext.Provider>
	);
};

const feeds = ["All", "Popular"];

const DrawerContent = (props) => {
	const theme = useTheme();
	const { feed, setFeed, setSort } = useContext(FeedContext);

	return (
		<DrawerContentScrollView
			{...props}
			contentContainerStyle={{ display: "flex", flex: 1 }}
		>
			<Surface style={styles.container}>
				<View>
					<Text>Feeds</Text>

					{feeds.map((name) => (
						<DrawerItem
							key={name}
							label={name}
							focused={feed === name}
							activeTintColor={theme.colors.onSecondaryContainer}
							activeBackgroundColor={
								theme.colors.secondaryContainer
							}
							onPress={() => {
								setFeed(name);
								setSort("hot");
								props.navigation.closeDrawer();
							}}
						/>
					))}
				</View>

				<View>
					<Text>Search</Text>
				</View>
			</Surface>
		</DrawerContentScrollView>
	);
};

export default MyDrawer;
