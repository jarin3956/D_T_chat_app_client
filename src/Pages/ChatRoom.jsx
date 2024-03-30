import React, { useEffect, useState } from 'react';
import { useSocket } from '../Socket/SocketProvider';
import { createInstance } from '../Axios/Axios';
import { toast, ToastContainer } from 'react-toastify';
import './ChatRoom.css';
import { useNavigate } from 'react-router-dom';

function ChatRoom() {
    const socket = useSocket();
    const [msg, setMsg] = useState('');
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const url = new URL(window.location.href);
    const roomId = url.pathname.split('/').pop();
    const navigate = useNavigate();

    useEffect(() => {
        const profileData = async () => {
            try {
                let res = await createInstance().get('/profile');
                if (res.status === 200) {
                    setUserName(res.data.user.name);
                } else {
                    toast.error('Cannot find users. Please try again later.');
                }
            } catch (error) {
                toast.error('Error fetching user data. Please try again later.');
            }
        };
        profileData();
    }, []);

    useEffect(() => {
        const handleUserEntered = (theName) => {
            toast.success(`${theName} joined the chat`);
        };
        const handleUserReject = (theName) => {
            toast.error(`${theName} rejected the chat`);
        };
        socket.emit('join-chat', roomId);
        socket.on('user-entered', handleUserEntered);
        socket.on('user-rejected', handleUserReject);
        socket.on('chat-history', (history) => {
            setMessages(history);
        });
        socket.on('new-msg', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });
        return () => {
            socket.off('chat-history');
            socket.off('new-msg');
        };
    }, [roomId, socket, messages]);

    const sendMsg = () => {
        if (userName) {
            socket.emit('send-msg', { msg, roomId, userName });
            setMsg('');
        }
    };

    const closeChat = () => {
        socket.emit('disconnect-chat');
        navigate('/home');
    }

    return (
        <>
            <ToastContainer />
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((message, i) => (
                        <div key={i} className='single-msg'>
                            <p>{message.userName}:</p>
                            <p className="message-user">{message.message}</p>
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} />
                    <button className='ch-sta' onClick={sendMsg}>Send</button>
                    <button className='ch-sto' onClick={closeChat}>Close Chat</button>
                </div>
            </div>
        </>
    );
}

export default ChatRoom;
