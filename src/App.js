import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import EmployeeDashboard from './components/EmployeeDashboard';
import SalesStats from './components/SalesStats';
import EmployeeList from './components/EmployeeList';
import ProductList from './components/ProductList';
import FinancialReport from './components/FinancialReport';
import Alerts from './components/Alerts';
import ActivityLog from './components/ActivityLog';
import EmployeeSalesHistory from './components/EmployeeSalesHistory';
import ExportReports from './components/ExportReports';
import PermissionsManager from './components/PermissionsManager';
import StockManager from './components/StockManager';
import EmployeeDataTable from './components/EmployeeDataTable';
import StockTable from './components/StockTable';
import SalesHistory from './components/SalesHistory';

const App = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        // Verifica se o usuário está logado e tem um papel no localStorage
        const role = localStorage.getItem('role');
        if (!role) {
            // Redireciona para a página de login se não houver papel no localStorage
            window.location.href = '/';
        }
    }, []);

    const handleAdd = (newEmployee) => {
        setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    };

    const handleEdit = (updatedEmployee) => {
        setEmployees((prevEmployees) =>
            prevEmployees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
        );
    };

    const handleDelete = (id) => {
        setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== id));
    };

    // Componente de proteção de rota
    const ProtectedRoute = ({ children, roleRequired }) => {
        const userRole = localStorage.getItem('role');

        if (userRole !== roleRequired) {
            return <Navigate to="/" />;
        }

        return children;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                
                {/* Rota protegida para o admin */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute roleRequired="admin">
                            <DashboardAdmin />
                        </ProtectedRoute>
                    }
                />
                
                {/* Rota protegida para o employee */}
                <Route
                    path="/employee-dashboard"
                    element={
                        <ProtectedRoute roleRequired="employee">
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Outras rotas */}
                <Route path="/sales-stats" element={
                    <ProtectedRoute roleRequired={'admin'}>

                        <SalesStats />
                    </ProtectedRoute>
                }

                />
                    
                <Route path="/employee-list" element={
                    <ProtectedRoute roleRequired={'employee'}>

                        <EmployeeList />

                    </ProtectedRoute>}
                />

                <Route path="/product-list" element={
                    <ProtectedRoute roleRequired={'admin'}>

                        <ProductList />
                    </ProtectedRoute>
                
                } 
                    
                />

                <Route path="/financial-report" element={
                    <ProtectedRoute roleRequired={"admin"}>

                        <FinancialReport />
                    </ProtectedRoute>
                
                    } 
                    
                />

                <Route path="/alerts" element={
                    <ProtectedRoute roleRequired={'admin'}>

                        <Alerts />
                    </ProtectedRoute>
                
                }

                />

                <Route path="/activity-log" element={
                    <ProtectedRoute roleRequired={"admin"}>

                        <ActivityLog />
                    </ProtectedRoute>
                }
                />


                <Route path="/employee-sales-history" element={
                    <ProtectedRoute roleRequired={'admin'}>

                        <EmployeeSalesHistory />
                    </ProtectedRoute>
                    }
                />

                <Route path="/export-reports" element={
                    <ProtectedRoute roleRequired={'admin'}>

                        <ExportReports />
                    </ProtectedRoute>
                } 
                
                />

                <Route path="/permissions-manager" element={
                    <ProtectedRoute roleRequired={'admin'}>

                        <PermissionsManager />
                    </ProtectedRoute>
                } 
                />

                <Route path="/stock-manager" element={
                    <ProtectedRoute roleRequired={'admin'}>

                        <StockManager />
                    </ProtectedRoute>
                    
                    } 
                />

                <Route path="/stock-table" element={
                    <ProtectedRoute roleRequired={'employee'}>

                        <StockTable />
                    </ProtectedRoute>
                } 
                />

                <Route path="/vendas-pessoais" element={
                    <ProtectedRoute roleRequired={'employee'}>

                        <SalesHistory />
                    </ProtectedRoute>
                }
                />
                
                <Route
                    path="/employee-data-table"
                    element={
                        <ProtectedRoute roleRequired="admin">
                            <EmployeeDataTable 
                                employees={employees}
                                onEdit={handleEdit} 
                                onDelete={handleDelete} 
                                onAdd={handleAdd} 
                            />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
