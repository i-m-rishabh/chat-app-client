import './App.css';
import io from 'socket.io-client';
// import Signup from './pages/Signup.js';
// import Login from './pages/Login.js';
import Router from './router/routes.js';

function App() {
  
  // const socket = io("http://localhost:5000");
  return (
    <div className="App">
      {/* <Signup /> */}
      {/* <Login /> */}
      <Router />
    </div>
  );
}
export default App;
