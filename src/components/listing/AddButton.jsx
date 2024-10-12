import React from "react";
import Link from "next/link";

const AddButton = ({
  text,
  linkText,
  buttonClick,
  classIdentifier,
  classExtra,
  disableButton,
}) => {
  return (
    disableButton && (
      <div
        className={`${
          classIdentifier ? classIdentifier : "block"
        } ${classExtra}`}>
        {linkText ? (
          <>
            <Link href={`/${linkText}`}>
              <button
                type="submit"
                className=" bg-buttonColorPrimary w-full text-[14px] font-bold text-white py-2 px-4 rounded  hover:bg-buttonColorPrimary transform transition-transform duration-500 ease-in-out hover:scale-105 hover:bg-blue-600">
                {text}
              </button>
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={buttonClick}
              type="submit"
              className=" bg-buttonColorPrimary w-full text-[14px] font-bold text-white py-2 px-4 rounded  hover:bg-buttonColorPrimary transform transition-transform duration-500 ease-in-out hover:scale-105 hover:bg-blue-600">
              {text}
            </button>
          </>
        )}
      </div>
    )
  );
};

export default AddButton;
