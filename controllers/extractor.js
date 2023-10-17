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
                const re = new RegExp(`[^.?!]*${expression}[^.]*\.`, 'g');
                const pdfText = data.text.replace(/(\r\n|\n|\r|\t)/gm, "");
                const found = pdfText.match(re);
                
                if(found != null){
                    const foundReplaced = found.map((el, key) =>  (el.replace(/(\r\n|\n|\r|\t)/gm, "") ))
                    resolve(foundReplaced);         
                }
            })
            .catch(function(error){
                reject(error)
            })
        })
    }

    async function sendPhrases(){
        let data = []
        const files = await readDir(); 

        const promises = files.map(async file => { 
            const result = await readFiles(file)
            data.push(...result)
        });
        await Promise.all(promises)
        res.send(data);
    }

    sendPhrases();
}

module.exports = {
    getPhrases,
};