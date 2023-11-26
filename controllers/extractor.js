const fs = require('fs');
const pdf = require('pdf-parse');

const getPhrases = (req, res) => {
    
    async function readDir() {
        const files = fs.readdirSync('./pdfs');  
        return files;
    }

    async function readFiles(file) {
        return new Promise((resolve, reject) => {

            let dataBuffer = fs.readFileSync(`pdfs/${file}`);
            let expression = req.body.word;
            
            pdf(dataBuffer).then(function(data, err) {
                const regex = new RegExp(`[^.?!]*${expression}[^.]*\.`, 'g');
                const pdfText = data.text.replace(/(\r\n|\n|\r|\t)/gm, "");
                const result = pdfText.match(regex);
                
                if(result != null){
                    const foundReplaced = result.map((el, key) =>  (el.replace(/(\r\n|\n|\r|\t)/gm, "") ))
                    resolve(foundReplaced);         
                }
            })
            .catch(function(error){
                reject(error)
            })
        })
    }

    async function sendPhrases(){
        const data = [];
        try {
            const files = await readDir();

            const promises = files.map(async (file) => {
                try {
                    const result = await readFiles(file);
                    return result;
                } catch (error) {
                    console.error(`Error reading file ${file}: ${error}`);
                    return [];
                }
            });
            
            const fileData = await Promise.all(promises);
            data.push(...fileData.flat());
            res.send(data);
        } catch (error) {
            console.error(`Error reading directory: ${error}`);
            res.status(500).send("Internal Server Error");
        }

    }

    sendPhrases();
}

module.exports = {
    getPhrases,
};