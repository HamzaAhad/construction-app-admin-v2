import React, { useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
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
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaCalendarAlt,
} from "react-icons/fa";
import { CiSaveDown1 } from "react-icons/ci";

import DynamicComponent from "./DynamicComponent";
// Define the field options with icons
const fieldOptions = [
  {
    type: "headline",
    label: "Headline",
    icon: <FaHeading className="text-2xl" />,
  },
  {
    type: "paragraph",
    label: "Paragraph",
    icon: <FaParagraph className="text-2xl" />,
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: <FaCheckSquare className="text-2xl" />,
  },
  {
    type: "radio",
    label: "Radio button",
    icon: <FaRegDotCircle className="text-2xl" />,
  },
  {
    type: "e-sign",
    label: "E-signature",
    icon: <FaSignature className="text-2xl" />,
  },
  {
    type: "question",
    label: "Question",
    icon: <FaQuestion className="text-2xl" />,
  },
  {
    type: "upload-image",
    label: "Upload Image",
    icon: <FaImage className="text-2xl" />,
  },
  {
    type: "uploader",
    label: "Uploader",
    icon: <FaUpload className="text-2xl" />,
  },
  {
    type: "user-e-sign",
    label: "User E-signature",
    icon: <FaPen className="text-2xl" />,
  },
  { type: "date", label: "Date", icon: <FaCalendarAlt className="text-2xl" /> },
];

const ItemType = "FIELD"; // Define the item type for drag-and-drop

const FormPreview = ({
  formFields,
  removeField,
  moveField,
  openModal,
  addField,
  addComponent,
}) => {
  useEffect(() => {
    console.log("formfields--->", formFields);
  }, [formFields]);

  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item) => {
      // Open the modal when a field is dropped
      openModal(<DynamicComponent type={item.type} addField={addField} />);
    },
  });

  // Function to get icon based on field type
  const getIconForType = (type) => {
    const option = fieldOptions.find((opt) => opt.type === type);
    return option ? option.icon : null;
  };

  const moveCard = (dragIndex, hoverIndex) => {
    const dragCard = formFields[dragIndex];
    console.log("drag card--->", dragCard);
    moveField(dragIndex, hoverIndex);
  };

  return (
    <div
      ref={drop}
      className={`flex flex-col border p-6 w-full mt-4 mb-20 lg:mt-20 rounded-lg bg-white shadow-md max-h-[30rem]  md:max-h-[50rem] overflow-y-scroll custom-scrollbar`}>
      <h3 className="text-black text-xl font-semibold mb-4">Form Preview</h3>
      {formFields.length === 0 ? (
        <p className="text-gray-500">No fields added.</p>
      ) : (
        formFields?.map((field, index) => (
          <DraggableField
            key={field.id}
            index={index}
            id={field.id}
            field={field}
            removeField={removeField}
            moveCard={moveCard}
            getIconForType={getIconForType}
            moveField={moveField}
            addComponent={addComponent}
          />
        ))
      )}
    </div>
  );
};

const DraggableField = ({
  id,
  index,
  field,
  removeField,
  moveCard,
  getIconForType,
  moveField,
  addComponent,
}) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: "MOVE",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "MOVE",
    item: { type: field.type, id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`border rounded-lg p-4 mb-4 bg-gray-50 cursor-pointer shadow-sm flex items-start space-x-4 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}>
      {/* Render the icon */}
      <div className="flex-shrink-0 text-black">
        {getIconForType(field.type)}
      </div>
      <div className="flex-1">
        {/* Render the field HTML */}
        <div
          className="text-black"
          dangerouslySetInnerHTML={{ __html: field.html }}
        />
        <div className="mt-4 flex justify-start space-x-4 items-center">
          <button
            onClick={() => removeField(index)}
            className="text-red-500 hover:text-red-700 transition-colors">
            <FaTrash className="text-lg" />
          </button>
          <button
            onClick={() => addComponent(index)}
            className="text-blue-700 hover:text-blue-600 transition-colors">
            <CiSaveDown1 className="text-xl" />
          </button>
          {/* <button
            onClick={() => moveField(index, index - 1)}
            disabled={index === 0}
            className={`text-blue-500 hover:text-blue-700 transition-colors ${
              index === 0 ? "cursor-not-allowed" : ""
            }`}>
            <FaArrowUp className="text-lg" />
          </button>
          <button
            onClick={() => moveField(index, index + 1)}
            disabled={index === formFields.length - 1}
            className={`text-blue-500 hover:text-blue-700 transition-colors ${
              index === formFields.length - 1 ? "cursor-not-allowed" : ""
            }`}>
            <FaArrowDown className="text-lg" />
          </button> */}
        </div>
      </div>
    </div>
  );
};
export default FormPreview;
