import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Linking, 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [qrData, setQrData] = useState('');

  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();


  const validarLogin = () => {
    const validUser = 'admin';
    const validPass = '1234';

    if (user === validUser && pass === validPass) {
      Alert.alert('Correcto', 'Inicio de sesión exitoso');
      setLoggedIn(true);
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  
  const cambiarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a las imágenes');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };


  const tomarFoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });

      setImageUri(result.uri);
      setShowCamera(false);
    }
  };

  const cerrarSesion = () => {
    setUser('');
    setPass('');
    setImageUri(null);
    setLoggedIn(false);
    setShowCamera(false);
    setShowScanner(false);
    setQrData('');
  };

  const isUrl = (text) => {
   
    return /^(https?:\/\/|www\.)[^\s$.?#].[^\s]*$/i.test(text);
  };

  const handleBarCodeScanned = ({ data }) => {
    setQrData(data);
    setShowScanner(false);

    let message = `Contenido: ${data}`;
    if (isUrl(data)) {
      message = `URL escaneada: ${data}. Presiona "Abrir enlace" para navegar.`;
    }

    Alert.alert('QR Escaneado', message);
  };

  const openQrLink = async () => {
    if (qrData && isUrl(qrData)) {
      try {
        const supported = await Linking.canOpenURL(qrData);
        if (supported) {
          await Linking.openURL(qrData);
        } else {
          Alert.alert(`No se puede abrir la URL: ${qrData}`);
        }
      } catch (error) {
        Alert.alert('Error al abrir el enlace', 'Asegúrate de que la URL sea válida.');
      }
    } else if (qrData) {
      Alert.alert('Contenido no es un enlace', `El contenido escaneado no es una URL: ${qrData}`);
    } else {
      Alert.alert('Sin contenido', 'No hay datos de QR escaneados para abrir.');
    }
  };

  
  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Cargando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.title}>Permiso de cámara requerido</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.btnText}>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // UI 
  return (
    <SafeAreaView style={styles.container}>
      {showCamera ? (
        <>
          <CameraView ref={cameraRef} style={{ flex: 1 }} />
          <TouchableOpacity style={styles.button} onPress={tomarFoto}>
            <Text style={styles.btnText}>Tomar foto</Text>
          </TouchableOpacity>
        </>
      ) : showScanner ? (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
        />
      ) : !loggedIn ? (
        <View style={styles.box}>
          <Text style={styles.title}>Inicio de Sesión</Text>

          <TextInput
            placeholder="Usuario"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={pass}
            onChangeText={setPass}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={validarLogin}>
            <Text style={styles.btnText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.box}>
          <Text style={styles.title}>Bienvenido {user}</Text>

          <TouchableOpacity onPress={cambiarImagen} activeOpacity={0.8}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Image
                  source={{
                    uri: 'https://static.vecteezy.com/system/resources/previews/005/005/840/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg',
                  }}
                  style={styles.defaultImage}
                />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.button, styles.smallButton]}
              onPress={() => setShowCamera(true)}
            >
              <Text style={styles.btnText}>Tomar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.smallButton]}
              onPress={() => setShowScanner(true)}
            >
              <Text style={styles.btnText}>Escanear QR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.smallButton, styles.logoutButton]}
              onPress={cerrarSesion}
            >
              <Text style={styles.btnText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>

          {qrData ? (
            
            <>
              <Text style={styles.qrText}>Último QR escaneado:</Text>
              {isUrl(qrData) ? (
                <>
                  <TouchableOpacity onPress={openQrLink}>
                    <Text style={styles.qrLink}>{qrData}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { marginTop: 10, width: 200, backgroundColor: '#28a745' }]} onPress={openQrLink}>
                    <Text style={styles.btnText}>Abrir enlace</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.qrTextContent}>{qrData}</Text>
              )}
            </>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
}

 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    marginTop: 60,
    marginHorizontal: 20,
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: '#00BFFF',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: '#2A2A2A',
  },
  button: {
    backgroundColor: '#00BFFF',
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  smallButton: {
    width: '30%',
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginTop: 10,
  },
  defaultImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 14,
  },
  qrText: {
    color: '#FFF',
    marginTop: 10,
    fontWeight: 'bold',
  },
  qrTextContent: {
    color: '#FFF',
    marginTop: 5,
    padding: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 5,
    maxWidth: '100%',
  },
  qrLink: {
    color: '#00BFFF',
    marginTop: 5,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    padding: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 5,
    maxWidth: '100%',
  },
});