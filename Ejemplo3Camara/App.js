import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Camara from './src/components/Camara';

export default function App() {
  return (
    <View style={styles.container}>
      <Camara></Camara>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
