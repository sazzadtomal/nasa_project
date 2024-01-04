const launchesDatabase=require("./launches.mongo")
const planets=require("./planets.mongo")
const axios=require("axios");

const launches=new Map();


const DEFAULT_FILE_NUMBER=100;


async function saveLaunch(launch){

    await launchesDatabase.findOneAndUpdate({
        flightNumber:launch.flightNumber,
    },launch,{
        upsert:true
    })
}

const SPACEX_API_URL="https://api.spacexdata.com/v4/launches/query";



async function populateLaunches(){
    console.log("downloading spacex data");
    const response=await axios.post(SPACEX_API_URL,{
        query:{},
        options:{
            pagination:false,
            populate:[
                {
                    path:"rocket",
                    select:{
                        "name":1
                    }
                },
                {
                    path:"payloads",
                    select:{
                        "customers":1
                    }
                }
            ]
        }
    })

    const launchDocs=response.data.docs;
    for(const launchDoc of launchDocs){
        const payloads=launchDoc["payloads"];
        const customers=payloads.flatMap((payload)=>{
            return payload["customers"]
        })
        const launch={
            flightNumber:launchDoc["flight_number"],
            mission:launchDoc["name"],
            launchDate:launchDoc["date_local"],
            upcoming:launchDoc["upcoming"],
            success:launchDoc["success"],
            rocket:launchDoc["rocket"]["name"],
            customers,
        }
        


        if(response.status!== 200 ){
            console.log("problem downloading")
            throw new Error("launch data download failed")
        }

        await saveLaunch(launch)
    }
}






 async function loadLaunchesData(){
    const firstLaunch= await findLaunch({
        flightNumber:1,
        rocket:"Falcon 1",
        mission:"FalconSat" 
    });
    if(firstLaunch){
        console.log("launch data already exists")
    
    }else{
        await populateLaunches()
    }

}

async function getLatestFlightNUmber(){
    const latestLaunch=await launchesDatabase.findOne(
        {}).sort("-flightNumber")

        if(!latestLaunch){
           return DEFAULT_FILE_NUMBER
        }
       
        return latestLaunch.flightNumber; 
}




async function getAllLaunches(skip,limit){
    return await launchesDatabase.find({},{
        "_id":0,"__v":0
    }).sort({flightNumber:1}).skip(skip).limit(limit)
}


async function findLaunch(filter){
   return await launchesDatabase.findOne(filter)
}

async function existsLaunchWithId(launchId){
    return await findLaunch({
        flightNumber:launchId
    })
}



function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(latestFlightNumber,Object.assign(launch,{
        flightNumber:latestFlightNumber,
        upcoming:true,
        customers:["ztm","nasa"],
        success:true
    }))
}


async function scheduleNewLaunch(launch){

    const planet=await planets.findOne({
        keplerName:launch.target,
    })
     
    if(!planet){
        throw new Error("planet not exists")
    }
    
    
    const newFlightNumber=await getLatestFlightNUmber()+1;

    const newLaunch=Object.assign(launch,{
        flightNumber: newFlightNumber,
        upcoming:true,
        customers:["ztm","nasa"],
        success:true
    })

    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId){

    const aborted=await launchesDatabase.updateOne({
        flightNumber:launchId
    },{
        upcoming:false,
        success:false
    })

    console.log(aborted)

    return aborted.modifiedCount===1;
 }



module.exports={
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
    loadLaunchesData
}