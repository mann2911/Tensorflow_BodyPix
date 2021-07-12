import React, { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import "./virtualBackground.css";

const VirtualBackground = () => {
  const [temp, setTemp] = useState(true);
  const [loadImage, setLoadImage] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startVideo = () => {
    startVideoStream();
  };

  const startVideoStream = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    videoRef.current.srcObject = mediaStream;
    let width = "";
    let height = "";
    if (videoRef) {
      width = videoRef.current.width;
      height = videoRef.current.height;
    }
    if (canvasRef) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
    videoRef.current.width = width;
    videoRef.current.height = height;
    setLoadImage(true);
    const options = {
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2,
    };
    bodyPix
      .load(options)
      .then((net) => perform(net))
      .catch((err) => console.log(err));
  };

  async function perform(net) {
    while (temp) {
      const backgroundBlurAmount = 8;
      const edgeBlurAmount = 6;
      const flipHorizontal = true;
      await net
        .segmentPerson(videoRef.current, {
          flipHorizontal: true,
          internalResolution: "medium",
          segmentationThreshold: 0.5,
        })
        .catch((err) => console.log("error in segmentPerson method"))
        .then((personSegmentation) => {
          if (personSegmentation !== null) {
            drawBody(personSegmentation);
          }
        });
    }
  }
  const drawBody = (personSegmentation) => {
    const context = canvasRef.current.getContext("2d");
    console.log("context", context);
    context.drawImage(
      videoRef.current,
      0,
      0,
      videoRef.current.width,
      videoRef.current.height
    );
    let imageData = context.getImageData(
      0,
      0,
      videoRef.current.width,
      videoRef.current.height
    );
    let pixel = imageData.data;
    for (let p = 0; p < pixel.length; p += 4) {
      if (personSegmentation.data[p / 4] === 0) {
        pixel[p + 3] = 0;
      }
    }
    context.imageSmoothingEnabled = true;
    context.putImageData(imageData, 0, 0);
  };

  const stopVideo = () => {
    stopVideoStream();
    setLoadImage(false);
  };

  function stopVideoStream() {
    const stream = videoRef.current.srcObject;
    if (temp) {
      stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject = null;
      }
      const context = canvasRef.current.getContext("2d");
      context.clearRect(0, 0, videoRef.current.width, videoRef.current.height);
    }
  }
  const trackVideo = () => {
    setTemp(false);
  };
  return (
    <>
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark justify-content-center">
        <a className="navbar-brand" href="#"></a>
        <ul className="navbar-nav">
          <h2 className="text-white">
            Virtual Background Using TensorFlow BodyPix
          </h2>
        </ul>
      </nav>
      <br />
      <div className="row ">
        <div className="col-12 col-sm-12 text-center">
          <button
            id="start-btn"
            className="btn btn-success m-2 "
            type="button"
            onClick={startVideo}
          >
            Start
          </button>
          <button
            id="stop-btn"
            className="btn btn-danger m-2"
            type="button"
            onClick={stopVideo}
          >
            Stop
          </button>
        </div>
        <div className="col-12 col-sm-6 border justify-content-center text-center">
          <h2>Real Video Stream</h2>
          <video
            id="video"
            ref={videoRef}
            width="480"
            height="320"
            autoPlay={true}
            playsInline
          ></video>
        </div>
        <div className="col-12 col-sm-6 border text-center">
          <h2>Virtual Background Stream</h2>
          <canvas
            id="canvas"
            width="480"
            height="320"
            ref={canvasRef}
            className={loadImage ? "canvasPerson canvasPersonImage" : ""}
          ></canvas>
        </div>
        <div className="col-sm12 col-12 text-center m-3">
          <h6 className="text-danger">
            *Pl wait or press start button again in case of not loading the
            Tensorflow modal.
          </h6>
        </div>
      </div>
    </>
  );
};

export default VirtualBackground;
