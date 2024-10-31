/* eslint-disable */
// @ts-nocheck 
'use client';
import React, { useEffect, useRef, useState } from "react";
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import p5 from "p5";
import '@tensorflow/tfjs-backend-webgl';

const TennisBallTracker = () => {
  const sketchRef = useRef(null);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment',
          frameRate: { ideal: 30 }
        }
      });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setError(null);
      return true;
    } catch (err) {
      console.error('Camera permission error:', err);
      // setError('Camera permission denied. Please allow camera access to use this feature.');
      setHasPermission(false);
      return false;
    }
  };

  useEffect(() => {
    let video;
    let detector;
    let detections = [];
    let myP5;
    let isDetecting = false;

    const initializeSketch = async () => {
      try {
        await tf.setBackend('webgl');
        console.log('TensorFlow backend initialized:', tf.getBackend());

        const hasAccess = await requestCameraPermission();
        if (!hasAccess) return;

        const sketch = (p) => {
          p.setup = async () => {
            const canvas = p.createCanvas(640, 480);
            canvas.parent(sketchRef.current);

            try {
              video = p.createCapture({
                video: {
                  width: 640,
                  height: 480,
                  facingMode: 'environment',
                  frameRate: 30
                }
              }, () => {
                console.log('Video capture ready');
                video.size(640, 480);
                video.elt.addEventListener('loadeddata', () => {
                  console.log('Video data loaded');
                  setIsVideoReady(true);
                });
              });

              video.hide();

              console.log('Loading COCO-SSD model...');
              // Use mobilenet_v2 for better accuracy
              detector = await cocoSsd.load({
                base: 'mobilenet_v2',
                modelUrl: undefined,
                // Lower threshold to detect more potential balls
                scoreThreshold: 0.3
              });
              console.log('Model loaded successfully');
              setModelLoading(false);

              if (video.elt.readyState === 4) {
                detect();
              } else {
                video.elt.addEventListener('loadeddata', detect);
              }
            } catch (err) {
              console.error('Setup error:', err);
              setError('Error initializing camera or model. Please refresh and try again.');
              setModelLoading(false);
            }
          };

          const detect = async () => {
            if (isDetecting) return;

            if (video?.elt && detector && video.elt.readyState === 4) {
              isDetecting = true;

              try {
                if (video.elt.videoWidth === 0 || video.elt.videoHeight === 0) {
                  setTimeout(detect, 100);
                  return;
                }

                detections = await detector.detect(video.elt);

                // Log all detections for debugging
                if (detections.length > 0) {
                  console.log('All detections:', detections);
                }

                const balls = detections.filter(d => {
                  // Include both "sports ball" and "ball" classes
                  return (d.class === "sports ball" || d.class === "ball") && d.score > 0.1;
                });

                if (balls.length > 0) {
                  console.log('Balls detected:', balls);
                  setDebugInfo(`Detected ${balls.length} ball(s)`);
                } else {
                  setDebugInfo('No balls detected');
                }

              } catch (err) {
                console.error('Detection error:', err);
                setDebugInfo('Detection error: ' + err.message);
              } finally {
                isDetecting = false;
                requestAnimationFrame(detect);
              }
            } else {
              setTimeout(detect, 100);
            }
          };

          p.draw = () => {
            if (video && video.elt.readyState === 4) {
              p.image(video, 0, 0);
              drawDetections();
            }
          };

          const drawDetections = () => {
            if (!detections) return;

            // Draw all detected objects for debugging
            detections.forEach(detection => {
              const { bbox, class: className, score } = detection;

              // Different colors for different types of detections
              let strokeColor;
              if (className === "sports ball") {
                strokeColor = [0, 255, 0]; // Green for sports balls
              } else {
                strokeColor = [255, 165, 0]; // Orange for other detections
              }

              if (bbox && bbox.length === 4 && score > 0.3 && className === "sports ball") {
                const [x, y, width, height] = bbox;

                p.stroke(...strokeColor);
                p.strokeWeight(4);
                p.noFill();
                p.rect(x, y, width, height);

                p.fill(...strokeColor);
                p.noStroke();
                p.textSize(18);
                p.textFont('Arial');
                const label = `${className} ${(score * 100).toFixed(1)}%`;
                p.text(label, x, y > 20 ? y - 5 : y + height + 20);
              }
            });
          };
        };

        myP5 = new p5(sketch);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Error initializing TensorFlow.js. Please check your browser compatibility.');
      }
    };

    initializeSketch();

    return () => {
      if (myP5) {
        myP5.remove();
      }
    };
  }, []);

  if (error) {
    return (
      <div className="w-[640px] h-[480px] flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg">
        <div className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={sketchRef} className="relative w-[640px] h-[480px]">
      {(!hasPermission || modelLoading || !isVideoReady) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-gray-600">
            {!hasPermission ? 'Loading camera...' :
             modelLoading ? 'Loading ML model...' :
             'Initializing video...'}
          </p>
        </div>
      )}
      <div className="absolute top-0 left-0 p-4 bg-black/50 text-white text-sm">
        Tennis Ball Detector
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white text-sm">
        {debugInfo}
      </div>
    </div>
  );
};

export default TennisBallTracker;
