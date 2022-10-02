import React, {useState, useEffect} from 'react'
import axios from "axios";
import { twoline2satrec, propagate, gstime, eciToGeodetic } from 'satellite.js'
//threejs components 
const celestrakAPI = "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle";

let satrecList = [];
const sat = ()=> {

  for (let i = 0; i < satrecList.length; i++) {
    
  //  obtencion de tiempo actual
  //  obtencion de posicion y velocidad
  //  trasformacion de posicion de eci a coordenadas geodesicas (latitud, longitud y Altitud)
  let date = new Date()
  const positionAndVelocity = propagate(satrecList[i], date);
  const gmst = gstime(date);
  const position = eciToGeodetic(positionAndVelocity.position, gmst);
  console.log(position.height + " " + position.latitude + " " + position.longitude);
  }

}
function App() {
  const [satelliteData, setSatelliteData] = useState({});
  const getCoordinatesStellites = async () => {
    const response = await axios({
      method: 'get',
      url: celestrakAPI
  })
  setSatelliteData(response.data);
  };

  useEffect(() => {
    getCoordinatesStellites();
  }, []);
  if(satelliteData != null){
    let recordSatellite = satelliteData;
    recordSatellite = recordSatellite.toString().split('\r\n');
    for (let i = 0; i < recordSatellite.length-3; i+=3){
      const satrec = twoline2satrec(
        recordSatellite[i+1].trim(), 
        recordSatellite[i+2].trim()
      );
      satrecList.push(satrec);
    }
    console.log(satrecList);
  }
  sat();

  return (
    <div className="App">
      <header className="App-header">
        <p>
        </p>
          Learn React
      </header>
    </div>
  );
}

export default App;
