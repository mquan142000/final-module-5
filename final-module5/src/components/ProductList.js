import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductList = ({ products }) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/db.json');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching the categories", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredProducts = products.filter(product => {
      const matchesName = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      return matchesName && matchesCategory;
    });

    const sorted = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    setSortedProducts(sorted);
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">TIT Pharmacy</h2>
      <Link to="/add" className="btn btn-primary mb-3">Thêm sản phẩm mới</Link>

      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo tên sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Tất cả thể loại</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>STT</th>
              <th>Mã sản phẩm</th>
              <th>Tên sản phẩm</th>
              <th>Thể loại</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Ngày nhập sản phẩm</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.code}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>{product.price.toLocaleString()}</td>
                <td>{new Date(product.dateAdded).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
