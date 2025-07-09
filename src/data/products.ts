import { Product } from '../types';

// Helper function to get category-based images
const getCategoryImage = (category: string, productName: string): string => {
  const categoryImages: Record<string, string[]> = {
    'Produce': [
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop'
    ],
    'Dairy': [
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518788545-2e9170db0faf?w=400&h=400&fit=crop'
    ],
    'Bakery': [
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop'
    ],
    'Meat & Seafood': [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop'
    ],
    'Pantry': [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1587411768103-73ab3b50fdeb?w=400&h=400&fit=crop'
    ],
    'Beverages': [
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571167988840-c4a16d39c99c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=400&h=400&fit=crop'
    ],
    'Frozen': [
      'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop'
    ],
    'Health & Beauty': [
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop'
    ],
    'Household': [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1610557892851-23d9cb6227b4?w=400&h=400&fit=crop'
    ],
    'Prepared Foods': [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop'
    ]
  };

  const categoryImageList = categoryImages[category] || categoryImages['Pantry'];
  const imageIndex = productName.length % categoryImageList.length;
  return categoryImageList[imageIndex];
};

// Alternative: Generate placeholder image with product info
const getPlaceholderImage = (productName: string): string => {
  const initials = productName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  const colors = ['3B82F6', '10B981', 'F59E0B', 'EF4444', '8B5CF6', 'F97316', '06B6D4', 'EC4899'];
  const colorIndex = productName.length % colors.length;
  const backgroundColor = colors[colorIndex];
  
  return `https://via.placeholder.com/400x400/${backgroundColor}/FFFFFF?text=${encodeURIComponent(initials)}`;
};

