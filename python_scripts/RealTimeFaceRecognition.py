import os
import cv2
import numpy as np
import tensorflow as tf
from mtcnn import MTCNN
from sklearn.metrics.pairwise import cosine_similarity
from tensorflow.keras.models import load_model

# Load the trained model and label map
model = load_model('face_recognition_model.h5')
label_map = np.load('label_map.npy', allow_pickle=True).item()

# Load known face feature vectors
features_dir = "features"
feature_vectors = {}
for feature_file in os.listdir(features_dir):
    if feature_file.endswith('.npy'):
        person_name = feature_file.split('_')[0]
        feature_vector = np.load(os.path.join(features_dir, feature_file))
        feature_vectors[person_name] = feature_vector

# Function to preprocess input image and extract features
def preprocess_and_extract_features(img):
    img_resized = cv2.resize(img, (200, 200))  # Resize for model input
    img_resized = img_resized / 255.0  # Normalize
    img_resized = np.expand_dims(img_resized, axis=0)  # Add batch dimension

    # Extract feature vector from model
    intermediate_layer_model = tf.keras.models.Model(inputs=model.inputs, outputs=model.layers[-2].output)
    feature_vector = intermediate_layer_model.predict(img_resized)[0]
    return feature_vector

# Function to recognize person from face
def recognize_person(img, threshold=0.7):
    feature_vector = preprocess_and_extract_features(img)

    # Compute cosine similarity with all known faces
    similarities = {}
    for person_name, saved_feature in feature_vectors.items():
        similarity = cosine_similarity([feature_vector], [saved_feature])[0][0]
        similarities[person_name] = similarity

    # Identify most similar person
    recognized_person = max(similarities, key=similarities.get)
    recognition_score = similarities[recognized_person]

    # If similarity is too low, return 'Unknown'
    if recognition_score < threshold:
        return 'Unknown', recognition_score

    return recognized_person, recognition_score

# Initialize face detector
detector = MTCNN()

# Open camera
cap = cv2.VideoCapture(2)

if not cap.isOpened():
    print("Error: Could not access the camera.")
    exit()

recognized_name = "Unknown"
consecutive_recognitions = 0  # Track stable recognition
unknown_count = 0  # Track how many times "Unknown" is detected
RECOGNITION_THRESHOLD = 3  # Person must be recognized at least 3 times
UNKNOWN_THRESHOLD = 5  # Ignore first few "Unknown" detections

# Instead of immediately closing, use a counter
recognized_counter = 0

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame.")
        break

    faces = detector.detect_faces(frame)

    for face in faces:
        x, y, w, h = face['box']
        face_img = frame[y:y+h, x:x+w]

        recognized_person, recognition_score = recognize_person(face_img)

        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
        cv2.putText(frame, f"Name: {recognized_person}", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)
        cv2.putText(frame, f"Confidence: {recognition_score:.2f}", (x, y+h+10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

        if recognized_person != "Unknown":
            recognized_counter += 1  # Increment counter
            if recognized_counter > 5:  # Recognize the same face for 5 frames before closing
                print(f"Recognized: {recognized_person}")
                cap.release()
                cv2.destroyAllWindows()
                exit()

    cv2.imshow("Face Recognition", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
