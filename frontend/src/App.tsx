import { type FC, Fragment } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Footer from "@/common/components/main/footer";

/**
 * Everything above the module shells: the toast host and the footer.
 *
 * No wrapper `<main>` here. Every module layout renders its own
 * `<main id="main-content">` inside a `min-h-dvh` column, so one here made two
 * `main` landmarks on every page — and its `calc(100vh-128px)` was reserving
 * room for a navbar and footer that now live inside those layouts, which is
 * where the trailing gap came from.
 *
 * The footer sits after the outlet rather than inside each shell, so there is
 * one of it for the whole app. Because those shells are `min-h-dvh`, it always
 * lands at or below the fold instead of riding up into a short page — the usual
 * sticky-footer problem solves itself here.
 */
const App: FC = () => (
  <Fragment>
    <ToastContainer />
    <Outlet />
    <Footer />
  </Fragment>
);

export default App
