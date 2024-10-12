import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/base/Breadcrumb";
import PageContainer from "@/components/base/PageContainer";
import { toast } from "react-toastify";
import apiClient from "@/helpers/interceptor";
import EmptyDisplay from "@/components/base/EmptyDisplay";
import Table from "@/components/base/Table";
import Pagination from "@/components/base/PaginationControls";
import StackBox from "@/components/dashboard/StatBox";

import { checkScope } from "@/helpers/checkScope";

import {
  WorkOutline,
  ReportProblem,
  CheckCircleOutline,
  Person,
  People,
  Category,
  Edit,
} from "@mui/icons-material";
import EditEmployeeModal from "@/components/listing/EditEmployeeModal";

const columnsIssue = [
  { name: "ID", minWidth: "70px", key: "id" },
  { name: "Site Location", minWidth: "200px", key: "site" },
  { name: "Category", minWidth: "150px", key: "category" },
  { name: "Issue", minWidth: "250px", key: "issues" },
  { name: "Status", minWidth: "100px", key: "status" },
  { name: "Created At", minWidth: "280px", key: "createdAt" },
  { name: "Preview Form", minWidth: "200px", key: "categoryAction" },
  { name: "View Close Action", minWidth: "250px", key: "viewCloseAction" },
  //   { name: "Action", minWidth: "150px", key: "controlAction" },
];

const columnsEvents = [
  { name: "ID", minWidth: "70px", key: "id" },
  { name: "Site Location", minWidth: "200px", key: "location" },
  { name: "Status", minWidth: "100px", key: "status" },
  { name: "Event Date", minWidth: "180px", key: "date" },
  { name: "Event Time", minWidth: "180px", key: "time" },
  { name: "Created At", minWidth: "180px", key: "createdAt" },
  { name: "Preview", minWidth: "150px", key: "categoryAction" },
  { name: "View Close Action", minWidth: "250px", key: "viewCloseAction" },
  //   { name: "Action", minWidth: "150px", key: "controlAction" },
];

const Index = ({ scopes }) => {
  const router = useRouter();

  const [userData, setUserData] = useState({});
  const [issueData, setIssueData] = useState([]);
  const [eventData, setEventData] = useState([]);

  //Issues states
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for the current page

  //events state
  const [openPreviewModal1, setOpenPreviewModal1] = useState(false);
  const [openViewModal1, setOpenViewModal1] = useState(false);
  const [currentPage1, setCurrentPage1] = useState(1); // State for the current page

  const breadcrumbItems = [
    { label: "Employees", href: "/employee" },
    { label: `${router.query.id}`, href: null }, // Current page, no link
  ];

  const fetchData = async () => {
    try {
      if (router.query.id) {
        const response = await apiClient.get(
          `/users/getUserData/${router.query.id}`
        );
        console.log(response);
        setUserData(response.data.result.user);
        setIssueData(response.data.result.issues);
        setEventData(response.data.result.events);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router.query.id]);

  //   const handleModalOpen = (val, recordId) => {
  //     console.log("handleModalOpen", val, recordId);
  //     setId(recordId);
  //     setCloseIssueModal(val);
  //   };

  //   const handleSubmit = async (id) => {
  //     const body = { status: "close" };
  //     try {
  //       const response = await apiClient.put(`/issues/${id}`, body);

  //       toast.success(response?.data?.message);
  //       await fetchData();
  //     } catch (err) {
  //       console.log("error->", err);
  //       toast.error(err.response.data.message);
  //     }
  //   };
  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(issueData.length / ITEMS_PER_PAGE);
  const paginatedRows = issueData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages1 = Math.ceil(eventData.length / ITEMS_PER_PAGE);
  const paginatedRows1 = eventData.slice(
    (currentPage1 - 1) * ITEMS_PER_PAGE,
    currentPage1 * ITEMS_PER_PAGE
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <PageContainer
      scopes={scopes}
      title="Add Employee"
      currentPage="Manage Employee">
      <div className="p-2 py-20 lg:p-8 w-full">
        <div className="rounded-md mb-4">
          <Breadcrumb items={breadcrumbItems} /> {/* Add Breadcrumb here */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold my-4">Employee Statistics</h1>
            <Edit className="mt-4 mr-4 cursor-pointer" onClick={openModal} />
          </div>
          <div className="flex flex-col md:flex-row w-full justify-between">
            <StackBox
              icon={<People />}
              heading="Employee Name"
              value={
                userData.firstName
                  ? `${userData.firstName} ${userData.lastName}`
                  : ""
              }
            />
            <StackBox
              icon={<Category />}
              heading="Total Issues"
              value={issueData.length || 0}
            />
            <StackBox
              icon={<Category />}
              heading="Total Events"
              value={eventData.length || 0}
            />
          </div>
        </div>
        <h1 className="text-2xl text-white lg:text-black font-bold my-4">
          Inspections
        </h1>
        {issueData.length > 0 ? (
          <>
            <Table
              columns={columnsIssue}
              rows={paginatedRows}
              refreshList={fetchData}
              //   isCloseModal={closeIssueModal}
              title="Inspections"
              //   onCloseIssueModal={handleModalOpen}
              //   handleCloseDirectly={handleSubmit}
              isPreview={openPreviewModal}
              previewKey={"content"}
              onPreviewClose={setOpenPreviewModal}
              isViewModal={openViewModal}
              onViewClose={setOpenViewModal}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage} // Pass the page change handler
            />
          </>
        ) : (
          <EmptyDisplay />
        )}

        <h1 className="text-2xl text-white lg:text-black font-bold my-4">
          Events
        </h1>
        {eventData.length > 0 ? (
          <>
            <Table
              columns={columnsEvents}
              rows={paginatedRows1}
              refreshList={fetchData}
              //   isCloseModal={closeIssueModal}
              title="Event"
              //   onCloseIssueModal={handleModalOpen}
              //   handleCloseDirectly={handleSubmit}
              isPreview={openPreviewModal1}
              previewKey={"content"}
              onPreviewClose={setOpenPreviewModal1}
              isViewModal={openViewModal1}
              onViewClose={setOpenViewModal1}
            />
            <Pagination
              currentPage={currentPage1}
              totalPages={totalPages1}
              onPageChange={setCurrentPage1} // Pass the page change handler
            />
          </>
        ) : (
          <EmptyDisplay />
        )}
      </div>
      <EditEmployeeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        userData={userData}
      />
    </PageContainer>
  );
};

export default Index;

export const getServerSideProps = async (context) => {
  let {
    req: {
      cookies: { loggedInUser },
    },
    resolvedUrl,
  } = context;

  const { scopes, canEdit } = await checkScope(loggedInUser, resolvedUrl);

  if (!scopes) {
    return {
      notFound: true,
    };
  }
  // Pass the fetched data as props to the component
  return {
    props: { scopes, canEdit },
  };
};
