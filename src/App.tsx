import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Outfalls from "./pages/Outfalls";
import Monitoring from "./pages/Monitoring";
import Warnings from "./pages/Warnings";
import Maintenance from "./pages/Maintenance";
import System from "./pages/System";
import Screen from "./pages/Screen";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/screen" element={<Screen />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="outfalls" element={<Outfalls />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="warnings" element={<Warnings />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="system" element={<System />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
