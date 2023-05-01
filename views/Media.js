import {
  Center,
  Text,
  IconButton,
  Icon,
  Box,
  Spinner,
  Image,
  useToast,
} from "native-base";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Media({ navigation }) {
  const [prediction, setPrediction] = useState("");
  const [image, setImage] = useState(null);
  const [permission, requestPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const apiEndpoint = useRef("");
  const toast = useToast();

  useEffect(() => {
    AsyncStorage.getItem("apiEndpoint").then((res) => {
      apiEndpoint.current = res;
    });
  }, []);

  const predict = (b64image) => {
    if (b64image) {
      axios
        .post(apiEndpoint.current + "/predict", {
          image: b64image,
        })
        .then((res) => {
          setPrediction(res.data.class || "Unknown"),
            console.log(res.data.class);
        });
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: true,
        allowsEditing: true,
      });
      if (!result.canceled) {
        setImage(result);
        predict(result.assets[0].base64);
      }
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
    if (image === null) pickImage();
  }, [image]);

  const pickAgain = async () => {
    setImage(null);
    setPrediction("");
  };

  if (!permission) {
    return (
      <Center height={"full"} safeArea>
        Please Allow File Permissions
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

        <Image
          source={{ uri: image?.assets[0].uri }}
          width={"full"}
          height={"full"}
          resizeMode="contain"
          alt="Picked Image"
        />
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
          onPress={pickAgain}
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
          {prediction === "" && (
            <Spinner size={"lg"} color="darkBlue.500"></Spinner>
          )}
          <Text
            fontSize={"7xl"}
            fontWeight={"semibold"}
            color="lightBlue.400"
            lineHeight={"sm"}
          >
            {prediction}
          </Text>
        </Center>
      </Center>
    </Box>
  );
}
