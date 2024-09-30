import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/db.json'); 
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching the products", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<ProductList products={products} />} 
        />
        <Route 
          path="/add" 
          element={<AddProduct products={products} setProducts={setProducts} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
