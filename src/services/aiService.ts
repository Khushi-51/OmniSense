import { Product, SearchFilters } from '../types';
import { products } from '../data/products';

// Mock AI service - in production, this would connect to OpenAI GPT-4
export class AIService {
  static async processVoiceCommand(command: string): Promise<{
    intent: string;
    products: Product[];
    response: string;
    filters?: SearchFilters;
  }> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerCommand = command.toLowerCase();
    
    // Extract intent and filters from voice command
    const intent = this.extractIntent(lowerCommand);
    const filters = this.extractFilters(lowerCommand);
    
    // Search for products based on the command
    const matchedProducts = this.searchProducts(lowerCommand, filters);
    
    // Generate response
    const response = this.generateResponse(intent, matchedProducts, command);
    
    return {
      intent,
      products: matchedProducts,
      response,
      filters
    };
  }

  private static extractIntent(command: string): string {
    if (command.includes('find') || command.includes('look for') || command.includes('search')) {
      return 'search';
    }
    if (command.includes('where') || command.includes('location') || command.includes('aisle')) {
      return 'locate';
    }
    if (command.includes('price') || command.includes('cost') || command.includes('expensive')) {
      return 'price_check';
    }
    if (command.includes('alternative') || command.includes('substitute') || command.includes('replace')) {
      return 'alternatives';
    }
    return 'search';
  }

  private static extractFilters(command: string): SearchFilters {
    const filters: SearchFilters = {};
    
    // Price filters (in Indian Rupees)
    if (command.includes('cheap') || command.includes('budget') || command.includes('under')) {
      filters.priceRange = [0, 100];
    }
    if (command.includes('expensive') || command.includes('premium') || command.includes('over')) {
      filters.priceRange = [200, 1000];
    }
    
    // Dietary filters
    const dietary: string[] = [];
    if (command.includes('organic')) dietary.push('organic');
    if (command.includes('gluten free') || command.includes('gluten-free')) dietary.push('gluten-free');
    if (command.includes('vegan')) dietary.push('vegan');
    if (command.includes('vegetarian')) dietary.push('vegetarian');
    if (command.includes('dairy free') || command.includes('dairy-free')) dietary.push('dairy-free');
    if (command.includes('protein') || command.includes('high protein')) dietary.push('high-protein');
    
    if (dietary.length > 0) {
      filters.dietary = dietary;
    }
    
    // Category filters
    if (command.includes('bread') || command.includes('bakery')) filters.category = 'Bakery';
    if (command.includes('milk') || command.includes('dairy') || command.includes('cheese')) filters.category = 'Dairy';
    if (command.includes('fruit') || command.includes('vegetable') || command.includes('produce')) filters.category = 'Produce';
    if (command.includes('meat') || command.includes('fish') || command.includes('seafood')) filters.category = 'Meat & Seafood';
    
    return filters;
  }

  private static searchProducts(command: string, filters: SearchFilters): Product[] {
    const results = products.filter(product => {
      // Text matching
      const searchTerms = command.toLowerCase().split(' ');
      const productText = `${product.name} ${product.brand} ${product.description} ${product.category}`.toLowerCase();
      const hasMatch = searchTerms.some(term => productText.includes(term));
      
      if (!hasMatch) return false;
      
      // Apply filters
      if (filters.category && product.category !== filters.category) return false;
      if (filters.priceRange && (product.price < filters.priceRange[0] || product.price > filters.priceRange[1])) return false;
      if (filters.dietary && !filters.dietary.every(diet => product.dietary.includes(diet))) return false;
      if (filters.inStock !== undefined && product.inStock !== filters.inStock) return false;
      
      return true;
    });
    
    // Sort by relevance (mock scoring)
    results.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, command);
      const bScore = this.calculateRelevanceScore(b, command);
      return bScore - aScore;
    });
    
    return results.slice(0, 5); // Return top 5 results
  }

  private static calculateRelevanceScore(product: Product, command: string): number {
    let score = 0;
    const lowerCommand = command.toLowerCase();
    const productText = `${product.name} ${product.brand}`.toLowerCase();
    
    // Exact name match
    if (productText.includes(lowerCommand)) score += 10;
    
    // Partial matches
    const commandWords = lowerCommand.split(' ');
    commandWords.forEach(word => {
      if (productText.includes(word)) score += 3;
      if (product.category.toLowerCase().includes(word)) score += 2;
      if (product.dietary.some(diet => diet.includes(word))) score += 2;
    });
    
    // Boost for in-stock items
    if (product.inStock) score += 1;
    
    return score;
  }

  private static generateResponse(intent: string, products: Product[], originalCommand: string): string {
    if (products.length === 0) {
      return `I couldn't find any products matching "${originalCommand}". Try being more specific or ask for alternatives.`;
    }

    const product = products[0];
    
    switch (intent) {
      case 'locate':
        return `I found ${product.name} by ${product.brand} in aisle ${product.location.aisle}, ${product.location.shelf} shelf, ${product.location.position}. It costs ₹${product.price}. ${product.inStock ? 'It\'s currently in stock.' : 'It appears to be out of stock.'}`;
      
      case 'price_check':
        return `${product.name} by ${product.brand} costs ₹${product.price}. ${products.length > 1 ? `I found ${products.length} similar products with prices ranging from ₹${Math.min(...products.map(p => p.price))} to ₹${Math.max(...products.map(p => p.price))}.` : ''}`;
      
      case 'alternatives':
        return `For ${product.name}, I recommend these alternatives: ${products.slice(1, 3).map(p => `${p.name} by ${p.brand} for ₹${p.price}`).join(', ')}. All are located in nearby aisles.`;
      
      default:
        return `I found ${product.name} by ${product.brand} for ₹${product.price}. It's located in aisle ${product.location.aisle}, ${product.location.shelf} shelf. ${product.dietary.length > 0 ? `This product is ${product.dietary.join(', ')}.` : ''} ${product.inStock ? 'It\'s in stock!' : 'Currently out of stock.'}`;
    }
  }
}