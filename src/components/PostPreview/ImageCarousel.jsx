import { StyleSheet, View, Image } from "react-native";
import { useTheme } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";
import { useWindowDimensions } from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";

const styles = StyleSheet.create({
	fullImage: {
		flex: 1,
	},
	galleryPagination: {
		position: "absolute",
		bottom: 8,
		backgroundColor: "black",
		padding: 5,
		borderRadius: 10,
		alignSelf: "center",
	},
	paginationItem: {
		backgroundColor: "white",
		borderRadius: 50,
		borderColor: "white",
		borderStyle: "solid",
		borderWidth: 1,
		overflow: "hidden",
	},
	selectedItem: {
		flex: 1,
		borderRadius: 50,
	},
});

const ImageCarousel = ({ images, margin }) => {
	const progressValue = useSharedValue(0);
	const windowWidth = useWindowDimensions().width - margin;
	return (
		<>
			<Carousel
				loop={false}
				mode="normal"
				width={windowWidth}
				data={images}
				scrollAnimationDuration={1000}
				onProgressChange={(_, absoluteProgress) =>
					(progressValue.value = absoluteProgress)
				}
				panGestureHandlerProps={{
					activeOffsetX: [-10, 10],
				}}
				renderItem={({ index }) => (
					<Image
						resizeMode="contain"
						style={styles.fullImage}
						source={{
							uri: images[index].url,
						}}
					/>
				)}
			/>
			{!!progressValue && (
				<View style={styles.galleryPagination}>
					<View
						style={{
							flexDirection: "row",
							gap: 5,
						}}
					>
						{images.map((_, index) => {
							return (
								<PaginationItem
									animValue={progressValue}
									index={index}
									key={index}
									length={images.length}
								/>
							);
						})}
					</View>
				</View>
			)}
		</>
	);
};

const PaginationItem = ({ animValue, index, length }) => {
	const theme = useTheme();
	const width = 10;

	const animStyle = useAnimatedStyle(() => {
		let inputRange = [index - 1, index, index + 1];
		let outputRange = [-width, 0, width];

		if (index === 0 && animValue?.value > length - 1) {
			inputRange = [length - 1, length, length + 1];
			outputRange = [-width, 0, width];
		}

		return {
			transform: [
				{
					translateX: interpolate(
						animValue?.value,
						inputRange,
						outputRange
					),
				},
			],
		};
	}, [animValue, index, length]);

	return (
		<View style={[styles.paginationItem, { width, height: width }]}>
			<Animated.View
				style={[
					styles.selectedItem,
					{
						backgroundColor: theme.colors.primary,
					},
					animStyle,
				]}
			/>
		</View>
	);
};

export default ImageCarousel;
