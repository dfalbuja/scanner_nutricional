import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { fetchProductByBarcode } from '../api/openFoodFacts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, Modal, Pressable } from 'react-native';
import imageMap from '../assets/imageMap';
import healthySuggestionMap from '../assets/healthySuggestionMap';
import { UnhealthyFoodItem } from '../types/UnhealthyFoodItem';
import unhealthyFoodData from '../assets/unhealthyFood.json';
import healthyFoodData from '../assets/healthyFood.json';

const unhealthyFood = unhealthyFoodData as UnhealthyFoodItem[];
const healthyFood = healthyFoodData as any[];

type RootStackParamList = {
  Producto: { code: string };
};

type ProductoRouteProp = RouteProp<RootStackParamList, 'Producto'>;

export default function ProductoScreen() {
  const { params } = useRoute<ProductoRouteProp>();
  const { code } = params;

  const [product, setProduct] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [trialExpired, setTrialExpired] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      // Verifica la fecha actual
      const today = new Date();
      const trialEnd = new Date('2030-07-24');

      if (today >= trialEnd) {
        setTrialExpired(true);
        return;
      }

      let result = unhealthyFood.find((p) => p.code === code);
      if (!result) result = await fetchProductByBarcode(code);

      setProduct(result);
    };

    loadProduct();
  }, [code]);

  if (trialExpired) {
    return (
      <View style={styles.loadingContainer}>
        <Modal visible={true} transparent animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                maxWidth: '80%',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Periodo de prueba finalizado
              </Text>
              <Text style={{ marginBottom: 20, textAlign: 'center' }}>
                Esta aplicación ya no se encuentra disponible. El periodo de
                prueba terminó.
              </Text>
              <Pressable
                style={{
                  backgroundColor: '#2196F3',
                  borderRadius: 5,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                }}
                onPress={() => {}}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Cerrar
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando producto</Text>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  const nutriments = product.nutriments || {};

  const healthyCode = healthySuggestionMap[code];
  const healthySuggestion = healthyFood.find((p) => p.code === healthyCode);
  const healthyNutriments = healthySuggestion?.nutriments || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardUnhealthy}>
        <Text style={styles.title}>PRODUCTO</Text>
        <Text style={styles.title}>
          {product.product_name || 'Desconocido'}
        </Text>

        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : product.code && imageMap[product.code] ? (
          <Image
            source={imageMap[product.code]}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : null}

        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, { flex: 1.5 }]}>
              Información nutricional
            </Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>
              Por 100g / 100ml
            </Text>
          </View>

          {[
            [
              'Energía (Calorías)',
              {
                kj: nutriments['energy_100g'],
                kcal: nutriments['energy-kcal_100g'],
              },
              null,
            ],
            ['Grasa', nutriments['fat_100g'], 'g'],
            ['Grasa Saturada', nutriments['saturated-fat_100g'], 'g'],
            ['Carbohidratos', nutriments['carbohydrates_100g'], 'g'],
            ['Azúcares', nutriments['sugars_100g'], 'g'],
            ['Fibra', nutriments['fiber_100g'], 'g'],
            ['Proteínas', nutriments['proteins_100g'], 'g'],
            ['Sal', nutriments['salt_100g'], 'g'],
          ].map(([label, value, unit], idx) => (
            <View style={styles.row} key={idx}>
              <Text style={[styles.cell, { flex: 1.5 }]}>{label}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>
                {label === 'Energía (Calorías)'
                  ? value &&
                    value.kj !== undefined &&
                    value.kj !== null &&
                    String(value.kj).trim() !== ''
                    ? `${value.kj} kJ (${value.kcal ?? '-'} kcal)`
                    : '-'
                  : value !== null &&
                    value !== undefined &&
                    String(value).trim() !== ''
                  ? `${value} ${unit}`
                  : '-'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.cardHealthy}>
        <Text style={styles.subtitle}>OPCIÓN: </Text>
        <Text style={styles.subtitle}>
          {healthySuggestion
            ? healthySuggestion.product_name
            : 'No se encontró una opción'}
        </Text>

        {/* Modal para mostrar el comentario */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                maxWidth: '80%',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Comentario
              </Text>
              <Text style={{ marginBottom: 20, textAlign: 'center' }}>
                {healthySuggestion?.comment}
              </Text>
              <Pressable
                style={{
                  backgroundColor: '#2196F3',
                  borderRadius: 5,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Cerrar
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* ...resto del código de la opción saludable... */}
        {healthySuggestion ? (
          <View
            style={{
              marginBottom: 5,
              position: 'relative',
              alignItems: 'center',
            }}
          >
            {/* Imagen */}
            {healthySuggestion.image_url ? (
              <Image
                source={{ uri: healthySuggestion.image_url }}
                style={styles.productImage}
                resizeMode="contain"
              />
            ) : healthySuggestion.code && imageMap[healthySuggestion.code] ? (
              <Image
                source={imageMap[healthySuggestion.code]}
                style={styles.productImage}
                resizeMode="contain"
              />
            ) : null}

            {/* Ícono */}
            {healthySuggestion.comment ? (
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                  position: 'absolute',
                  right: 20,
                  top: '50%',
                  marginTop: -17, // Centrar verticalmente aprox.
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    color: '#2196F3',
                    fontWeight: 'bold',
                    fontSize: 30,
                  }}
                >
                  ⓘ
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, { flex: 1.5 }]}>
              Información nutricional
            </Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>
              Por 100g / 100ml
            </Text>
          </View>

          {(healthySuggestion
            ? [
                [
                  'Energía (Calorías)',
                  healthyNutriments['energy_100g'],
                  'kJ (' +
                    (healthyNutriments['energy-kcal_100g'] ?? '-') +
                    ' kcal)',
                ],
                ['Grasa', healthyNutriments['fat_100g'], 'g'],
                [
                  'Grasa Saturada',
                  healthyNutriments['saturated-fat_100g'],
                  'g',
                ],
                ['Carbohidratos', healthyNutriments['carbohydrates_100g'], 'g'],
                ['Azúcares', healthyNutriments['sugars_100g'], 'g'],
                ['Fibra', healthyNutriments['fiber_100g'], 'g'],
                ['Proteínas', healthyNutriments['proteins_100g'], 'g'],
                ['Sal', healthyNutriments['salt_100g'], 'g'],
              ]
            : [
                [
                  'Energía (Calorías)',
                  nutriments['energy_100g'],
                  'kJ (' + (nutriments['energy-kcal_100g'] ?? '-') + ' kcal)',
                ],
                ['Grasa', nutriments['fat_100g'], 'g'],
                ['Grasa Saturada', nutriments['saturated-fat_100g'], 'g'],
                ['Carbohidratos', nutriments['carbohydrates_100g'], 'g'],
                ['Azúcares', nutriments['sugars_100g'], 'g'],
                ['Fibra', nutriments['fiber_100g'], 'g'],
                ['Proteínas', nutriments['proteins_100g'], 'g'],
                ['Sal', nutriments['salt_100g'], 'g'],
              ]
          ).map(([label, value, unit], idx) => (
            <View style={styles.row} key={`suggestion-${idx}`}>
              <Text style={[styles.cell, { flex: 1.5 }]}>{label}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>
                {value !== null &&
                value !== undefined &&
                String(value).trim() !== ''
                  ? // Si la fila es Energía, mostramos los dos valores
                    label === 'Energía (Calorías)'
                    ? `${value} kJ (${
                        healthyNutriments['energy-kcal_100g'] ?? '-'
                      } kcal)`
                    : `${value} ${unit}`
                  : '-'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 1,
    marginTop: 0,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 1,
    color: '#4caf50',
    textAlign: 'center',
  },
  productImage: {
    width: 135,
    height: 130,
    alignSelf: 'center',
    marginBottom: 5,
    borderRadius: 8,
    // backgroundColor: 'white',
    backgroundColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  cell: {
    fontSize: 11,
    color: '#333',
    paddingHorizontal: 4,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 3,
  },

  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },

  headerCell: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
    paddingHorizontal: 4,
  },
  cardUnhealthy: {
    backgroundColor: '#ffe5e5', // rojo claro
    borderRadius: 10,
    padding: 6,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },

  cardHealthy: {
    backgroundColor: '#e6f4ea', // verde claro
    borderRadius: 10,
    padding: 6,
    marginTop: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
});
