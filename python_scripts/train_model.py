import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Load dataset and create labels from image filenames
def load_data(data_directory):
    images = []
    labels = []
    label_map = {}
    current_label = 0

    for person in os.listdir(data_directory):
        person_path = os.path.join(data_directory, person)
        
        # Ensure we process only directories containing images
        if not os.path.isdir(person_path):
            continue
            
        for img_name in os.listdir(person_path):
            img_path = os.path.join(person_path, img_name)
            img = cv2.imread(img_path)
            img = cv2.resize(img, (200, 200))  # Resize to model input size
            images.append(img)

            # Extract label (name) from the image filename
            person_name = person  # Assuming folder name is the person's name
            if person_name not in label_map:
                label_map[person_name] = current_label
                current_label += 1

            labels.append(label_map[person_name])

    return np.array(images), np.array(labels), label_map

# Prepare data
images, labels, label_map = load_data('data')  # 'data' is the root folder containing subfolders of people's images
images = images / 255.0  # Normalize the images
labels = np.array(labels)

# Convert labels to one-hot encoding
labels = tf.keras.utils.to_categorical(labels)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(images, labels, test_size=0.3, random_state=42)

# Define ImageDataGenerator for data augmentation
datagen = ImageDataGenerator(
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

# Fit the data generator to the training data
datagen.fit(X_train)

# Build CNN model
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(200, 200, 3)),
    layers.MaxPooling2D(2, 2),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D(2, 2),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(len(label_map), activation='softmax')  # Output layer size based on number of labels
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model using data augmentation
model.fit(datagen.flow(X_train, y_train, batch_size=32), epochs=10, validation_data=(X_test, y_test))

# Save the trained model and label map
model.save('face_recognition_model.h5')
np.save('label_map.npy', label_map)

# Evaluate the model
test_loss, test_acc = model.evaluate(X_test, y_test)
print(f'Test Accuracy: {test_acc * 100:.2f}%')

# Create feature vectors directory
features_dir = "features"
os.makedirs(features_dir, exist_ok=True)

# Ensure the model is called on some data or input shape is defined
model.build(input_shape=(None, 200, 200, 3))  # Define the input shape explicitly

# Extract features using the penultimate layer
for person_name, label_idx in label_map.items():
    print(f"Processing {person_name}...")
    
    person_folder = os.path.join('data', person_name)
    feature_vectors = []

    for img_name in os.listdir(person_folder):
        img_path = os.path.join(person_folder, img_name)
        img = cv2.imread(img_path)
        if img is None:
            print(f"Could not read {img_path}. Skipping.")
            continue

        # Preprocess the image
        img_resized = cv2.resize(img, (200, 200))
        img_resized = img_resized / 255.0  # Normalize
        img_resized = np.expand_dims(img_resized, axis=0)  # Add batch dimension

        # Create an intermediate model to extract features
        intermediate_layer_model = models.Model(inputs=model.inputs, outputs=model.layers[-2].output)
        feature_vector = intermediate_layer_model.predict(img_resized)[0]
        feature_vectors.append(feature_vector)

    # Average the feature vectors if multiple images are available
    if feature_vectors:
        mean_feature_vector = np.mean(feature_vectors, axis=0)

        # Save the feature vector as a .npy file
        np.save(os.path.join(features_dir, f"{person_name}_feature.npy"), mean_feature_vector)
        print(f"Saved feature vector for {person_name}.")
    else:
        print(f"No valid images found for {person_name}.")