import React,{useRef} from "react";
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import Person from './assets/person.jpg';

const Blurdemo1=()=>{

    const canvasRef=useRef(null); 
    let model;
    const loadPage = async () => {
        model = await bodyPix.load();
        console.log('model loaded successfully.');
        removeBackGround();
      };
      
      const removeBackGround = async () => {
        // const img = document.getElementById('image');
        const segmentation = await model.segmentPerson(Person);
      
        const coloredPartImage = bodyPix.toMask(segmentation);
        const opacity = 1;
        const flipHorizontal = false;
        const maskBlurAmount = 10;
        const canvas = document.getElementById('canvas1');
        // Draw the mask image on top of the original image onto a canvas.
        // The colored part image will be drawn semi-transparent, with an opacity of
        // 0.7, allowing for the original image to be visible under.
        bodyPix.drawMask(canvasRef.current, Person, coloredPartImage, opacity, maskBlurAmount, flipHorizontal);
        makeBlur(segmentation);
      };
      
      const makeBlur = async segmentation => {
        const img = document.getElementById('image');
        const backgroundBlurAmount = 30;
        const edgeBlurAmount = 2;
        const flipHorizontal = false;
      
        const canvas = document.getElementById('canvas2');
        // Draw the image with the background blurred onto the canvas. The edge between
        // the person and blurred background is blurred by 3 pixels.
        bodyPix.drawBokehEffect(canvasRef.current, Person, segmentation, backgroundBlurAmount, edgeBlurAmount, flipHorizontal);
      };
      
      loadPage();
      return(
          <div>
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
                </div>
      );
}

export default Blurdemo1;