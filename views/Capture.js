import {
  Center,
  Text,
  IconButton,
  Icon,
  Box,
  Spinner,
  useToast,
} from "native-base";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Camera, CameraType } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Capture({ navigation }) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [prediction, setPrediction] = useState("");
  const cameraRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [imageCaptured, setImageCaptured] = useState(false);
  const cameraReady = useRef(false);
  const [apiEndpoint, setApiEndpoint] = useState("");
  const toast = useToast();

  useEffect(() => {
    AsyncStorage.getItem("apiEndpoint").then((res) => {
      setApiEndpoint(res);
    });
  }, []);
  const captureFrame = async () => {
    if (!cameraRef.current || !apiEndpoint) return;
    setIsCapturing(true);
    try {
      cameraRef.current
        .takePictureAsync({
          quality: 0,
          base64: true,
        })
        .then((img) => {
          cameraRef.current.pausePreview();
          const base64 = img.base64;
          setIsCapturing(false);
          setImageCaptured(true);
          predict(base64);
        });
    } catch (error) {
      console.log(error);
      setIsCapturing(false);
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

  const predict = (b64image) => {
    if (b64image) {
      axios
        .post(apiEndpoint + "/predict", {
          image: b64image,
        })
        .then((res) => {
          setPrediction(res.data.class || "Unknown"),
            console.log(res.data.class);
        });
    }
  };

  const clearCaptured = () => {
    setImageCaptured(false);
    setPrediction("");
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
        {isCapturing && (
          <Center
            height={"full"}
            width={"full"}
            bg={"black"}
            zIndex="30"
            opacity={60}
            bottom="0"
            position="absolute"
          >
            <Spinner size={"lg"} color="darkBlue.500"></Spinner>
          </Center>
        )}
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
          onCameraReady={() => (cameraReady.current = true)}
          ref={cameraRef}
          pictureSize="640x480"
        ></Camera>
        {!imageCaptured ? (
          <>
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
              onPress={() =>
                setCameraType(
                  cameraType == CameraType.front
                    ? CameraType.back
                    : CameraType.front
                )
              }
            ></IconButton>
            <IconButton
              position={"absolute"}
              bottom="10"
              borderRadius="full"
              colorScheme={"light"}
              opacity={90}
              size={"24"}
              icon={
                <Icon
                  as={FontAwesome}
                  name="circle"
                  color="light.300"
                  marginLeft={"1"}
                  size={"20"}
                />
              }
              onPress={captureFrame}
            ></IconButton>
          </>
        ) : (
          <>
            <IconButton
              position={"absolute"}
              bottom={"1/2"}
              top={"1/2"}
              borderRadius="full"
              colorScheme={"light"}
              opacity={90}
              size={"20"}
              icon={
                <Icon
                  as={FontAwesome}
                  name="repeat"
                  color="light.200"
                  marginLeft={"1"}
                  size={"5xl"}
                />
              }
              onPress={clearCaptured}
            ></IconButton>
            <Center
              marginY="auto"
              width={"full"}
              flexDir={"row"}
              height={"24"}
              position={"absolute"}
              bottom="0"
              bgColor={"black"}
              zIndex={10}
            >
              <Text
                fontSize={"7xl"}
                fontWeight={"semibold"}
                color="lightBlue.400"
                lineHeight={"sm"}
              >
                {prediction}
              </Text>
            </Center>
          </>
        )}
      </Center>
    </Box>
  );
}
