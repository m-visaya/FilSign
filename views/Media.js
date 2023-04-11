import { Center, Text, IconButton, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";

export default function Media({ navigation }) {
  return (
    <Center>
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
      <Text>File Screen</Text>
    </Center>
  );
}
