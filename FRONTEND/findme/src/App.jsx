import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './component/home';
import Login from './component/login';
import Register from './component/register';
import UserDashboard from './component/userDashboard';
import AddItem from './component/addItem';
import EditItem from './component/editItem';
import Chat from './component/chat';
import Chats from './component/chats';
import AdminDashboard from './component/adminDashboard';


import './App.css'

function App() {


  return (
   <>
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
   <Route path="/dashboard" element={<UserDashboard />} />
<Route path="/add-item" element={<AddItem />} />
<Route path="/edit-item/:id" element={<EditItem />} />
<Route path="/chat/:chatId" element={<Chat />} />
<Route path="/chats" element={<Chats />} />
<Route path="/admin" element={<AdminDashboard />} />

   </Routes>
   </>
  )
}

export default App
