from flask import Flask, render_template, request, url_for
from prediction import predict_image
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'  # Direktori untuk menyimpan gambar di dalam direktori static

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        if 'image' not in request.files:
            return render_template('error.html', message='No file part')

        image = request.files['image']

        # Pastikan file gambar disertakan
        if image.filename == '':
            return render_template('error.html', message='No selected file')

        if image:
            # Pastikan direktori uploads ada
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])
                
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
            image.save(image_path)
            predicted_label, confidence = predict_image(image_path)
            return render_template('predict.html', image_path=image.filename, predicted_label=predicted_label, confidence=confidence)

if __name__ == '__main__':
    app.run(debug=True)
