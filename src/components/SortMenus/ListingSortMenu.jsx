import { useState } from "react";
import { View } from "react-native";
import { Appbar, Menu, Divider } from "react-native-paper";

const ListingSortMenu = ({ setSort, setTopSort }) => {
	const [visible, setVisible] = useState(false);
	const [subMenuVisible, setSubMenuVisible] = useState(false);

	const openMenu = () => setVisible(true);

	const openSubMenu = () => setSubMenuVisible(true);

	const closeMenu = () => {
		setVisible(false);
		setSubMenuVisible(false);
	};

	return (
		<Menu
			visible={visible}
			onDismiss={closeMenu}
			anchor={<Appbar.Action icon="sort" onPress={openMenu} />}
		>
			{visible && !subMenuVisible && (
				<SortItems
					openSubMenu={openSubMenu}
					closeMenu={closeMenu}
					setSort={setSort}
					setTopSort={setTopSort}
				/>
			)}
			{visible && subMenuVisible && (
				<TopSortItems
					closeMenu={closeMenu}
					setSort={setSort}
					setTopSort={setTopSort}
				/>
			)}
		</Menu>
	);
};

const sorts = [
	{ name: "hot", title: "Hot", icon: "fire" },
	{ name: "new", title: "New", icon: "new-box" },
	{ name: "rising", title: "Rising", icon: "chart-line-variant" },
	{ name: "top", title: "Top", icon: "arrow-up-bold-hexagon-outline" },
];

const SortItems = ({ openSubMenu, closeMenu, setSort, setTopSort }) => {
	const onItemPress = (newSort) => {
		setSort(newSort);
		setTopSort(null);
		closeMenu();
	};

	return (
		<>
			{sorts.map((sort) => (
				<View key={sort.name}>
					<Menu.Item
						leadingIcon={sort.icon}
						onPress={() => {
							sort.name === "top"
								? openSubMenu()
								: onItemPress(sort.name);
						}}
						title={sort.title}
					/>
					{sort !== sorts[sorts.length - 1] && <Divider />}
				</View>
			))}
		</>
	);
};

const topSorts = ["hour", "day", "week", "month", "year", "all"];

const TopSortItems = ({ closeMenu, setSort, setTopSort }) => {
	const onItemPress = (topSort) => {
		setSort("top");
		setTopSort(topSort);
		closeMenu();
	};

	return (
		<>
			{topSorts.map((sort) => (
				<View key={sort}>
					<Menu.Item
						key={sort}
						onPress={() => {
							onItemPress(sort === "year" ? "y" : sort);
						}}
						title={sort}
					/>
					{sort !== topSorts[topSorts.length - 1] && <Divider />}
				</View>
			))}
		</>
	);
};

export default ListingSortMenu;
