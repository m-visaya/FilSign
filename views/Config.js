import {
  Text,
  IconButton,
  Icon,
  Box,
  HStack,
  Input,
  Button,
  FormControl,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Config = ({ navigation }) => {
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiInvalid, setApiInvalid] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("apiEndpoint").then((res) => {
      setApiEndpoint(res);
    });
  }, []);

  const handleSave = async () => {
    setApiInvalid(false);

    try {
      const response = await axios.get(apiEndpoint);
      if (response.data) {
        console.log(response.data);
        await AsyncStorage.setItem("apiEndpoint", apiEndpoint);
      }
    } catch (error) {
      console.log(error);
      setApiInvalid(true);
    }
  };

  return (
    <Box safeArea px={"3"} py={"4"}>
      <HStack>
        <IconButton
          borderRadius="full"
          icon={
            <Icon
              as={Ionicons}
              name="arrow-back"
              size={"2xl"}
              color={"black"}
            />
          }
          onPress={() => navigation.navigate("Home")}
        ></IconButton>
        <Text fontSize={"4xl"}>Settings</Text>
      </HStack>
      <Box p={"4"} mt={"5"} width={"full"}>
        <Text fontSize={"xl"} fontWeight={"semibold"}>
          API endpoint
        </Text>
        <Text fontSize={"sm"} w={"full"}>
          Set the api endpoint for the inference model
        </Text>
        <FormControl isInvalid={apiInvalid}>
          <Input
            placeholder="http://filsign.com/api"
            width={"full"}
            mt={"4"}
            variant={"unstyled"}
            focusable={false}
            focusOutlineColor={"blueGray.900"}
            borderColor={"blueGray.600"}
            borderWidth={"1"}
            value={apiEndpoint}
            onChangeText={(text) => setApiEndpoint(text)}
          />
          <FormControl.ErrorMessage>
            Cannot reach endpoint
          </FormControl.ErrorMessage>
        </FormControl>
        <Button
          size={"sm"}
          mt={"4"}
          width={"1/3"}
          ml={"auto"}
          colorScheme={"darkBlue"}
          onPress={handleSave}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default Config;
