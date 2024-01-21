import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Error from './Error.js'
import Login from './Login.js'
import Logout from './Logout.js'
import Items from './Items.js'
import {SignUp, SignUpSent} from './SignUp.js'
import PasswordUpdate from './PasswordUpdate.js'
import CreateItem from './CreateItem.js'
import TotalItems from './TotalItems.js'


const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/password/update/:signupcode" element={<PasswordUpdate />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/sent" element={<SignUpSent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/create" element={<CreateItem />} />
          <Route path="/items/total" element={<TotalItems />} />
          <Route path="/" element={<Items />} />
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
