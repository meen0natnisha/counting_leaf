import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  Dashboard,
  CreateTree,
  TreeDetail,
  ManageTree,
  Login,
  Signup,
} from "../pages";

export default function Navigation() {
  const isLogin = !(localStorage.getItem("accessTokenLeafCount") === null);
  return (
    <Router>
      <div className="App-header">
        <Suspense fallback={<div className="h1">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-tree" element={<CreateTree />} />
            <Route path="/tree-detail" element={<TreeDetail />} />
            <Route path="/manage-tree/:manage" element={<ManageTree />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}
