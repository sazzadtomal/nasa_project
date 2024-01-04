const API_URL="http://localhost:8000/v1"


async function httpGetPlanets() {

  const response=await fetch(`${API_URL}/planets`);
  return await response.json();
  // TODO: Once API is ready.
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  const response=await fetch(`${API_URL}/launches`);
  const fetchedLanches=await response.json();
  return fetchedLanches.sort((a,b)=>{return a.flightNumber-b.flightNumber})
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`,{
      method:"post",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(launch)
  
    })
  } catch (error) {
    return {ok:false};
  }
  ;

}

async function httpAbortLaunch(id) {


  try {
    return await fetch(`${API_URL}/launches/${id}`,{
      method:"delete"
    })
  } catch (error) {
    return {ok:false}
  }
  
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};