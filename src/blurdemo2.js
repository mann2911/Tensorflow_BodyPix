// Install dependencies
//import dependencies
//setup webcam and canvas
//define references for those
import React,{useRef} from "react";
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import Webcam from "react-webcam";
import './App.css';
// import Blurdemo1 from './blurdemo1';
//Tasks
//1)Installed tenserflow bodypix
//2)React Webcame installed
//3)using tenserflow bodypix function
function Blurdemo2() {

  const webcamRef=useRef(null);
  const canvasRef=useRef(null);

  const runBodySegment = async()=>{
    console.log("Body pix model is not loaded");
    const net=await bodyPix.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2
    });
    // architecture: 'MobileNetV1',
      // outputStride: 16,
      // multiplier: 0.75,
      // quantBytes: 2
    //Loop and detect hands
    console.log("Body pix model is loaded");
    setInterval(()=>{
      detect(net);
    },300)
  }

  const detect= async(net)=>{
    //check data is available
    if(typeof webcamRef.current!=="undefined" &&
    webcamRef.current!== null && 
    webcamRef.current.video.readyState===4){

      //Get Video Properties
      const video=webcamRef.current.video;
      const videoHeight=video.videoHeight;
      const videoWidth=video.videoWidth;

      //set video width and height
      webcamRef.current.video.width=videoWidth;
      webcamRef.current.video.height=videoHeight;

      //set canvas width and height
      canvasRef.current.width=videoWidth;
      canvasRef.current.height=videoHeight;

      // make detections

      const person=await net.segmentPerson(video,{
        internalResolution:'medium'
      });
      // const person=await net.segmentPersonParts(video);
      console.log(person);

      // Draw Detections

    //const foregroundColor = {r: 0, g: 0, b: 0, a: 0};
    //const backgroundColor = {r: 0, g: 0, b: 0, a: 255};
    // const coloredPartImage=bodyPix.toColoredPartMask(person);//draw in colored part mask
     // const coloredPartImage = bodyPix.toMask(person); // draw only in black and white pixels
    //  const backgroundDarkeningMask = bodyPix.toMask(
    //   person, foregroundColor, backgroundColor);

    // const coloredPartImage = bodyPix.toColoredPartMask(person);
    //   bodyPix.drawMask(
    //     canvasRef.current,
    //     video,
    //     coloredPartImage,
    //     0.7,
    //     10,
    //     false,
    //     10.0//pixelCellWidth 
    //   )

      const backgroundBlurAmount = 10;
      // it is showing How many pixels in the background blend into each other. 
      //Defaults to 3. it can be an integer between 1 and 20.
      const edgeBlurAmount = 10;
      //it is showing How many pixels to blur on the edge between the person and the background by. 
      //Defaults to 3. it can be an integer between 0 and 20.
      const flipHorizontal = false;
      //it is use for flipped horizontally 

    
    // Draw the image with the background blurred onto the canvas. The edge between
    // the person and blurred background is blurred by 3 pixels.
    bodyPix.drawBokehEffect(
      canvasRef.current, video, person, backgroundBlurAmount,
    edgeBlurAmount, flipHorizontal);


    }
  }



  runBodySegment();

  return (
    <div className="App">
      <div className="App-header">
      <Webcam ref={webcamRef}
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
      />
      <canvas ref={canvasRef}
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
      />
      {/* <Blurdemo1/> */}
     </div> 
    </div>
  );
}

export default Blurdemo2;
