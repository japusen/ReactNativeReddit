import { useState } from "react";
import { Appbar, Menu, Divider } from "react-native-paper";

const SortMenu = ({ onSortChange, onTopSortChange }) => {
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
					onSortChange={onSortChange}
					onTopSortChange={() => onTopSortChange(null)}
					openSubMenu={openSubMenu}
					closeMenu={closeMenu}
				/>
			)}
			{visible && subMenuVisible && (
				<TopSortItems
					onSortChange={() => onSortChange("top")}
					onTopSortChange={onTopSortChange}
					closeMenu={closeMenu}
				/>
			)}
		</Menu>
	);
};

const SortItems = ({
	onSortChange,
	onTopSortChange,
	openSubMenu,
	closeMenu,
}) => {
	const onItemPress = (newSort) => {
		onSortChange(newSort);
		onTopSortChange();
		closeMenu();
	};

	return (
		<>
			<Menu.Item
				leadingIcon="fire"
				onPress={() => {
					onItemPress("hot");
				}}
				title="Hot"
			/>
			<Divider />
			<Menu.Item
				leadingIcon="new-box"
				onPress={() => {
					onItemPress("new");
				}}
				title="New"
			/>
			<Divider />
			<Menu.Item
				leadingIcon="chart-line-variant"
				onPress={() => {
					onItemPress("rising");
				}}
				title="Rising"
			/>
			<Divider />
			<Menu.Item
				leadingIcon="chart-line-variant"
				onPress={openSubMenu}
				title="Top"
			/>
		</>
	);
};

const TopSortItems = ({ onSortChange, onTopSortChange, closeMenu }) => {
	const onItemPress = (topSort) => {
		onSortChange();
		onTopSortChange(topSort);
		closeMenu();
	};

	return (
		<>
			<Menu.Item
				onPress={() => {
					onItemPress("hour");
				}}
				title="hour"
			/>
			<Divider />
			<Menu.Item
				onPress={() => {
					onItemPress("day");
				}}
				title="day"
			/>
			<Divider />
			<Menu.Item
				onPress={() => {
					onItemPress("week");
				}}
				title="week"
			/>
			<Divider />
			<Menu.Item
				onPress={() => {
					onItemPress("month");
				}}
				title="month"
			/>
			<Divider />
			<Menu.Item
				onPress={() => {
					onItemPress("y");
				}}
				title="year"
			/>
			<Divider />
			<Menu.Item
				onPress={() => {
					onItemPress("all");
				}}
				title="all"
			/>
		</>
	);
};

export default SortMenu;
