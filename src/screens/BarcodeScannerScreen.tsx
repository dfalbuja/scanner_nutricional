import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { fetchProductByBarcode } from '../api/openFoodFacts';
import { addToHistory } from '../utils/history';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { UnhealthyFoodItem } from '../types/UnhealthyFoodItem';
import unhealthyFoodData from '../assets/unhealthyFood.json';
const unhealthyFood = unhealthyFoodData as UnhealthyFoodItem[];

type RootStackParamList = {
  Producto: { code: string };
  Historial: undefined;
};

export default function BarcodeScannerScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const cameraRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      setScanned(false);
      return () => {
        setIsFocused(false); // cuando salimos de la pantalla
      };
    }, [])
  );

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    console.log('Código escaneado:', data);
    const result = await fetchProductByBarcode(data);

    if (result) {
      await addToHistory(result, data);
      navigation.navigate('Producto', { code: data });
    } else {
      const product = unhealthyFood.find((p) => p.code === data);

      if (product) {
        await addToHistory(product, data);
        navigation.navigate('Producto', { code: data });
      } else {
        setScanned(true);

        Alert.alert(
          'Producto no encontrado',
          'El producto no se encuentra en Open Food Facts',
          [
            {
              text: 'Aceptar',
              onPress: () => setScanned(false),
            },
          ],
          { cancelable: false } // importante para evitar que se cierre tocando fuera
        );
      }
    }
  };

  if (!permission) {
    return <Text>Verificando permisos...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons
          name="camera-outline"
          size={64}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.permissionText}>
          Se requiere permiso para la cámara
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'],
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },

  permissionText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },

  permissionButton: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },

  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginBottom: 20,
  },
});
