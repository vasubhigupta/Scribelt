const mongoose = require('mongoose')

const mongoURI = "mongodb://0.0.0.0:27017/inotebook"
//callbacks
//prommises

const connectToMongo = async() =>{
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongoose successfully")
}

module.exports =  connectToMongo;