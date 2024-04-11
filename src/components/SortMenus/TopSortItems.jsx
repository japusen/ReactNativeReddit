import { View } from "react-native";
import { Menu, Divider } from "react-native-paper";

const TopSortItems = ({ items, onTopSortSelected }) => {
	return (
		<>
			{items.map((sort) => (
				<View key={sort}>
					<Menu.Item
						key={sort}
						onPress={() => {
							onTopSortSelected(sort === "year" ? "y" : sort);
						}}
						title={sort}
					/>
					{sort !== items[items.length - 1] && <Divider />}
				</View>
			))}
		</>
	);
};

export default TopSortItems;
