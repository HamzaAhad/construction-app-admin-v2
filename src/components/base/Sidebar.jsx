import { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu"; // Import a menu icon from Heroicons (or any icon library)
import Drawer from "@mui/material/Drawer";

import ResponsiveSideBar from "./ResponsiveSideBar";

const Sidebar = ({ scopes, currentPage }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      {/* Sidebar for large screens */}
      <div className="hidden lg:flex flex-col min-h-screen lg:min-w-[23%] lg:max-w-[25%] xl:min-w-[19%] xl:max-w-[25%]  bg-gradient-custom text-white ">
        <ResponsiveSideBar
          currentPage={currentPage}
          isSmall={false}
          toggleDrawer={setDrawerOpen}
          scopes={scopes}
        />
      </div>

      {/* Navbar for small screens */}
      <div className="lg:hidden flex justify-between items-center h-[60px] px-4 py-2 bg-gradient-custom text-white">
        <h1 className="text-2xl font-bold text-white">HSE</h1>
        <MenuIcon
          className="h-10 w-10 cursor-pointer"
          onClick={toggleDrawer(true)}
        />
      </div>

      {/* Drawer for small screens */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        classes={{ paper: "bg-gradient-custom text-white" }}
      >
        <ResponsiveSideBar
          currentPage={currentPage}
          isSmall={true}
          toggleDrawer={setDrawerOpen}
          drawerOpen={drawerOpen}
          scopes={scopes}
        />
      </Drawer>
    </>
  );
};

export default Sidebar;
