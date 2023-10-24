const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes/index')
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(router)

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
