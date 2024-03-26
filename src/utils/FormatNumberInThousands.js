const formatNumberInThousands = (value, name) => {
	const valueInThousands = Math.round((value / 1000) * 10) / 10;

	if (valueInThousands > 1) {
		return `${valueInThousands}k ${name}s`;
	} else if (value === 1) {
		return `1 ${name}`;
	} else {
		return `${value} ${name}s`;
	}
};

export default formatNumberInThousands;
