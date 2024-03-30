import React, { useEffect, useState } from 'react';
import Card from '../Components/Card';
import { createInstance } from '../Axios/Axios';
import { toast, ToastContainer } from 'react-toastify';
import { useSocket } from '../Socket/SocketProvider';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {

    const [users, setUsers] = useState([]);
    const [reloadPage, setReloadPage] = useState(false);
    

    const socket = useSocket();
    const navigate = useNavigate();

    const getFriends = async () => {
        try {
            let res = await createInstance().get('/newfriends');
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

    let theId = '';
    let theName = '';

    const profileData = async () => {
        try {
            let res = await createInstance().get('/profile');
            if (res.status === 200) {
                socket.emit('set-up', res.data.user._id);
                theId = res.data.user._id;
                theName = res.data.user.name;
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

    useEffect(() => {
        getFriends();
        socket.on('groupChatStarted', ({ chatRoomId, iUser }) => {
            console.log("Received groupChatStarted event. Chat room id:", chatRoomId);
            Swal.fire({
                title: `You are invited to a group chat by ${iUser} !`,
                text: `Do you want to join the chat room ${chatRoomId}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, join chat',
                cancelButtonText: 'No, thanks'
            }).then((result) => {
                if (result.isConfirmed) {
                    if (theId, theName) {
                        socket.emit('usr-joined-chat', { theId, theName, chatRoomId });
                        navigate(`/chat-room/${chatRoomId}`);
                    }
                } else {
                    if (theId, theName) {
                        socket.emit('usr-rej-chat', { theId, theName, chatRoomId });
                    }
                }
            });
        });

        return () => {
            socket.off('groupChatStarted');
        };
    }, [reloadPage, socket, navigate]);


    return (
        <>
            <ToastContainer />
            <div className='h-header'>
                <h2>Find More Friends</h2>
            </div>
            <div className='h-area'>
                {users.length === 0 ? (
                    <h4 className='text-center'>No new users found</h4>
                ) : (
                    <div className='row card-area'>
                        {users.map((user) => (
                            <div key={user._id} className="col-lg-3 col-md-6 col-sm-12 card-space">
                                <Card user={user} setReloadPage={setReloadPage} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default Home