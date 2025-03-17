import React, { useState } from 'react';
import { viewReceipt } from '../utils/receiptPrinter';

function Checkout({ cart, setCart, updateStock }) {
  const [payment, setPayment] = useState('');
  const [change, setChange] = useState(0);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = (e) => {
    e.preventDefault();
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
      viewReceipt(saleData);
      setCart([]);
      setPayment('');
      setChange(changeAmount);

      alert('Venda finalizada com sucesso!');
    } else {
      alert('Valor insuficiente!');
    }
  };

  return (
    <div className="checkout">
      <h3>Total: R$ {total.toFixed(2)}</h3>
      <form onSubmit={handleCheckout}>
        <input
          type="number"
          value={payment}
          onChange={(e) => setPayment(Number(e.target.value))}
          placeholder="Valor pago"
          step="0.01"
        />
        <button type="submit">Finalizar</button>
      </form>
      {change > 0 && <h3>Troco: R$ {change.toFixed(2)}</h3>}
    </div>
  );
}

export default Checkout;
