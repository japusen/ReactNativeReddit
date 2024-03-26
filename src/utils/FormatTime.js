const formatTime = (time) => {
	const createdTimeInSeconds = parseInt(time);
	const nowInSeconds = Date.now() / 1000;

	const timeDifferenceInSeconds = nowInSeconds - createdTimeInSeconds;
	const years = Math.floor(timeDifferenceInSeconds / 31536000);
	const months = Math.floor(timeDifferenceInSeconds / 2592000);
	const weeks = Math.floor(timeDifferenceInSeconds / 604800);
	const days = Math.floor(timeDifferenceInSeconds / 86400);
	const hours = Math.floor(timeDifferenceInSeconds / 3600);
	const minutes = Math.floor(timeDifferenceInSeconds / 60);
	const seconds = Math.floor(timeDifferenceInSeconds);

	if (years) {
		return `${years}y ago`;
	} else if (months) {
		return `${months}m ago`;
	} else if (weeks) {
		return `${weeks}w ago`;
	} else if (days) {
		return `${days}d ago`;
	} else if (hours) {
		return `${hours}h ago`;
	} else if (minutes) {
		return `${minutes}m ago`;
	} else {
		return `${seconds}s ago`;
	}
};

export default formatTime;
