import cv2
import numpy as np
from tensorflow.keras.models import load_model

model = load_model('model.h5')

def preprocess_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (28, 28))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = np.array(img)
    img = img / 255.0  # Normalization
    if len(img.shape) == 3:  # Cek apakah gambar berwarna
        img = img.reshape(1, 28, 28, 3)
    else:
        img = img.reshape(1, 28, 28, 1)
    return img

def predict_image(image_path):
    preprocessed_img = preprocess_image(image_path)
    prediction = model.predict(preprocessed_img)
    labels = ['Cyst', 'Normal', 'Stone', 'Tumor']
    predicted_index = np.argmax(prediction)
    predicted_label = labels[predicted_index]
    confidence = prediction[0][predicted_index]
    return predicted_label, confidence
