import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Table from "@/components/base/Table";
import PageContainer from "@/components/base/PageContainer";

import apiClient from "@/helpers/interceptor";
import Pagination from "@/components/base/PaginationControls";

import { checkScope } from "@/helpers/checkScope";

const columns = [
  { name: "ID", minWidth: "70px", key: "id" },
  { name: "Email", minWidth: "150px", key: "email" },
  { name: "Username", minWidth: "150px", key: "userName" },
  { name: "Entity", minWidth: "100px", key: "entity" },
  { name: "Company Name", minWidth: "200px", key: "companyName" },
  { name: "Action", minWidth: "250px", key: "title" },
];

const ITEMS_PER_PAGE = 10; // Define items per page here

const Index = ({ scopes }) => {
  const [filterField, setFilterField] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");

  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkLoading, setChecktLoading] = useState(true); // New loading state
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/system-logs");
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

  const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <PageContainer
      scopes={scopes}
      title="System Logs"
      currentPage="System Logs"
    >
      <div className="p-4 sm:p-8 w-full">
        <h1 className="text-2xl text-white lg:text-black font-bold my-4">
          System Logs Listing
        </h1>
        <Table columns={columns} rows={paginatedRows} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage} // Pass the page change handler
        />
      </div>
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
