import React, { useState, useRef
} from 'react';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';

const BlurVideoStream = () => {

  const [temp, setTemp] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startVideo = () => {
    startVideoStream();
  }

  const startVideoStream = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = mediaStream;
    let width = "";
    let height = "";
    if (videoRef) {
      width = videoRef.current.width;
      height = videoRef.current.height;
    }

    canvasRef.current.width = width;
    canvasRef.current.height = height;
    videoRef.current.width = width;
    videoRef.current.height = height;

    const options = {
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2
    }

    bodyPix.load(options)
      .then(net => perform(net))
      .catch(err => console.log("body pix error" + err))
  };



  async function perform(net) {
    while (temp) {
      const person = await net.segmentPerson(videoRef.current, {
        internalResolution: 'medium'
      });
      const backgroundBlurAmount = 7;
      // it is showing How many pixels in the background blend into each other. 
      //Defaults to 3. it can be an integer between 1 and 20.
      const edgeBlurAmount = 20;
      //it is showing How many pixels to blur on the edge between the person and the background by. 
      //Defaults to 3. it can be an integer between 0 and 20.
      const flipHorizontal = true;
      //it is use for flipped horizontally 


      // Draw the image with the background blurred onto the canvas. The edge between
      // the person and blurred background is blurred by 3 pixels.
      bodyPix.drawBokehEffect(
        canvasRef.current, videoRef.current, person, backgroundBlurAmount,
        edgeBlurAmount, flipHorizontal);
    }
  }

  const stopVideo = () => {
    stopVideoStream();
  }

  function stopVideoStream() {
    const stream = videoRef.current.srcObject;
    if (temp) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current.srcObject) { videoRef.current.srcObject = null }
    }
  }

  return (
    <>
    
    
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark justify-content-center">
        <a className="navbar-brand" href="#"></a>
        <ul className="navbar-nav">
          <h2>Bluring Image Using TensorFlow BodyPix</h2>
        </ul>
      </nav><br/>

    
      <div className="row ">
        <div className="col-12 col-sm-6 border justify-content-center text-center">
          <h2>Real Video Stream</h2>
          <video id="video" ref={videoRef} width="480" height="420" autoPlay={true} playsInline></video>
        </div>
        <div className="col-12 col-sm-6 border text-center">
          <h2>Blur Video Stream</h2>
          <canvas id="canvas" width="480" height="420" ref={canvasRef} playsInline></canvas>
        </div>
        <div className="col-12 col-sm-12 text-center">
          <button id="start-btn"className="btn btn-success m-2 " type="button" onClick={startVideo} >Start</button>
          <button id="stop-btn" className="btn btn-danger m-2" type="button" onClick={stopVideo} >Stop</button>
        </div>
      </div>
      
    </>
  );
}

export default BlurVideoStream;