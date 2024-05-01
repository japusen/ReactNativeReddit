import { formatScore, formatNumComments } from "./FormatNumberInThousands";
import formatTime from "./FormatTime";
import calculateAspectRatio from "./CalculateAspectRatio";
import parseFlair from "./ParseFlair";

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
		fullname: post.name,
		title: post.title.trim(),
		subreddit: post.subreddit,
		author: post.author,
		score: formatScore(post.score),
		numComments: formatNumComments(post.num_comments),
		isNsfw: post.over_18,
		isSpoiler: post.spoiler,
		isLocked: post.locked,
		isPinned: post.pinned,
		isStickied: post.stickied,
		isRemoved: post.no_follow,
		domain: post.domain,
		permalink: post.permalink,
		time: formatTime(post.created_utc),
		flair: parseFlair(
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
	if (post.gallery_data) {
		const gallery = parseGalleryImages(
			post.media_metadata,
			post.gallery_data
		);
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
	}

	console.log("removed?", post.title);
	return linkPost(post);
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
	if (post.media) {
		const dashURL = post.media.reddit_video.dash_url;

		const hostedAspectRatio = calculateAspectRatio(
			post.media.reddit_video.width,
			post.media.reddit_video.height
		);
		return redditVideoPost(post, dashURL, hostedAspectRatio);
	}

	console.log("removed?", post.title);
	return linkPost(post);
};

const parseExternalVideo = (post) => {
	if (post.media) {
		const extractedURL = extractVideoSrcFromHTML(post.media.oembed.html);

		const externalAspectRatio = calculateAspectRatio(
			post.media.oembed.width,
			post.media.oembed.height
		);
		return externalVideoPost(post, extractedURL, externalAspectRatio);
	}

	console.log("removed?", post.title);
	return linkPost(post);
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
