import React, { useState } from 'react';
import { printReceipt } from '../utils/receiptPrinter';

function Cart({ cart, setCart, updateStock }) {
  const [isVisible, setIsVisible] = useState(true);
  const [payment, setPayment] = useState('');
  const [change, setChange] = useState(0);
  
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity, maxStock) => {
    if (newQuantity > 0 && newQuantity <= maxStock) {
      setCart(cart.map(item => {
        if (item.id === productId) {
          return { ...item, quantity: parseInt(newQuantity) };
        }
        return item;
      }));
    }
  };

  const clearCart = () => {
    if (window.confirm('Tem certeza que deseja limpar o carrinho?')) {
      setCart([]);
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const changeAmount = payment - total;
    
    if (changeAmount >= 0) {
      const saleData = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: cart,
        total: total,
        payment: Number(payment),
        change: changeAmount
      };

      const savedSales = JSON.parse(localStorage.getItem('sales')) || [];
      localStorage.setItem('sales', JSON.stringify([...savedSales, saleData]));

      updateStock(cart);
      printReceipt(saleData);
      setCart([]);
      setPayment('');
      setChange(changeAmount);
      
      setTimeout(() => {
        setChange(0);
      }, 5000);

    } else {
      alert('Valor insuficiente!');
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {!isVisible && (
        <button
          className="cart-toggle"
          onClick={() => setIsVisible(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#34495e',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 1001,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            minWidth: '150px',
            justifyContent: 'center'
          }}
        >
          ⬆️ Carrinho ({totalItems})
        </button>
      )}

      <div className="cart" style={{
        position: 'fixed',
        bottom: isVisible ? 0 : '-100%',
        left: 0,
        right: 0,
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        transition: 'bottom 0.3s ease-in-out',
        height: 'auto',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        '@media (max-width: 768px)': {
          width: '100%',
          height: '100vh',
          maxHeight: '100vh'
        }
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '0.5rem',
          position: 'relative',
          paddingTop: '25px'  // Added padding to accommodate the hide button
        }}>
          <h2>Carrinho ({totalItems} itens)</h2>
          <button
            onClick={clearCart}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px'
            }}
          >
            Limpar Carrinho
          </button>
          <button
            className="cart-toggle"
            onClick={() => setIsVisible(false)}
            style={{
              position: 'absolute',
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#34495e',
              color: 'white',
              border: 'none',
              padding: '3px 15px',
              borderRadius: '0 0 15px 15px',
              cursor: 'pointer',
              fontSize: '0.9em',
              zIndex: 1001,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
          >
            ⬇️ Esconder
          </button>
        </div>

        <div className="cart-items" style={{
          overflowY: 'auto',
          flex: 1,
          marginTop: '1rem',
          maxHeight: 'calc(100vh - 250px)',
          borderTop: '1px solid #34495e',
          borderBottom: '1px solid #34495e',
          padding: '0.5rem 0'
        }}>
          {cart.map(item => (
            <div key={item.id} className="cart-item" style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(150px, 2fr) minmax(100px, 1fr) minmax(80px, 1fr) auto',
              gap: '0.5rem',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              backgroundColor: '#34495e',
              borderRadius: '4px',
              alignItems: 'center',
              '@media (max-width: 600px)': {
                gridTemplateColumns: '1fr auto',
                gridTemplateRows: 'auto auto',
                gap: '0.25rem'
              }
            }}>
              <div>
                <div>{item.name}</div>
                <div style={{ fontSize: '0.8em', color: '#bdc3c7' }}>
                  R$ {item.price.toFixed(2)} cada
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock)}
                  style={{ padding: '2px 8px' }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, e.target.value, item.stock)}
                  style={{ width: '50px', textAlign: 'center' }}
                />
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)}
                  style={{ padding: '2px 8px' }}
                >
                  +
                </button>
              </div>

              <div>R$ {(item.price * item.quantity).toFixed(2)}</div>

              <button 
                onClick={() => removeFromCart(item.id)}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px'
                }}
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        {/* Novo componente de checkout integrado */}
        <div className="cart-checkout" style={{
          borderTop: '2px solid #34495e',
          marginTop: 'auto',
          paddingTop: '1rem',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3>Total: R$ {total.toFixed(2)}</h3>
            {change > 0 && (
              <h3 style={{ color: '#2ecc71' }}>
                Troco: R$ {change.toFixed(2)}
              </h3>
            )}
          </div>

          <form onSubmit={handleCheckout} style={{
            display: 'flex',
            gap: '1rem'
          }}>
            <input
              type="number"
              value={payment}
              onChange={(e) => setPayment(Number(e.target.value))}
              placeholder="Valor pago"
              step="0.01"
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #34495e'
              }}
            />
            <button 
              type="submit"
              style={{
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              disabled={cart.length === 0}
            >
              Finalizar Venda
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Cart;
