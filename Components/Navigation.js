import React, { useState, useEffect, createContext, useContext } from "react";
import { Alert } from "react-native";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import Login from "./Login";
import Register from "./RegisterForm";
import MenuP from "./Main";
import { Registro } from "./Registro";

const Tab = createBottomTabNavigator();
const UserContext = createContext(null);

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const confirmLogout = () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sí",
          onPress: () => {
            setIsLoggedIn(false);
            setUsername('');
          }
        }
      ]
    );
  };

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={isLoggedIn ? "Inicio" : "Login"}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Inicio") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Login") {
                iconName = focused ? "login" : "login-variant";
              } else if (route.name === "Cerrar Sesión") {
                iconName = focused ? "logout" : "logout-variant";
              } else if (route.name === "RegisterForm") {
                iconName = focused ? "account-plus" : "account-plus-outline";
              }

              return <Icon type="material-community" name={iconName} size={size} color={color} />;
            },
            headerShown: false,
            tabBarActiveTintColor: "#03983E",
            tabBarInactiveTintColor: "#000000",
            tabBarStyle: {
              display: isLoggedIn ? "flex" : "none",
            },
          })}
        >
          {isLoggedIn ? (
            <>
              <Tab.Screen name="Inicio">
                {() => <Registro />}
              </Tab.Screen>
              <Tab.Screen name="Cerrar Sesión">
                {() => <CerrarSesionScreen confirmLogout={confirmLogout} />}
              </Tab.Screen>
              {/* <Tab.Screen name="RegisterForm">
                {() => <Register />}
              </Tab.Screen> */}
            </>
          ) : (
            <>
              <Tab.Screen name="Login">
                {() => <LoginScreen setIsLoggedIn={setIsLoggedIn} />}
              </Tab.Screen>
              <Tab.Screen name="RegisterForm">
                {() => <Register />}
              </Tab.Screen>
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

const LoginScreen = ({ setIsLoggedIn }) => (
  <Login setIsLoggedIn={setIsLoggedIn} />
);

const CerrarSesionScreen = ({ confirmLogout }) => {
  useFocusEffect(
    React.useCallback(() => {
      confirmLogout();
    }, [])
  );

  return <Registro />;
};

export const useUser = () => useContext(UserContext);
