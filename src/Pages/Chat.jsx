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
    const [iUser, setIUser] = useState('');
    const [iUserId, setIUserId] = useState('');

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

    const profileData = async () => {
        try {
            let res = await createInstance().get('/profile');
            if (res.status === 200) {
                console.log('profile data', res.data.user);
                socket.emit('set-up', res.data.user._id);
                setIUser(res.data.user.name);
                setIUserId(res.data.user._id)
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
        findFriends()
    }, []);


    const addToChat = async (uId) => {
        try {
            setFriendIds([...friendIds, uId]);
            socket.emit('addFriendToChat', { friendId: uId });
            toast.success('Friend added to chat')
        } catch (error) {
            toast.error('Error adding friend to chat')
        }
    }

    const startGroupChat = async () => {
        if (friendIds.length > 0) {
            console.log('Main user name', iUser);
            socket.emit('startGroupChat', { friendIds, iUser, iUserId });
            socket.on('groupChatStarted', ({ chatRoomId }) => {
                console.log(chatRoomId, 'room idddd');
                if (chatRoomId) {
                    navigate(`/chat-room/${chatRoomId}`);
                } else {
                    toast.error('There was an error loading chatroom, Please try after sometime.')
                }
            });
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
                                    <div className="ch-card-img"><div><img className="pro-img" src={user.image} alt="Logo" /></div></div>
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
            <div className='c-footer'>
                <button className='start-chat-btn' onClick={startGroupChat} >
                    Start Group Chat
                </button>
            </div>
        </>
    )
}

export default Chat