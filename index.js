const fs = require('fs');
const pdf = require('pdf-parse');
const express = require('express'); 

const app = express();
app.use(express.json())

app.use("/", express.static("public"));

app.post("/extract-phrase", async (req, res) => {
    
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
        console.log (data);
        console.log ('test');
        console.log ('conflict');
        res.send(data);
    }
    
    await sendPhrases();
});

app.listen(3000)

// problem when readFiles returns []. How can I send an empty array using this function? 
 

