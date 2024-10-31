'use client';
import React, { useEffect } from "react";
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import p5 from "p5";

let video;
let detector;
let detections = [];

const TennisBallTracker = () => {
  useEffect(() => {
  console.log('TensorFlow.js version:', tf.version.tfjs);

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(640, 480);
        video = p.createCapture(p.VIDEO);
        video.size(640, 480);
        video.hide();

        cocoSsd.load().then((model) => {
          console.log('COCO-SSD model loaded successfully');
          detector = model;
          detect();
        });
      };

      const detect = () => {
        detector.detect(video.elt).then((results) => {
          detections = results;
          console.log(detections);
          detect();
        });
      };

      p.draw = () => {
        p.image(video, 0, 0);
        drawDetections(p);
      };

      const drawDetections = (p) => {
        for (let i = 0; i < detections.length; i++) {
          const { bbox, class: className, score } = detections[i];

          if (className === "sports ball" && score > 0.5) {
            p.stroke(0, 255, 0);
            p.strokeWeight(4);
            p.noFill();
            p.rect(bbox[0], bbox[1], bbox[2], bbox[3]);

            p.fill(255);
            p.textSize(24);
            p.text(`Tennis Ball!`, bbox[0], bbox[1] > 10 ? bbox[1] - 5 : 10);
          }
        }
      };
    };

    new p5(sketch);
  }, []);

  return (<div></div>);
};

export default TennisBallTracker;
