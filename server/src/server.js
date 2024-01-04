const http=require("http");
require("dotenv").config();
const app=require("./app")
const {loadPlanetsData}=require("./models/planets.model");
const  {mongoConnect}=require("./services/mongo")
const {loadLaunchesData}=require("./models/launches.model")

const server=http.createServer(app);

const PORT=process.env.PORT || 3000; 







async function initServer (){

   await mongoConnect();

   await loadPlanetsData;
   
   await loadLaunchesData();
   
   
   
   server.listen(PORT,()=>{
        console.log(`listening on port ${PORT}`)
    });
}



initServer();






