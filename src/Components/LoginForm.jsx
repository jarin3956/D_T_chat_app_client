import React,{useState} from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { axiosinstance } from '../Axios/Axios';
import 'react-toastify/dist/ReactToastify.css';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        try {

            const userData = {
                email: formData.email,
                password: formData.password
            };

            const res = await axiosinstance.post('login', userData);
            setFormData({
                email: '',
                password: ''
            });

            if (res.status === 200) {
                toast.success('Login successful');
                localStorage.setItem('dtoken', res.data.user);
                navigate('/home');
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
        <ToastContainer/>
        <form className="l-form" onSubmit={handleSubmit} >
            <div className="l-title">Welcome,<br /><span>sign in to continue</span></div>
            <input className="l-input" name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} />
            <input className="l-input" name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} />
            <button className="l-button-confirm">Let's go →</button>
            <p className='theLink' onClick={() => navigate('/')}>Need to Register?</p>
        </form>
        </>
        
    )
}

export default LoginForm