import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { fetchProductByBarcode } from '../api/openFoodFacts';

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
      const result = await fetchProductByBarcode(code);
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
    <View style={styles.container}>
      <Text style={styles.title}>{product.product_name || 'Desconocido'}</Text>

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
          <Text style={[styles.headerCell, { flex: 1 }]}>Por 100g / 100ml</Text>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 20,
  },
  productImage: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 12,
    borderRadius: 8,
    // backgroundColor: 'white',
    backgroundColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cell: {
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 4,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 8,
  },

  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },

  headerCell: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    paddingHorizontal: 4,
  },
});
