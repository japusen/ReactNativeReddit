import { useState } from "react";
import { Appbar, Menu } from "react-native-paper";
import SortItems from "./SortItems";
import TopSortItems from "./TopSortItems";

const sorts = [
	{ name: "hot", title: "Hot", icon: "fire" },
	{ name: "new", title: "New", icon: "new-box" },
	{ name: "rising", title: "Rising", icon: "chart-line-variant" },
	{ name: "top", title: "Top", icon: "arrow-up-bold-hexagon-outline" },
];

const topSorts = ["hour", "day", "week", "month", "year", "all"];

const ListingSortMenu = ({ setSort, setTopSort }) => {
	const [visible, setVisible] = useState(false);
	const [subMenuVisible, setSubMenuVisible] = useState(false);

	const openMenu = () => setVisible(true);

	const openSubMenu = () => setSubMenuVisible(true);

	const closeMenu = () => {
		setVisible(false);
		setSubMenuVisible(false);
	};

	const onSortSelected = (sort) => {
		if (sort === "top") {
			openSubMenu();
		} else {
			setSort(sort);
			setTopSort(null);
			closeMenu();
		}
	};

	const onTopSortSelected = (topSort) => {
		setSort("top");
		setTopSort(topSort);
		closeMenu();
	};

	return (
		<Menu
			visible={visible}
			onDismiss={closeMenu}
			anchor={<Appbar.Action icon="sort" onPress={openMenu} />}
		>
			{visible && !subMenuVisible && (
				<SortItems items={sorts} onSortSelected={onSortSelected} />
			)}
			{visible && subMenuVisible && (
				<TopSortItems
					items={topSorts}
					onTopSortSelected={onTopSortSelected}
				/>
			)}
		</Menu>
	);
};

export default ListingSortMenu;
