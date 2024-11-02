import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Loading from '../components/Loading'; // Componente de loading
import { authenticate } from '../services/authService'; // Importa a função authenticate

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Estado de loading
    const [errorMessage, setErrorMessage] = useState(''); // Estado para a mensagem de erro
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Ativar o loading
        setErrorMessage(''); // Limpar a mensagem de erro

        try {
            // Faz o login e obtém o token e o refresh token
            const [accessToken, refreshToken, role, employeeId] = await authenticate(username, password);
            
            if (accessToken && refreshToken) {
                // Armazene os tokens no localStorage
                localStorage.setItem('access', accessToken);
                localStorage.setItem('refresh', refreshToken);
                localStorage.setItem("employee_id", employeeId)

                // Navega para o dashboard correspondente
                if (role === 'admin') {
                    navigate('/admin-dashboard');
                } else if (role === 'employee') {
                    navigate('/employee-dashboard');
                }
            } else {
                setErrorMessage('Falha na autenticação. Verifique suas credenciais.');
            }
        } catch (error) {
            setErrorMessage('Erro ao fazer login. Tente novamente mais tarde.');
            console.error('Erro de autenticação:', error);
        } finally {
            setLoading(false); // Desativar o loading
        }
    };

    return (
        <div className="login-container">
            {loading ? (
                <Loading />
            ) : (
                <>
                    <h2 className="login-title">Login</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder="Usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <span className="input-icon">👤</span>
                        </div>
                        <div className="input-container">
                            <input
                                type="password"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="input-icon">🔒</span>
                        </div>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <button type="submit" className="login-button">
                            <span>🔑</span>
                            Entrar
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Login;
