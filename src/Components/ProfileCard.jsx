import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { createInstance } from '../Axios/Axios';
import './ProfileCard.css';
import { useNavigate } from 'react-router-dom';

function ProfileCard() {

    const navigate = useNavigate()

    const [user, setUser] = useState('');

    const profileData = async () => {
        try {
            let res = await createInstance().get('/profile');
            if (res.status === 200) {
                console.log('profile data',res.data.user);
                setUser(res.data.user);
            } else {
                toast.error('Cannot find users, Please try after sometime.')
            }
        } catch (error) {
            let es = error.response.status;
            if (es === 400 || es === 401 || es === 404 || es === 403 || es === 500) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Login failed. Please try again.');
            }
        }
    }

    useEffect(() => {
        profileData()
    },[])
    return (
        <>
            <ToastContainer />
            <div className="pro-card">
                <div className="pro-card-img"><div className="img"><img src="/logo192.png" alt="Logo" /></div></div>
                <div className="pro-card-name">{user.name}</div>
                <div className="pro-card-sh">{user.email}</div>
                <div className="pro-card-sh">age: {user.age}</div>
                <div className="pro-card-footer">
                    <button className="pro-card-btn" onClick={() => navigate('/chat')}>
                        Create Chat
                    </button>
                </div>
            </div>
        </>
    )
}

export default ProfileCard