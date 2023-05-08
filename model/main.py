from fastapi import FastAPI, Request
import json
from ultralytics import YOLO
import numpy as np
import cv2
import base64
from phrases import check_if_phrase

model = YOLO('./model.pt')

app = FastAPI()

names =   [
    "A",
    "Afternoon",
    "Are",
    "B",
    "Boss",
    "C",
    "D",
    "E",
    "F",
    "Father",
    "G",
    "Give",
    "Good",
    "H",
    "Hello",
    "How",
    "I_love_you",
    "I",
    "J",
    "K",
    "L",
    "M",
    "Me",
    "Mine",
    "Morning",
    "Mother",
    "N",
    "Night",
    "O",
    "P",
    "Q",
    "Quiet",
    "R",
    "S",
    "See",
    "Serious",
    "T",
    "Think",
    "This",
    "U",
    "V",
    "W",
    "Wait",
    "Water",
    "X",
    "Y",
    "You",
    "Z",
  ]

@app.get("/")
def index():
    return "Filsign API working"


@app.post("/predict")
async def predict(file: Request):
    raw_body = await file.body()
    image_data = json.loads(raw_body)
    buffer = base64.b64decode(image_data['image'])
    np_arr = np.frombuffer(buffer, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    results = model.predict(img, imgsz=640)
    classes = results[0].boxes.cls

    name = names[int(classes[0])] if len(classes) > 0 else ""
    name = check_if_phrase(name)

    print("Predicted class: ", name)

    return {"class": name}
