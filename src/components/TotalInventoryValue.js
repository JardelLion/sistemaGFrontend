import React, { useEffect, useState } from 'react';
import { getResources } from '../services/authService';

const TotalInventoryValue = () => {
  const [totalValue, setTotalValue] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

    // Função para buscar o valor total do estoque
  const fetchTotalInventoryValue = async () => {
    try {
      const data = await getResources(`api/total-product-value`); // Use getResources para buscar os dados
      setTotalValue(data.total_stock_value); // Define o valor total do estoque
    } catch (error) {
      console.error('Erro ao buscar o valor total do estoque:', error);
      setError('Não foi possível carregar o valor total do estoque.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalInventoryValue();
  }, []);


  return (
    <div className="total-inventory-value">
      <h2>Valor Total da Mercadoria</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <p>Total: {totalValue} MT</p>
    </div>
  );
};

export default TotalInventoryValue;
