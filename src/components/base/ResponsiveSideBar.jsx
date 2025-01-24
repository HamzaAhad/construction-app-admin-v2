import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { compact } from "lodash";
import Cookies from "js-cookie";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { Items } from "@/constants/navbarArray";
import { CardMedia, Drawer } from "@mui/material";
import ProfileEdit from "./ProfileEdit";

const ResponsiveSideBar = ({
  currentPage,
  toggleDrawer,
  isSmall,
  drawerOpen,
  scopes,
  companyName,
  companyLogo,
}) => {
  const [filteredItems, setFilteredItems] = useState(null); // Default to all items
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false); // Profile drawer state
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      const allowedPages = compact(
        scopes?.map((scope) => {
          if (scope?.permissions?.viewAll) return scope?.page;
        })
      );
      console.log("allowedPages", allowedPages);
      const filteredItems = Items.filter((item) => {
        return item?.name == "Logout" || allowedPages.includes(item?.link);
      });

      setFilteredItems(filteredItems);
    }
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation(); // To prevent event bubbling
    toggleDrawer(false);
  };

  const toggleProfileDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setProfileDrawerOpen(open);
  };

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto">
      {isSmall && (
        <div className="flex justify-end p-4 z-50 ">
          <CloseIcon
            className="cursor-pointer h-10 w-10 text-white"
            onClick={handleToggle}
          />
        </div>
      )}
      {companyLogo ? (
        <div className="flex items-start justify-start text-[32px] font-bold text-white mx-8 mt-2 mb-10">
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
      <div className="flex-1 ml-5 mt-5">
        <ul>
          {filteredItems?.map((item, index) => (
            <div
              onClick={() => {
                if (item?.link == "/login") {
                  // Clear the loggedInUser cookie
                  Cookies.remove("loggedInUser", { path: "/" });

                  // Clear the loggedInUser item from localStorage
                  localStorage.removeItem("loggedInUser");
                }
                router.push(item?.link);
              }}
              key={index}>
              <li
                className={`flex mt-[1px] items-center px-4 py-[10px] hover:bg-lightBlue cursor-pointer rounded-l-lg ${
                  currentPage == item?.name ? "bg-lightBlue" : ""
                }`}>
                {item?.icon && (
                  <item.icon
                    className={`mr-4 text-white ${
                      currentPage == item?.name ? "animate-pulse" : ""
                    }`}
                  />
                )}
                <span className="text-white text-md">{item?.name}</span>
              </li>
            </div>
          ))}
        </ul>
      </div>
      {/* Profile Section */}
      <div className="flex justify-center items-center m-4 p-2 bg-lightBlue rounded-lg">
        <div
          className="flex items-center cursor-pointer"
          onClick={toggleProfileDrawer(true)}>
          <AccountCircleIcon className="text-gray-200 text-3xl" />
          <span className="ml-2 text-gray-300 text-xl">Profile</span>
        </div>
      </div>

      {/* Profile Drawer */}
      <Drawer
        anchor="right"
        open={profileDrawerOpen}
        onClose={toggleProfileDrawer(false)}>
        <ProfileEdit />
      </Drawer>
    </div>
  );
};

export default ResponsiveSideBar;
