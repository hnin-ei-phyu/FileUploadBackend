import fileUpload from "express-fileupload"
import application from "../constants/application"
import aws from "aws-sdk"
import decompress from "decompress"
import fs from "fs"
// import Promise from "core-js-pure/features/promise"

/** Class representing a file storage */
class Storage {
	driver: string

	/**
	 * Initialize the required driver for file storage
	 */
	constructor(driver: string) {
		this.driver = driver
	}

	/**
	 * Update the required file to s3 storage
	 */
	private async uploadToS3(file: fileUpload.UploadedFile, folder: string): Promise<string> {
		// S3 config
		const s3EndPoint = new aws.Endpoint(application.env.storageEndpoint)
		const s3 = new aws.S3({
			region: application.env.storageRegion,
			endpoint: s3EndPoint,
			accessKeyId: application.env.storageAccessKeyId,
			secretAccessKey: application.env.storageSecretAccessKey,
		})

		let assignedName = `${new Date().getTime()}.${file.mimetype.split("/")[1]}`
		const params = {
			Bucket: application.env.storageBucket,
			Key: `${folder}/${assignedName}`,
			Body: file.data,
		}

		try {
			const data = await s3.upload(params).promise()
			return data.Location
		} catch (error) {
			throw "Unable to upload to bucket."
		}
	}

	/**
	 * Upload the file to local disk
	 */
	private async uploadLocal(file: fileUpload.UploadedFile, folder: string): Promise<string> {
		let assignedName = `${new Date().getTime()}.${
			file.mimetype.split("/")[1]
		}`
		try {
			// console.log(file);
			
			await file.mv(`static/${folder}/${assignedName}`)		
			return `${application.env.host}/static/${folder}/${assignedName}`
		} catch (error) {
			throw "Unable to move uploaded file."
		}
	}

	private async uploadZipFileLocal(file: fileUpload.UploadedFile, folder: string) {
		const assignedName = `${new Date().getTime()}.${file.mimetype.split("/")[1]}`
		const templateName = file.name.split(".")[0]
		const folderName = file.name.split(".")[1]
		const mimeType = file.mimetype

		const tempFileDest = `static/${folder}/${assignedName}}`
		const finalDest = `static/${folder}/${templateName}/${folderName}`

		const folderPath = `static/${folder}/${templateName}`

		if (mimeType !== "application/zip") {
			throw "unsupprted_extension"
		}

		try {
			// Accept the temporary file
			await file.mv(tempFileDest)
			// Decompress the incoming zip file
			await decompress(tempFileDest, finalDest)
			// And delete the temporary file
			fs.unlinkSync(tempFileDest)

			return folderPath
		} catch (error) {
			throw error
		}
	}

	/**
	 * Public uploadable method for zip files
	 */
	async uploadZip(file: fileUpload.UploadedFile, folder: string) {
		try {
			let uploadedResult

			if (this.driver == "s3") {
			} else {
				const folderPath: string = (await this.uploadZipFileLocal(file, folder)) as string

				uploadedResult = {
					size: file.size,
					encoding: file.encoding,
					mimeType: file.mimetype,
					path: folderPath,
					uploadedType: "local-disk",
				}
			}

			return uploadedResult
		} catch (error) {
			throw error
		}
	}

	/**
	 * Public uploadable method
	 */
	async upload(file: fileUpload.UploadedFile, folder: string): Promise<Object> {
		try {
			let uploadedResult

			if (this.driver === "s3") {
				const filePath: string = await this.uploadToS3(file, folder)

				uploadedResult = {
					size: file.size,
					encoding: file.encoding,
					mimeType: file.mimetype,
					path: filePath,
					uploadedType: "s3",
				}
			} else {
				const filePath = await this.uploadLocal(file, folder)

				uploadedResult = {
					size: file.size,
					encoding: file.encoding,
					mimeType: file.mimetype,
					path: filePath,
					uploadedType: "local-disk",
				}
			}
			return uploadedResult
		} catch (error) {
			throw error
		}
	}
}

export default Storage