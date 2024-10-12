import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import PageContainer from "@/components/base/PageContainer";
import Breadcrumb from "@/components/base/Breadcrumb";
import Table from "@/components/base/Table";
import Pagination from "@/components/base/PaginationControls";
import EmptyDisplay from "@/components/base/EmptyDisplay";
import SearchFilter from "@/components/base/SearchFilter";
import AddUser from "@/components/roles/AddUser";
import apiClient from "@/helpers/interceptor";

import { checkScope } from "@/helpers/checkScope";

const columns = [
  { name: "ID", minWidth: "70px", key: "id" },
  { name: "Name", minWidth: "180px", key: "fullName" },
  { name: "Email", minWidth: "250px", key: "email" },
  { name: "Phone", minWidth: "250px", key: "phone" },
  { name: "Status", minWidth: "100px", key: "status" },
];

const Index = ({ scopes }) => {
  const router = useRouter();
  const { id } = router.query;

  const [filterField, setFilterField] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State for the current page

  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkLoading, setChecktLoading] = useState(true); // New loading state
  const [openModal, setOpenModal] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/users?roleId=${id}`);

      console.log(response);
      setData(JSON.parse(JSON.stringify(response?.data))); // Set the fetched data into the state
    } catch (err) {
      setError(err); // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("User");
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

  const breadcrumbItems = [
    { label: "Roles", href: "/roles" },
    { label: id, href: null },
    { label: `User`, href: null },
  ];

  const handleModal = () => {
    setOpenModal(true);
  };
  return (
    <PageContainer
      scopes={scopes}
      title="Associate User"
      currentPage="Manage Roles">
      <div className="p-4 sm:p-8 w-full">
        <Breadcrumb items={breadcrumbItems} /> {/* Add Breadcrumb here */}
        <h1 className="text-2xl text-white lg:text-black font-bold my-4">
          Associate User
        </h1>
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filterField={filterField}
          onFilterChange={handleFilterChange}
          columns={columns}
          buttonText="Add User"
          buttonClick={handleModal}
        />
        {filteredRows.length > 0 ? (
          <>
            <Table columns={columns} rows={paginatedRows} />
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
      <AddUser
        isOpen={openModal}
        onClose={setOpenModal}
        refreshList={fetchData}
        id={id}
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
