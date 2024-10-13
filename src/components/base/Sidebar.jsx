import { useState, useEffect } from "react";

import MenuIcon from "@mui/icons-material/Menu"; // Import a menu icon from Heroicons (or any icon library)
import Drawer from "@mui/material/Drawer";

import ResponsiveSideBar from "./ResponsiveSideBar";

const Sidebar = ({ scopes, currentPage }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [companyName, setCompanyName] = useState();
  const [companyLogo, setCompanyLogo] = useState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (loggedInUser?.comapany?.logo) {
        setCompanyLogo(loggedInUser?.comapany?.logo);
      } else {
        setCompanyName(loggedInUser?.comapany?.name);
      }
    }
  }, []);

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
        {companyLogo ? (
          <div className="flex items-start justify-start text-[32px] font-bold animate-pulse text-white mx-8 mt-2 mb-10">
            <CardMedia
              component="img"
              image={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${companyLogo}`}
              className="w-40 h-20 object-contain"
            />
          </div>
        ) : companyName ? (
          <div className="flex items-center justify-start mx-8 mt-5 mb-5 h-11">
            <div
              className={`${
                companyName.length > 10 ? "text-[28px]" : "text-4xl"
              } font-galada font-bold text-transparent bg-gradient-to-r from-[#3a9dbd] to-[#5bc1da] bg-clip-text animate-gradient mx-auto`}>
              {companyName}
            </div>
            <div className="relative ml-3 flex-shrink-0 rounded-full w-2 h-2 bg-[#5bc1da] animate-ping"></div>
          </div>
        ) : (
          <div className="flex items-center justify-start mx-8 mt-5 mb-5 h-11">
            <div className="text-4xl font-galada font-bold text-transparent bg-gradient-to-r from-[#3a9dbd] to-[#5bc1da] bg-clip-text animate-gradient mx-auto">
              SssManage
            </div>
            <div className="relative ml-3 flex-shrink-0 rounded-full w-2 h-2 bg-[#5bc1da] animate-ping"></div>
          </div>
        )}
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
        classes={{ paper: "bg-gradient-custom text-white" }}>
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
