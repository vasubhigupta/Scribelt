const connectToMongo = require('./db.js');
const express = require('express')

connectToMongo();
const app = express()
const port = 3000

//to use request.body/middleware we have to use
app.use(express.json())

//Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/notes', require('./routes/notes.js'));


app.listen(port, () => {
    console.log(`Example app listening at  http://localhost:${port}`)
})