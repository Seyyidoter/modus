import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { MainLayout } from './layouts/MainLayout';
import { ProductsPage } from './pages/ProductsPage';
import { StockPage } from './pages/StockPage';
import { MovementsPage } from './pages/MovementsPage';
import { CustomersPage } from './pages/CustomersPage';
import { DemandsPage } from './pages/DemandsPage';
import { OffersPage } from './pages/OffersPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UsersPage } from './pages/UsersPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 4,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="stock" element={<StockPage />} />
                <Route path="movements" element={<MovementsPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="demands" element={<DemandsPage />} />
                <Route path="offers" element={<OffersPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
