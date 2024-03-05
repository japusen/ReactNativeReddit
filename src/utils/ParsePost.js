const parsePost = (post) => {
	const base = {
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

	if (post.is_self) {
		return {
			...base,
			type: "self",
			text: post.selftext,
			html: post.selftext_html,
		};
	}

	if (post.is_gallery) {
		const gallery = parseGallery(post.media_metadata, post.gallery_data);
		return {
			...base,
			type: "gallery",
			thumbnail: isValidThumbnail(post.thumbnail)
				? post.thumbnail
				: gallery[0].url,
			gallery,
		};
	}

	switch (post.post_hint) {
		case "image":
			return {
				...base,
				type: "image",
				thumbnail: parseThumbnail(
					post.thumbnail,
					post.preview,
					post.url
				),
				imageURL: post.url,
			};
		case "hosted:video":
			return {
				...base,
				type: "reddit_video",
				thumbnail: parseThumbnail(post.thumbnail, post.preview),
				videoURL: post.media.reddit_video.dash_url,
			};
		case "rich:video":
			return {
				...base,
				type: "external_video",
				thumbnail: parseThumbnail(post.thumbnail, post.preview),
				videoURL: extractVideoSrcFromHTML(post.media.oembed.html),
			};
		case "link":
			if (post.domain === "i.imgur.com" && post.url.includes(".gifv")) {
				return {
					...base,
					type: "reddit_video",
					thumbnail: parseThumbnail(post.thumbnail, post.preview),
					videoURL: post.url.replace(".gifv", ".mp4"),
				};
			}
			return {
				...base,
				type: "link",
				thumbnail: parseThumbnail(post.thumbnail, post.preview),
				link: post.url,
			};
		default:
			// post_hint not used in some subreddits ex: anime_irl
			if (post.is_reddit_media_domain && post.is_video) {
				return {
					...base,
					type: "reddit_video",
					thumbnail: parseThumbnail(post.thumbnail, post.preview),
					videoURL: post.media.reddit_video.dash_url,
				};
			} else if (post.is_reddit_media_domain && !post.is_video) {
				return {
					...base,
					type: "image",
					thumbnail: parseThumbnail(
						post.thumbnail,
						post.preview,
						post.url
					),
					imageURL: post.url,
				};
			} else if (post.domain === "youtube.com") {
				const id = post.url.split("?v=")[1];
				return {
					...base,
					type: "external_video",
					thumbnail: null,
					videoURL: `https://www.youtube.com/embed/${id}`,
				};
			} else if (post.domain === "pornhub.com") {
				const id = post.url.split("?viewkey=")[1];
				return {
					...base,
					type: "external_video",
					thumbnail: parseThumbnail(post.thumbnail, post.preview),
					videoURL: `https://www.pornhub.com/embed/${id}`,
				};
			} else {
				return {
					...base,
					type: "unhandled",
					link: post.url,
					thumbnail: parseThumbnail(
						post.thumbnail,
						post.preview,
						post.url
					),
				};
			}
	}
};

const parseGallery = (metaData, galleryData) => {
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
