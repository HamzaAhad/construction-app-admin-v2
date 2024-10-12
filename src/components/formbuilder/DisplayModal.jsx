import React, { useState } from "react";
import DynamicComponent from "./DynamicComponent";
import { useDrag } from "react-dnd";

const DisplayModal = ({ key, option, addField, openModal, tab }) => {
  const [itemType, setItemType] = useState(option.type);
  // console.log(itemType);
  const [{ isDragging }, dragRef] = useDrag({
    type: "FIELD", // Replace 'ItemType' with the actual value or import it
    item: { type: itemType },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div
      key={key}
      ref={dragRef}
      className={`flex items-center p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200`}
      onClick={() =>
        openModal(<DynamicComponent type={option.type} addField={addField} />)
      }>
      <div className="text-black mr-4">{option.icon}</div>
      <span className="text-black text-lg hidden lg:block">{option.label}</span>
    </div>
  );
};

export default DisplayModal;
