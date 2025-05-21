import sys
import os
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
NUM_CLASSES = 80  # match your trained model

# Load class names
def load_class_names():
    classes = {}
    base_dir = os.path.dirname(os.path.abspath(__file__))
    class_file = os.path.join(base_dir, "..", "dataset", "CUB_200_2011", "classes.txt")

    with open(class_file, "r") as f:
        for line in f:
            class_id, name = line.strip().split(" ", 1)
            class_num = int(class_id)
            if class_num <= NUM_CLASSES:
                class_name = name.split(".")[1].replace("_", " ")
                classes[class_num - 1] = class_name
    return classes

class_names = load_class_names()

# Load model
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "cub_resnet18.pth")

model = models.resnet18()
model.fc = torch.nn.Linear(model.fc.in_features, NUM_CLASSES)
model.load_state_dict(torch.load(model_path, map_location=DEVICE))
model.to(DEVICE)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def predict(image_path):
    image = Image.open(image_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        output = model(input_tensor)
        _, pred = torch.max(output, 1)
        class_id = pred.item()
        return class_names[class_id]

if __name__ == "__main__":
    try:
        image_path = sys.argv[1]
        print(f"🔍 Predicting image: {image_path}", file=sys.stderr)
        bird_name = predict(image_path)
        print(bird_name)
    except Exception as e:
        print(f"❌ Python error: {e}", file=sys.stderr)
