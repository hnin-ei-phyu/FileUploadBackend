import axios from 'axios';

class UF {
    root: string = "http://localhost:3000/api/uploadFile"

    constructor() {

    }

    async uploadfile() {
        let headers: any = {}
        try {
            let result = await axios.post(`${this.root}/upload`,{headers})
            return result
        } catch (error) {
            throw error
        }
    }

}

export default UF