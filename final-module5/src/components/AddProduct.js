import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = ({ products, setProducts }) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const initialValues = {
        code: '',
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
        dateAdded: '',
    };

    const validationSchema = Yup.object({
        code: Yup.string()
            .matches(/^PROD-\d{4}$/, 'Mã sản phẩm không hợp lệ')
            .required('Bắt buộc'),
        name: Yup.string()
            .max(100, 'Tên sản phẩm không dài quá 100 ký tự')
            .required('Bắt buộc'),
        category: Yup.string().required('Bắt buộc'),
        dateAdded: Yup.date()
            .max(new Date(), 'Ngày không được lớn hơn ngày hiện tại')
            .required('Bắt buộc'),
        quantity: Yup.number()
            .min(1, 'Số lượng phải lớn hơn 0')
            .required('Bắt buộc'),
        price: Yup.number().required('Bắt buộc'),
    });

    const handleSubmit = (values, { resetForm }) => {
        const newProduct = { id: products.length + 1, ...values };
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        resetForm();
        setSuccessMessage('Sản phẩm đã được thêm thành công!');
        setTimeout(() => {
            setSuccessMessage('');
            navigate('/');
        }, 3000);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/db.json');
                setCategories(response.data.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Thêm Sản Phẩm</h2>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="form-group mb-3">
                            <label htmlFor="code">Mã Sản Phẩm</label>
                            <Field name="code" className="form-control" />
                            <ErrorMessage name="code" component="div" className="text-danger" />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="name">Tên Sản Phẩm</label>
                            <Field name="name" className="form-control" />
                            <ErrorMessage name="name" component="div" className="text-danger" />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="category">Thể Loại</label>
                            <Field name="category" as="select" className="form-control">
                                <option value="">Chọn thể loại</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="category" component="div" className="text-danger" />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="price">Giá</label>
                            <Field name="price" type="number" className="form-control" />
                            <ErrorMessage name="price" component="div" className="text-danger" />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="quantity">Số Lượng</label>
                            <Field name="quantity" type="number" className="form-control" />
                            <ErrorMessage name="quantity" component="div" className="text-danger" />
                        </div>

                        <div className="form-group mb-4">
                            <label htmlFor="dateAdded">Ngày Nhập Sản Phẩm</label>
                            <Field name="dateAdded" type="date" className="form-control" />
                            <ErrorMessage name="dateAdded" component="div" className="text-danger" />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="description">Mô Tả Sản Phẩm</label>
                            <Field name="description" component="textarea" className="form-control" rows="3" />
                        </div>

                        <div className="d-flex" style={{ alignItems: 'center' }}>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang thêm...' : 'Thêm Sản Phẩm'}
                            </button>
                            <button type="button" className="btn btn-secondary" style={{ marginLeft: '10px' }} onClick={() => navigate('/')}>
                                Huỷ
                            </button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddProduct;
