import React, { useState ,useRef,useEffect} from 'react';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import { image } from '@tensorflow/tfjs';

const VirtualBackground=()=>{
    
    const videoElement = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const [temp,setTemp]=useState(true);
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startVideo=()=>{
        startVideoStream();
        console.log("v ",videoRef.current.width)
    }
      
    const startVideoStream = async () => {
        const mediaStream = await navigator.mediaDevices.getUserMedia({video: true});
        videoRef.current.srcObject = mediaStream;
        let width='';
        let height="";
        if(videoRef){
            width=videoRef.current.width;
            height=videoRef.current.height;
        }
        canvasRef.current.width=width;
        canvasRef.current.height=height;
        videoRef.current.width=width;
        videoRef.current.height=height; 
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
                const backgroundBlurAmount = 8;
                const edgeBlurAmount =6;
                const flipHorizontal = true;
                await net.segmentPerson(videoRef.current,{
                    internalResolution:'medium'
                }).catch(err=>console.log("error in segmentPerson method"))
                .then(personSegmentation=>{
                    if(personSegmentation!==null){
                        drawBody(personSegmentation);
                    }
                })
                
            }
        }
    const drawBody=(personSegmentation)=>{
        console.log("canvas",canvasRef.current)
        console.log("video",videoRef.current.width)
        const context=canvasRef.current.getContext('2d');
        console.log("context",context)
        context.drawImage(videoRef.current,0,0);
        let imageData=context.getImageData(0,0,videoRef.current.width,videoRef.current.height);
        let pixel=imageData.data;
        for(let p=0;p<pixel.length;p+=4){
            if(personSegmentation.data[p/4]===0){
                pixel[p+3]=0;
            }
        }
         context.imageSmoothingEnabled=true;
         context.putImageData(imageData,0,0);
        // const fore
        // const backgroundDarkeningMask=bodyPix.toMask(personSegmentation,)
        // bodyPix.drawMask(canvasRef.current,videoRef.current,)

    
     const maskBackground = true;
    // // Convert the segmentation into a mask to darken the background.
    const foregroundColor = { r: 0, g: 0, b: 0, a: 0 };
    const backgroundColor = { r: 0, g: 0, b: 0, a: 555 };
    const backgroundDarkeningMask = bodyPix.toMask(personSegmentation, foregroundColor, backgroundColor);

    const opacity = 0.7;
    const maskBlurAmount = 3;
    const flipHorizontal = false;
    // // Draw the mask onto the image on a canvas.  With opacity set to 0.7 and
    // // maskBlurAmount set to 3, this will darken the background and blur the
    // // darkened background's edge.
    bodyPix.drawMask(canvasRef.current,videoRef.current, backgroundDarkeningMask, opacity, maskBlurAmount, flipHorizontal);
    }

      const stopVideo=()=>{
        stopVideoStream();
      }

      function stopVideoStream() {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject=null;
      }
      const trackVideo=()=>{
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

export default VirtualBackground;