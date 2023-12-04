import express from 'express';
import bodyParser from 'body-parser';
import FileRouter from './router/FileRouter';
import fileupload from 'express-fileupload';
import path from "path"

const app = express();
const port = 3000

app.use(fileupload({createParentPath: true}))
app.use(bodyParser.json())
    app.use(function (req: any, res: any, next: any) {
        res.set("Access-Control-Allow-Origin", "*")
        res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
        res.set("Access-Control-Allow-Headers", "Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,Content-Type, Date, X-Api-Version, x-access-token")

        next()
})

app.use("/api/uploadFile", FileRouter)
app.use("/static", express.static(path.join(__dirname, "../static")))

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
})