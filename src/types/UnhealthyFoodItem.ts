export interface UnhealthyFoodItem {
  code: string;
  product_name: string;
  image_url?: string;
  nutriments: {
    energy_100g: string;
    'energy-kcal_100g': string;
    fat_100g: string;
    'saturated-fat_100g': string;
    carbohydrates_100g: string;
    sugars_100g: string;
    fiber_100g: string;
    proteins_100g: string;
    salt_100g: string;
  };
}
