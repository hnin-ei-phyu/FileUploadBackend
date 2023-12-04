import Storage from "../storage/index";
import application from "../constants/application";
import fs from 'fs';

class FileUpload {
    async uploadFile (req: any, res: any) {
        const file = req.files.file
        try {
            const storage = new Storage(application.env.storageLocation)
            const result = await storage.upload(file, "folder") 
            console.log(result);
             
            const data = JSON.stringify(result);
            const obj = JSON.parse(data);
            const path  = obj.path
            
            fetch('url/to/your/csv/'+path)

            .then(function(response) {
            return response.text()
            })
            // .then(function(csv) {
            // // convert your csv to an array
            // });
                
            
            res.status(200)
            
            
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Server Error"})
        }   
    }


}

export default FileUpload