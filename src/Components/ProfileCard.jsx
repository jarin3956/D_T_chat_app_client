import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { createInstance } from '../Axios/Axios';
import './ProfileCard.css';
import { useNavigate } from 'react-router-dom';

function ProfileCard() {

    const navigate = useNavigate()

    const [user, setUser] = useState('');
    const [openImgArea, setOpenImageArea] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    const profileData = async () => {
        try {
            let res = await createInstance().get('/profile');
            if (res.status === 200) {
                console.log('profile data', res.data.user);
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
    }, [])

    const openPopUp = () => {
        setOpenImageArea(true);
    }
    const closePopUp = () => {
        setOpenImageArea(false);
    }
    const handleUpdate = async () => {
        if (!selectedAvatar) {
            toast.error('Please select an avatar.');
            return;
        }
        if (selectedAvatar) {
            try {
                let res = await createInstance().post('/avatar', {
                    image: selectedAvatar
                });
                if (res.status === 200){
                    toast.success('Image updated Successfully');
                    closePopUp();
                    profileData();
                } else {
                    toast.error('Avatar cannot be updated now, try after some time.');
                    closePopUp();
                }
                
            } catch (error) {
                let es = error.response.status;
                if (es === 400 || es === 401 || es === 404 || es === 403 || es === 500) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Avatar cannot be updated now');
                }
            }
        }
    };

    return (
        <>
            <ToastContainer />
            {openImgArea ? (
                <div className="pro-card">
                    <h3 className='image-opt-text'>Select Avatar</h3>
                    <div className='image-opt'>
                        <img
                            className={`image-opt-sel ${selectedAvatar === '/avatar-1.jpg' ? 'selected-image' : ''}`}
                            src='/avatar-1.jpg'
                            alt=""
                            onClick={() => setSelectedAvatar('/avatar-1.jpg')}
                        />
                        <img
                            className={`image-opt-sel ${selectedAvatar === '/avatar-2.jpg' ? 'selected-image' : ''}`}
                            src='/avatar-2.jpg'
                            alt=""
                            onClick={() => setSelectedAvatar('/avatar-2.jpg')}
                        />
                    </div>
                    <div className='image-opt'>
                        <img
                            className={`image-opt-sel ${selectedAvatar === '/avatar-3.jpg' ? 'selected-image' : ''}`}
                            src='/avatar-3.jpg'
                            alt=""
                            onClick={() => setSelectedAvatar('/avatar-3.jpg')}
                        />
                        <img
                            className={`image-opt-sel ${selectedAvatar === '/avatar-4.jpg' ? 'selected-image' : ''}`}
                            src='/avatar-4.jpg'
                            alt=""
                            onClick={() => setSelectedAvatar('/avatar-4.jpg')}
                        />
                    </div>
                    <div className='image-opt'>
                        <img
                            className={`image-opt-sel ${selectedAvatar === '/avatar-5.jpg' ? 'selected-image' : ''}`}
                            src='/avatar-5.jpg'
                            alt=""
                            onClick={() => setSelectedAvatar('/avatar-5.jpg')}
                        />
                        <img
                            className={`image-opt-sel ${selectedAvatar === '/avatar-6.jpg' ? 'selected-image' : ''}`}
                            src='/avatar-6.jpg'
                            alt=""
                            onClick={() => setSelectedAvatar('/avatar-6.jpg')}
                        />
                    </div>
                    <div className="pro-card-footer">
                        <button className="pro-card-btn" onClick={handleUpdate} >
                            Update
                        </button>
                        <button className="pro-card-btn" onClick={closePopUp} >
                            close
                        </button>
                    </div>
                </div>
            ) : (
                <div className="pro-card">
                    <div className="pro-card-img"><div><img className='pro-img' src={user.image} alt="Logo" /></div></div>
                    <div className="pro-card-name">{user.name}</div>
                    <div className="pro-card-sh">{user.email}</div>
                    <div className="pro-card-sh">age: {user.age}</div>
                    <div className="pro-card-footer">
                        <button className="pro-card-btn" onClick={openPopUp} >
                            Avatar
                        </button>
                        <button className="pro-card-btn" onClick={() => navigate('/chat')}>
                            Chat
                        </button>
                    </div>
                </div>
            )}

        </>
    )
}

export default ProfileCard