export const printReceipt = (saleData) => {
  const receiptContent = `
    ================ RECIBO ================
    Data: ${new Date(saleData.date).toLocaleString()}
    
    ITENS:
    ${saleData.items.map(item => 
      `${item.name}
       ${item.quantity}x R$ ${item.price.toFixed(2)} = R$ ${(item.quantity * item.price).toFixed(2)}`
    ).join('\n')}
    
    Total: R$ ${saleData.total.toFixed(2)}
    Pago: R$ ${saleData.payment.toFixed(2)}
    Troco: R$ ${saleData.change.toFixed(2)}
    ======================================
  `;

  const printWindow = window.open('', '', 'width=600,height=600');
  printWindow.document.write(`
    <pre style="font-family: monospace;">
      ${receiptContent}
    </pre>
  `);
  printWindow.print();
  printWindow.close();
};
