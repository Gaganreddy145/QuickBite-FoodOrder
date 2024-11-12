import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";

function RootLayout() {
  const navigation = useNavigation();
  return (
    <div>
      <MainNavigation />
      {navigation.state === "loading" && <p>Loading...</p>}
      {navigation.state === "idle" && <Outlet />}
    </div>
  );
}

export default RootLayout;
