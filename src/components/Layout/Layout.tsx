import React from "react";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";
import { PortfolioCoin } from "../../types/types";

interface LayoutProps {
  portfolio: PortfolioCoin[];
  setPortfolio: (portfolio: PortfolioCoin[] | ((prev: PortfolioCoin[]) => PortfolioCoin[])) => void;
}

const Layout: React.FC<LayoutProps> = ({ portfolio, setPortfolio }) => {
  return (
    <div>
      <Header portfolio={portfolio} setPortfolio={setPortfolio} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;