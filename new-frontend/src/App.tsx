import { type FC, Fragment } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Navbar from "./components/navbar";
import Footer from "./components/footer";

const App: FC = () => (
  <Fragment>
    <ToastContainer />
    <Navbar />
    <main className="min-h-[calc(100vh-128px)]">
      <Outlet />
    </main>
    <Footer />
  </Fragment>
);

export default App
