import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App = () => {
    const [employees, setEmployees] = useState([]);

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

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin-dashboard" element={<DashboardAdmin />} />
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="/sales-stats" element={<SalesStats />} />
                <Route path="/employee-list" element={<EmployeeList />} />
                <Route path="/product-list" element={<ProductList />} />
                <Route path="/financial-report" element={<FinancialReport />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/activity-log" element={<ActivityLog />} />
                <Route path="/employee-sales-history" element={<EmployeeSalesHistory />} />
                <Route path="/export-reports" element={<ExportReports />} />
                <Route path="/permissions-manager" element={<PermissionsManager />} />
                <Route path="/stock-manager" element={<StockManager />} />
                <Route 
                    path="/employee-data-table" 
                    element={
                        <EmployeeDataTable 
                            employees={employees} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete} 
                            onAdd={handleAdd} 
                        />
                    } 
                />
            </Routes>
        </Router>
    );
};

export default App;
