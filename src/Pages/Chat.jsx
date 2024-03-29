import React, { useState, useEffect } from 'react';
import { createInstance } from '../Axios/Axios';
import { toast, ToastContainer } from 'react-toastify';
import { useSocket } from '../Socket/SocketProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chat.css';
import { useNavigate } from 'react-router-dom';

function Chat() {

    const socket = useSocket();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [friendIds, setFriendIds] = useState([]);

    const findFriends = async () => {
        try {
            let res = await createInstance().get('/friends');
            if (res.status === 200) {
                setUsers(res.data.users);
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
        findFriends()
    }, []);


    const addToChat = async (uId) => {
        try {
            setFriendIds([...friendIds, uId ]);
            socket.emit('addFriendToChat', { friendId: uId });
            toast.success('Friend added to chat')
        } catch (error) {
            toast.error('Error adding friend to chat')
        }
    }

    const startGroupChat = () => {
        if (friendIds.length > 0) {
            toast.success(friendIds);
            socket.emit('startGroupChat', { friendIds });
            navigate('/group-chat');
        } else {
            toast.error('Please add at least one friend to start the group chat.');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className='c-header'>
                <h2>Choose Friends</h2>
            </div>
            <div className='c-area'>
                {users.length === 0 ? (
                    <h4 className='text-center'>No friends found</h4>
                ) : (
                    <div className='row c-card-area'>
                        {users.map((user) => (
                            <div key={user._id} className="col-lg-3 col-md-6 col-sm-12 c-card-space">
                                <div className="ch-card">
                                    <div className="ch-card-img"><div className="img"><img src="/logo192.png" alt="Logo" /></div></div>
                                    <div className="ch-card-name">{user.name}</div>
                                    <div className="ch-card-email">{user.email}</div>
                                    <div className="ch-card-footer">
                                        <button className="card-btn" onClick={() => addToChat(user._id)}>
                                            Add to Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div  className='c-footer'>
            <button className='start-chat-btn' onClick={startGroupChat} >
                Start Group Chat
            </button>
            </div>
        </>
    )
}

export default Chat