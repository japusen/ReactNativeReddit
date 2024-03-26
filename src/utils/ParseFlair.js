const parseFlair = (type, text, richText, bgColor, textColorType) => {
	const textColor =
		!bgColor || !textColorType || textColorType === "light"
			? "white"
			: "black";
	const backgroundColor = bgColor ? bgColor : "gray";

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
