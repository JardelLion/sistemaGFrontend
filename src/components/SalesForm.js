import React, { useState } from 'react';
import { getResources } from '../services/authService';

const SalesForm = ({ products, token }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se um produto foi selecionado
    if (!selectedProduct) {
      alert('Por favor, selecione um produto.');
      return;
    }

    const sale = {
      product_id: selectedProduct,
      quantity,
    };

    try {
      // Faz a requisição para adicionar o produto ao carrinho
      const data = await getResources('api/cart/add', 'POST', sale);

       // Verifica se a resposta contém um erro
       if (data.error) {
        throw new Error(data.error || 'Erro desconhecido ao adicionar ao carrinho');
      }
      
      // Resetar o formulário
      setSelectedProduct('');
      setQuantity(1);

       setInterval(function(){
           window.location.reload();
          }, 1000);
      
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert(`Erro ao adicionar ao carrinho: ${error.message}`);
    }
};

  // Verifica se 'products' é uma lista válida antes de tentar mapear
  if (!Array.isArray(products)) {
    return <div>Erro: Lista de produtos não disponível.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="sales-form">
      <label htmlFor="product">Produto:</label>
      <select
        id="product"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        <option value="">Selecione um produto</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>

      <label htmlFor="quantity">Quantidade:</label>
      <input
        type="number"
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
      />

      <button type="submit">Adicionar ao Carrinho</button>
    </form>
  );
};

export default SalesForm;
