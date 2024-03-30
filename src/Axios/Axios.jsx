import axios from 'axios';

// const baseURL = 'http://localhost:3001/';
const baseURL = 'https://d-t-chat-app-server.onrender.com/';
const axiosinstance = axios.create({
    baseURL: baseURL,
});

const createInstance = () => {
    const token = localStorage.getItem('dtoken')
    const instance = axios.create({
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
    return instance;
}

export { createInstance, axiosinstance };