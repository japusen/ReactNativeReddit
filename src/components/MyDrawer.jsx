import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
	DrawerItem,
} from "@react-navigation/drawer";

import Feed from "./Feed";

const Drawer = createDrawerNavigator();

const MyDrawer = () => {
	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawerContent {...props} />}
		>
			<Drawer.Screen name="Feed" component={Feed} />
		</Drawer.Navigator>
	);
};

const CustomDrawerContent = (props) => {
	return (
		<DrawerContentScrollView {...props}>
			{/* <DrawerItemList {...props} /> */}
			<DrawerItem
				label="Close drawer"
				onPress={() => props.navigation.closeDrawer()}
			/>
		</DrawerContentScrollView>
	);
};

export default MyDrawer;
