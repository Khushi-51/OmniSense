import React from 'react';
import { MapPin, DollarSign, Star, Package, Leaf, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductResultsProps {
  products: Product[];
  highlightedProduct?: Product;
  onProductSelect: (product: Product) => void;
}

export const ProductResults: React.FC<ProductResultsProps> = ({
  products,
  highlightedProduct,
  onProductSelect
}) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <Package size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-500">Try using voice commands to search for products</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Product Results</h2>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {products.length} found
        </span>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onProductSelect(product)}
            className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
              highlightedProduct?.id === product.id
                ? 'border-green-400 bg-green-50 shadow-lg ring-2 ring-green-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">
                      ${product.price}
                    </span>
                    {!product.inStock && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MapPin size={14} />
                    <span>Aisle {product.location.aisle}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Package size={14} />
                    <span>{product.category}</span>
                  </div>
                </div>

                {product.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.dietary.slice(0, 3).map((diet) => (
                      <span
                        key={diet}
                        className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        <Leaf size={10} className="mr-1" />
                        {diet}
                      </span>
                    ))}
                    {product.dietary.length > 3 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{product.dietary.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {product.nutritional && (
                  <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{product.nutritional.calories}</div>
                      <div className="text-gray-500">cal</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{product.nutritional.protein}g</div>
                      <div className="text-gray-500">protein</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{product.nutritional.carbs}g</div>
                      <div className="text-gray-500">carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{product.nutritional.fat}g</div>
                      <div className="text-gray-500">fat</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};