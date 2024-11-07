import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Loading from '../components/Loading'; // Componente de loading
import { authenticate } from '../services/authService'; // Função de autenticação

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' }); // Usando um estado para os campos
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            // Tenta autenticar
            const [accessToken, refreshToken, role, employeeId] = await authenticate(formData.username, formData.password);
            
            if (accessToken && refreshToken) {
                // Armazenar os tokens no localStorage
                localStorage.setItem('access', accessToken);
                localStorage.setItem('refresh', refreshToken);
                localStorage.setItem('employee_id', employeeId);
                localStorage.setItem('role', role);

                // Navegar para a dashboard com base no papel do usuário
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
            setLoading(false);
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
                                name="username"
                                placeholder="Usuário"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            <span className="input-icon">👤</span>
                        </div>
                        <div className="input-container">
                            <input
                                type="password"
                                name="password"
                                placeholder="Senha"
                                value={formData.password}
                                onChange={handleChange}
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
