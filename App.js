import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { View, Button, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [photo, setPhoto] = useState(null);      
  const [openCamera, setOpenCamera] = useState(false);   

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 20 }}>Necesitas permitir acceso a la cámara</Text>
        <Button title="Dar permiso" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync({ quality: 1 });
      setPhoto(result.uri);
      setOpenCamera(false); 
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>

      {/* Pantalla de cámara */}
      {openCamera ? (
        <View style={{ flex: 1 }}>
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing="front"
          />

          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Tomar foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Pantalla principal */
        <View style={styles.container}>
          <Text style={styles.title}>Perfil</Text>

          {/* Foto de perfil */}
          <TouchableOpacity onPress={() => setOpenCamera(true)}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultProfile}>
                <Text style={{ color: "white", fontSize: 40 }}>👤</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setOpenCamera(true)}
          >
            <Text style={styles.buttonText}>
              {photo ? "Cambiar foto" : "Tomar una foto"}
            </Text>
          </TouchableOpacity>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1, justifyContent: "center", alignItems: "center"
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
  },
  title: {
    color: "white",
    fontSize: 28,
    marginBottom: 30,
    fontWeight: "bold",
  },
  defaultProfile: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#6A5ACD",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#6A5ACD",
  },
  button: {
    backgroundColor: "#6A5ACD",
    padding: 12,
    borderRadius: 10,
    marginTop: 35,
    width: 150,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  captureButton: {
    backgroundColor: "#6A5ACD",
    padding: 15,
    alignItems: "center",
  }
});
