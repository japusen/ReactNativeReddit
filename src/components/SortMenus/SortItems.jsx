import { View } from "react-native";
import { Menu, Divider } from "react-native-paper";

const SortItems = ({ items, onSortSelected }) => {
	return (
		<>
			{items.map((sort) => (
				<View key={sort.name}>
					<Menu.Item
						leadingIcon={sort.icon}
						onPress={() => {
							onSortSelected(sort.name);
						}}
						title={sort.title}
					/>
					{sort !== items[items.length - 1] && <Divider />}
				</View>
			))}
		</>
	);
};

export default SortItems;
