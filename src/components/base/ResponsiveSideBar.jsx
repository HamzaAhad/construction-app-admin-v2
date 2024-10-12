import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { compact } from "lodash";
import Cookies from "js-cookie";
import CloseIcon from "@mui/icons-material/Close";

import Animation from "../animations/Animation";
import logo from "../../../public/pollo.json";

import { Items } from "@/constants/navbarArray";
import { CardMedia } from "@mui/material";

const ResponsiveSideBar = ({
  currentPage,
  toggleDrawer,
  isSmall,
  drawerOpen,
  scopes,
}) => {
  const [filteredItems, setFilteredItems] = useState(null); // Default to all items
  const [companyName, setCompanyName] = useState();
  const [companyLogo, setCompanyLogo] = useState();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (loggedInUser?.comapany?.logo) {
        setCompanyLogo(loggedInUser?.comapany?.logo);
      } else {
        setCompanyName(loggedInUser?.comapany?.name);
      }
      const allowedPages = compact(
        scopes?.map((scope) => {
          if (scope?.permissions?.viewAll) return scope?.page;
        })
      );

      const filteredItems = Items.filter((item) => {
        // if (roleTitle === "User") {
        //   // Exclude 'Dashboard', 'Manage Employee', and 'Manage Import' for employees
        return item?.name == "Logout" || allowedPages.includes(item?.link);
        // }
        // return true; // Return all items for admin
      });

      setFilteredItems(filteredItems);
    }
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation(); // To prevent event bubbling
    toggleDrawer(false);
  };
  return (
    <div className="min-h-screen max-h-screen overflow-y-auto">
      {/* // <div className="min-h-screen lg:min-w-[23%] lg:max-w-[25%] xl:min-w-[19%] xl:max-w-[25%]  bg-gradient-custom text-white flex flex-col"> */}
      {isSmall && (
        <div className="flex justify-end p-4 z-50 ">
          <CloseIcon
            className="cursor-pointer h-10 w-10 text-white"
            onClick={handleToggle}
          />
        </div>
      )}
      {/* <div className="flex items-center justify-center mt-20 mb-25 h-11">
        <Animation path={logo} />
      </div> */}
      {companyLogo ? (
        <div className="flex items-start justify-start text-[32px] font-bold animate-pulse text-white mx-8 mt-2 mb-10">
          <CardMedia
            component="img"
            image={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${companyLogo}`}
            className="w-40 h-20 object-contain"
          />
        </div>
      ) : (
        <div className="flex items-start justify-start text-[32px] font-bold animate-pulse text-white mx-8 mt-5 mb-5 h-11">
          {companyName}
        </div>
      )}
      <div className="flex-1 ml-5 mt-20">
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
                className={`flex  items-center p-4 mt-2 hover:bg-lightBlue cursor-pointer rounded-l-lg ${
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
      {/* // </div> */}
    </div>
  );
};

export default ResponsiveSideBar;
