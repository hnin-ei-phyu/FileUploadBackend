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

                const atbStatusValues: any = [];
                const TimeStamp: any = [];

                for (const dataPoint of json) {
                    const atb = dataPoint.ATB_Status;
                    const timestamp = dataPoint.Timestamp;
                    // console.log(`ATB_Status: ${atb}, ${timestamp}`);
                    atbStatusValues.push(atb);
                    TimeStamp.push(timestamp);  
                }
                //Merge tow array abbSatatusValues & Timestampp into one array myArr
                const myArr = atbStatusValues.map((value: any, index: any) => [value, TimeStamp[index]]);
                // console.log(myArr);

                //Count ATB_Status times And Duration
                let count = 0;
                let totalTime = 0; // in minutes
                const sequenceInfo: any[] = [];

                for (let i = 0; i < myArr.length; i++) {
                    const currentValue = myArr[i][0];
                
                    if (currentValue === 1 && (i === 0 || myArr[i - 1][0] === 0)) {
                        // Start of a new sequence
                        count++;
                        const currentSequenceStartTime: any = new Date(myArr[i][1]);
                    
                        // Find the index of the next 0
                        const endIndex = myArr.findIndex(([value]: any, index: any) => index > i && value === 0);
                    
                        // If there is no next 0, consider the sequence until the end
                        const endIndexOrLastIndex = endIndex !== -1 ? endIndex : myArr.length;
                    
                        const currentSequenceEndTime: any = new Date(myArr[endIndexOrLastIndex - 1][1]);
                    
                        const durationInMilliseconds = currentSequenceEndTime - currentSequenceStartTime;
                        const durationInMinutes = durationInMilliseconds / (1000 * 60);

                        totalTime += durationInMinutes;

                    
                        const sequenceInfoItem = {
                            sequence: count,
                            startTime: currentSequenceStartTime,
                            endTime: currentSequenceEndTime,
                            duration: durationInMinutes.toFixed(2),
                          };
            
                          sequenceInfo.push(sequenceInfoItem);
                        }
                      }
            
                      res.status(200).json({ TotalATB_Status: count,TotalTime: totalTime.toFixed(2) ,sequenceInfo });

            });
             
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Server Error"})
        }   
    }


}

export default FileUpload