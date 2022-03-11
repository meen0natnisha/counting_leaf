import * as tf from "@tensorflow/tfjs";

const threshold = 0.8;

  function load(url) {
    return new Promise((resolve, reject) => {
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.src = url;
      im.onload = () => {
        resolve(im);
      };
    });
  }

  // Main function
  const runModel = async (selectedImg) => {
    console.log("Loading model...");
    const net = await tf.loadGraphModel(
      "https://leaf-counting.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json"
    );
    console.log("Model loaded");
    return await detect(net, selectedImg);
  };

  const detect = async (net, selectedImg) => {
    // Check data is available
    if (selectedImg != "" && selectedImg !== null) {
      console.log("Image ready");

      const image = await load(selectedImg);
      console.log("Image loaded");
      // 4. TODO - Make Detections
      // console.log("Detecting...");
      const img = tf.browser.fromPixels(image);
      console.log("Image converted to tensor");
      const resized = tf.image.resizeBilinear(img, [640, 640]);
      const casted = resized.cast("int32");
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);
      console.log("Detections done");
      const scores = await obj[6].array();
      const leafCount = scores[0].filter((score) => score > threshold);
      // Draw mesh
      return leafCount.length;
    } else console.log("Image not ready");
  };

export default runModel;
