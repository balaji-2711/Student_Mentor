const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient; //to connect backend (express) with mongodb
const dbName = "Student_Mentor";
const dbUrl = `mongodb+srv://balaji:balapass@cluster0.wr30crl.mongodb.net/${dbName}`;

module.exports = { dbUrl, dbName, mongodb, MongoClient };
