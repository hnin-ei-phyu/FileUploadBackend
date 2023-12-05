import Storage from "../storage/index";
import application from "../constants/application";
 
// import csv from 'csvtojson';


class FileUpload {
    async uploadFile (req: any, res: any) {
        const file = req.files.file
        try {
            const storage = new Storage(application.env.storageLocation)
            const result = await storage.upload(file, "folder") 
             
            const data = JSON.stringify(result);
            const obj = JSON.parse(data);
            const path  = obj.path
            // console.log(path);

            const csv2json = require("./csv2json");

            fetch(path)
            .then(res => res.text())
            .then(data => {

            const json = csv2json(data, {parseNumbers: true});
            // console.log(json);
            // console.log(json[0].ATB_Status);

            const atbStatusValues = [];

            for (const dataPoint of json) {
                const atb = dataPoint.ATB_Status;
                // console.log(`ATB_Status: ${atb}`);
                atbStatusValues.push(atb);  
            }
            // console.log('ATB_Status values:', atbStatusValues);

            //Count ATB_Status times
            let count = 0;

            for (let i = 0; i < atbStatusValues.length; i++) {
                // Check if the current value is 1
                if (atbStatusValues[i] === 1) {
                    // If it's the first occurrence or the previous value was 0, increment the count
                    if (i === 0 || atbStatusValues[i - 1] === 0) {
                    count++;
                    console.log(`data: ${atbStatusValues[i]} (Start of sequence)`);
                    }
                } else {
                    // If the current value is 0, log it
                    console.log(`data: ${atbStatusValues[i]} (End of sequence)`);
                }
            }

            console.log(`Total ATB_Status: ${count}`);
            res.status(200).json({TotalATB_Status: `${count}`})
            

            });
            
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Server Error"})
        }   
    }


}

export default FileUpload