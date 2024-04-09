import { useContext, useState } from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";
import { Text, Searchbar, useTheme } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, DrawerActions } from "@react-navigation/native";

import { FeedContext } from "../../contexts/FeedContext";
import { TokenContext } from "../../contexts/TokenContext";
import { getSubredditAutocomplete } from "../../requests/SubredditAutocomplete";

const styles = StyleSheet.create({
	container: {
		padding: 10,
		display: "flex",
		gap: 10,
	},
	header: {
		marginBottom: 10,
	},
	searchBar: {
		marginHorizontal: 10,
	},
	resultsContainer: {
		display: "flex",
		gap: 10,
		marginVertical: 10,
	},
	resultItem: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 20,
	},
	tinyLogo: {
		width: 50,
		height: 50,
		borderRadius: 25,
	},
	placeholderLogo: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
});

const DrawerContent = ({ navigation }) => {
	const token = useContext(TokenContext);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

	const { data, error } = useQuery({
		queryKey: ["subredditAutocomplete", debouncedSearchQuery],
		queryFn: () => getSubredditAutocomplete(token, debouncedSearchQuery),
	});

	return (
		<DrawerContentScrollView contentContainerStyle={{ display: "flex" }}>
			<View style={styles.container}>
				<View>
					<Text style={styles.header}>Feeds</Text>
					<FeedDrawerItems closeDrawer={navigation.closeDrawer} />
				</View>

				<View>
					<Text style={styles.header}>Search</Text>
					<SearchBar
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
					/>
					{data && <SearchResults results={data} />}
				</View>
			</View>
		</DrawerContentScrollView>
	);
};

const defaultFeeds = ["All", "Popular"];

const FeedDrawerItems = ({ closeDrawer }) => {
	const theme = useTheme();
	const { feed, setFeed, setSort } = useContext(FeedContext);

	const changeFeed = (name) => {
		setFeed(name);
		setSort("hot");
	};

	return defaultFeeds.map((name) => (
		<DrawerItem
			key={name}
			label={name}
			focused={feed === name}
			activeTintColor={theme.colors.onSecondaryContainer}
			activeBackgroundColor={theme.colors.secondaryContainer}
			onPress={() => {
				if (feed !== name) {
					changeFeed(name);
				}

				closeDrawer();
			}}
		/>
	));
};

const SearchBar = ({ searchQuery, setSearchQuery }) => {
	return (
		<Searchbar
			placeholder="User or Subreddit"
			onChangeText={setSearchQuery}
			value={searchQuery}
			onIconPress={() => console.log(`searching for ${searchQuery}`)}
			style={styles.searchBar}
		/>
	);
};

const SearchResults = ({ results }) => {
	const navigation = useNavigation();

	const navToSubreddit = (name) => {
		navigation.dispatch(DrawerActions.closeDrawer());
		navigation.navigate("Subreddit", {
			subreddit: name,
		});
	};

	return (
		<View style={styles.resultsContainer}>
			{results.map((result) => (
				<Pressable
					key={result.id}
					onPress={() => {
						if (result.name.startsWith("u_")) {
							// TODO: handle user profile
							console.log("user", result.name);
						} else {
							navToSubreddit(result.name);
						}
					}}
				>
					<View style={styles.resultItem}>
						<View style={[styles.tinyLogo, { overflow: "hidden" }]}>
							<ResultIcon
								communityIcon={result.communityIcon}
								icon={result.icon}
							/>
						</View>

						<Text key={result.id}>{result.name}</Text>
					</View>
				</Pressable>
			))}
		</View>
	);
};

const ResultIcon = ({ communityIcon, icon }) => {
	if (communityIcon) {
		return <ResultImage icon={communityIcon} />;
	} else if (icon) {
		return <ResultImage icon={icon} />;
	} else {
		return <PlaceholderIcon />;
	}
};

const PlaceholderIcon = () => {
	const theme = useTheme();
	return (
		<View
			style={[
				styles.tinyLogo,
				styles.placeholderLogo,
				{ backgroundColor: theme.colors.secondaryContainer },
			]}
		>
			<Text>r</Text>
		</View>
	);
};

const ResultImage = ({ icon }) => {
	return (
		<Image
			style={styles.tinyLogo}
			source={{
				uri: icon,
			}}
			resizeMode="contain"
		/>
	);
};

export default DrawerContent;
