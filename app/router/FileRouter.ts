const express = require('express')
const router = express.Router()

import FileController from "../controllers/FileController";
const fileController = new FileController();

router.post('/upload', fileController.uploadFile)

export default router