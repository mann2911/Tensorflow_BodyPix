import React from "react";
import './App.css';
import BlurVideoStream from "./BlurVideoStream";

//Tasks
//1)Installed tenserflow bodypix
//2)React Webcame installed
//3)using tenserflow bodypix function

function App() {
  
  return (
    <div className="App">
      <div className="App-header">
        <BlurVideoStream/>
     </div> 
    </div>
  );
}

export default App;
