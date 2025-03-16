import React, { useState, useEffect } from 'react';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    stock: '',
    category: '' // Nova propriedade
  });

  const categories = [
    'Bebidas',
    'Alimentos',
    'Limpeza',
    'Higiene',
    'Outros'
  ];

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(savedProducts);
  }, []);

  const addProduct = (e) => {
    e.preventDefault();
    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      category: newProduct.category
    };
    
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setNewProduct({ name: '', price: '', stock: '', category: '' });
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleStockChange = (id, value) => {
    const newStock = Number(value);
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        return { ...product, stock: newStock };
      }
      return product;
    });
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  return (
    <div className="inventory">
      <form onSubmit={addProduct}>
        <input
          type="text"
          placeholder="Nome do produto"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Preço"
          step="0.01"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Estoque"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
        />
        <select
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit">Adicionar Produto</button>
      </form>
      
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>R$ {product.price.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  value={product.stock}
                  onChange={(e) => handleStockChange(product.id, e.target.value)}
                  style={{ width: '80px' }}
                />
              </td>
              <td>
                <button onClick={() => deleteProduct(product.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
