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
    const [userUpdate, setUserUpdate] = useState(false);
    const [typing, setTyping] = useState('');

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
        socket.emit('join-chat', roomId);
        socket.on('user-entered', handleUserEntered);
        socket.on('user-rejected', handleUserReject);
        socket.on('chat-history', handleChatHistory);
        socket.on('new-msg', handleNewMsg);
        socket.on('user-typing', handleTyping);
        socket.on('usr-st-typing', handleUsrStopTyping);
        socket.on('usr-offline', handleUserOffline);
        return () => {
            socket.off('user-entered', handleUserEntered);
            socket.off('user-rejected', handleUserReject);
            socket.off('chat-history', handleChatHistory);
            socket.off('new-msg', handleNewMsg);
            socket.off('user-typing', handleTyping);
            socket.off('usr-st-typing', handleUsrStopTyping);
            socket.off('usr-offline', handleUserOffline);
        };
    }, [roomId, socket, messages, typing]);


    const handleUserEntered = (theName) => {
        if (!userUpdate) {
            toast.success(`${theName} joined the chat`);
            setUserUpdate(true);
        }
    };

    const handleUserReject = (theName) => {
        if (!userUpdate) {
            toast.error(`${theName} rejected the chat`);
            setUserUpdate(true);
        }
    };

    const handleChatHistory = (history) => {
        setMessages(history);
    };

    const handleNewMsg = (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
    };

    const sendMsg = () => {
        if (userName && msg.length > 0) {
            socket.emit('send-msg', { msg, roomId, userName });
            setMsg('');
            socket.emit('stop-typing',roomId);
        } else {
            toast.error('Type anything');
        }
    };

    const handleTypingIndicator = () => {
        socket.emit('typing', { roomId, tUser: userName });
    };

    const handleTyping = (tUser) => {
        if (tUser!==userName) {
            setTyping(`${tUser} is Typing ...`);   
        }
    };

    const handleUsrStopTyping = () => {
        setTyping(false);
    }

    const closeChat = () => {
        socket.emit('disconnect-chat',{roomId,dUser:userName});
        navigate('/home');
    };

    const handleUserOffline = (dUser) => {
        toast.info(`${dUser} left the chat`)
    };

    return (
        <>
            <ToastContainer />
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((message, i) => (
                        <div key={i} className='single-msg'>
                            <p className="message-head">{message.userName === userName ? 'ME' : message.userName}</p>
                            <p className="message-user">{message.message}</p>
                        </div>
                    ))}
                    {typing && <p className="typing-indicator">{typing}</p>}
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        onKeyUp={handleTypingIndicator} 
                    />
                    <button className='ch-sta' onClick={sendMsg}>Send</button>
                    <button className='ch-sto' onClick={closeChat}>Close Chat</button>
                </div>
            </div>
        </>
    );
}

export default ChatRoom;


