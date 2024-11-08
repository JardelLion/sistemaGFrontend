import React, { useState, useEffect } from 'react';
import { getResources } from '../services/authService';

const ExportReports = () => {
  const [hasSalesData, setHasSalesData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSalesData = async () => {
      try {
        const result = await getResources('/api/check-daily-sales'); // Verifica dados de vendas diárias
        setHasSalesData(result.salesAvailable); // true se houver vendas diárias
      } catch (error) {
        console.error('Erro ao verificar os dados de vendas:', error);
        setHasSalesData(false);
      } finally {
        setLoading(false); // Conclui o carregamento
      }
    };

    checkSalesData();
  }, []);

  const downloadFile = (data, filename) => {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToCSV = async () => {
    if (!hasSalesData) return;
    try {
      const data = await getResources('/api/export-daily-sales?format=csv', { responseType: 'blob' });
      downloadFile(data, 'relatorio_vendas_diarias.csv');
    } catch (error) {
      console.error('Erro ao exportar relatório como CSV:', error);
    }
  };

  const exportToPDF = async () => {
    if (!hasSalesData) return;
    try {
      const data = await getResources('/api/export-daily-sales?format=pdf', { responseType: 'blob' });
      downloadFile(data, 'relatorio_vendas_diarias.pdf');
    } catch (error) {
      console.error('Erro ao exportar relatório como PDF:', error);
    }
  };

  return (
    <div className="export-reports">
      <h2>Exportar Relatórios de Vendas Diárias</h2>
      {loading ? (
        <p>Verificando disponibilidade de dados de vendas...</p>
      ) : hasSalesData ? (
        <>
          <button onClick={exportToCSV}>Exportar Vendas como CSV</button>
          <button onClick={exportToPDF}>Exportar Vendas como PDF</button>
        </>
      ) : (
        <p>Nenhum dado de vendas disponível para exportação hoje.</p>
      )}
    </div>
  );
};

export default ExportReports;
