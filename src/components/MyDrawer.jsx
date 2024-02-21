import { useState } from "react";
import { useTheme } from "react-native-paper";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { FeedContext } from "../contexts/FeedContext";
import Feed from "./Feed";
import SortMenu from "./SortMenu";
import DrawerContent from "./DrawerContent";

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

export default MyDrawer;
