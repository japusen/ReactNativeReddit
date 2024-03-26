const calculateAspectRatio = (width, height) => {
	return width && height ? width / height : 1;
};

export default calculateAspectRatio;
