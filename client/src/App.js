import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// page components
import ScrollTop from './components/utils/ScrollTop';

import Layout from './components/Layout';
import Home from './components/Home';
import Funding from './components/Funding';
import Project from './components/Project';
import User from './components/User';
import Lanuch from './components/Launch';
import UserRevise from './components/UserRevise';

function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='funding' element={<Funding />} />
          <Route path="project/:projectId" element={<Project />} />
          <Route path="user/:userAddress" element={<User />} />
          <Route path="userRevise" element={<UserRevise />} />
          <Route path='launch' element={<Lanuch />} />
        </Route>
      </Routes>
    </BrowserRouter >
  );
}

export default App;