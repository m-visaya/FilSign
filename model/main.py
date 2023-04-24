from fastapi import FastAPI, Request
import json
from ultralytics import YOLO
import numpy as np
import cv2
import base64

model = YOLO('./model.onnx')

app = FastAPI()

names = [
    "A",
    "B",
    "Boss",
    "C",
    "D",
    "E",
    "F",
    "Father",
    "G",
    "Good",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "Me",
    "Mine",
    "Mother",
    "N",
    "O",
    "Onion",
    "P",
    "Q",
    "Quiet",
    "R",
    "Responsible",
    "S",
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
async def get_tensor(file: Request):
    raw_body = await file.body()
    image_data = json.loads(raw_body)
    buffer = base64.b64decode(image_data['image'])
    np_arr = np.frombuffer(buffer, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    results = model.predict(img, imgsz=640)
    classes = results[0].boxes.cls
    
    name = names[int(classes[0])] if len(classes) > 0  else ""
    print("class",name)

    return {"class": name}