// Helper function to generate products
const generateProducts = (): Product[] => {
  const products: Product[] = [];
  
  // Product data templates
  const productTemplates = [
    // Produce
    { name: 'Organic Bananas', brand: 'Dole', category: 'Produce', basePrice: 2.99, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Fresh Apples', brand: 'Gala', category: 'Produce', basePrice: 3.49, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Orange Juice', brand: 'Tropicana', category: 'Beverages', basePrice: 4.99, dietary: ['vegan', 'gluten-free'] },
    { name: 'Baby Spinach', brand: 'Fresh Express', category: 'Produce', basePrice: 2.79, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Carrots', brand: 'Bolthouse', category: 'Produce', basePrice: 1.99, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Cherry Tomatoes', brand: 'Nature Sweet', category: 'Produce', basePrice: 3.99, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Avocados', brand: 'Hass', category: 'Produce', basePrice: 4.99, dietary: ['organic', 'vegan', 'gluten-free', 'keto'] },
    { name: 'Broccoli', brand: 'Green Giant', category: 'Produce', basePrice: 2.49, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Bell Peppers', brand: 'Sweet Bell', category: 'Produce', basePrice: 3.29, dietary: ['organic', 'vegan', 'gluten-free'] },
    { name: 'Cucumber', brand: 'Fresh Garden', category: 'Produce', basePrice: 1.79, dietary: ['organic', 'vegan', 'gluten-free'] },
    
    // Dairy
    { name: 'Whole Milk', brand: 'Horizon', category: 'Dairy', basePrice: 4.29, dietary: ['organic'] },
    { name: 'Greek Yogurt', brand: 'Chobani', category: 'Dairy', basePrice: 5.99, dietary: ['high-protein', 'probiotic'] },
    { name: 'Cheddar Cheese', brand: 'Tillamook', category: 'Dairy', basePrice: 6.49, dietary: ['high-protein'] },
    { name: 'Butter', brand: 'Land O Lakes', category: 'Dairy', basePrice: 4.99, dietary: [] },
    { name: 'Cream Cheese', brand: 'Philadelphia', category: 'Dairy', basePrice: 3.79, dietary: [] },
    { name: 'Almond Milk', brand: 'Silk', category: 'Dairy', basePrice: 3.49, dietary: ['dairy-free', 'vegan', 'gluten-free'] },
    { name: 'Soy Milk', brand: 'Silk', category: 'Dairy', basePrice: 3.29, dietary: ['dairy-free', 'vegan', 'gluten-free'] },
    { name: 'Oat Milk', brand: 'Oatly', category: 'Dairy', basePrice: 4.99, dietary: ['dairy-free', 'vegan', 'gluten-free'] },
    { name: 'Coconut Milk', brand: 'So Delicious', category: 'Dairy', basePrice: 3.99, dietary: ['dairy-free', 'vegan', 'gluten-free'] },
    { name: 'Heavy Cream', brand: 'Organic Valley', category: 'Dairy', basePrice: 3.49, dietary: ['organic'] },
    
    // Bakery
    { name: 'Whole Wheat Bread', brand: 'Nature\'s Own', category: 'Bakery', basePrice: 4.99, dietary: ['organic', 'whole-grain'] },
    { name: 'Sourdough Bread', brand: 'Boudin', category: 'Bakery', basePrice: 4.49, dietary: [] },
    { name: 'Bagels', brand: 'Thomas\'', category: 'Bakery', basePrice: 3.99, dietary: [] },
    { name: 'Croissants', brand: 'Pillsbury', category: 'Bakery', basePrice: 4.29, dietary: [] },
    { name: 'Muffins', brand: 'Otis Spunkmeyer', category: 'Bakery', basePrice: 5.99, dietary: [] },
    { name: 'Donuts', brand: 'Krispy Kreme', category: 'Bakery', basePrice: 6.99, dietary: [] },
    { name: 'Dinner Rolls', brand: 'King\'s Hawaiian', category: 'Bakery', basePrice: 3.79, dietary: [] },
    { name: 'Pita Bread', brand: 'Joseph\'s', category: 'Bakery', basePrice: 2.99, dietary: [] },
    { name: 'Tortillas', brand: 'Mission', category: 'Bakery', basePrice: 3.49, dietary: [] },
    { name: 'English Muffins', brand: 'Thomas\'', category: 'Bakery', basePrice: 3.29, dietary: [] },
    
    // Meat & Seafood
    { name: 'Chicken Breast', brand: 'Foster Farms', category: 'Meat & Seafood', basePrice: 8.99, dietary: ['high-protein'] },
    { name: 'Ground Beef', brand: 'Angus', category: 'Meat & Seafood', basePrice: 9.99, dietary: ['high-protein'] },
    { name: 'Salmon Fillet', brand: 'Atlantic', category: 'Meat & Seafood', basePrice: 12.99, dietary: ['high-protein'] },
    { name: 'Shrimp', brand: 'SeaPak', category: 'Meat & Seafood', basePrice: 10.99, dietary: ['high-protein'] },
    { name: 'Turkey Slices', brand: 'Oscar Mayer', category: 'Meat & Seafood', basePrice: 4.99, dietary: ['high-protein'] },
    { name: 'Ham', brand: 'Honey Baked', category: 'Meat & Seafood', basePrice: 7.99, dietary: ['high-protein'] },
    { name: 'Bacon', brand: 'Applegate', category: 'Meat & Seafood', basePrice: 6.99, dietary: ['high-protein'] },
    { name: 'Pork Chops', brand: 'Smithfield', category: 'Meat & Seafood', basePrice: 8.49, dietary: ['high-protein'] },
    { name: 'Tuna', brand: 'Bumble Bee', category: 'Meat & Seafood', basePrice: 2.99, dietary: ['high-protein'] },
    { name: 'Cod Fillet', brand: 'Fresh Catch', category: 'Meat & Seafood', basePrice: 11.99, dietary: ['high-protein'] },
    
    // Pantry
    { name: 'Pasta', brand: 'Barilla', category: 'Pantry', basePrice: 1.99, dietary: [] },
    { name: 'Rice', brand: 'Uncle Ben\'s', category: 'Pantry', basePrice: 3.49, dietary: ['gluten-free'] },
    { name: 'Quinoa', brand: 'Ancient Harvest', category: 'Pantry', basePrice: 5.99, dietary: ['gluten-free', 'high-protein'] },
    { name: 'Olive Oil', brand: 'Bertolli', category: 'Pantry', basePrice: 7.99, dietary: ['vegan', 'gluten-free'] },
    { name: 'Peanut Butter', brand: 'Jif', category: 'Pantry', basePrice: 4.49, dietary: ['high-protein'] },
    { name: 'Honey', brand: 'Nature Nate\'s', category: 'Pantry', basePrice: 6.99, dietary: ['organic'] },
    { name: 'Oats', brand: 'Quaker', category: 'Pantry', basePrice: 3.99, dietary: ['whole-grain', 'gluten-free'] },
    { name: 'Cereal', brand: 'Cheerios', category: 'Pantry', basePrice: 4.99, dietary: ['whole-grain'] },
    { name: 'Granola', brand: 'Kind', category: 'Pantry', basePrice: 5.99, dietary: ['organic'] },
    { name: 'Nuts', brand: 'Blue Diamond', category: 'Pantry', basePrice: 6.49, dietary: ['high-protein', 'keto'] },
    
    // Beverages
    { name: 'Coffee', brand: 'Starbucks', category: 'Beverages', basePrice: 8.99, dietary: ['organic'] },
    { name: 'Tea', brand: 'Lipton', category: 'Beverages', basePrice: 3.99, dietary: ['organic'] },
    { name: 'Soda', brand: 'Coca Cola', category: 'Beverages', basePrice: 5.99, dietary: [] },
    { name: 'Energy Drink', brand: 'Red Bull', category: 'Beverages', basePrice: 2.99, dietary: [] },
    { name: 'Sparkling Water', brand: 'LaCroix', category: 'Beverages', basePrice: 4.99, dietary: ['gluten-free'] },
    { name: 'Juice', brand: 'Simply Orange', category: 'Beverages', basePrice: 4.49, dietary: ['vegan'] },
    { name: 'Wine', brand: 'Kendall Jackson', category: 'Beverages', basePrice: 12.99, dietary: [] },
    { name: 'Beer', brand: 'Budweiser', category: 'Beverages', basePrice: 8.99, dietary: [] },
    { name: 'Sports Drink', brand: 'Gatorade', category: 'Beverages', basePrice: 1.99, dietary: [] },
    { name: 'Kombucha', brand: 'GT\'s', category: 'Beverages', basePrice: 3.99, dietary: ['probiotic', 'organic'] },
    
    // Frozen
    { name: 'Frozen Pizza', brand: 'DiGiorno', category: 'Frozen', basePrice: 6.99, dietary: [] },
    { name: 'Ice Cream', brand: 'Ben & Jerry\'s', category: 'Frozen', basePrice: 5.99, dietary: [] },
    { name: 'Frozen Vegetables', brand: 'Birds Eye', category: 'Frozen', basePrice: 2.99, dietary: ['vegan', 'gluten-free'] },
    { name: 'Frozen Fruit', brand: 'Dole', category: 'Frozen', basePrice: 3.99, dietary: ['vegan', 'gluten-free'] },
    { name: 'Frozen Meals', brand: 'Lean Cuisine', category: 'Frozen', basePrice: 4.99, dietary: ['low-carb'] },
    { name: 'Frozen Yogurt', brand: 'Dannon', category: 'Frozen', basePrice: 4.49, dietary: ['probiotic'] },
    { name: 'Frozen Waffles', brand: 'Eggo', category: 'Frozen', basePrice: 3.99, dietary: [] },
    { name: 'Frozen Berries', brand: 'Wyman\'s', category: 'Frozen', basePrice: 4.99, dietary: ['organic', 'vegan'] },
    { name: 'Fish Sticks', brand: 'Gorton\'s', category: 'Frozen', basePrice: 5.99, dietary: ['high-protein'] },
    { name: 'Frozen Burritos', brand: 'Amy\'s', category: 'Frozen', basePrice: 4.99, dietary: ['vegetarian'] },
    
    // Health & Beauty
    { name: 'Shampoo', brand: 'Pantene', category: 'Health & Beauty', basePrice: 5.99, dietary: [] },
    { name: 'Toothpaste', brand: 'Crest', category: 'Health & Beauty', basePrice: 3.99, dietary: [] },
    { name: 'Soap', brand: 'Dove', category: 'Health & Beauty', basePrice: 4.49, dietary: [] },
    { name: 'Deodorant', brand: 'Old Spice', category: 'Health & Beauty', basePrice: 4.99, dietary: [] },
    { name: 'Vitamins', brand: 'Nature Made', category: 'Health & Beauty', basePrice: 12.99, dietary: [] },
    { name: 'Sunscreen', brand: 'Neutrogena', category: 'Health & Beauty', basePrice: 8.99, dietary: [] },
    { name: 'Lotion', brand: 'Cetaphil', category: 'Health & Beauty', basePrice: 7.99, dietary: [] },
    { name: 'Face Wash', brand: 'CeraVe', category: 'Health & Beauty', basePrice: 9.99, dietary: [] },
    { name: 'Moisturizer', brand: 'Olay', category: 'Health & Beauty', basePrice: 11.99, dietary: [] },
    { name: 'Hair Conditioner', brand: 'Herbal Essences', category: 'Health & Beauty', basePrice: 5.99, dietary: [] },
    
    // Household
    { name: 'Toilet Paper', brand: 'Charmin', category: 'Household', basePrice: 12.99, dietary: [] },
    { name: 'Paper Towels', brand: 'Bounty', category: 'Household', basePrice: 8.99, dietary: [] },
    { name: 'Detergent', brand: 'Tide', category: 'Household', basePrice: 14.99, dietary: [] },
    { name: 'Dish Soap', brand: 'Dawn', category: 'Household', basePrice: 3.99, dietary: [] },
    { name: 'Trash Bags', brand: 'Glad', category: 'Household', basePrice: 9.99, dietary: [] },
    { name: 'Aluminum Foil', brand: 'Reynolds', category: 'Household', basePrice: 4.99, dietary: [] },
    { name: 'Plastic Wrap', brand: 'Saran', category: 'Household', basePrice: 3.99, dietary: [] },
    { name: 'Cleaning Spray', brand: 'Lysol', category: 'Household', basePrice: 4.99, dietary: [] },
    { name: 'Air Freshener', brand: 'Febreze', category: 'Household', basePrice: 3.99, dietary: [] },
    { name: 'Sponges', brand: 'Scotch-Brite', category: 'Household', basePrice: 2.99, dietary: [] }
  ];

  const variations = ['Regular', 'Organic', 'Low-Fat', 'Sugar-Free', 'Extra Large', 'Family Pack', 'Premium', 'Light', 'Diet', 'Fresh'];
  const aisles = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'D3', 'P1', 'P2', 'P3', 'PF1', 'F1', 'F2', 'H1', 'H2'];
  const shelves = ['Top', 'Middle', 'Bottom', 'Display', 'Refrigerated', 'Freezer'];
  const positions = ['Left side', 'Center', 'Right side', 'Front center', 'Back', 'End cap'];

  let id = 1;

  // Generate variations of each product template
  productTemplates.forEach((template) => {
    const numVariations = Math.floor(Math.random() * 15) + 10; // 10-25 variations per template
    
    for (let i = 0; i < numVariations; i++) {
      const variation = variations[Math.floor(Math.random() * variations.length)];
      const isVariant = i > 0;
      const productName = isVariant ? `${variation} ${template.name}` : template.name;
      const priceVariation = (Math.random() - 0.5) * 4; // ±$2 variation
      
      products.push({
        id: id.toString(),
        name: productName,
        brand: template.brand,
        price: Math.max(0.99, Math.round((template.basePrice + priceVariation) * 100) / 100),
        category: template.category,
        description: `High quality ${productName.toLowerCase()} from ${template.brand}`,
        location: {
          aisle: aisles[Math.floor(Math.random() * aisles.length)],
          shelf: shelves[Math.floor(Math.random() * shelves.length)],
          position: positions[Math.floor(Math.random() * positions.length)]
        },
        nutritional: {
          calories: Math.floor(Math.random() * 400) + 50,
          protein: Math.floor(Math.random() * 25) + 1,
          carbs: Math.floor(Math.random() * 50) + 5,
          fat: Math.floor(Math.random() * 20) + 0.5
        },
        dietary: template.dietary,
        image: Math.random() > 0.5 
          ? getCategoryImage(template.category, productName)
          : getPlaceholderImage(productName),
        inStock: Math.random() > 0.1, // 90% in stock
        alternatives: []
      });
      
      id++;
      
      if (products.length >= 1000) break;
    }
    
    if (products.length >= 1000) return;
  });

  // Add alternatives for some products
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

export const products: Product[] = generateProducts();

export const categories = [
  'Produce',
  'Dairy',
  'Bakery',
  'Meat & Seafood',
  'Prepared Foods',
  'Beverages',
  'Pantry',
  'Frozen',
  'Health & Beauty',
  'Household'
];

export const dietaryOptions = [
  'organic',
  'gluten-free',
  'dairy-free',
  'vegan',
  'vegetarian',
  'high-protein',
  'low-carb',
  'keto',
  'whole-grain',
  'probiotic'
];