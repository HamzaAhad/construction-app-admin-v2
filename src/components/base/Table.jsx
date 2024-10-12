import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

import { Edit, Delete, Visibility } from "@mui/icons-material"; // Import icons from Material-UI or your icon library
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MdNavigateNext } from "react-icons/md";

import dayjs from "dayjs";

import ViewModal from "./ViewModal";
import EditCategory from "../categories/EditCategory";
import DeleteRecord from "../categories/DeleteRecord.";
import PreviewForm from "../categories/PreviewForm";
import ClosedIssue from "../categories/ClosedIssue";
import { Router, useRouter } from "next/router";
import apiClient from "@/helpers/interceptor";

const Table = ({
  columns,
  rows,
  isEdit,
  isDelete,
  onEditClose,
  onDeleteClose,
  refreshList,
  onPreviewClose,
  deleteUrl = null,
  isPreview,
  previewKey,
  title,
  isCloseModal,
  onCloseIssueModal,
  handleCloseDirectly,
  isViewModal,
  onViewClose,
  handleUpdate,
  event = false,
  redirect = false,
  redirectUrl,
  redirectText = "",
  canEdit = true,
}) => {
  const [recordId, setRecordId] = useState("");
  const [formFields, setFormFields] = useState(null);
  const [eventFields, setEventFields] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [entityId, setEntityId] = useState();
  const [companies, setCompanies] = useState([]);
  const open = Boolean(anchorEl);

  const handleClick = (event, id, row) => {
    if (row?.folderId) {
      setEntityId(row.folderId);
    } else if (row?.siteId) {
      setEntityId(row.siteId);
    } else {
      setEntityId();
    }
    setAnchorEl(event.currentTarget);
    setRecordId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Directly CLosing issues and events
  const handleSubmit = () => {
    handleCloseDirectly(recordId);
  };

  // CLosing issues and events with actions
  const handleCloseAction = (recordId) => {
    onCloseIssueModal(true, recordId);
  };
  const router = useRouter();
  const handleRedirect = () => {
    console.log("rid", recordId);
    router.push(`${redirectUrl}/${recordId}`);
  };

  const loggedInUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("loggedInUser"))
      : null;

  // Check if the user title is "Product Owner"
  const getCompanies = async () => {
    try {
      const response = await apiClient.get("/company");
      setCompanies(response?.data?.company);
    } catch (err) {
      console.log("err", err);
    }
  };
  const isProductOwner =
    loggedInUser && loggedInUser?.user?.roleTitle === "Product Owner";
  const modifiedColumns = useMemo(() => {
    const newColumns = [...columns]; // Create a shallow copy of columns

    if (isProductOwner) {
      getCompanies();
      newColumns.splice(2, 0, {
        name: "Company Name",
        minWidth: "200px",
        key: "companyId",
      }); // Insert at index 2
    }

    return newColumns;
  }, [columns, isProductOwner]);
  return (
    <div className="overflow-x-auto scroll-bar-custom shadow-sm">
      <table className="min-w-full bg-white mb-20 md:mb-0">
        <thead>
          <tr className="border-b">
            {modifiedColumns.map((column, index) => (
              <th
                key={index}
                className="text-center py-4 px-6 text-black font-bold text-lg uppercase"
                style={{ minWidth: column.minWidth }}>
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {modifiedColumns?.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="text-center py-4 px-6 text-gray-700 text-base font-normal">
                  {column.key === "companyId" ? (
                    // row.companyId
                    companies?.find((company) => company.id == row.companyId)
                      ?.name || "Unknown Company"
                  ) : /* Status Column */ column.key === "status" ? (
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-white w-24 text-center ${
                        row[column.key] === "Active" ||
                        row[column.key] === "Closed" ||
                        row[column.key] === "Enabled"
                          ? "bg-green-500"
                          : row[column.key] === "Inactive" ||
                            row[column.key] === "Open" ||
                            row[column.key] === "Disabled"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }`}>
                      {row[column.key]}
                    </div>
                  ) : /* Link for category folder */ column.key ===
                    "folderName" ? (
                    <Link
                      href={`/category/${row?.id}`}
                      className=" hover:text-blue-500 hover:underline">
                      {row[column.key]}
                    </Link>
                  ) : /* Link for form folder */ column.key === "formName" ? (
                    <Link
                      href={`/category/${row.folderId}/formbuilder/${row.id}`}
                      className=" hover:text-blue-500 hover:underline">
                      {row[column.key]}
                    </Link>
                  ) : /* Link for Site location */ column.key === "name" &&
                    column.link ? (
                    <Link
                      href={`/sites/${row.id}`}
                      className=" hover:text-blue-500 hover:underline">
                      {row[column.key]}
                    </Link>
                  ) : /* Redirect for logs */ column.key === "title" &&
                    (row.entity === "site" ||
                      row.entity === "folder" ||
                      row.entity === "form" ||
                      row.entity === "issues" ||
                      row.entity === "events" ||
                      row.entity === "tickets" ||
                      row.entity === "SubSite") ? (
                    <Link
                      href={`/${
                        row.entity === "folder"
                          ? "category"
                          : row.entity === "site"
                          ? "sites"
                          : row.entity === "form"
                          ? `category/${row.entityId}`
                          : row.entity === "issue"
                          ? "issues"
                          : row.entity === "event"
                          ? "events"
                          : row.entity === "ticket"
                          ? "tickets"
                          : row.entity === "SubSite"
                          ? `sites/${row.entityId}`
                          : `dashboard`
                      }`}
                      className=" hover:text-blue-500 hover:underline">
                      {row[column.key]}
                    </Link>
                  ) : column.key === "previewAction" ? (
                    isPreview !== undefined && previewKey ? (
                      <Tooltip title="Preview">
                        <button
                          onClick={() => {
                            console.log(row);
                            const canParseJson =
                              typeof row[previewKey] === "string" &&
                              (() => {
                                try {
                                  JSON.parse(row[previewKey]);
                                  return true;
                                } catch {
                                  return false;
                                }
                              })();
                            let fields = canParseJson
                              ? JSON.parse(row[previewKey])
                              : [];
                            setFormFields(Array.isArray(fields) ? fields : []);
                            if (event) {
                              fields.eventDescription = row.eventDescription;
                              fields.eventImages = JSON.parse(row.eventImages);
                              setEventFields(fields);
                            }
                            onPreviewClose(true);
                          }}
                          className="text-buttonColorPrimary hover:text-blue-700">
                          <Visibility />
                        </button>
                      </Tooltip>
                    ) : null
                  ) : /* Category Action for categories and forms */ column.key ===
                    "categoryAction" ? (
                    // {/* {isEdit !== undefined ? (
                    //   <Tooltip title="Edit">
                    //     <button
                    //       onClick={() => {
                    //         setRecordId(row.id);
                    //         onEditClose(true);
                    //       }}
                    //       className="text-buttonColorPrimary hover:text-blue-700">
                    //       <Edit />
                    //     </button>
                    //   </Tooltip>
                    // ) : null} */}
                    // {/* {isPreview !== undefined && previewKey ? (
                    //   <Tooltip title="Preview">
                    //     <button
                    //       onClick={() => {
                    //         console.log(row);
                    //         const canParseJson =
                    //           typeof row[previewKey] === "string" &&
                    //           (() => {
                    //             try {
                    //               JSON.parse(row[previewKey]);
                    //               return true;
                    //             } catch {
                    //               return false;
                    //             }
                    //           })();
                    //         let fields = canParseJson
                    //           ? JSON.parse(row[previewKey])
                    //           : [];
                    //         setFormFields(
                    //           Array.isArray(fields) ? fields : []
                    //         );
                    //         if (event) {
                    //           fields.eventDescription =
                    //             row.eventDescription;
                    //           fields.eventImages = JSON.parse(
                    //             row.eventImages
                    //           );
                    //           setEventFields(fields);
                    //         }
                    //         onPreviewClose(true);
                    //       }}
                    //       className="text-buttonColorPrimary hover:text-blue-700">
                    //       <Visibility />
                    //     </button>
                    //   </Tooltip>
                    // ) : null} */}
                    // {/* {isDelete !== undefined ? (
                    //   <Tooltip title="Delete">
                    //     <button
                    //       onClick={() => {
                    //         setRecordId(row.id);
                    //         onDeleteClose(true);
                    //       }}
                    //       className="text-red-500 hover:text-red-700">
                    //       <Delete />
                    //     </button>
                    //   </Tooltip>
                    // ) : null} */}
                    <div className="flex relative justify-around space-x-2">
                      <IconButton
                        onClick={(e) => handleClick(e, row.id, row)} // Pass the correct row ID when clicking
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        sx={{
                          cursor: "pointer",
                        }}
                        PaperProps={{
                          elevation: 1,
                          style: {
                            minWidth: "140px",
                          },
                        }}>
                        {isDelete !== undefined && canEdit ? (
                          <MenuItem>
                            <button
                              onClick={() => {
                                handleClose();
                                onDeleteClose(true);
                              }}
                              className="text-red-500 hover:text-red-700">
                              <Delete /> <span>Delete</span>
                            </button>
                          </MenuItem>
                        ) : null}
                        {isEdit !== undefined && canEdit ? (
                          <MenuItem>
                            <button
                              onClick={() => {
                                setRecordId(row.id);
                                onEditClose(true);
                              }}
                              className="text-buttonColorPrimary hover:text-blue-700">
                              <Edit /> <span>Edit</span>
                            </button>
                          </MenuItem>
                        ) : null}
                        {isPreview !== undefined && previewKey ? (
                          <MenuItem>
                            <button
                              onClick={() => {
                                console.log(row);
                                const canParseJson =
                                  typeof row[previewKey] === "string" &&
                                  (() => {
                                    try {
                                      JSON.parse(row[previewKey]);
                                      return true;
                                    } catch {
                                      return false;
                                    }
                                  })();
                                let fields = canParseJson
                                  ? JSON.parse(row[previewKey])
                                  : [];
                                setFormFields(
                                  Array.isArray(fields) ? fields : []
                                );
                                if (event) {
                                  fields.eventDescription =
                                    row.eventDescription;
                                  fields.eventImages = JSON.parse(
                                    row.eventImages
                                  );
                                  setEventFields(fields);
                                }
                                onPreviewClose(true);
                              }}
                              className="text-buttonColorPrimary hover:text-blue-700">
                              <Visibility /> <span>Preview</span>
                            </button>
                          </MenuItem>
                        ) : null}
                        {redirect ? (
                          <MenuItem>
                            <button className="text-buttonColorPrimary flex space-x-2 justify-between hover:text-blue-700">
                              {redirectUrl === "category" ? (
                                <Link
                                  href={`/category/${recordId}`}
                                  className="hover:text-blue-500 hover:underline">
                                  {row[column.key]}
                                  <div className="flex justify-between space-x-2">
                                    <MdNavigateNext className="text-xl" />
                                    <span>{redirectText}</span>
                                  </div>
                                </Link>
                              ) : redirectUrl === "formbuilder" ? (
                                <Link
                                  href={`/category/${row.folderId}/formbuilder/${recordId}`}
                                  className="hover:text-blue-500 hover:underline">
                                  {row[column.key]}
                                  <div className="flex justify-between space-x-2">
                                    <MdNavigateNext className="text-xl" />
                                    <span>{redirectText}</span>
                                  </div>
                                </Link>
                              ) : redirectUrl === "sites" ? (
                                <Link
                                  href={`/sites/${recordId}`}
                                  className="hover:text-blue-500 hover:underline">
                                  {row[column.key]}
                                  <div className="flex justify-between space-x-2">
                                    <MdNavigateNext className="text-xl" />
                                    <span>{redirectText}</span>
                                  </div>
                                </Link>
                              ) : null}
                            </button>
                          </MenuItem>
                        ) : null}{" "}
                      </Menu>{" "}
                    </div>
                  ) : column.key === "viewCloseAction" ? (
                    <div className="flex justify-center space-x-4">
                      {isViewModal !== undefined ? (
                        <Tooltip title="View">
                          <button
                            onClick={() => {
                              setRecordId(row.id);
                              onViewClose(true);
                            }}
                            disabled={
                              !(
                                row.status == "close" &&
                                row.actions &&
                                row.actions?.length > 0
                              )
                            }
                            className={`${
                              row.status == "close" &&
                              row.actions &&
                              row.actions?.length > 0
                                ? " text-red-500 hover:text-red-700"
                                : row.status == "close"
                                ? "text-red-300 hover:text-red-500"
                                : "text-red-200 hover:text-red-400"
                            }`}>
                            <Visibility />
                          </button>
                        </Tooltip>
                      ) : null}
                    </div>
                  ) : column.key === "viewItem" ? (
                    <div className="flex justify-center space-x-4">
                      {isViewModal !== undefined ? (
                        <Tooltip title="View">
                          <button
                            onClick={() => {
                              setRecordId(row.id);
                              onViewClose(true);
                            }}
                            className={
                              "text-buttonColorPrimary hover:text-blue-700"
                            }>
                            <Visibility />
                          </button>
                        </Tooltip>
                      ) : null}
                    </div>
                  ) : /* COntrolled Action for events and issues */
                  column.key === "controlAction" ? (
                    <div className="flex relative justify-around space-x-2">
                      <IconButton
                        onClick={(e) => handleClick(e, row.id)} // Pass the correct row ID when clicking
                        disabled={
                          !canEdit ||
                          !["pending", "active", "open"].includes(row.status)
                        }>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        sx={{
                          cursor: "pointer",
                        }}
                        PaperProps={{
                          elevation: 1,
                          style: {
                            minWidth: "140px",
                          },
                        }}>
                        <MenuItem
                          onClick={() => {
                            setRecordId(row.id);
                            handleCloseAction(recordId);
                            handleClose();
                          }}>
                          {/* <Edit className="mr-2" /> */}
                          Close with action
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setRecordId(row.id);
                            handleSubmit();
                            handleClose();
                          }}>
                          Close directly
                        </MenuItem>
                      </Menu>
                    </div>
                  ) : /*Date Column*/
                  column.key == "createdAt" ? (
                    dayjs(row[column.key]).format("YYYY-MM-DD HH:mm:ss")
                  ) : column.key == "updateStatus" ? (
                    row.status === "closed" ? (
                      <span className="text-green-400">Ticket Resolved</span>
                    ) : (
                      <button
                        className={`${
                          row.status === "pending"
                            ? "text-gray-400"
                            : "text-blue-500"
                        }`}
                        disabled={!canEdit}
                        onClick={() => handleUpdate(row.id)}>
                        {row.status === "pending"
                          ? "Accept Ticket"
                          : "Close Ticket"}
                      </button>
                    )
                  ) : column.key == "viewDetails" ? (
                    <button
                      className={`bg-buttonColorPrimary p-2 rounded-2xl text-gray-50`}
                      onClick={() => handleUpdate(row.id)}>
                      View Details
                    </button>
                  ) : column.key == "roleActions" ? (
                    <div className="flex justify-center space-x-4">
                      <button
                        className={`bg-gray-400 px-4 py-2 rounded-3xl text-gray-50`}
                        onClick={() => handleUpdate(row.id, "user")}>
                        Associate Users
                      </button>
                      <button
                        className={`bg-purple-300 px-4 py-2 rounded-3xl text-gray-50`}
                        onClick={() => handleUpdate(row.id, "permission")}>
                        Set Permissions
                      </button>
                    </div>
                  ) : (
                    /*General Column*/ row[column.key] || "NA"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <EditCategory isOpen={isEdit} onClose={onEditClose} recordId={recordId} />
      <DeleteRecord
        path={deleteUrl}
        isOpen={isDelete}
        onClose={onDeleteClose}
        recordId={recordId}
        refreshList={refreshList}
      />
      <PreviewForm
        isOpen={isPreview}
        onClose={onPreviewClose}
        formFields={event ? eventFields : formFields}
        event={event}
      />
      <ViewModal
        isOpen={isViewModal}
        onClose={onViewClose}
        recordId={recordId}
      />
    </div>
  );
};

export default Table;
