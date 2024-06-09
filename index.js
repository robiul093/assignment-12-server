const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;


app.get('/', (req, res) =>{
    res.send('surver is running')
});


app.listen(port, () =>{
    console.log(`surver is running on port ${port}`)
})