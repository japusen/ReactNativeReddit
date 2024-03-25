const parsePost = (post) => {
	if (post.is_self) {
		return selfPost(post);
	}

	if (post.is_gallery) {
		return galleryPost(post);
	}

	if (post.crosspost_parent_list) {
		return crossPost(post);
	}

	switch (post.post_hint) {
		case "image":
			return imagePost(post);
		case "hosted:video":
			return parseRedditVideo(post);
		case "rich:video":
			return parseExternalVideo(post);
		case "link":
			return parseLink(post);
		default:
			break;
	}

	// post_hint not used in some subreddits ex: anime_irl
	if (post.is_reddit_media_domain && post.is_video) {
		return parseRedditVideo(post);
	} else if (post.is_reddit_media_domain) {
		return imagePost(post);
	} else if (post.domain === "youtube.com") {
		const id = post.url.split("?v=")[1];
		const url = `https://www.youtube.com/embed/${id}`;
		return externalVideoPost(post, url, 16 / 9);
	} else if (
		post.domain.includes("pornhub.com") &&
		post.url.includes("?viewkey=")
	) {
		const id = post.url.split("?viewkey=")[1];
		const url = `https://www.pornhub.com/embed/${id}`;
		return externalVideoPost(post, url, 16 / 9);
	} else {
		return {
			...commonProps(post),
			type: "unhandled",
			link: post.url,
			thumbnail: parseThumbnail(post.thumbnail, post.preview), //, post.url),
		};
	}
};

const commonProps = (post) => {
	return {
		id: post.id,
		title: post.title.trim(),
		subreddit: post.subreddit,
		author: post.author,
		score: formatNumberInThousands(post.score, "point"),
		numComments: formatNumberInThousands(post.num_comments, "comment"),
		isNsfw: post.over_18,
		isSpoiler: post.spoiler,
		isLocked: post.locked,
		isPinned: post.pinned,
		isStickied: post.stickied,
		domain: post.domain,
		permalink: post.permalink,
		time: formatTime(post.created_utc),
		linkFlair: parseFlair(
			post.link_flair_type,
			post.link_flair_text,
			post.link_flair_richtext,
			post.link_flair_background_color,
			post.link_flair_text_color
		),
		selfText: post.selftext,
	};
};

const selfPost = (post) => {
	return {
		...commonProps(post),
		type: "self",
	};
};

const galleryPost = (post) => {
	const gallery = parseGalleryImages(post.media_metadata, post.gallery_data);
	const aspectRatios = gallery.map((item) => item.aspectRatio);
	const minAspectRatio = Math.min(...aspectRatios);

	return {
		...commonProps(post),
		type: "gallery",
		thumbnail: isValidThumbnail(post.thumbnail)
			? post.thumbnail
			: gallery[0].url,
		gallery,
		aspectRatio: minAspectRatio,
	};
};

const imagePost = (post) => {
	const aspectRatio = post.preview
		? calculateAspectRatio(
				post.preview.images[0].source.width,
				post.preview.images[0].source.height
		  )
		: 1;
	return {
		...commonProps(post),
		type: "image",
		thumbnail: parseThumbnail(post.thumbnail, post.preview, post.url),
		imageURL: post.url,
		aspectRatio,
	};
};

const redditVideoPost = (post, url, aspectRatio = 1) => {
	return {
		...commonProps(post),
		type: "reddit_video",
		thumbnail: parseThumbnail(post.thumbnail, post.preview),
		videoURL: url,
		aspectRatio,
	};
};

const externalVideoPost = (post, url, aspectRatio = 1) => {
	return {
		...commonProps(post),
		type: "external_video",
		thumbnail: parseThumbnail(post.thumbnail, post.preview),
		videoURL: url,
		aspectRatio,
	};
};

const linkPost = (post) => {
	return {
		...commonProps(post),
		type: "link",
		thumbnail: parseThumbnail(post.thumbnail, post.preview),
		link: post.url,
	};
};

const crossPost = (post) => {
	return {
		...commonProps(post),
		type: "cross-post",
		innerPost: parsePost(post.crosspost_parent_list[0]),
	};
};

const parseRedditVideo = (post) => {
	const dashURL = post.media.reddit_video.dash_url;

	const hostedAspectRatio = calculateAspectRatio(
		post.media.reddit_video.width,
		post.media.reddit_video.height
	);
	return redditVideoPost(post, dashURL, hostedAspectRatio);
};

const parseExternalVideo = (post) => {
	const extractedURL = extractVideoSrcFromHTML(post.media.oembed.html);

	const externalAspectRatio = calculateAspectRatio(
		post.media.oembed.width,
		post.media.oembed.height
	);
	return externalVideoPost(post, extractedURL, externalAspectRatio);
};

const parseLink = (post) => {
	if (post.domain === "i.imgur.com" && post.url.includes(".gifv")) {
		const url = post.url.replace(".gifv", ".mp4");
		return redditVideoPost(post, url);
	}
	return linkPost(post);
};

const parseGalleryImages = (metaData, galleryData) => {
	return galleryData.items.map((item) => {
		const id = item.media_id;
		const ext = metaData[id].m.split("/")[1];
		const aspectRatio = metaData[id].s.x / metaData[id].s.y;
		return {
			id,
			url: "https://i.redd.it/".concat(id, `.${ext}`),
			aspectRatio,
		};
	});
};

const parseThumbnail = (thumbnail, preview, url = null) => {
	return isValidThumbnail(thumbnail)
		? thumbnail
		: preview
		? preview.images.at(0).source.url
		: url;
};

const isValidThumbnail = (thumbnail) => {
	return (
		thumbnail &&
		thumbnail !== "default" &&
		thumbnail !== "nsfw" &&
		thumbnail !== "image" &&
		thumbnail !== "spoiler"
	);
};

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

const extractVideoSrcFromHTML = (htmlString) => {
	const regex = /src\s*=\s*["']([^"']+)["']/;
	const match = regex.exec(htmlString);

	if (match && match.length > 1) {
		return match[1];
	} else {
		return null; // Return null if no match is found
	}
};

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

const calculateAspectRatio = (width, height) => {
	return width && height ? width / height : 1;
};

export default parsePost;
