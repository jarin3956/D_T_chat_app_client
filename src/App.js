import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CheckUser from './Auth/CheckUser';
import RequireUser from './Auth/RequireUser';
import NavBar from './Components/NavBar';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Chat from './Pages/Chat';

function App() {
  return (
    

    <BrowserRouter>
    <NavBar/>
      <Routes>

        <Route element={<CheckUser />}>
          <Route path="" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<RequireUser />} >
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
        </Route>

      </Routes>
    </BrowserRouter>


  );
}

export default App;
