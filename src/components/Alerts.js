import React, { useEffect, useState } from 'react';
import { getResources } from '../services/authService';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  const fetchData = async (url, setData) => {
    try {
      const data = await getResources(url); // Utilize getResources para obter os dados
      setData(data);
    } catch (error) {
      console.error(`Erro ao buscar dados de ${url}:`, error);
    }
  };

  
  useEffect(() => {
    fetchData('api/notifications', setAlerts); // Chama a função fetchData com a URL e o setter de estado
  }, []);
  

  return (
    <div className="alerts">
      <h2>Alertas</h2>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>{alert.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;
