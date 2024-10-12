import React from "react";

import { HiSearch } from "react-icons/hi";

import AddButton from "../listing/AddButton";
import DownloadDropdown from "./DownloadDropdown";

const SearchFilter = ({
  searchQuery,
  onSearchChange,
  filterField,
  onFilterChange,
  columns,
  buttonText,
  linkText,
  buttonClick,
  buttonClass,
  disableButton,
  showButton = true,
  downloadAble,
  data,
  csvName,
  canEdit = true,
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center my-8">
      <AddButton
        classExtra="lg:hidden w-full mb-2 bg-white"
        classIdentifier={buttonClass}
        text={buttonText}
        linkText={linkText}
        buttonClick={buttonClick}
      />

      <div
        className={`relative flex-grow min-w-full ${
          !showButton
            ? "lg:min-w-[60%] lg:max-w-[60%]"
            : "lg:min-w-[40%] lg:max-w-[40%]"
        }  shadow-sm`}>
        <input
          type="text"
          className="border rounded p-2 pl-10 w-full text-black focus:border-buttonColorPrimary focus:outline-none"
          placeholder={`Search by ${filterField}`}
          value={searchQuery}
          onChange={onSearchChange}
        />
        <HiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
      </div>
      <select
        className="border text-black rounded shadow-sm p-2 m-2 lg:m-0 min-w-full lg:min-w-[20%] lg:max-w-[20%] focus:border-buttonColorPrimary focus:outline-none"
        value={filterField}
        onChange={onFilterChange}>
        {columns.map((column) => (
          <option
            key={column.name}
            value={column.key}
            className="hover:bg-buttonColorPrimary">
            {column.name}
          </option>
        ))}
      </select>
      {showButton && canEdit && (
        <AddButton
          classExtra="hidden lg:block"
          classIdentifier={buttonClass}
          text={buttonText}
          linkText={linkText}
          buttonClick={buttonClick}
          disableButton={disableButton ? false : true}
        />
      )}
      {downloadAble && data.length > 0 ? (
        <DownloadDropdown data={data} csvName={csvName} />
      ) : null}
    </div>
  );
};

export default SearchFilter;
