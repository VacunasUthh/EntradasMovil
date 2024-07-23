import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import * as Location from 'expo-location';
import * as LocalAuthentication from 'expo-local-authentication';
import moment from 'moment';
import 'moment/locale/es';
import { useUser } from './Navigation';

export const Registro = () => {
  const { username } = useUser();
  const [currentTime, setCurrentTime] = useState(moment().format('LTS'));
  const [entradaTime, setEntradaTime] = useState(null);
  const [salidaTime, setSalidaTime] = useState(null);
  const [recesoTime, setRecesoTime] = useState(null);
  const [recesoCountdown, setRecesoCountdown] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format('LTS'));
    }, 1000);

    if (recesoCountdown !== null) {
      const recesoInterval = setInterval(() => {
        const now = moment();
        const endTime = moment(recesoTime).add(40, 'minutes');
        const diff = endTime.diff(now, 'seconds');

        if (diff <= 0) {
          clearInterval(recesoInterval);
          setRecesoCountdown('Receso terminado');
        } else {
          const duration = moment.duration(diff, 'seconds');
          const formatted = `${duration.minutes()}:${duration.seconds() < 10 ? '0' : ''}${duration.seconds()}`;
          setRecesoCountdown(formatted);
        }
      }, 1000);

      return () => clearInterval(recesoInterval);
    }

    return () => clearInterval(interval);
  }, [recesoTime, recesoCountdown]);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    return location;
  };

  const authenticate = async (callback) => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert('Error', 'Autenticación biométrica no disponible');
      return;
    }

    const fingerprintResult = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticación de huella digital',
    });

    if (fingerprintResult.success) {
      const faceResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticación facial',
      });

      if (faceResult.success) {
        callback();
      } else {
        Alert.alert('Error', 'Autenticación facial fallida');
      }
    } else {
      Alert.alert('Error', 'Autenticación de huella fallida');
    }
  };

  const handleEntrada = () => {
    authenticate(async () => {
      const location = await getLocation();
      setEntradaTime(moment().format('LTS'));
      if (location) {
        Alert.alert('Ubicación', `Latitud: ${location.coords.latitude}, Longitud: ${location.coords.longitude}`);
      }
    });
  };

  const handleSalida = () => {
    authenticate(async () => {
      const location = await getLocation();
      setSalidaTime(moment().format('LTS'));
      if (location) {
        Alert.alert('Ubicación', `Latitud: ${location.coords.latitude}, Longitud: ${location.coords.longitude}`);
      }
    });
  };

  const handleReceso = () => {
    authenticate(async () => {
      const location = await getLocation();
      setRecesoTime(moment());
      setRecesoCountdown('40:00');
      if (location) {
        Alert.alert('Ubicación', `Latitud: ${location.coords.latitude}, Longitud: ${location.coords.longitude}`);
      }
    });
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitud: ${location.coords.latitude}, Longitud: ${location.coords.longitude}`;
  }

  return (
    <ImageBackground 
      source={{ uri: 'https://www.publicdomainpictures.net/pictures/270000/velka/plain-light-grey-background.jpg' }} 
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.welcomeText}>Bienvenido, {username}</Text>
          <Text style={styles.currentTime}>{currentTime}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleEntrada}>
              <Text style={styles.buttonText}>Entrada</Text>
            </TouchableOpacity>
            {entradaTime && <Text style={styles.eventTime}>Hora de entrada: {entradaTime}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleReceso}>
              <Text style={styles.buttonText}>Receso</Text>
            </TouchableOpacity>
            {recesoCountdown && <Text style={styles.eventTime}>Tiempo de receso: {recesoCountdown}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleSalida}>
              <Text style={styles.buttonText}>Salida</Text>
            </TouchableOpacity>
            {salidaTime && <Text style={styles.eventTime}>Hora de salida: {salidaTime}</Text>}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#BC955B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  currentTime: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#A02142',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 19,
  },
  eventTime: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Registro;
