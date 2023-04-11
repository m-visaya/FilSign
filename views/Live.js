import { Camera, CameraType } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { Box, Text, Center, Icon, IconButton } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function Live({ navigation }) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [prediction, setPrediction] = useState("");
  const [currImage, setCurrImage] = useState(null);
  const cameraRef = useRef(null);
  const [cameraType, setCameraType] = useState(CameraType.back);

  const captureFrame = async () => {
    if (!cameraRef.current) return;

    cameraRef.current
      .takePictureAsync({
        quality: 0,
        base64: true,
      })
      .then((img) => {
        const base64 = img.base64;
        setCurrImage(base64);
      });
  };

  useEffect(() => {
    if (currImage) {
      axios
        .post("http://localhost:port/sendtensor", {
          image: currImage,
        })
        .then((res) => {
          setPrediction(res.data.class), console.log(res.data.class);
          captureFrame();
        });
    }
  }, [currImage]);

  useEffect(() => {
    console.log("camera change");
    captureFrame();
  }, [cameraType]);

  if (!permission) {
    return (
      <Center height={"full"} safeArea>
        Please Allow Camera Permissions
      </Center>
    );
  }

  if (!permission.granted) {
    requestPermission();
  }

  return (
    <Box>
      <Center bg={"black"} height={"full"} position={"relative"} safeArea>
        <IconButton
          borderRadius="full"
          colorScheme={"light"}
          variant="ghost"
          position={"absolute"}
          top={"8"}
          left={"2"}
          zIndex={"20"}
          icon={
            <Icon
              as={Ionicons}
              name="arrow-back"
              size={"2xl"}
              color="light.300"
            />
          }
          onPress={() => navigation.navigate("Home")}
        ></IconButton>
        <Camera
          style={{ height: "100%", width: "100%", aspectRatio: 3 / 4 }}
          type={cameraType}
          onCameraReady={captureFrame}
          ref={cameraRef}
          pictureSize="640x480"
          autoFocus="on"
        ></Camera>
        <Center
          marginY="auto"
          width={"full"}
          flexDir={"row"}
          height={"20"}
          paddingX="6"
          position={"absolute"}
          bottom="0"
          bgColor={"black"}
          opacity={60}
          zIndex={10}
        >
          <Text fontSize={"3xl"} fontWeight={"semibold"} color="lightBlue.400">
            {prediction}
          </Text>
          <IconButton
            borderRadius="full"
            colorScheme={"light"}
            variant="ghost"
            position={"absolute"}
            bottom={"1"}
            right={"2"}
            zIndex={"20"}
            icon={
              <Icon
                as={Ionicons}
                name="camera-reverse"
                size={"5xl"}
                color="light.100"
              />
            }
            onPress={() =>
              setCameraType(
                cameraType == CameraType.front
                  ? CameraType.back
                  : CameraType.front
              )
            }
          ></IconButton>
        </Center>
      </Center>
    </Box>
  );
}
