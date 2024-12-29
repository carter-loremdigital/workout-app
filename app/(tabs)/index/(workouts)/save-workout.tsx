import { View } from "react-native";
import { Exercise } from "../../../../types/exercise";
import { Appbar, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";

const SaveWorkoutPage = () => {
  const router = useRouter();

  const { exercises } = useLocalSearchParams();

  // Parse the serialized exercises data
  const parsedExercises: any = JSON.parse(decodeURIComponent(exercises));

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        <Appbar.Content title="Save Workout" />
      </Appbar.Header>
      <Text>Save WOrkout</Text>
    </View>
  );
};

export default SaveWorkoutPage;
