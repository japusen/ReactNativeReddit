const calculateMediaContainerHeight = (
	aspectRatio,
	targetHeight,
	maxHeight
) => {
	return Math.min(targetHeight / aspectRatio, maxHeight);
};

export default calculateMediaContainerHeight;
