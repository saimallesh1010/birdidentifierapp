import os
import torch
import pandas as pd
from torch import nn, optim
from torchvision import models, transforms
from torch.utils.data import Dataset, DataLoader
from PIL import Image

DATA_DIR = "../dataset/CUB_200_2011/"
IMAGE_DIR = os.path.join(DATA_DIR, "images")
BATCH_SIZE = 32
NUM_CLASSES = 80
EPOCHS = 6
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load metadata
images_df = pd.read_csv(os.path.join(DATA_DIR, "images.txt"), sep=" ", names=["img_id", "img_path"])
labels_df = pd.read_csv(os.path.join(DATA_DIR, "image_class_labels.txt"), sep=" ", names=["img_id", "label"])
split_df = pd.read_csv(os.path.join(DATA_DIR, "train_test_split.txt"), sep=" ", names=["img_id", "is_train"])

# Filter for first 80 species
valid_labels = set(range(1, NUM_CLASSES + 1))
filtered_df = labels_df[labels_df['label'].isin(valid_labels)]
images_df = images_df[images_df['img_id'].isin(filtered_df['img_id'])]
split_df = split_df[split_df['img_id'].isin(filtered_df['img_id'])]
df = images_df.merge(filtered_df, on="img_id").merge(split_df, on="img_id")

# Dataset class
class BirdDataset(Dataset):
    def __init__(self, df, train=True):
        self.df = df[df['is_train'] == int(train)].reset_index(drop=True)
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
        ])

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        img_path = os.path.join(IMAGE_DIR, self.df.loc[idx, 'img_path'])
        image = Image.open(img_path).convert("RGB")
        label = self.df.loc[idx, 'label'] - 1
        return self.transform(image), label

# Data loaders
train_loader = DataLoader(BirdDataset(df, train=True), batch_size=BATCH_SIZE, shuffle=True)
test_loader = DataLoader(BirdDataset(df, train=False), batch_size=BATCH_SIZE)

# Load ResNet18
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)
model.to(DEVICE)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop
for epoch in range(EPOCHS):
    model.train()
    total_loss = 0
    for images, labels in train_loader:
        images, labels = images.to(DEVICE), labels.to(DEVICE)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    print(f"Epoch {epoch+1}/{EPOCHS}, Loss: {total_loss:.4f}")

# Save the model
torch.save(model.state_dict(), "cub_resnet18.pth")
print("✅ Model saved as cub_resnet18.pth")
