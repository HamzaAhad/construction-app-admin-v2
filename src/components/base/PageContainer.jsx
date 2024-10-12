import React from "react";
import Head from "next/head";

import { CardMedia } from "@mui/material";

import Sidebar from "@/components/base/Sidebar";

const PageContainer = ({ scopes = [], title, children, currentPage, step }) => {
  return (
    <div className=" flex flex-col lg:flex-row overflow-hidden">
      {step ? null : <Sidebar scopes={scopes} currentPage={currentPage} />}
      <Head>
        <title>{title}</title>
        <meta name="description" content="A simple custom form builder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`relative ${
          step
            ? "min-w-full max-w-full"
            : "lg:min-w-[77%] lg:max-w-[77%] xl:min-w-[81%] xl:max-w-[81%]"
        }  flex justify-start bg-gradient-custom lg:bg-[#edf5fa] lg:bg-none  min-h-screen max-h-screen overflow-y-auto`}
      >
        <div className=" absolute inset-0 min-h-screen lg:hidden"></div>
        {/* <CardMedia
          component="img"
          image="/./profile.png"
          alt="Overlay"
          // sx={{
          //   position: "absolute",
          //   top: 0,
          //   left: 0,
          //   width: "100%",
          //   opacity: 0.05,
          //   objectFit: "cover",
          // }}
          className="absolute flex top-0 left-0 w-[100%] opacity-5 object-cover lg:hidden min-h-[130vh]"
        /> */}
        <div className="absolute top-0 left-0 w-full lg:hidden">
          <CardMedia
            component="img"
            image="/./profile.png"
            alt="Overlay"
            className="w-full opacity-5 object-cover min-h-[130vh]"
          />
        </div>
        <div className="relative z-10 w-full">{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;
