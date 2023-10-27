from flask import Flask, request, jsonify
import cv2
from keras.models import model_from_json
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

json_file = open("facialemotionmodel.json", "r")
model_json = json_file.read()
json_file.close()
model = model_from_json(model_json)
model.load_weights("facialemotionmodel.h5")

labels = {0: 'angry', 1: 'disgust', 2: 'fear',
          3: 'happy', 4: 'neutral', 5: 'sad', 6: 'surprise'}

haar_file = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(haar_file)

def extract_features(image):
    feature = np.array(image)
    feature = feature.reshape(1, 48, 48, 1)
    return feature / 255.0



@app.route('/predict_emotion', methods=['POST'])
def predict_emotion():
    image = request.files['image']
    image = cv2.imdecode(np.fromstring(
        image.read(), np.uint8), cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(image, 1.3, 5)

    try:
        for (p, q, r, s) in faces:
            image = gray[q:q+s, p:p+r]
            image = cv2.resize(image, (48, 48))
            img = extract_features(image)
            pred = model.predict(img)
            prediction_label = labels[pred.argmax()]
            response = {"emotion": prediction_label}
            return jsonify(response)
    except cv2.error:
        pass


if __name__ == '__main__':
    app.run(debug=True)
