const mongoose =require("mongoose");
const mongoURI="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1"



async function connectToMongo() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Sucessfully');
 
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);

  }
}

connectToMongo();

module.exports = connectToMongo;