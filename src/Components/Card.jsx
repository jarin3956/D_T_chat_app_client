import React from 'react';
import { createInstance } from '../Axios/Axios';
import { toast, ToastContainer } from 'react-toastify';
import './Card.css';


function Card({ user, setReloadPage, page }) {


    const addFriend = async (uId, uName) => {
        try {
            let res = await createInstance().post('/add-friend', {
                friendId: uId,
                friendName: uName
            });
            console.log(res);
            if (res.status === 200) {
                toast.success(res.data.message);
                setReloadPage(prevState => !prevState);
            } else {
                toast.error('Cannot add friend now, Please try after sometime.');
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
    return (
        <>
            <ToastContainer />
            <div className="card">
                <div className="card-img"><div className="img"><img src="/logo192.png" alt="Logo" /></div></div>
                <div className="card-name">{user.name}</div>
                <div className="card-email">{user.email}</div>
                <div className="card-footer">
                    <button className="card-btn" onClick={() => addFriend(user._id, user.name)}>
                        Add Friend
                    </button>
                </div>
            </div>
        </>

    )
}

export default Card