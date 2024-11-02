// frontend/src/components/PermissionsManager.js
import React, { useEffect, useState } from 'react';
import { getResources } from '../services/authService';

const PermissionsManager = () => {
    const [permissions, setPermissions] = useState([]); // Inicializa como um array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPermissions = async () => {
            setLoading(true); // Inicia o loading
            try {
              const data = await getResources('/api/permissions'); // Usa getResource
              setPermissions(data); // Define os dados recebidos
            } catch (err) {
              setError(err.message); // Captura o erro
            } finally {
              setLoading(false); // Atualiza o estado de loading
            }
          };
          

        fetchPermissions();
    }, []);

    if (loading) return <div>Carregando...</div>; // Mensagem de carregamento
    if (error) return <div>Erro: {error}</div>; // Mensagem de erro

    return (
        <div>
            <h2>Gerenciamento de Permissões</h2>
            <ul>
                {permissions.map((permission) => (
                    <li key={permission.id}>{permission.name}</li> // Acesse a propriedade correta aqui
                ))}
            </ul>
        </div>
    );
};

export default PermissionsManager;
