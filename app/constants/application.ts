import dotenv from "dotenv"

// Load variables from .env
dotenv.config()

// Root url of the application
const base: string = "/api/v1"

const application = {
	url: {
		base,
	},
	env: {
		host: process.env.HOST || "http://localhost:3000",
		storageLocation: process.env.STORAGE_LOCATION || "disk",
		storageAccessKeyId: process.env.STORAGE_ACCESS_KEY_ID || "",
		storageSecretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || "",
		storageBucket: process.env.STORAGE_BUCKET || "",
		storageEndpoint: process.env.STORAGE_ENDPOINT || "",
		storageRegion: process.env.STORAGE_REGION || "",
	},
}

export default application