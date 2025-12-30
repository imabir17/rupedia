import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, SortOption } from '../types';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, X, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const ShopPage: React.FC = () => {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // URL state
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search') || '';
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const sortParam = searchParams.get('sort') as SortOption || 'popularity';

  // Calculate global min/max for defaults
  const globalMinPrice = Math.min(...products.map(p => p.price));
  const globalMaxPrice = Math.max(...products.map(p => p.price));

  // Local Filter State (for sidebar inputs)
  const [priceRange, setPriceRange] = useState<{ min: number, max: number }>({
    min: minPriceParam ? Number(minPriceParam) : globalMinPrice,
    max: maxPriceParam ? Number(maxPriceParam) : globalMaxPrice
  });

  // Effect to sync URL search changes to local state if needed (mainly for clearing)
  useEffect(() => {
    if (!minPriceParam && !maxPriceParam) {
      setPriceRange({ min: globalMinPrice, max: globalMaxPrice });
    }
  }, [minPriceParam, maxPriceParam, globalMinPrice, globalMaxPrice]);


  // Handlers
  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  const handleCategoryChange = (cat: string | null) => {
    updateParams({ category: cat });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ sort: e.target.value });
  };

  const handlePriceApply = () => {
    updateParams({
      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max.toString()
    });
    setIsFilterOpen(false); // Close mobile drawer on apply
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setPriceRange({ min: globalMinPrice, max: globalMaxPrice });
  };


  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search
    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // 2. Category
    if (categoryParam) {
      result = result.filter(p => p.category === categoryParam);
    }

    // 3. Price
    const currentMin = minPriceParam ? Number(minPriceParam) : 0;
    const currentMax = maxPriceParam ? Number(maxPriceParam) : Infinity;
    result = result.filter(p => p.price >= currentMin && p.price <= currentMax);

    // 4. Sort
    switch (sortParam) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popularity':
      default:
        // Featured first
        result.sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1));
        break;
    }

    return result;
  }, [products, searchParam, categoryParam, minPriceParam, maxPriceParam, sortParam]);

  return (
    <div className="bg-slate-50 min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl text-primary">
              {searchParam ? `Results for "${searchParam}"` : (categoryParam || 'All Products')}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Showing {filteredProducts.length} items
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden flex items-center px-4 py-2 bg-white border border-pink-200 rounded-md text-slate-700 shadow-sm"
            >
              <Filter size={18} className="mr-2" /> Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortParam}
                onChange={handleSortChange}
                className="appearance-none bg-white border border-pink-200 text-slate-700 py-2 pl-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer text-sm"
              >
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A - Z</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <SlidersHorizontal size={14} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters (Desktop & Mobile Drawer) */}
          <div className={`
            fixed inset-0 z-50 bg-black/50 md:bg-transparent md:static md:z-0 md:w-64 flex-shrink-0 transition-opacity
            ${isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}
          `}>
            <div className={`
                absolute right-0 top-0 bottom-0 w-80 bg-white md:bg-transparent md:static md:w-auto p-6 md:p-0 shadow-2xl md:shadow-none transform transition-transform duration-300 overflow-y-auto
                ${isFilterOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
             `}>
              <div className="flex justify-between items-center md:hidden mb-6">
                <h2 className="font-serif text-xl font-bold text-primary">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
              </div>

              <div className="space-y-8">
                {/* Category Filter */}
                <div>
                  <h3 className="font-bold text-primary mb-4">Categories</h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => handleCategoryChange(null)}
                        className={`text-sm hover:text-accent transition-colors ${!categoryParam ? 'text-accent font-bold' : 'text-slate-600'}`}
                      >
                        All Categories
                      </button>
                    </li>
                    {categories.map(cat => (
                      <li key={cat}>
                        <button
                          onClick={() => handleCategoryChange(cat)}
                          className={`text-sm hover:text-accent transition-colors ${categoryParam === cat ? 'text-accent font-bold' : 'text-slate-600'}`}
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Filter */}
                <div>
                  <h3 className="font-bold text-primary mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <label className="text-xs text-slate-500 block mb-1">Min (৳)</label>
                        <input
                          type="number"
                          min="0"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-pink-200 rounded text-sm focus:ring-1 focus:ring-accent focus:border-accent"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-slate-500 block mb-1">Max (৳)</label>
                        <input
                          type="number"
                          min="0"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-pink-200 rounded text-sm focus:ring-1 focus:ring-accent focus:border-accent"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handlePriceApply}
                      className="w-full py-2 bg-primary text-white text-sm rounded hover:bg-blue-900 transition-colors"
                    >
                      Apply Price
                    </button>
                  </div>
                </div>

                {/* Clear Button */}
                {(categoryParam || minPriceParam || maxPriceParam || searchParam) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-slate-500 underline hover:text-primary"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
            {/* Backdrop click to close on mobile */}
            <div className="md:hidden absolute inset-0 -z-10" onClick={() => setIsFilterOpen(false)} />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-pink-100">
                <Search size={48} className="text-pink-200 mb-4" />
                <h3 className="text-lg font-medium text-primary">No products found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2 bg-pink-50 text-primary rounded-full font-medium hover:bg-pink-100 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;