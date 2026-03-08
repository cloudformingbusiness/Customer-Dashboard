import { View, Text } from 'react-native'

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-primary">FlowTecsMedia</Text>
      <Text className="text-gray-500 mt-2 text-center px-8">
        ✏️ App hier aufbauen – starte mit einem Prompt aus prompts/starter-prompts.md
      </Text>
    </View>
  )
}
