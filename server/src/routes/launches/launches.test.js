const request=require("supertest")
const app=require("../../app")
const {mongoConnect,mongoDisconnect}=require("../../services/mongo")



describe("Launches API",()=>{

    beforeAll(async ()=>{
        await mongoConnect();
    })

    afterAll(async ()=>{
        await mongoDisconnect();
    })

    describe("Test GET /launches",()=>{
        test("It should response with 200 success",async ()=>{ 
            const response=await request(app).get("/v1/launches")
            .expect("Content-Type",/json/)
            .expect(200);
     
        })
    
        
    });
    
    
    describe("Test POST /launches",()=>{
    
        const completeLauchData={
            mission:"Kepler Exploration",
            rocket:"Explorer IS1",
            launchDate:"December 27,2030",
            target:"Kepler-62 f"
        }
        const lauchDataWithoutDate={
            mission:"Kepler Exploration",
            rocket:"Explorer IS1",
            target:"Kepler-62 f"
        }
        const lauchDataWithInvalidDate={
            mission:"Kepler Exploration",
            rocket:"Explorer IS1",
            target:"Kepler-62 f",
            launchDate:"yoyo honey singh",
        }
    
        test("It should response with 201 created",async ()=>{
            const response=await request(app).post("/v1/launches")
            .send(completeLauchData).expect("Content-Type",/json/)
            .expect(201)
    
    
            const requestDate=new Date(completeLauchData.launchDate).valueOf;
            const responseDate=new Date(response.body.launchDate).valueOf;
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(lauchDataWithoutDate)
        })
    
         
           test("It should catch Missing required properties",async ()=>{
            const response=await request(app).post("/v1/launches")
            .send(lauchDataWithoutDate).expect("Content-Type",/json/)
            .expect(400)
    
            expect(response.body).toStrictEqual({
                error:"Missing required launch property"
             })
           })
    
    
           test("It should catch Invalid Dates",async ()=>{
            const response=await request(app).post("/v1/launches")
            .send(lauchDataWithInvalidDate).expect("Content-Type",/json/)
            .expect(400)

            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
              });
           })
        
        // test("It should catch Invalid Dates", ()=>{})
    
    })

})

