const mongoose=require("mongoose");


mongoose.connection.once("open",()=>{
    console.log("MongoDb Connected")
})

mongoose.connection.on("error",(err)=>{
    console.error("cannot connect"+err)
})


const MONGO_URL=process.env.MONGO_URL;


async function mongoConnect(){
    
    await mongoose.connect(MONGO_URL);
   
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports={
    mongoConnect,
    mongoDisconnect
}