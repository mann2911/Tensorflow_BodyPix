import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';

const Blurdemo3=()=>{
    const videoElement = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const [temp,setTemp]=useState(true);
    const startBtn = document.getElementById('start-btn');
     const stopBtn = document.getElementById('stop-btn');
    const blurBtn = document.getElementById('blur-btn');
    // const unblurBtn = document.getElementById('unblur-btn');
    const startVideo=()=>{
        startVideoStream();
    }
    function startVideoStream() {
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
          .then(stream => {
              console.log("stream object",stream);
              console.log(videoElement);
              
            videoElement.srcObject = stream;
            videoElement.play();
            canvas.height = videoElement.videoHeight;
            canvas.width = videoElement.videoWidth;
          })
          .catch(err => {
            
            alert(`Following error occured: ${err}`);
          });
      }
      
      const stopVideo=()=>{
        // startBtn.disabled = false;
        // stopBtn.disabled = true;
      
        
        // blurBtn.disabled = true;
        // videoElement.hidden = false;
        // canvas.hidden = true;
        // setTemp(false);
        stopVideoStream();
      }
      function stopVideoStream() {
        const stream = videoElement.srcObject;
      
        stream.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
      }

      const blurVideo=()=>{
        // videoElement.hidden = true;
        // canvas.hidden = false;
        console.log("blur video")
        loadBodyPix();
      }
      const notBlurVideo=()=>{
          setTemp(false);
      }
      function loadBodyPix() {
        let options = {
            architecture: 'MobileNetV1',
            outputStride: 16,
            multiplier: 0.75,
            quantBytes: 2
        }
        bodyPix.load(options)
          .then(net => {perform(net);console.log("bodypix load then")})
          .catch(err => console.log(err))
      }
      async function perform(net) {
        console.log("startbtn",startBtn,temp)
        while (temp) {
            console.log("success",true);
          const segmentation = await net.segmentPerson(videoElement);
            console.log("mann patel",segmentation)
          const backgroundBlurAmount = 10;
          const edgeBlurAmount = 10;
          const flipHorizontal = false;
      
          bodyPix.drawBokehEffect(
            canvas, videoElement, segmentation, backgroundBlurAmount,
            edgeBlurAmount, flipHorizontal);
            console.log('broken call method is runned');
        }
        
      }
    return(
        <div>
            <video id="video" width="480" height="320"  playsInline></video>
            <canvas hidden id="canvas"></canvas>
            <button id="start-btn" type="button" onClick={startVideo} >Start</button>
            <button id="stop-btn" type="button" onClick={stopVideo} >Stop</button>
            <button id="blur-btn" type="button" onClick={blurVideo} >Blur</button>
            <button id="blur-btn" type="button" onClick={notBlurVideo} >notBlur</button>
        </div>
    );
}

export default Blurdemo3;