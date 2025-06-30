import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { fetchProductByBarcode } from '../api/openFoodFacts';
import { SafeAreaView } from 'react-native-safe-area-context';
import imageMap from '../assets/imageMap';
import { UnhealthyFoodItem } from '../types/UnhealthyFoodItem';
import unhealthyFoodData from '../assets/unhealthyFood.json';
const unhealthyFood = unhealthyFoodData as UnhealthyFoodItem[];

type RootStackParamList = {
  Producto: { code: string };
};

type ProductoRouteProp = RouteProp<RootStackParamList, 'Producto'>;

export default function ProductoScreen() {
  const { params } = useRoute<ProductoRouteProp>();
  const { code } = params;

  const [product, setProduct] = useState<any | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      let result = unhealthyFood.find((p) => p.code === code);
      if (!result) result = await fetchProductByBarcode(code);

      setProduct(result);
    };
    loadProduct();
  }, [code]);

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando producto</Text>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  const nutriments = product.nutriments || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardUnhealthy}>
        <Text style={styles.title}>
          Producto escaneado: {product.product_name || 'Desconocido'}
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
              nutriments['energy_100g'] + ' kJ',
              '(' + nutriments['energy-kcal_100g'] + ' kcal)',
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
                {value !== null &&
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
        <Text style={styles.subtitle}>Opción saludable: Zanahorias</Text>

        {product.image_url && (
          <Image
            source={{ uri: product.image_url }}
            style={styles.productImage}
            resizeMode="contain"
          />
        )}

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
              nutriments['energy_100g'] + ' kJ',
              '(' + nutriments['energy-kcal_100g'] + ' kcal)',
            ],
            ['Grasa', nutriments['fat_100g'], 'g'],
            ['Grasa Saturada', nutriments['saturated-fat_100g'], 'g'],
            ['Carbohidratos', nutriments['carbohydrates_100g'], 'g'],
            ['Azúcares', nutriments['sugars_100g'], 'g'],
            ['Fibra', nutriments['fiber_100g'], 'g'],
            ['Proteínas', nutriments['proteins_100g'], 'g'],
            ['Sal', nutriments['salt_100g'], 'g'],
          ].map(([label, value, unit], idx) => (
            <View style={styles.row} key={`suggestion-${idx}`}>
              <Text style={[styles.cell, { flex: 1.5 }]}>{label}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>
                {value !== null &&
                value !== undefined &&
                String(value).trim() !== ''
                  ? `${value} ${unit}`
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
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 0,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 5,
    color: '#4caf50',
    textAlign: 'center',
  },
  productImage: {
    width: 135,
    height: 135,
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
    fontSize: 12,
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
