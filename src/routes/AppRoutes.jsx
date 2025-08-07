import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import AllProducts from '../pages/AllProducts';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout'; // Add this import

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<AllProducts />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} /> {/* Add this route */}
      
      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
