import { useState } from "react";
import { Appbar, Menu } from "react-native-paper";
import SortItems from "./SortItems";

const SortMenu = ({ sorts, setSort, icon = "sort" }) => {
	const [visible, setVisible] = useState(false);

	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);

	const onSortSelected = (sort) => {
		setSort(sort);
		closeMenu();
	};

	return (
		<Menu
			visible={visible}
			onDismiss={closeMenu}
			anchor={<Appbar.Action icon={icon} onPress={openMenu} />}
		>
			{visible && (
				<SortItems items={sorts} onSortSelected={onSortSelected} />
			)}
		</Menu>
	);
};

export default SortMenu;
