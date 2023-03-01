import { View, Text } from 'react-native'
import React from 'react'

export default function Settings({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text
        onPress={() => alert('This is the "Settingg" screen.')}
        style={{ fontSize: 26, fontWeight: 'bold' }}>Setting Screen</Text>
</View>
  )
}