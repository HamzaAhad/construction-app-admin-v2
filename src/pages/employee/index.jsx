import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Table from "@/components/base/Table";
import SearchFilter from "@/components/base/SearchFilter";
import PageContainer from "@/components/base/PageContainer";

import apiClient from "@/helpers/interceptor";
import EmptyDisplay from "@/components/base/EmptyDisplay";
import Pagination from "@/components/base/PaginationControls";

import { checkScope } from "@/helpers/checkScope";
import DeleteRecord from "@/components/categories/DeleteRecord.";

const columns = [
  { name: "ID", minWidth: "70px", key: "id" },
  { name: "Full Name", minWidth: "180px", key: "fullName" },
  { name: "Email", minWidth: "250px", key: "email" },
  { name: "Phone", minWidth: "250px", key: "phone" },
  { name: "Status", minWidth: "100px", key: "status" },
  { name: "Inspection Count", minWidth: "250px", key: "inspectionCount" },
  { name: "Event Count", minWidth: "200px", key: "eventCount" },
  { name: "User Stats", minWidth: "150px", key: "viewDetails" },
  { name: "Created By", minWidth: "180px", key: "createdBy" },
  { name: "Created At", minWidth: "180px", key: "createdAt" },
  { name: "Delete", minWidth: "200px", key: "deleteEmployee" },
];

const Index = ({ scopes, canEdit = true }) => {
  const [filterField, setFilterField] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const [openDeleteModal, setOpemDeleteModal] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkLoading, setChecktLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/users");

      console.log("User data", response);
      setData(JSON.parse(JSON.stringify(response?.data))); // Set the fetched data into the state
    } catch (err) {
      setError(err); // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchData();
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const roleTitle = loggedInUser?.user?.roleTitle;

      // if (roleTitle === "User") {
      // router.push("/404");
      // } else {
      setChecktLoading(false); // Only set loading to false if the user is authorized
      // }
    }
  }, [router]);

  // Render nothing or a loading state until the user role is determined
  if (checkLoading) {
    return null; // or a spinner/loading indicator if you prefer
  }

  const handleFilterChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRows = data.filter((row) =>
    String(row[filterField])
      ?.toLowerCase()
      .includes(String(searchQuery)?.toLowerCase())
  );
  const ITEMS_PER_PAGE = 10; // Define items per page here
  const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleClick = (id) => {
    router.push(`/employee/${id}`);
  };
  const handleDelete = (id) => {
    setDeleteId(id);
    setOpemDeleteModal(true);
  };

  return (
    <PageContainer
      scopes={scopes}
      title="Employees"
      currentPage="Manage Employee">
      <div className="p-4 sm:p-8 w-full">
        <h1 className="text-2xl text-white lg:text-black font-bold my-4">
          Employee Listing
        </h1>
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filterField={filterField}
          onFilterChange={handleFilterChange}
          columns={columns}
          buttonText="Add Employee"
          linkText="employee/add-employee"
          downloadAble={true}
          data={filteredRows}
          csvName="Employees"
          canEdit={canEdit}
        />
        {filteredRows.length > 0 ? (
          <>
            <Table
              columns={columns}
              rows={paginatedRows}
              handleUpdate={handleClick}
              handleEmployee={handleDelete}
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
      {deleteId && (
        <DeleteRecord
          path="users"
          isOpen={openDeleteModal}
          onClose={setOpemDeleteModal}
          refreshList={fetchData}
          recordId={deleteId}
        />
      )}
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
