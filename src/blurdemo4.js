import React, { useState ,useRef,useEffect} from 'react';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';

const BlurDemo4=()=>{
    
    // const videoElement = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const [temp,setTemp]=useState(true);
    // const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('start-btn');
     const stopBtn = document.getElementById('stop-btn');
     const trackBtn = document.getElementById('track-btn');
     const untrackBtn = document.getElementById('untrack-btn');
     const videoRef = useRef(null);
     const canvasRef = useRef(null);

     const startVideo=()=>{
        startVideoStream();
    }
    // function startVideoStream() {
    //     navigator.mediaDevices.getUserMedia({video: true, audio: false})
    //       .then(stream => {
    //           console.log("stream object",stream);
    //           console.log(videoElement);
              
    //         videoElement.srcObject = stream;
    //         videoElement.play();
    //       })
    //       .catch(err => {
            
    //         alert(`Following error occured: ${err}`);
    //       });
    //   }
      
        const startVideoStream = async () => {
            // console.log("videoelement1",videoElement)
            //videoElement.srcObject={};
            // await navigator.mediaDevices.getUserMedia({video: true, audio: false})
            // .then(stream => {
            //     console.log("stream object",stream);
            //     console.log(videoElement);
            //     var sourceObject = videoElement.srcObject;

            //     videoElement.srcObject = sourceObject;
            //   videoElement.Object = stream;
            //   console.log("videoelement2",videoElement)
            //   videoElement.play();
            
            // })
            // .catch(err => {
              
            //   alert(`Following error occured: ${err}`);
            // });

            const mediaStream = await navigator.mediaDevices.getUserMedia({video: true});
            console.log("dc",typeof mediaStream)
            videoRef.current.srcObject = mediaStream;
            console.log("videoRef",videoRef.current.width)
            let width='';
            let height="";
            if(videoRef){
             width=videoRef.current.width;
            height=videoRef.current.height;
            // videoElement.width=width;
            // videoElement.height=height;
            
            
            }
            // const net=await bodyPix.load()
            console.log("canvasRef",canvasRef)
            
                
            console.log("videoelment",videoRef.current)
            canvasRef.current.width=width;
            canvasRef.current.height=height;
            videoRef.current.width=width;
            videoRef.current.height=height; 
            // canvas.width=width;
            // canvas.height=height
            const options={
                architecture: 'MobileNetV1',
                outputStride: 16,
                multiplier: 0.75,
                quantBytes: 2

            }
            bodyPix.load(options)
    .then(net => perform(net))
    .catch(err => console.log(err))
   
            

    };
    
        

        async function perform(net){
                            
            while(temp){

            console.log("net",videoRef.current)
            const person=await net.segmentPerson(videoRef.current,{
                internalResolution:'medium'
              });
              console.log("person",person)
              const backgroundBlurAmount = 7;
      // it is showing How many pixels in the background blend into each other. 
      //Defaults to 3. it can be an integer between 1 and 20.
      const edgeBlurAmount =20;
      //it is showing How many pixels to blur on the edge between the person and the background by. 
      //Defaults to 3. it can be an integer between 0 and 20.
      const flipHorizontal = true;
      //it is use for flipped horizontally 

    
    // Draw the image with the background blurred onto the canvas. The edge between
    // the person and blurred background is blurred by 3 pixels.
    bodyPix.drawBokehEffect(
      canvasRef.current,videoRef.current, person, backgroundBlurAmount,
    edgeBlurAmount, flipHorizontal);
    console.log("garv");
            }
            

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
        const stream = videoRef.current.srcObject;
      
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject=null;
      }
      const trackVideo=()=>{
          console.log("kj")
          setTemp(false);
      }
    return(
        <div>
            <div style={{textAlign:'center',margin:'10px'}}>Real Video
            <video id="video" ref={videoRef}  width="480" height="320" autoPlay={true} playsInline></video></div>
            <div style={{textAlign:'center'}}>Blur Video<canvas  id="canvas"  width="480" height="320" ref={canvasRef}></canvas></div>
            <div style={{textAlign:'center'}}>
            <button id="start-btn" type="button" onClick={startVideo} >Start</button>
            <button id="stop-btn" type="button" onClick={stopVideo} >Stop</button>
            <button id="track-btn" type="button" onClick={trackVideo} hidden disabled={false}>Track</button>
            <button id="untrack-btn" type="button" hidden disabled={true}>UnTrack</button>
            </div>

        </div>
    );


}

export default BlurDemo4;