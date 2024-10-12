import React from "react";

const DisabledOverlay = ({ message }) => {
  return <span className="text-red-500 font-bold">*{message}</span>;
};

export default DisabledOverlay;
