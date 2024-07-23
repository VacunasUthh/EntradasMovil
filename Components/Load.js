import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Cargando...</Text>
      <Progress.Circle size={80} indeterminate={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    alignItems: 'center',

  },
  loadingText: {
    fontSize: 30,
    marginBottom: 20,
  },
});

export default LoadingScreen;