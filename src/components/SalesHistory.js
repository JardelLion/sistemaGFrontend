import React from 'react';

const SalesHistory = ({ salesData }) => {
    // Verifique se salesData e salesData.sales estão disponíveis
    if (!salesData || !salesData.sales || salesData.sales.length === 0) {
        return <p>Nenhuma venda registrada.</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Data</th>
                </tr>
            </thead>
            <tbody>
                {salesData.sales.map((sale) => (
                    <tr key={sale.id}>
                        <td>{sale.product_name}</td>
                        <td>{sale.total_quantity}</td>
                        <td>{sale.date}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SalesHistory;
