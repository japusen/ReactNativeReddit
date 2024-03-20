import { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { FeedContext } from "../../contexts/FeedContext";
import StackNav from "./StackNav";
import DrawerContent from "./DrawerContent";

const Drawer = createDrawerNavigator();

const DrawerNav = () => {
	const [feed, setFeed] = useState("All");
	const [sort, setSort] = useState("hot");
	const [topSort, setTopSort] = useState(null);

	return (
		<FeedContext.Provider
			value={{ feed, setFeed, sort, setSort, topSort, setTopSort }}
		>
			<Drawer.Navigator
				initialRouteName="StackNav"
				drawerContent={(props) => <DrawerContent {...props} />}
			>
				<Drawer.Screen
					name="StackNav"
					component={StackNav}
					options={{
						headerShown: false,
					}}
				/>
			</Drawer.Navigator>
		</FeedContext.Provider>
	);
};

export default DrawerNav;
