import React, { useEffect, useState } from 'react';
import Card from '../Components/Card';
import { createInstance } from '../Axios/Axios';
import { toast, ToastContainer } from 'react-toastify';
import { useSocket } from '../Socket/SocketProvider';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

function Home() {

    const [users, setUsers] = useState([]);
    const [reloadPage, setReloadPage] = useState(false);

    const socket = useSocket();

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

    // useEffect(() => {
    //     getFriends();
    //     socket.on('groupChatStarted', ({ chatRoomId }) => { 
    //         console.log("Chat room id :", chatRoomId);
    //         alert("Chat room id : " + chatRoomId);
    //     });
    // }, [reloadPage,socket])

    useEffect(() => {
        getFriends();
        socket.on('groupChatStarted', ({ chatRoomId }) => {
            Swal.fire({
                title: 'You are invited to a group chat!',
                text: `Do you want to join the chat room ${chatRoomId}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, join chat',
                cancelButtonText: 'No, thanks'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/chat-room/${chatRoomId}`);
                } else {
                    console.log('User declined the invitation');
                }
            });
        })
    }, [reloadPage, socket]);

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