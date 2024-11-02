import React, { useState, useEffect } from 'react';
import { getResources } from '../services/authService';

const ExportReports = () => {
  const [hasReports, setHasReports] = useState(false);

  useEffect(() => {
    // Função para verificar se os relatórios estão disponíveis
    const checkReports = async () => {
      try {
        const result = await getResources('/api/check-reports'); // Usa getResource
        setHasReports(result.reportsAvailable); // true ou false
      } catch (error) {
        console.error('Erro ao verificar os relatórios:', error);
        setHasReports(false); // Em caso de erro, desabilita os botões
      }
    };

    checkReports();
  }, []);

  const exportToCSV = async () => {
    if (!hasReports) return; // Não faz nada se não houver relatórios
    try {
      const data = await getResources('/api/export-reports?format=csv'); // Usa getResource
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio.csv';
      a.click();
    } catch (error) {
      console.error('Erro ao exportar relatório como CSV:', error);
    }
  };

  const exportToPDF = async () => {
    if (!hasReports) return; // Não faz nada se não houver relatórios
    try {
      const data = await getResources('/api/export-reports?format=pdf'); // Usa getResource
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio.pdf';
      a.click();
    } catch (error) {
      console.error('Erro ao exportar relatório como PDF:', error);
    }
  };

  return (
    <div className="export-reports">
      <h2>Exportar Relatórios</h2>
      {hasReports ? (
        <>
          <button onClick={exportToCSV}>Exportar como CSV</button>
          <button onClick={exportToPDF}>Exportar como PDF</button>
        </>
      ) : (
        <p>Nenhum relatório disponível para exportação.</p>
      )}
    </div>
  );
};

export default ExportReports;
