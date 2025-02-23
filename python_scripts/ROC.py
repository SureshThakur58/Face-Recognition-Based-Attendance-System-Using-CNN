import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from sklearn.metrics import roc_curve, auc
from sklearn.model_selection import train_test_split

# Load trained model
model = tf.keras.models.load_model('face_recognition_model.h5')

# Load dataset again
def load_data(data_directory):
    import os
    import cv2
    images = []
    labels = []
    label_map = {}
    current_label = 0

    for person in os.listdir(data_directory):
        person_path = os.path.join(data_directory, person)
        if not os.path.isdir(person_path):
            continue
            
        for img_name in os.listdir(person_path):
            img_path = os.path.join(person_path, img_name)
            img = cv2.imread(img_path)
            img = cv2.resize(img, (200, 200))
            images.append(img)

            if person not in label_map:
                label_map[person] = current_label
                current_label += 1

            labels.append(label_map[person])

    return np.array(images), np.array(labels), label_map

# Load data
images, labels, label_map = load_data('data')  # Make sure 'data' is the correct path
images = images / 255.0  # Normalize
labels = tf.keras.utils.to_categorical(labels)  # One-hot encoding

# Split data
X_train, X_test, y_train, y_test = train_test_split(images, labels, test_size=0.3, random_state=42)

# Get model predictions
y_pred_probs = model.predict(X_test)

# Compute ROC curve for each class
fpr = {}
tpr = {}
roc_auc = {}

plt.figure(figsize=(8, 6))

colors = ['blue', 'green', 'orange']  # Different colors for different classes
for i in range(y_test.shape[1]):
    fpr[i], tpr[i], _ = roc_curve(y_test[:, i], y_pred_probs[:, i])
    roc_auc[i] = auc(fpr[i], tpr[i])
    plt.plot(fpr[i], tpr[i], color=colors[i % len(colors)], label=f"Class {i} (AUC = {roc_auc[i]:.2f})")

# Plot diagonal reference line (Random Classifier)
plt.plot([0, 1], [0, 1], 'r--', label="Random classifier")

# Perfect classifier point
plt.scatter(0, 1, color='blue', s=100, label="Perfect classifier")
plt.text(0.02, 0.98, "Perfect\nclassifier", color="blue", fontsize=12, fontweight="bold")

# Add "Better" and "Worse" annotation
plt.annotate("Better", xy=(0.3, 0.8), xytext=(0.4, 0.9), arrowprops=dict(facecolor='black', shrink=0.05), fontsize=12)
plt.annotate("Worse", xy=(0.6, 0.4), xytext=(0.5, 0.3), arrowprops=dict(facecolor='black', shrink=0.05), fontsize=12)

# Labels and title
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curve for Face Recognition Model")
plt.legend(loc="lower right")
plt.grid(True)
plt.show()
