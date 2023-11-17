const {MongoClient} = require("mongodb"); 
const mongoose = require("mongoose")

const connectDB = async(connectionString) => {

    try {
        const client = new MongoClient(connectionString);
        client.connect((err) =>{
            const collection = client.db("").collection("");
            console.log(collection.find());
        });
        const Connect = await mongoose.connect(connectionString)
        console.log("DB connected")
    } catch (error) {
        console.log(`DB connection failed ${error}`)
        process.exit(1)
    }
}


module.exports = { connectDB };