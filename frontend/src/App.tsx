import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-black">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
