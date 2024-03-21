import { useState } from "react";
import { View } from "react-native";
import { Appbar, Menu, Divider } from "react-native-paper";

const CommentSortMenu = ({ setSort }) => {
	const [visible, setVisible] = useState(false);

	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);

	return (
		<Menu
			visible={visible}
			onDismiss={closeMenu}
			anchor={<Appbar.Action icon="sort" onPress={openMenu} />}
		>
			{visible && <SortItems closeMenu={closeMenu} setSort={setSort} />}
		</Menu>
	);
};

const sorts = [
	{
		name: "confidence",
		title: "Best",
		icon: "star-four-points",
	},
	{ name: "top", title: "Top", icon: "arrow-up-bold-hexagon-outline" },
	{ name: "new", title: "New", icon: "new-box" },
	{ name: "old", title: "Old", icon: "clock-outline" },
	{ name: "qa", title: "Q&A", icon: "forum" },
	{
		name: "controversial",
		title: "Controversial",
		icon: "exclamation",
	},
];

const SortItems = ({ closeMenu, setSort }) => {
	const onItemPress = (newSort) => {
		setSort(newSort);
		closeMenu();
	};

	return (
		<>
			{sorts.map((sort) => (
				<View key={sort.name}>
					<Menu.Item
						leadingIcon={sort.icon}
						onPress={() => {
							onItemPress(sort.name);
						}}
						title={sort.title}
					/>
					{sort !== sorts[sorts.length - 1] && <Divider />}
				</View>
			))}
		</>
	);
};

export default CommentSortMenu;
