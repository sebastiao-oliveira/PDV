import React, { useState, useEffect } from 'react';
import { printReceipt } from '../utils/receiptPrinter';

function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [dateFilter, setDateFilter] = useState('today');

  useEffect(() => {
    loadSales();
  }, [dateFilter]);

  const loadSales = () => {
    const savedSales = JSON.parse(localStorage.getItem('sales')) || [];
    const today = new Date().setHours(0, 0, 0, 0);
    
    const filteredSales = savedSales.filter(sale => {
      const saleDate = new Date(sale.date).setHours(0, 0, 0, 0);
      switch(dateFilter) {
        case 'today':
          return saleDate === today;
        case 'week':
          return saleDate >= today - 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return saleDate >= today - 30 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });

    setSales(filteredSales);
  };

  const getTotalRevenue = () => {
    return sales.reduce((sum, sale) => sum + sale.total, 0);
  };

  return (
    <div className="sales-history">
      <div className="filters">
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="today">Hoje</option>
          <option value="week">Última Semana</option>
          <option value="month">Último Mês</option>
          <option value="all">Todo Período</option>
        </select>
      </div>

      <div className="summary">
        <h3>Total de Vendas: {sales.length}</h3>
        <h3>Receita Total: R$ {getTotalRevenue().toFixed(2)}</h3>
      </div>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Itens</th>
            <th>Total</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale.id}>
              <td>{new Date(sale.date).toLocaleString()}</td>
              <td>{sale.items.length} itens</td>
              <td>R$ {sale.total.toFixed(2)}</td>
              <td>
                <button onClick={() => printReceipt(sale)}>
                  Reimprimir Recibo
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesHistory;
