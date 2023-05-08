import { Camera, CameraType } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { Box, Text, Center, Icon, IconButton, useToast } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Live({ navigation }) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [prediction, setPrediction] = useState("");
  const cameraRef = useRef(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [predictionFontSize, setPredictionFontSize] = useState("5xl");
  const toast = useToast();

  const controller = useRef(new AbortController());
  const pendingFlip = useRef(false);

  const captureFrame = async () => {
    if (!cameraRef.current || !apiEndpoint) return;

    try {
      const image = await cameraRef.current.takePictureAsync({
        skipPreprocessing: true,
        base64: true,
      });

      if (pendingFlip.current) await flipCamera();

      const response = await axios.post(
        apiEndpoint + "/predict",
        {
          image: image.base64,
        },
        {
          signal: controller.current?.signal,
        }
      );

      const prediction = response.data.class;

      setPredictionFontSize("5xl");

      if (prediction.length < 12) {
        setPredictionFontSize("7xl");
      }

      setPrediction(prediction), console.log(prediction);

      captureFrame();
    } catch (error) {
      console.log(error);
      toast.show({
        render: () => {
          return (
            <Box bg="red.700" px="4" py="3" rounded="sm" mb={5}>
              <Text color="white"> Something went wrong </Text>
            </Box>
          );
        },
      });
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("apiEndpoint").then((res) => {
      setApiEndpoint(res);
    });

    return () => {
      if (controller.current) controller.current.abort();
    };
  }, []);

  const flipCamera = async () => {
    cameraRef.current.pausePreview();
    setCameraType((prevState) =>
      prevState == CameraType.front ? CameraType.back : CameraType.front
    );
    pendingFlip.current = false;
    cameraRef.current.resumePreview();
  };

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
        <IconButton
          borderRadius="full"
          colorScheme={"light"}
          variant="ghost"
          position={"absolute"}
          top={"8"}
          right={"2"}
          zIndex={"20"}
          icon={
            <Icon
              as={Ionicons}
              name="camera-reverse"
              size={"2xl"}
              color="light.300"
            />
          }
          onPress={() => (pendingFlip.current = true)}
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
          height={"32"}
          position={"absolute"}
          bottom="0"
          bgColor={"black"}
          zIndex={10}
        >
          <Text
            fontSize={predictionFontSize}
            fontWeight={"semibold"}
            color="lightBlue.400"
            lineHeight={"xs"}
            textAlign={"center"}
          >
            {prediction}
          </Text>
        </Center>
      </Center>
    </Box>
  );
}
