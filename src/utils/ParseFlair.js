import calculateTextColor from "./CalculateTextColor";
const parseFlair = (type, text, richText, bgColor, textColorType) => {
	let textColor, backgroundColor;

	if (!bgColor || bgColor === "transparent") {
		textColor = "black";
		backgroundColor = "transparent";
	} else if (textColorType === "dark") {
		textColor = "black";
		backgroundColor = bgColor;
	} else if (textColorType === "light") {
		textColor = "white";
		backgroundColor = bgColor;
	} else {
		textColor = calculateTextColor(bgColor);
		backgroundColor = bgColor;
	}

	if (type === "text" && text) {
		return {
			type,
			text,
			backgroundColor,
			textColor,
		};
	} else if (type === "richtext" && richText) {
		return {
			type,
			richText: richText.map((item) =>
				item.e === "emoji"
					? { type: item.e, value: item.u }
					: { type: item.e, value: item.t }
			),
			backgroundColor,
			textColor,
		};
	} else {
		return null;
	}
};

export default parseFlair;
