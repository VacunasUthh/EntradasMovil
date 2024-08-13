import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import { Icon } from 'react-native-elements';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import LoadingScreen from './Load';
import { useUser } from './Navigation';

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deviceUUID, setDeviceUUID] = useState('');
  const navigation = useNavigation();
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const { setUsername: setGlobalUsername } = useUser();

  useFocusEffect(
    React.useCallback(() => {
      setUsername('');
      setPassword('');
      setError('');
    }, [])
  );

  useEffect(() => {
    const fetchUUID = async () => {
      const uuid = await SecureStore.getItemAsync('deviceUUID');
      setDeviceUUID(uuid || ''); 
    };
    
    fetchUUID();
    console.log('Device UUID:', deviceUUID); 

  }, []);

  const toggleMostrarContraseña = () => {
    setMostrarContraseña(!mostrarContraseña);
  };

  const iconContraseña = mostrarContraseña ? 'eye-off' : 'eye';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    if (username === '' || password === '') {
      setError('Por favor complete ambos campos');
      setIsLoading(false);
      return;
    }

    try {
      const loginResponse = await axios.get('https://entradas-backend.vercel.app/alumnos/validar', {
        params: {
          matricula: username,
          password: password,
          deviceUUID: deviceUUID,
        },
      });

      if (loginResponse.data.valid) {
        setIsLoggedIn(true);
        setGlobalUsername(username);
        navigation.navigate('Inicio');
      } else {
        setError('Usuario, contraseña o dispositivo no están registrados.');
      }
    } catch (error) {
      setError('Ocurrió un error al iniciar sesión. Inténtalo nuevamente.');
    }

    setIsLoading(false);
  };

  const handleAddStudentPress = () => {
    navigation.navigate('RegisterForm');
  };

  return (
    <View style={styles.container}>
      <Image source={require('./imagenes/LogoEscuela.png')} style={styles.logo} />

      <View style={styles.card}>
        <Text style={styles.label}>Matricula</Text>
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          placeholder="Ingrese la matricula"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña:</Text>
        <View style={styles.contraseña}>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.inputPass}
              onChangeText={setPassword}
              value={password}
              placeholder="Ingresa tu contraseña"
              secureTextEntry={!mostrarContraseña}
            />
            <TouchableOpacity onPress={toggleMostrarContraseña} style={styles.visibilityButton}>
              <Icon type="material-community" name={iconContraseña} size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Inicio de sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addStudentButton} onPress={handleAddStudentPress}>
          <Text style={styles.addStudentButtonText}>Añadir Alumno</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isLoading} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LoadingScreen />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: '10%',
    backgroundColor:'#BC955B',
  },
  logo: {
    width: '100%',
    height: 100,
    backgroundColor: '#FFFFFF',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  visibilityButton: {
    marginLeft: 10,
  },
  card: {
    width: '80%',
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '30%',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    width: '100%', 
    height: 40,
    marginBottom: 15,
  },
  inputPass: {
    borderWidth: 0,
    borderRadius: 10,
    width: '85%', 
    height: 36,
    textAlign: 'center',
  },
  contraseña: {
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
    height: 40,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#03983E',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    width: '80%',
  },
  addStudentButton: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    width: '80%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  addStudentButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});
