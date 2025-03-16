import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import Cart from './Cart';

function POS() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // novo estado para busca
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartVisible, setCartVisible] = useState(true);
  const categories = ['Bebidas', 'Alimentos', 'Limpeza', 'Higiene', 'Outros'];

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(savedProducts);
  }, []);

  const addToCart = (product) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity += 1;
        setCart(updatedCart);
      }
    } else if (product.stock > 0) {
      updatedCart.push({ ...product, quantity: 1 });
      setCart(updatedCart);
    }
  };

  const updateStock = (updatedCart) => {
    const updatedProducts = products.map(product => {
      const cartItem = updatedCart.find(item => item.id === product.id);
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  // Filtrar produtos de acordo com searchTerm e selectedCategory
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pos-container" style={{
      paddingBottom: cartVisible ? '300px' : '50px',
      transition: 'padding-bottom 0.3s ease-in-out'
    }}>
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Todas as categorias</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <ProductList products={filteredProducts} addToCart={addToCart} />
      <Cart 
        cart={cart} 
        setCart={setCart} 
        isVisible={cartVisible}
        setIsVisible={setCartVisible}
        updateStock={updateStock}
      />
    </div>
  );
}

export default POS;
