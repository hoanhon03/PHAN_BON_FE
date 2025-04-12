import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Admin/Dashboard";
import Product from "./pages/Admin/Product";
import Login from "./pages/Login";
import Category from "./pages/Admin/Category";
import Warehouse from "./pages/Admin/Warehouse";

import Staff from "./pages/Admin/Staff";
import Role from "./pages/Admin/Role";
import SaleBill from "./pages/Admin/SaleBill";
import PurchaseBill from "./pages/Admin/PurchaseBill";
import ReceiveDebt from "./pages/Admin/ReceiveDebt";
import PayDebt from "./pages/Admin/PayDebt";
import Customer from "./pages/Admin/Customer";
import Profile from "./pages/Admin/Profile";
import Supplier from "./pages/Admin/Supplier";
import Statistic from "./pages/Admin/Statistic";
function App() {
  const location = useLocation();

  const isLoginOrRegister =
    location.pathname.includes("login") ||
    location.pathname.includes("register");

  return (
    <div className="flex md:flex-row flex-col min-h-screen">
      {isLoginOrRegister ? <></> : <Navbar />}
      <main className={`${isLoginOrRegister ? "" : "flex-1"} bg-[#ECE6F0]`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/sale-bills" element={<SaleBill />} />
          <Route path="/purchase-bills" element={<PurchaseBill />} />
          <Route path="/receive-debts" element={<ReceiveDebt />} />
          <Route path="/pay-debts" element={<PayDebt />} />
          <Route path="/staffs" element={<Staff />} />
          <Route path="/roles" element={<Role />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/customers" element={<Customer />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/suppliers" element={<Supplier />} />
          <Route path="/statistic" element={<Statistic />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
