import React from "react";
import Animation from "./Animation";
import empty from "../../../public/empty-record.json";

const EmptyAnimation = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <Animation path={empty} />
    </div>
  );
};

export default EmptyAnimation;
