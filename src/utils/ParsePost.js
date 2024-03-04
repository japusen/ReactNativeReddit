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
		// thumbnail can be "nsfw"
		return {
			...base,
			type: "gallery",
			thumbnail: post.thumbnail === "nsfw" ? null : post.thumbnail,
		};
	}

	switch (post.post_hint) {
		case "image":
			return {
				...base,
				type: "image",
				thumbnail: parseThumbnail(post.thumbnail, post.preview),
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
			return {
				...base,
				type: "link",
				thumbnail: parseThumbnail(post.thumbnail, post.preview),
				link: post.url,
			};
		default:
			// post with a link (can be seen in r/science)
			return {
				...base,
				type: "legacy",
				link: post.url,
			};
	}
};

const parseThumbnail = (thumbnail, preview) => {
	// thumbnail can be default
	return thumbnail && thumbnail !== "default"
		? thumbnail
		: preview.images.at(0).source.url;
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
