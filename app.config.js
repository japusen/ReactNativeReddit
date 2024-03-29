import "dotenv/config";

export default {
	name: "ReactNativeReddit",
	slug: "ReactNativeReddit",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./assets/icon.png",
	userInterfaceStyle: "light",
	splash: {
		image: "./assets/splash.png",
		resizeMode: "contain",
		backgroundColor: "#ffffff",
	},
	assetBundlePatterns: ["**/*"],
	ios: {
		supportsTablet: true,
	},
	android: {
		package: "com.anonymous.ReactNativeReddit",
		adaptiveIcon: {
			foregroundImage: "./assets/adaptive-icon.png",
			backgroundColor: "#ffffff",
		},
	},
	web: {
		favicon: "./assets/favicon.png",
	},
	extra: {
		env: process.env.ENV,
		clientID: process.env.REDDIT_CLIENT_ID,
	},
};
