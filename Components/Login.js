import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import { Icon } from 'react-native-elements';
import axios from 'axios';
import LoadingScreen from './Load';
import { useUser } from './Navigation';

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const toggleMostrarContraseña = () => {
    setMostrarContraseña(!mostrarContraseña);
  };

  const iconContraseña = mostrarContraseña ? 'eye-off' : 'eye';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const passV = password;
    const nombreV = username;

    if (nombreV === '' && passV === '') {
      setError('Por favor complete ambos campos');
      setIsLoading(false);
      return;
    }

    if (nombreV === '') {
      setError('El campo del nombre no puede estar vacío. Complete este campo por favor');
      setIsLoading(false);
      return;
    }

    if (passV === '') {
      setError('El campo de la contraseña no puede estar vacío. Complete este campo por favor');
      setIsLoading(false);
      return;
    }

    if (nombreV === 'R' && passV === 'R') {
      setIsLoggedIn(true);
      setGlobalUsername(nombreV);
      navigation.navigate('Inicio');
    } else {
      setError('Usuario o contraseña incorrecta');
    }

    setIsLoading(false);
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
    alignItems: 'center', // Alinea verticalmente en el centro
    justifyContent: 'space-between', // Distribuye espacio entre los elementos
    width: '90%', // Asegúrate de que ocupe el ancho completo disponible
  },
  
  visibilityButton: {
    marginLeft: 10,
  },
  card: {
    width: '80%',
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    padding: 25,
    alignItems: 'center', // Centra los elementos hijos horizontalmente
    justifyContent: 'center', // Centra los elementos hijos verticalmente
    marginTop: '45%',
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
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
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
