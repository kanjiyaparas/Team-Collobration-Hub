// import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Switch, Navigate, Routes } from 'react-router-dom';
// import Login from './screen/Login';
// import Register from './screen/Register';
// import Dashboard from './screen/Dashboard';
// import UserManager from './screen/UserManager';
// import TaskManager from './screen/TaskManager';
// import TaskChatRoom from './screen/TaskChatRoom';

// const App = () => {
//   const [user, setUser] = useState(null);

//   const handleLoginSuccess = (userData) => {
//     setUser(userData);
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login">
//           <Login onLoginSuccess={handleLoginSuccess} />
//         </Route>
//         <Route path="/register">
//           <Register />
//         </Route>
//         <Route path="/dashboard">
//           {user ? <Dashboard /> : <Navigate to="/login" />}
//         </Route>
//         <Route path="/user-manager" component={UserManager} />
//         <Route path="/task-manager" component={TaskManager} />
//         <Route path="/task-chat/:taskId" component={TaskChatRoom} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import Login from './screen/Login';
import Register from './screen/Register';
import Dashboard from './screen/Dashboard';
import UserManager from './screen/UserManager';
import TaskManager from './screen/TaskManager';
import TaskChatRoom from './screen/TaskChatRoom';

const App = () => {
  const [user, setUser] = useState(null);
  
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const token = localStorage.getItem("token")

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/user-manager" element={<UserManager />} />
        <Route path="/task-manager" element={<TaskManager />} />
        <Route path="/task-chat/:taskId" element={<TaskChatRoom />} />
      </Routes>
    </Router>
  );
};

export default App;

