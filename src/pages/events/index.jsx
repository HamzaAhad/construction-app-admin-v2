import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Table from "@/components/base/Table";
import SearchFilter from "@/components/base/SearchFilter";
import PageContainer from "@/components/base/PageContainer";
import apiClient from "@/helpers/interceptor";
import ClosedIssue from "@/components/categories/ClosedIssue";
import { toast } from "react-toastify";
import EmptyDisplay from "@/components/base/EmptyDisplay";
import Pagination from "@/components/base/PaginationControls";

import { checkScope } from "@/helpers/checkScope";

const columns = [
  { name: "ID", minWidth: "70px", key: "id" },
  { name: "Inspector Name", minWidth: "250px", key: "inspectorName" },
  { name: "Site Location", minWidth: "200px", key: "location" },
  { name: "Status", minWidth: "100px", key: "status" },
  // { name: "Deadline", minWidth: "100px", key: "deadline" },
  { name: "Event Date", minWidth: "180px", key: "date" },
  { name: "Event Time", minWidth: "180px", key: "time" },
  { name: "Created At", minWidth: "180px", key: "createdAt" },
  { name: "Preview", minWidth: "150px", key: "previewAction" },
  { name: "View Close Action", minWidth: "250px", key: "viewCloseAction" },
  { name: "Action", minWidth: "150px", key: "controlAction" },
];
const ITEMS_PER_PAGE = 10; // Define items per page here

const Index = ({ scopes, canEdit = true }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterField, setFilterField] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [closeIssueModal, setCloseIssueModal] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for the current page

  const [id, setId] = useState(null);
  const router = useRouter();
  console.log("router", router);
  const { query } = router;
  const { status, tab, date } = query;
  const fetchData = async () => {
    try {
      let response;
      if (tab || date) {
        console.log("Inside if");
        let dateParams = {};
        let start;
        let end;
        try {
          dateParams = date ? JSON.parse(date) : {};
          console.log("2");
          const { from, to } = dateParams;
          console.log("3");
          start = from;
          end = to;
        } catch (error) {
          console.error("Invalid date JSON:", error);
        }
        const activeTab = tab;
        console.log("1", status, tab, end, start);
        let from = start;
        let to = end;
        // Construct params object conditionally
        const params = {
          ...(from && to ? { from, to } : {}),
          ...(activeTab ? { period: activeTab } : {}),
          ...(status ? { status } : {}),
        };
        console.log("params--->", params);
        response = await apiClient.get("/analytics/events-analytics", {
          params,
        });
        const issuesData = JSON.parse(
          JSON.stringify(response?.data.result.issues)
        );
        setData(issuesData.map((issue) => ({ ...issue, controlAction: "NA" })));
      } else {
        console.log("Inside else");
        response = await apiClient.get(`/events`);
        const issuesData = JSON.parse(JSON.stringify(response?.data));
        setData(issuesData.map((issue) => ({ ...issue, controlAction: "NA" })));
      }
      console.log("response", response);
    } catch (err) {
      setError(err); // Handle error
    } finally {
      setLoading(false);
    }
  };

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await apiClient.get(`/events`);

  //     setData(JSON.parse(JSON.stringify(response?.data))); // Set the fetched data into the state
  //   } catch (err) {
  //     setError(err); // Handle error
  //   }
  //   setLoading(false);
  // };

  useEffect(() => {
    fetchData();
  }, [status]);

  const handleFilterChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRows = data?.filter((row) =>
    row[filterField]
      ?.toString()
      .toLowerCase()
      ?.includes(searchQuery?.toLowerCase())
  );
  const handleModalOpen = (val, recordId) => {
    setId(recordId);
    setCloseIssueModal(val);
  };

  const handleSubmit = async (id) => {
    const body = { status: "close" };
    try {
      const response = await apiClient.put(`/events/${id}`, body);

      toast.success(response?.data?.message);
      await fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.error);
      console.log("Error-->", err);
    }
  };
  const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  console.log("events", paginatedRows);
  return (
    <PageContainer scopes={scopes} title="Events" currentPage="Manage Events">
      <div className="p-4 sm:p-8 w-full">
        <h1 className="text-2xl text-white lg:text-black font-bold my-4">
          Manage Events
        </h1>
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filterField={filterField}
          onFilterChange={handleFilterChange}
          columns={columns}
          buttonClass="hidden"
          buttonText="Add Employee"
          linkText="employee/add-employee"
          disableButton={true}
          showButton={false}
          downloadAble={true}
          csvName="Events"
          data={filteredRows}
        />
        {filteredRows.length > 0 ? (
          <>
            <Table
              columns={columns}
              rows={paginatedRows}
              refreshList={fetchData}
              isCloseModal={closeIssueModal}
              title="Event"
              onCloseIssueModal={handleModalOpen}
              handleCloseDirectly={handleSubmit}
              isPreview={openPreviewModal}
              previewKey={"content"}
              onPreviewClose={setOpenPreviewModal}
              isViewModal={openViewModal}
              onViewClose={setOpenViewModal}
              event={true}
              canEdit={canEdit}
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
      </div>
      <ClosedIssue
        isOpen={closeIssueModal}
        onClose={setCloseIssueModal}
        recordId={id}
        text={`Close Event`}
        refreshList={fetchData}
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
