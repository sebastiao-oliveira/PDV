import React from 'react';

function ProductList({ products, addToCart }) {
  return (
    <div className="product-list">
      <h2>Produtos</h2>
      {/* Caixa para limitar a visualização da lista */}
      <div className="products-grid-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>R$ {product.price.toFixed(2)}</p>
              <p>Estoque: {product.stock}</p>
              <button 
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
