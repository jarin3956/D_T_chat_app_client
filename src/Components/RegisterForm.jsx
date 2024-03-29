import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { axiosinstance } from '../Axios/Axios';
import 'react-toastify/dist/ReactToastify.css';
import './RegisterForm.css';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        email: '',
        password: '',
        repassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        for (const key in formData) {
            if (!formData[key]) {
                toast.error('Please fill in all fields');
                return;
            }
        }

        const nameRegex = /^.{5,}$/; 
        const ageRegex = /^(?:10[0]|1[1-9]|[2-9][0-9])$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        const passwordRegex = /^.{6,}$/; 

        if (!nameRegex.test(formData.name)) {
            toast.error('Name must be at least 5 characters');
            return;
        }
        if (!ageRegex.test(formData.age)) {
            toast.error('Age must be between 10 and 100');
            return;
        }
        if (!emailRegex.test(formData.email)) {
            toast.error('Invalid email address');
            return;
        }
        if (!passwordRegex.test(formData.password)) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.repassword) {
            toast.error("Passwords don't match");
            return;
        }

        try {

            const userData = {
                name: formData.name,
                age: formData.age,
                email: formData.email,
                password: formData.password,
            };

            const res = await axiosinstance.post('register', userData);
            setFormData({
                name: '',
                age: '',
                email: '',
                password: '',
                repassword: ''
            });

            if (res.status === 200) {
                toast.success('Registration successful');
                navigate('/login')
            }
        } catch (error) {
            let es = error.response.status;
            if (es === 400 || es === 401 || es === 404 || es === 403 || es === 500) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Login failed. Please try again.');
            }
        }
    };


    return (

        <>
            <ToastContainer />
            <form className="r-form" onSubmit={handleSubmit}>
                <div className="r-title">Welcome,<br /><span>sign up to continue</span></div>
                <input className="r-input" name="name" placeholder="Enter Name" type="text" value={formData.name} onChange={handleChange} />
                <input className="r-input" name="age" placeholder="Enter Age" type="number" value={formData.age} onChange={handleChange} />
                <input className="r-input" name="email" placeholder="Enter Email" type="email" value={formData.email} onChange={handleChange} />
                <input className="r-input" name="password" placeholder="Enter Password" type="password" value={formData.password} onChange={handleChange} />
                <input className="r-input" name="repassword" placeholder="Repeat Password" type="password" value={formData.repassword} onChange={handleChange} />
                <button className="r-button-confirm">Register →</button>
                <p className='theLink' onClick={() => navigate('/login')}>Need to Login?</p>
            </form>
        </>
    )
}

export default RegisterForm