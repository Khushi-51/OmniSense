import type { Product } from "../data/products"
import { ENHANCED_PRODUCTS_DATASET } from "../data/enhanced-products"

export interface SearchFilters {
  query?: string
  categories?: string[]
  brands?: string[]
  dietary?: string[]
  priceRange?: { min: number; max: number }
  rating?: number
  inStock?: boolean
  isOrganic?: boolean
  sortBy?: string
}

export interface SearchResult {
  products: Product[]
  totalCount: number
  facets: {
    categories: { [key: string]: number }
    brands: { [key: string]: number }
    dietary: { [key: string]: number }
    priceRanges: { [key: string]: number }
  }
}

export class SearchEngine {
  private static products = ENHANCED_PRODUCTS_DATASET

  static search(filters: SearchFilters = {}, page = 1, limit = 20): SearchResult {
    let filteredProducts = [...this.products]

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => filters.categories!.includes(product.category))
    }

    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      filteredProducts = filteredProducts.filter((product) => filters.brands!.includes(product.brand))
    }

    // Dietary filter
    if (filters.dietary && filters.dietary.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        filters.dietary!.some((diet) => product.dietary.includes(diet)),
      )
    }

    // Price range filter
    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= filters.priceRange!.min && product.price <= filters.priceRange!.max,
      )
    }

    // Rating filter
    if (filters.rating) {
      filteredProducts = filteredProducts.filter((product) => product.rating >= filters.rating!)
    }

    // Stock filter
    if (filters.inStock !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.inStock === filters.inStock)
    }

    // Organic filter
    if (filters.isOrganic !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.isOrganic === filters.isOrganic)
    }

    // Sorting
    if (filters.sortBy) {
      filteredProducts = this.sortProducts(filteredProducts, filters.sortBy)
    }

    // Calculate facets
    const facets = this.calculateFacets(filteredProducts)

    // Pagination
    const startIndex = (page - 1) * limit
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit)

    return {
      products: paginatedProducts,
      totalCount: filteredProducts.length,
      facets,
    }
  }

  private static sortProducts(products: Product[], sortBy: string): Product[] {
    switch (sortBy) {
      case "price_asc":
        return products.sort((a, b) => a.price - b.price)
      case "price_desc":
        return products.sort((a, b) => b.price - a.price)
      case "rating":
        return products.sort((a, b) => b.rating - a.rating)
      case "popularity":
        return products.sort((a, b) => b.popularity - a.popularity)
      case "newest":
        return products.sort((a, b) => (b.isFeatured ? 1 : -1))
      default:
        return products.sort((a, b) => b.popularity - a.popularity)
    }
  }

  private static calculateFacets(products: Product[]) {
    const facets = {
      categories: {} as { [key: string]: number },
      brands: {} as { [key: string]: number },
      dietary: {} as { [key: string]: number },
      priceRanges: {} as { [key: string]: number },
    }

    products.forEach((product) => {
      // Categories
      facets.categories[product.category] = (facets.categories[product.category] || 0) + 1

      // Brands
      facets.brands[product.brand] = (facets.brands[product.brand] || 0) + 1

      // Dietary
      product.dietary.forEach((diet) => {
        facets.dietary[diet] = (facets.dietary[diet] || 0) + 1
      })

      // Price ranges
      if (product.price < 100) {
        facets.priceRanges["Under ₹100"] = (facets.priceRanges["Under ₹100"] || 0) + 1
      } else if (product.price < 300) {
        facets.priceRanges["₹100 - ₹300"] = (facets.priceRanges["₹100 - ₹300"] || 0) + 1
      } else if (product.price < 500) {
        facets.priceRanges["₹300 - ₹500"] = (facets.priceRanges["₹300 - ₹500"] || 0) + 1
      } else if (product.price < 1000) {
        facets.priceRanges["₹500 - ₹1000"] = (facets.priceRanges["₹500 - ₹1000"] || 0) + 1
      } else {
        facets.priceRanges["Above ₹1000"] = (facets.priceRanges["Above ₹1000"] || 0) + 1
      }
    })

    return facets
  }

  static getProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id)
  }

  static getFeaturedProducts(limit = 8): Product[] {
    return this.products
      .filter((product) => product.isFeatured)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit)
  }

  static getRecommendedProducts(productId: string, limit = 4): Product[] {
    const product = this.getProductById(productId)
    if (!product) return []

    return this.products
      .filter(
        (p) =>
          p.id !== productId && (p.category === product.category || p.tags.some((tag) => product.tags.includes(tag))),
      )
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit)
  }

  static searchSuggestions(query: string, limit = 5): string[] {
    if (!query || query.length < 2) return []

    const suggestions = new Set<string>()
    const queryLower = query.toLowerCase()

    this.products.forEach((product) => {
      // Product names
      if (product.name.toLowerCase().includes(queryLower)) {
        suggestions.add(product.name)
      }

      // Brands
      if (product.brand.toLowerCase().includes(queryLower)) {
        suggestions.add(product.brand)
      }

      // Categories
      if (product.category.toLowerCase().includes(queryLower)) {
        suggestions.add(product.category)
      }

      // Tags
      product.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag.replace("-", " "))
        }
      })
    })

    return Array.from(suggestions).slice(0, limit)
  }
}
