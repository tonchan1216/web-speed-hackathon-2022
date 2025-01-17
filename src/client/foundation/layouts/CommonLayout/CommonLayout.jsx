import { Outlet } from "react-router-dom";

import { Footer } from "../../components/navs/Footer/Footer";
import { Header } from "../../components/navs/Header/Header";

export const CommonLayout = () => {
  return (
    <div>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
