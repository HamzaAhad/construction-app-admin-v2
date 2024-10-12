import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Table from "@/components/base/Table";
import SearchFilter from "@/components/base/SearchFilter";
import EmptyDisplay from "@/components/base/EmptyDisplay";
import PageContainer from "@/components/base/PageContainer";
import ClosedIssue from "@/components/categories/ClosedIssue";

import apiClient from "@/helpers/interceptor";

import { toast } from "react-toastify";
import Pagination from "@/components/base/PaginationControls";

import { checkScope } from "@/helpers/checkScope";

const columns = [
  { name: "ID", minWidth: "70px", key: "id" },
  { name: "Inspector Name", minWidth: "250px", key: "inspectorName" },
  { name: "Site Location", minWidth: "200px", key: "site" },
  { name: "Category", minWidth: "150px", key: "category" },
  { name: "Issue", minWidth: "250px", key: "issues" },
  { name: "Status", minWidth: "100px", key: "status" },
  // { name: "Deadline", minWidth: "100px", key: "deadline" },
  { name: "Created At", minWidth: "280px", key: "createdAt" },
  { name: "Preview Form", minWidth: "200px", key: "previewAction" },
  { name: "View Close Action", minWidth: "250px", key: "viewCloseAction" },
  { name: "Action", minWidth: "150px", key: "controlAction" },
];
const ITEMS_PER_PAGE = 10; // Define items per page here

const Index = ({ scopes, canEdit }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterField, setFilterField] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [closeIssueModal, setCloseIssueModal] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const { query, asPath } = router;
  const { status, tab, date, priority, range, state } = query;
  const [currentPage, setCurrentPage] = useState(1); // State for the current page

  const fetchData = async () => {
    try {
      let response;
      if (state) {
        const response = await apiClient.get("/analytics/issues-data", {
          params: { state: state, range: range }, // Ensure priority is being sent
        });
        const issuesData = JSON.parse(JSON.stringify(response?.data));
        setData(issuesData.map((issue) => ({ ...issue, controlAction: "NA" })));
      } else if (priority) {
        const response = await apiClient.get("/issues", {
          params: { priority }, // Ensure priority is being sent
        });
        const issuesData = JSON.parse(JSON.stringify(response?.data));
        setData(issuesData.map((issue) => ({ ...issue, controlAction: "NA" })));
      } else if (tab || date || status) {
        let dateParams = {};
        let start;
        let end;
        try {
          dateParams = date ? JSON.parse(date) : {};
          const { from, to } = dateParams;
          start = from;
          end = to;
        } catch (error) {
          console.error("Invalid date JSON:", error);
        }
        const activeTab = tab;
        let from = start;
        let to = end;

        // Construct params object conditionally
        const params = {
          ...(from && to ? { from, to } : {}),
          ...(activeTab ? { period: activeTab } : {}),
          ...(status ? { status } : {}),
        };
        response = await apiClient.get("/analytics/issues-analytics", {
          params,
        });
        const issuesData = JSON.parse(
          JSON.stringify(response?.data.result.issues)
        );
        setData(issuesData.map((issue) => ({ ...issue, controlAction: "NA" })));
      } else {
        response = await apiClient.get(`/issues`);
        const issuesData = JSON.parse(JSON.stringify(response?.data));
        setData(issuesData.map((issue) => ({ ...issue, controlAction: "NA" })));
      }
    } catch (err) {
      console.log("error", err);
      setError(err); // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(asPath);
    fetchData();
  }, [status, tab, priority, date, range, state]);

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
      ?.includes(searchQuery.toLowerCase())
  );
  const handleModalOpen = (val, recordId) => {
    setId(recordId);
    setCloseIssueModal(val);
  };

  const handleSubmit = async (id) => {
    const body = { status: "close" };
    try {
      const response = await apiClient.put(`/issues/${id}`, body);

      toast.success(response?.data?.message);
      await fetchData();
    } catch (err) {
      console.log("error->", err);
      toast.error(err.response.data.message);
    }
  };

  const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <PageContainer
      scopes={scopes}
      title="Inspections"
      currentPage="Manage Inspection">
      <div className="p-4 sm:p-8 w-full">
        <h1 className="text-2xl text-white lg:text-black font-bold my-4">
          Manage Inspections
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
          showButton={false}
          disableButton={true}
          downloadAble={true}
          data={filteredRows}
          csvName="Inspections"
        />
        {filteredRows.length > 0 ? (
          <>
            <Table
              columns={columns}
              rows={paginatedRows}
              refreshList={fetchData}
              isCloseModal={closeIssueModal}
              title="Inspections"
              onCloseIssueModal={handleModalOpen}
              handleCloseDirectly={handleSubmit}
              isPreview={openPreviewModal}
              previewKey={"content"}
              onPreviewClose={setOpenPreviewModal}
              isViewModal={openViewModal}
              onViewClose={setOpenViewModal}
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
        text={`Close Issue`}
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
