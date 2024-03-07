const parsePost = (post) => {
	const base = commonProps(post);

	if (post.is_self) {
		return selfPost(post);
	}

	if (post.is_gallery) {
		return galleryPost(post);
	}

	switch (post.post_hint) {
		case "image":
			return imagePost(post);
		case "hosted:video":
			const dashURL = post.media.reddit_video.dash_url;
			return redditVideoPost(post, dashURL);
		case "rich:video":
			const extractedURL = extractVideoSrcFromHTML(
				post.media.oembed.html
			);
			return externalVideoPost(post, extractedURL);
		case "link":
			if (post.domain === "i.imgur.com" && post.url.includes(".gifv")) {
				const url = post.url.replace(".gifv", ".mp4");
				return redditVideoPost(post, url);
			}
			return linkPost(post);
		default:
			break;
	}

	// post_hint not used in some subreddits ex: anime_irl
	if (post.is_reddit_media_domain && post.is_video) {
		const url = post.media.reddit_video.dash_url;
		return redditVideoPost(post, url);
	} else if (post.is_reddit_media_domain && !post.is_video) {
		return imagePost(post);
	} else if (post.domain === "youtube.com") {
		const id = post.url.split("?v=")[1];
		const url = `https://www.youtube.com/embed/${id}`;
		return externalVideoPost(post, url);
	} else if (
		post.domain.includes("pornhub.com") &&
		post.url.includes("?viewkey=")
	) {
		const id = post.url.split("?viewkey=")[1];
		const url = `https://www.pornhub.com/embed/${id}`;
		return externalVideoPost(post, url);
	} else {
		return {
			...base,
			type: "unhandled",
			link: post.url,
			thumbnail: parseThumbnail(post.thumbnail, post.preview, post.url),
		};
	}
};

const commonProps = (post) => {
	return {
		id: post.id,
		title: post.title,
		subreddit: post.subreddit,
		author: post.author,
		score: post.score,
		isNsfw: post.over_18,
		isSpoiler: post.spoiler,
		isLocked: post.locked,
		isPinned: post.pinned,
		isStickied: post.stickied,
		domain: post.domain,
		permalink: post.permalink,
		time: post.created_utc,
	};
};

const selfPost = (post) => {
	return {
		...commonProps(post),
		type: "self",
		text: post.selftext,
		html: post.selftext_html,
	};
};

const galleryPost = (post) => {
	const gallery = parseGalleryImages(post.media_metadata, post.gallery_data);
	return {
		...commonProps(post),
		type: "gallery",
		thumbnail: isValidThumbnail(post.thumbnail)
			? post.thumbnail
			: gallery[0].url,
		gallery,
	};
};

const imagePost = (post) => {
	return {
		...commonProps(post),
		type: "image",
		thumbnail: parseThumbnail(post.thumbnail, post.preview, post.url),
		imageURL: post.url,
	};
};

const redditVideoPost = (post, url) => {
	return {
		...commonProps(post),
		type: "reddit_video",
		thumbnail: parseThumbnail(post.thumbnail, post.preview),
		videoURL: url,
	};
};

const externalVideoPost = (post, url) => {
	return {
		...commonProps(post),
		type: "external_video",
		thumbnail: parseThumbnail(post.thumbnail, post.preview),
		videoURL: url,
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

const parseGalleryImages = (metaData, galleryData) => {
	return galleryData.items.map((item) => {
		const id = item.media_id;
		const ext = metaData[id].m.split("/")[1];
		return { id, url: "https://i.redd.it/".concat(id, `.${ext}`) };
	});
};

const parseThumbnail = (thumbnail, preview, url = null) => {
	// thumbnail can be default
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

const extractVideoSrcFromHTML = (htmlString) => {
	const regex = /src\s*=\s*["']([^"']+)["']/;
	const match = regex.exec(htmlString);

	if (match && match.length > 1) {
		return match[1];
	} else {
		return null; // Return null if no match is found
	}
};

export default parsePost;
