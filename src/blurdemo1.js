import React,{useRef,useCallback, useState} from "react";
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import Webcam from "react-webcam";
import './App.css';

const Blurdemo1=()=>{

  const webcamRef=useRef(null);
  const canvasRef=useRef(null);
  const [bluring,setBluring]=useState(false);
  const [capturing,setCapturing]=useState(false);
  const [temp,setTemp]=useState(false);

  // const capturing=useCallback(()=>{
  //   if(typeof webcamRef.current!=="undefined" &&
  //   webcamRef.current!== null && 
  //   webcamRef.current.video.readyState===4){
  //     console.log("Success")
  //   }
  //   console.log("mann")
  //   console.log("webcam",webcamRef)

  //   // while(e){
  //   //   console.log("a")
  //   // }
  // },[webcamRef])
  // capturing();
  const handleStartCaptureClick = async()=> {
     setCapturing(true);
    // while(1){
    //   console.log("success",capturing)
    //   if(temp){
    //     console.log("not success")
    //     break;
    //   }
    // }
    const net=await bodyPix.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2
    });
    const video=await webcamRef.current.video;
    const person=await net.segmentPerson(video,{
      internalResolution:'medium'
    });
    const backgroundBlurAmount = 10;
    // it is showing How many pixels in the background blend into each other. 
    //Defaults to 3. it can be an integer between 1 and 20.
    const edgeBlurAmount = 10;
    //it is showing How many pixels to blur on the edge between the person and the background by. 
    //Defaults to 3. it can be an integer between 0 and 20.
    const flipHorizontal = false;
    bodyPix.drawBokehEffect(
      canvasRef.current, video, person, backgroundBlurAmount,
    edgeBlurAmount, flipHorizontal);


    
    };
  
    const handleStopCaptureClick = React.useCallback(() => {
      setCapturing(false);
      setTemp(true);
    }, [webcamRef, setCapturing]);

  const handleKeyDown=(e)=> {
    if (e.keyCode === 27) {
      console.log('You pressed the escape key!')
    }
  }

    
    return(
          <div className="App">
             <div><input type='text'
             onKeyPress={handleKeyDown} /></div>
             <div><button onClick={handleStartCaptureClick}>Start Capture</button>
            <button onClick={handleStopCaptureClick}>Stop Capture</button>
            </div>
             <div className="App-header">
             
             {capturing?<Webcam ref={webcamRef}
             style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 640,
              height: 480,
            }}
            />:null}
            {capturing?<canvas ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 640,
              height: 480,
            }}
            />:null}
            {/* <Blurdemo1/> */}
            
          </div> 
        </div>
      );
}

export default Blurdemo1;