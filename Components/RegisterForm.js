import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';
import { useNavigation } from '@react-navigation/native'; 



const RegisterForm = () => {
  const [formData, setFormData] = useState({
    matricula: '',
    correo: '',
    telefono: '',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    carrera: '',
    domicilio: {
      estado: '',
      municipio: '',
      colonia: '',
      calle: '',
      numero_interior: '',
      numero_exterior: '',
    },
    contacto_emergencia: {
      nombre_c: '',
      apellido_materno_c: '',
      apellido_paterno_c: '',
      telefono_c: '',
      parentesco: '',
    },
    password: '',
    deviceUUID: '',
  });

  const navigation = useNavigation();

  useEffect(() => {
    const storeUUID = async () => {
      try {
        let deviceUUID = await SecureStore.getItemAsync('deviceUUID');
        if (!deviceUUID) {
          deviceUUID = uuidv4();
          await SecureStore.setItemAsync('deviceUUID', deviceUUID);
        }
        setFormData(prevState => ({ ...prevState, deviceUUID }));
        console.log('Device UUID:', deviceUUID); 
      } catch (error) {
        console.error('Error storing UUID:', error);
      }
    };

    storeUUID();
  }, []);

  const handleChange = (name, value) => {
    setFormData(prevState => {
      if (name.startsWith('domicilio.')) {
        const field = name.split('.')[1];
        return {
          ...prevState,
          domicilio: { ...prevState.domicilio, [field]: value },
        };
      } else if (name.startsWith('contacto_emergencia.')) {
        const field = name.split('.')[1];
        return {
          ...prevState,
          contacto_emergencia: { ...prevState.contacto_emergencia, [field]: value },
        };
      } else {
        return {
          ...prevState,
          [name]: value,
        };
      }
    });
  };

  const handleRegister = async () => {
    console.log('Form Data:', formData); 

    try {
      // Verificar si el UUID ya está registrado
      const checkResponse = await fetch(`https://entradas-backend.vercel.app/alumnos/check-uuid?deviceUUID=${formData.deviceUUID}`);
      const checkData = await checkResponse.json();

      if (checkResponse.ok && checkData.exists) {
        Alert.alert('Error en el registro', 'Este dispositivo ya ha sido registrado con anterioridad.');
        return;
      }

      // Si el UUID no existe, proceder con el registro
      const response = await fetch('https://entradas-backend.vercel.app/alumnos/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Registro exitoso', 'El alumno se ha registrado correctamente');
        navigation.navigate('Login'); 

      } else {
        Alert.alert('Error en el registro', data.message || 'Ocurrió un error al registrar el alumno');
      }
    } catch (error) {
      console.error('Error registering alumno:', error);
      Alert.alert('Error en el registro', 'Ocurrió un error al registrar el alumno');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Matrícula</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('matricula', value)} value={formData.matricula} />

      <Text style={styles.label}>Correo</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('correo', value)} value={formData.correo} />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('telefono', value)} value={formData.telefono} />

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('nombre', value)} value={formData.nombre} />

      <Text style={styles.label}>Apellido Paterno</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('apellido_paterno', value)} value={formData.apellido_paterno} />

      <Text style={styles.label}>Apellido Materno</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('apellido_materno', value)} value={formData.apellido_materno} />

      <Text style={styles.label}>Carrera</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('carrera', value)} value={formData.carrera} />

      <Text style={styles.label}>Estado</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('domicilio.estado', value)} value={formData.domicilio.estado} />

      <Text style={styles.label}>Municipio</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('domicilio.municipio', value)} value={formData.domicilio.municipio} />

      <Text style={styles.label}>Colonia</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('domicilio.colonia', value)} value={formData.domicilio.colonia} />

      <Text style={styles.label}>Calle</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('domicilio.calle', value)} value={formData.domicilio.calle} />

      <Text style={styles.label}>Número Interior</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('domicilio.numero_interior', value)} value={formData.domicilio.numero_interior} />

      <Text style={styles.label}>Número Exterior</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('domicilio.numero_exterior', value)} value={formData.domicilio.numero_exterior} />

      <Text style={styles.label}>Nombre de Contacto de Emergencia</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('contacto_emergencia.nombre_c', value)} value={formData.contacto_emergencia.nombre_c} />

      <Text style={styles.label}>Apellido Materno de Contacto de Emergencia</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('contacto_emergencia.apellido_materno_c', value)} value={formData.contacto_emergencia.apellido_materno_c} />

      <Text style={styles.label}>Apellido Paterno de Contacto de Emergencia</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('contacto_emergencia.apellido_paterno_c', value)} value={formData.contacto_emergencia.apellido_paterno_c} />

      <Text style={styles.label}>Teléfono de Contacto de Emergencia</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('contacto_emergencia.telefono_c', value)} value={formData.contacto_emergencia.telefono_c} />

      <Text style={styles.label}>Parentesco de Contacto de Emergencia</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('contacto_emergencia.parentesco', value)} value={formData.contacto_emergencia.parentesco} />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput style={styles.input} onChangeText={value => handleChange('password', value)} value={formData.password} secureTextEntry />

      <Button title="Registrar" onPress={handleRegister} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default RegisterForm;
