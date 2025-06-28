import sys
import json
import numpy as np
from PIL import Image
import tensorflow as tf  # or import torch for PyTorch

def load_model(model_path):
    """Load your trained model"""
    try:
        # For TensorFlow/Keras
        model = tf.keras.models.load_model(model_path)
        return model
        
        # For PyTorch
        # import torch
        # model = torch.load(model_path)
        # model.eval()
        # return model
        
    except Exception as e:
        raise Exception(f"Failed to load model: {str(e)}")

def preprocess_image(image_path):
    """Preprocess image for your model"""
    try:
        img = Image.open(image_path)
        img = img.convert('RGB')
        
        # 🎯 CHANGE SIZE TO MATCH YOUR MODEL
        img = img.resize((224, 224))  # Change to your model's input size
        
        img_array = np.array(img)
        img_array = img_array.astype(np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        raise Exception(f"Failed to preprocess image: {str(e)}")

def analyze_image(model_path, image_path):
    """Analyze image with your model"""
    try:
        model = load_model(model_path)
        processed_image = preprocess_image(image_path)
        
        predictions = model.predict(processed_image)
        
        # 🎯 CHANGE THESE TO YOUR MODEL'S CLASSES
        class_labels = [
            'Recyclable Plastic',
            'Food Waste', 
            'Glass',
            'Metal',
            'Paper',
            'Organic Matter',
            'Electronics',
            'Textile',
            'Hazardous Waste'
        ]
        
        results = []
        for i, confidence in enumerate(predictions[0]):
            if i < len(class_labels):
                results.append({
                    'label': class_labels[i],
                    'confidence': float(confidence)
                })
        
        results.sort(key=lambda x: x['confidence'], reverse=True)
        
        return {
            'predictions': results[:3],  # Top 3
            'confidence': float(np.max(predictions))
        }
        
    except Exception as e:
        raise Exception(f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    try:
        if len(sys.argv) != 3:
            raise Exception("Usage: python analyze_image.py <model_path> <image_path>")
        
        model_path = sys.argv[1]
        image_path = sys.argv[2]
        
        result = analyze_image(model_path, image_path)
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)