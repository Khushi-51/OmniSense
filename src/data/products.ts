import { Product } from '../types';

// Helper function to get category-based images
const getCategoryImage = (category: string, productName: string): string => {
  const categoryImages: Record<string, string[]> = {
    'Fruits & Vegetables': [
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop'
    ],
    'Dairy & Eggs': [
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518788545-2e9170db0faf?w=400&h=400&fit=crop'
    ],
    'Grains & Cereals': [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1596040827470-5a4c7be5c9c4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop'
    ],
    'Pulses & Legumes': [
      'https://images.unsplash.com/photo-1515543904379-3d3ee6667b95?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581708834961-e8e3e7b0a4d2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=400&h=400&fit=crop'
    ],
    'Spices & Masalas': [
      'https://images.unsplash.com/photo-1596040827470-5a4c7be5c9c4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    ],
    'Meat & Seafood': [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop'
    ],
    'Beverages': [
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571167988840-c4a16d39c99c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=400&h=400&fit=crop'
    ],
    'Snacks & Sweets': [
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop'
    ],
    'Personal Care': [
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop'
    ],
    'Household Items': [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1610557892851-23d9cb6227b4?w=400&h=400&fit=crop'
    ],
    'Ready-to-Eat': [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop'
    ]
  };

  const categoryImageList = categoryImages[category] || categoryImages['Grains & Cereals'];
  const imageIndex = productName.length % categoryImageList.length;
  return categoryImageList[imageIndex];
};

// Alternative: Generate placeholder image with product info
const getPlaceholderImage = (productName: string): string => {
  const initials = productName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  const colors = ['FF6B35', '004E89', '009639', 'FF9F1C', '8E44AD', 'E74C3C', '3498DB', 'E91E63'];
  const colorIndex = productName.length % colors.length;
  const backgroundColor = colors[colorIndex];
  
  return `https://via.placeholder.com/400x400/${backgroundColor}/FFFFFF?text=${encodeURIComponent(initials)}`;
};

// Helper function to generate Indian products
const generateIndianProducts = (): Product[] => {
  const products: Product[] = [];
  
  // Indian product data templates
  const indianProductTemplates = [
    // Fruits & Vegetables
    { name: 'Bananas', brand: 'Dole', category: 'Fruits & Vegetables', basePrice: 60, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Apples', brand: 'Kashmiri', category: 'Fruits & Vegetables', basePrice: 180, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Mangoes', brand: 'Alphonso', category: 'Fruits & Vegetables', basePrice: 400, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Onions', brand: 'Local Farm', category: 'Fruits & Vegetables', basePrice: 40, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Potatoes', brand: 'Local Farm', category: 'Fruits & Vegetables', basePrice: 30, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Tomatoes', brand: 'Local Farm', category: 'Fruits & Vegetables', basePrice: 50, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Carrots', brand: 'Local Farm', category: 'Fruits & Vegetables', basePrice: 80, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Spinach', brand: 'Fresh Express', category: 'Fruits & Vegetables', basePrice: 25, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Cauliflower', brand: 'Local Farm', category: 'Fruits & Vegetables', basePrice: 35, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Green Beans', brand: 'Local Farm', category: 'Fruits & Vegetables', basePrice: 90, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Lemons', brand: 'Local Farm', category: 'Fruits & Vegetables', basePrice: 100, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Oranges', brand: 'Nagpur', category: 'Fruits & Vegetables', basePrice: 120, dietary: ['organic', 'vegan', 'gluten-free'] },
    
    // Dairy & Eggs
    { name: 'Milk', brand: 'Amul', category: 'Dairy & Eggs', basePrice: 60, dietary: ['organic', 'high-protein'] },
    { name: 'Paneer', brand: 'Amul', category: 'Dairy & Eggs', basePrice: 180, dietary: ['high-protein', 'vegetarian'] },
    { name: 'Curd', brand: 'Amul', category: 'Dairy & Eggs', basePrice: 50, dietary: ['probiotic', 'high-protein'] },
    { name: 'Butter', brand: 'Amul', category: 'Dairy & Eggs', basePrice: 250, dietary: ['high-protein'] },
    { name: 'Cheese', brand: 'Amul', category: 'Dairy & Eggs', basePrice: 200, dietary: ['high-protein'] },
    { name: 'Ghee', brand: 'Amul', category: 'Dairy & Eggs', basePrice: 550, dietary: ['organic'] },
    { name: 'Eggs', brand: 'Venkateshwara', category: 'Dairy & Eggs', basePrice: 90, dietary: ['high-protein'] },
    { name: 'Buttermilk', brand: 'Amul', category: 'Dairy & Eggs', basePrice: 25, dietary: ['probiotic', 'low-fat'] },
    
    // Grains & Cereals
    { name: 'Basmati Rice', brand: 'India Gate', category: 'Grains & Cereals', basePrice: 180, dietary: ['gluten-free'] },
    { name: 'Wheat Flour', brand: 'Aashirvaad', category: 'Grains & Cereals', basePrice: 45, dietary: ['whole-grain'] },
    { name: 'Oats', brand: 'Quaker', category: 'Grains & Cereals', basePrice: 150, dietary: ['whole-grain', 'high-fiber'] },
    { name: 'Quinoa', brand: 'Tata Sampann', category: 'Grains & Cereals', basePrice: 350, dietary: ['gluten-free', 'high-protein'] },
    { name: 'Brown Rice', brand: 'Fortune', category: 'Grains & Cereals', basePrice: 120, dietary: ['whole-grain', 'gluten-free'] },
    { name: 'Semolina', brand: 'Aashirvaad', category: 'Grains & Cereals', basePrice: 55, dietary: [] },
    { name: 'Poha', brand: 'Tata Sampann', category: 'Grains & Cereals', basePrice: 80, dietary: ['gluten-free'] },
    
    // Pulses & Legumes
    { name: 'Toor Dal', brand: 'Tata Sampann', category: 'Pulses & Legumes', basePrice: 140, dietary: ['high-protein', 'gluten-free'] },
    { name: 'Moong Dal', brand: 'Tata Sampann', category: 'Pulses & Legumes', basePrice: 120, dietary: ['high-protein', 'gluten-free'] },
    { name: 'Chana Dal', brand: 'Tata Sampann', category: 'Pulses & Legumes', basePrice: 110, dietary: ['high-protein', 'gluten-free'] },
    { name: 'Masoor Dal', brand: 'Tata Sampann', category: 'Pulses & Legumes', basePrice: 100, dietary: ['high-protein', 'gluten-free'] },
    { name: 'Urad Dal', brand: 'Tata Sampann', category: 'Pulses & Legumes', basePrice: 130, dietary: ['high-protein', 'gluten-free'] },
    { name: 'Rajma', brand: 'Tata Sampann', category: 'Pulses & Legumes', basePrice: 160, dietary: ['high-protein', 'gluten-free'] },
    { name: 'Chickpeas', brand: 'Fortune', category: 'Pulses & Legumes', basePrice: 80, dietary: ['high-protein', 'gluten-free'] },
    
    // Spices & Masalas
    { name: 'Turmeric Powder', brand: 'Tata Sampann', category: 'Spices & Masalas', basePrice: 35, dietary: ['organic', 'gluten-free'] },
    { name: 'Red Chili Powder', brand: 'Everest', category: 'Spices & Masalas', basePrice: 45, dietary: ['organic', 'gluten-free'] },
    { name: 'Coriander Powder', brand: 'Everest', category: 'Spices & Masalas', basePrice: 40, dietary: ['organic', 'gluten-free'] },
    { name: 'Cumin Seeds', brand: 'Everest', category: 'Spices & Masalas', basePrice: 120, dietary: ['organic', 'gluten-free'] },
    { name: 'Garam Masala', brand: 'MDH', category: 'Spices & Masalas', basePrice: 55, dietary: ['organic', 'gluten-free'] },
    { name: 'Mustard Seeds', brand: 'Everest', category: 'Spices & Masalas', basePrice: 60, dietary: ['organic', 'gluten-free'] },
    { name: 'Cardamom', brand: 'Everest', category: 'Spices & Masalas', basePrice: 800, dietary: ['organic', 'gluten-free'] },
    { name: 'Cinnamon', brand: 'Everest', category: 'Spices & Masalas', basePrice: 200, dietary: ['organic', 'gluten-free'] },
    
    // Meat & Seafood
    { name: 'Chicken', brand: 'Licious', category: 'Meat & Seafood', basePrice: 220, dietary: ['high-protein'] },
    { name: 'Mutton', brand: 'Licious', category: 'Meat & Seafood', basePrice: 650, dietary: ['high-protein'] },
    { name: 'Fish', brand: 'Fresh Ocean', category: 'Meat & Seafood', basePrice: 280, dietary: ['high-protein'] },
    { name: 'Prawns', brand: 'Sea Gold', category: 'Meat & Seafood', basePrice: 450, dietary: ['high-protein'] },
    { name: 'Eggs', brand: 'Suguna', category: 'Meat & Seafood', basePrice: 95, dietary: ['high-protein'] },
    
    // Beverages
    { name: 'Tea', brand: 'Tata Tea', category: 'Beverages', basePrice: 280, dietary: ['organic'] },
    { name: 'Coffee', brand: 'Nescafe', category: 'Beverages', basePrice: 180, dietary: [] },
    { name: 'Coconut Water', brand: 'Real', category: 'Beverages', basePrice: 35, dietary: ['natural', 'electrolyte'] },
    { name: 'Lassi', brand: 'Amul', category: 'Beverages', basePrice: 25, dietary: ['probiotic'] },
    { name: 'Fruit Juice', brand: 'Real', category: 'Beverages', basePrice: 40, dietary: ['vitamin-c'] },
    { name: 'Soft Drinks', brand: 'Coca Cola', category: 'Beverages', basePrice: 40, dietary: [] },
    { name: 'Energy Drink', brand: 'Red Bull', category: 'Beverages', basePrice: 125, dietary: [] },
    { name: 'Mineral Water', brand: 'Bisleri', category: 'Beverages', basePrice: 20, dietary: [] },
    
    // Snacks & Sweets
    { name: 'Biscuits', brand: 'Parle-G', category: 'Snacks & Sweets', basePrice: 10, dietary: [] },
    { name: 'Namkeen', brand: 'Haldiram', category: 'Snacks & Sweets', basePrice: 40, dietary: [] },
    { name: 'Chips', brand: 'Lays', category: 'Snacks & Sweets', basePrice: 20, dietary: [] },
    { name: 'Chocolates', brand: 'Cadbury', category: 'Snacks & Sweets', basePrice: 45, dietary: [] },
    { name: 'Sweets', brand: 'Haldiram', category: 'Snacks & Sweets', basePrice: 300, dietary: [] },
    { name: 'Dry Fruits', brand: 'Kesar', category: 'Snacks & Sweets', basePrice: 800, dietary: ['high-protein', 'healthy'] },
    { name: 'Nuts', brand: 'Tulsi', category: 'Snacks & Sweets', basePrice: 450, dietary: ['high-protein', 'healthy'] },
    
    // Personal Care
    { name: 'Soap', brand: 'Lux', category: 'Personal Care', basePrice: 35, dietary: [] },
    { name: 'Shampoo', brand: 'Head & Shoulders', category: 'Personal Care', basePrice: 180, dietary: [] },
    { name: 'Toothpaste', brand: 'Colgate', category: 'Personal Care', basePrice: 85, dietary: [] },
    { name: 'Face Wash', brand: 'Himalaya', category: 'Personal Care', basePrice: 120, dietary: ['herbal'] },
    { name: 'Hair Oil', brand: 'Parachute', category: 'Personal Care', basePrice: 90, dietary: ['natural'] },
    { name: 'Deodorant', brand: 'Axe', category: 'Personal Care', basePrice: 200, dietary: [] },
    { name: 'Moisturizer', brand: 'Nivea', category: 'Personal Care', basePrice: 180, dietary: [] },
    
    // Household Items
    { name: 'Detergent', brand: 'Surf Excel', category: 'Household Items', basePrice: 280, dietary: [] },
    { name: 'Dish Soap', brand: 'Vim', category: 'Household Items', basePrice: 95, dietary: [] },
    { name: 'Toilet Paper', brand: 'Origami', category: 'Household Items', basePrice: 120, dietary: [] },
    { name: 'Cleaning Spray', brand: 'Dettol', category: 'Household Items', basePrice: 180, dietary: [] },
    { name: 'Incense Sticks', brand: 'Cycle', category: 'Household Items', basePrice: 25, dietary: [] },
    { name: 'Candles', brand: 'Bright', category: 'Household Items', basePrice: 45, dietary: [] },
    
    // Ready-to-Eat
    { name: 'Instant Noodles', brand: 'Maggi', category: 'Ready-to-Eat', basePrice: 14, dietary: [] },
    { name: 'Ready Curry', brand: 'MTR', category: 'Ready-to-Eat', basePrice: 45, dietary: [] },
    { name: 'Instant Upma', brand: 'Saffola', category: 'Ready-to-Eat', basePrice: 35, dietary: [] },
    { name: 'Frozen Paratha', brand: 'Godrej', category: 'Ready-to-Eat', basePrice: 85, dietary: [] },
    { name: 'Pickle', brand: 'Priya', category: 'Ready-to-Eat', basePrice: 60, dietary: [] },
    { name: 'Papad', brand: 'Lijjat', category: 'Ready-to-Eat', basePrice: 25, dietary: [] }
  ];

  const variations = ['Fresh', 'Organic', 'Premium', 'Family Pack', 'Economy', 'Super', 'Special', 'Extra', 'Pure', 'Natural'];
  const aisles = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'D3', 'E1', 'E2', 'F1', 'F2', 'G1', 'G2', 'H1', 'H2'];
  const shelves = ['Top', 'Middle', 'Bottom', 'Display', 'Cold Storage', 'Freezer'];
  const positions = ['Left', 'Center', 'Right', 'Front', 'Back', 'Corner'];

  let id = 1;

  // Generate variations of each Indian product template
  indianProductTemplates.forEach((template) => {
    const numVariations = Math.floor(Math.random() * 12) + 8; // 8-20 variations per template
    
    for (let i = 0; i < numVariations; i++) {
      const variation = variations[Math.floor(Math.random() * variations.length)];
      const isVariant = i > 0;
      const productName = isVariant ? `${variation} ${template.name}` : template.name;
      const priceVariation = (Math.random() - 0.5) * 40; // ±₹20 variation
      
      products.push({
        id: id.toString(),
        name: productName,
        brand: template.brand,
        price: Math.max(5, Math.round(template.basePrice + priceVariation)),
        category: template.category,
        description: `High quality ${productName.toLowerCase()} from ${template.brand}`,
        location: {
          aisle: aisles[Math.floor(Math.random() * aisles.length)],
          shelf: shelves[Math.floor(Math.random() * shelves.length)],
          position: positions[Math.floor(Math.random() * positions.length)]
        },
        nutritional: {
          calories: Math.floor(Math.random() * 350) + 25,
          protein: Math.floor(Math.random() * 20) + 0.5,
          carbs: Math.floor(Math.random() * 40) + 2,
          fat: Math.floor(Math.random() * 15) + 0.2
        },
        dietary: template.dietary,
        image: Math.random() > 0.5 
          ? getCategoryImage(template.category, productName)
          : getPlaceholderImage(productName),
        inStock: Math.random() > 0.05, // 95% in stock
        alternatives: []
      });
      
      id++;
      
      if (products.length >= 1000) break;
    }
    
    if (products.length >= 1000) return;
  });

  // Add alternatives for products
  products.forEach((product) => {
    const sameCategory = products.filter(p => p.category === product.category && p.id !== product.id);
    const numAlternatives = Math.min(3, sameCategory.length);
    const alternatives: string[] = [];
    
    for (let i = 0; i < numAlternatives; i++) {
      const randomIndex = Math.floor(Math.random() * sameCategory.length);
      const alternative = sameCategory[randomIndex];
      if (alternative && !alternatives.includes(alternative.id)) {
        alternatives.push(alternative.id);
      }
    }
    
    product.alternatives = alternatives;
  });

  return products.slice(0, 1000); // Ensure exactly 1000 products
};

export const products: Product[] = generateIndianProducts();

export const categories = [
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Grains & Cereals',
  'Pulses & Legumes',
  'Spices & Masalas',
  'Meat & Seafood',
  'Beverages',
  'Snacks & Sweets',
  'Personal Care',
  'Household Items',
  'Ready-to-Eat'
];

export const dietaryOptions = [
  'organic',
  'gluten-free',
  'dairy-free',
  'vegan',
  'vegetarian',
  'high-protein',
  'low-fat',
  'whole-grain',
  'high-fiber',
  'probiotic',
  'natural',
  'herbal',
  'healthy'
];