const tf = require('@tensorflow/tfjs-node');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const modelPath = path.join(__dirname, 'model_tfjs/model.json');

async function loadModel() {
    try {
        if (!fs.existsSync(modelPath)) {
            throw new Error(`Model file not found at path: ${modelPath}`);
        }
        const model = await tf.loadGraphModel(`file://${modelPath}`);
        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        console.error('Error loading the model:', error);
        throw error;
    }
}

async function preprocessImage(imagePath) {
    try {
        const image = await Jimp.read(imagePath);
        image.resize(28, 28); // Resize image to 28x28
        const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
        const imgTensor = tf.node.decodeImage(buffer, 3);
        const normalized = imgTensor.div(tf.scalar(255.0)).expandDims(); // Normalize the image
        return normalized;
    } catch (error) {
        console.error('Error preprocessing the image:', error);
        throw error;
    }
}

async function predictImage(imagePath) {
    try {
        const model = await loadModel();
        const preprocessedImg = await preprocessImage(imagePath);
        const prediction = model.predict(preprocessedImg);
        const predictionArray = await prediction.array();
        const labels = ['Cyst', 'Normal', 'Stone', 'Tumor'];
        const predictedIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
        const predictedLabel = labels[predictedIndex];
        const confidence = predictionArray[0][predictedIndex];
        return { predictedLabel, confidence };
    } catch (error) {
        console.error('Error during prediction:', error);
        throw error;
    }
}

module.exports = { predictImage };