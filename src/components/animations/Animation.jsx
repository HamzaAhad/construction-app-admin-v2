import React from "react";
import Lottie from "lottie-react";

const Animation = ({ path }) => {
  return (
    <div className="">
      <>
        <Lottie animationData={path} loop={true} />
      </>
    </div>
  );
};

export default Animation;
