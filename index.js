const express = require('express'); 

const app = express();
app.use(express.json())
const extractor = require('./routes/extractor')

app.use("/", express.static("public"));
app.use("/extract-phrase", extractor);

app.listen(3000);