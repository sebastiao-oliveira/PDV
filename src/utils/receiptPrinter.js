export const generateReceiptContent = (sale) => {
  return `
    ===============================
    COMPROVANTE DE VENDA
    ===============================
    Data: ${new Date(sale.date).toLocaleString()}
    
    ITENS:
    ${sale.items.map(item => `
    ${item.name}
    ${item.quantity}x R$ ${item.price.toFixed(2)} = R$ ${(item.quantity * item.price).toFixed(2)}
    `).join('\n')}
    -------------------------------
    Total: R$ ${sale.total.toFixed(2)}
    
    Forma de Pagamento: ${formatPaymentMethod(sale.paymentMethod)}
    ${sale.paymentMethod === 'dinheiro' ? `
    Valor Pago: R$ ${sale.payment.toFixed(2)}
    Troco: R$ ${sale.change.toFixed(2)}` : ''}
    ===============================
  `;
};

export const viewReceipt = (sale) => {
  const content = generateReceiptContent(sale);
  const viewWindow = window.open('', '_blank');
  viewWindow.document.write(`
    <html>
      <head>
        <title>Visualizar Comprovante</title>
        <style>
          body {
            font-family: monospace;
            white-space: pre;
            padding: 20px;
          }
          .actions {
            position: fixed;
            top: 10px;
            right: 10px;
          }
          button {
            padding: 8px 16px;
            margin-left: 8px;
          }
          @media print {
            .actions { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="actions">
          <button onclick="window.print()">Imprimir</button>
          <button onclick="window.close()">Fechar</button>
        </div>
        ${content}
      </body>
    </html>
  `);
  viewWindow.document.close();
};

export const printReceipt = (sale) => {
  const content = generateReceiptContent(sale);
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Comprovante de Venda</title>
        <style>
          body {
            font-family: monospace;
            white-space: pre;
            padding: 20px;
          }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

const formatPaymentMethod = (method) => {
  const methods = {
    'dinheiro': 'Dinheiro',
    'pix': 'PIX',
    'cartao_credito': 'Cartão de Crédito',
    'cartao_debito': 'Cartão de Débito'
  };
  return methods[method] || method;
};
