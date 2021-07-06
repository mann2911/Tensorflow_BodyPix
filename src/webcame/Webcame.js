import React from 'react';
import Webcam from "react-webcam";
const Webcame=()=>{
    const [capturing, setCapturing] = React.useState(false);
    const webcamRef = React.useRef(null);

    const handleStartCaptureClick = React.useCallback(() => {
        setCapturing(true);
    }, [webcamRef, setCapturing]);

      const handleStopCaptureClick = React.useCallback(() => {
        setCapturing(false);
      }, [webcamRef, setCapturing]);

    return(
        <div>
            <h1>Hey!! this is the webcam task</h1>
            {/* <Webcam/> */}
            <button onClick={handleStartCaptureClick}>Start Capture</button>
            <button onClick={handleStopCaptureClick}>Stop Capture</button>
            
            <div>{capturing ?<Webcam audio={true} ref={webcamRef} />:null}</div>
            
    
     
        
        </div>
    );
}

export default Webcame;