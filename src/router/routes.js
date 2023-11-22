import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Layout from '../components/Layout';
import Main from "../pages/Main";

const Router = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/chat-app" element={<Main />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router;