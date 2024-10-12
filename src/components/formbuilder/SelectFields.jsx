import React from "react";
import { useDrag } from "react-dnd";
import {
  FaHeading,
  FaParagraph,
  FaCheckSquare,
  FaRegDotCircle,
  FaSignature,
  FaQuestion,
  FaImage,
  FaUpload,
  FaPen,
  FaCalendarAlt,
} from "react-icons/fa";
import DynamicComponent from "./DynamicComponent";
import DisplayModal from "./DisplayModal";

// const fieldOptions = [
//   {
//     type: "headline",
//     label: "Headline",
//     icon: <FaHeading className="text-2xl" />,
//   },
//   {
//     type: "paragraph",
//     label: "Paragraph",
//     icon: <FaParagraph className="text-2xl" />,
//   },
//   {
//     type: "checkbox",
//     label: "Checkbox",
//     icon: <FaCheckSquare className="text-2xl" />,
//   },
//   {
//     type: "radio",
//     label: "Radio button",
//     icon: <FaRegDotCircle className="text-2xl" />,
//   },
//   {
//     type: "e-sign",
//     label: "E-signature",
//     icon: <FaSignature className="text-2xl" />,
//   },
//   {
//     type: "question",
//     label: "Question",
//     icon: <FaQuestion className="text-2xl" />,
//   },
//   {
//     type: "upload-image",
//     label: "Upload Image",
//     icon: <FaImage className="text-2xl" />,
//   },
//   {
//     type: "uploader",
//     label: "Uploader",
//     icon: <FaUpload className="text-2xl" />,
//   },
//   {
//     type: "user-e-sign",
//     label: "User E-signature",
//     icon: <FaPen className="text-2xl" />,
//   },
//   { type: "date", label: "Date", icon: <FaCalendarAlt className="text-2xl" /> },
// ];

const ItemType = "FIELD"; // Define the item type for drag-and-drop

const useFieldDrag = (type) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType, // Replace 'ItemType' with the actual value or import it
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return { isDragging, dragRef };
};

const SelectFields = ({
  openModal,
  addField,
  setActiveTab,
  activeTab,
  componentFields,
  insertComponent,
  fieldOptions,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { type: null }, // Type will be set dynamically based on the field
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div className="bg-white rounded-lg w-full lg:w-80 h-auto max-h-[50rem] p-6 flex flex-col items-center shadow-md mt-20">
      <div className="flex w-full border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("default")}
          className={`py-2 px-4 ${
            activeTab === "default"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}>
          Default
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`py-2 px-4 ${
            activeTab === "custom"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
          }`}>
          Custom
        </button>
      </div>
      <h3 className="text-black text-xl font-semibold mb-4">Select Fields</h3>
      {activeTab === "default" ? (
        <div className="flex flex-wrap lg:flex-col w-full space-y-1">
          {fieldOptions.map((option, index) => {
            return (
              <DisplayModal
                key={index}
                option={option}
                addField={addField}
                openModal={openModal}
                tab={activeTab}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex lg:flex-col w-full space-y-1 max-h-[550px] overflow-y-auto">
          {componentFields.map((option, index) => {
            return (
              <div
                key={index}
                onClick={() =>
                  insertComponent(option.content, option.jsonContent)
                }
                className={`flex items-center p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200`}>
                <div className="text-black mr-4">{option.icon}</div>
                <span className="text-black text-sm hidden lg:block">
                  {option.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectFields;
