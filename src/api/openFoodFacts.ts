import axios from 'axios';

export async function fetchProductByBarcode(barcode: string) {
  try {
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,nutriments,image_url,quantity,brands`,
      {
        headers: {
          'User-Agent': 'AppNutricional/1.0 (diegofalbuja@gmail.com)',
        },
      }
    );

    // console.log('PRODUCT STATUS::::::', response.data.status);

    if (response.data.status === 1) return response.data.product;
    else return null;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // Producto no encontrado
      return null;
    }
    console.error('Error al consultar Open Food Facts:', error);
    return null;
  }
}
