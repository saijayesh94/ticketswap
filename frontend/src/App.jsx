import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Success from './pages/Success';
import Dummy from './pages/Dummy';
import ForgetPassword from './pages/ForgetPassword';
import SellPage from './pages/SellPage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={ <HomePage />} />
        <Route path='/success' element={<Success />} />
        <Route path='/forgetpassword' element={<ForgetPassword />} />
        <Route path='/dummy' element={<Dummy />} />
        <Route path='/sell' element={<SellPage />} />
      </Routes>
    </Router>
  );
}

export default App;

