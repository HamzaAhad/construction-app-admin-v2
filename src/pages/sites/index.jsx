import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Table from "@/components/base/Table";
import SearchFilter from "@/components/base/SearchFilter";
import PageContainer from "@/components/base/PageContainer";

import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";
import EmptyDisplay from "@/components/base/EmptyDisplay";
import dynamic from "next/dynamic";
import Pagination from "@/components/base/PaginationControls";

import { FaArrowLeft } from "react-icons/fa";

import { checkScope } from "@/helpers/checkScope";

// Dynamically import AddSite with SSR disabled
const AddSite = dynamic(() => import("../../components/categories/AddSite"), {
  ssr: false,
});

const columns = [
  { name: "ID", minWidth: "70px", key: "id" },
  { name: "Name", minWidth: "150px", key: "name", link: true },
  { name: "Location", minWidth: "250px", key: "location" },
  { name: "Status", minWidth: "150px", key: "status" },
  { name: "Action", minWidth: "150px", key: "categoryAction" },
];

const Index = ({ scopes, canEdit = true }) => {
  const [filterField, setFilterField] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketModal, setTicketModal] = useState(false);

  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkLoading, setChecktLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const router = useRouter();
  const [openViewModal, setOpenViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const { stepSize } = router.query;
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/sites");
      setData(JSON.parse(JSON.stringify(response?.data)));
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };
  const handleUpdate = async (id) => {
    console.log("id-->", id);
    console.log("data", data);
    const ticket = data.filter((item) => item.id === id);
    let status;
    console.log("ticket status", ticket[0].status);
    if (ticket[0].status === "pending") {
      status = "active";
    } else {
      status = "closed";
    }
    console.log("status", status);
    try {
      const response = await apiClient.put(`/tickets/${id}`, {
        status: status,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
      }
    } catch (err) {
      console.log("error");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchData();
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const roleTitle = loggedInUser?.user?.roleTitle;

      // if (roleTitle === "User") {
      // router.push("/404");
      // } else {
      setChecktLoading(false);
      // }
    }
  }, [router]);

  if (checkLoading) {
    return null;
  }

  const handleClick = () => {
    setTicketModal(true);
  };
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

  const handleBackToSetup = () => {
    const step = Number(stepSize) + 1;
    router.push(`/setup?stepSize=${step}`);
  };

  return (
    <PageContainer
      scopes={scopes}
      title="Sites"
      currentPage="Manage Sites"
      step={stepSize ? true : false}>
      <div className="p-4 sm:p-8 w-full">
        {stepSize ? (
          <button
            onClick={handleBackToSetup}
            className="px-6 py-2 flex justify-between space-x-2 text-white bg-buttonColorPrimary hover:bg-blue-500 rounded-lg">
            <FaArrowLeft className="mt-1" />
            <span>Back to setup</span>
          </button>
        ) : null}
        <h1 className="text-2xl text-white lg:text-black font-bold my-4">
          Sites Listing
        </h1>
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filterField={filterField}
          onFilterChange={handleFilterChange}
          columns={columns}
          buttonText="Add Site"
          buttonClick={handleClick}
          downloadAble={true}
          csvName="Sites"
          data={filteredRows}
          canEdit={canEdit}
        />
        {filteredRows.length > 0 ? (
          <>
            <Table
              columns={columns}
              rows={paginatedRows}
              isViewModal={openViewModal}
              onViewClose={setOpenViewModal}
              handleUpdate={handleUpdate}
              isDelete={openDeleteModal}
              onDeleteClose={setOpenDeleteModal}
              deleteUrl="sites"
              refreshList={fetchData}
              redirect={true}
              redirectUrl="sites"
              redirectText="SubSites"
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
      <AddSite
        isOpen={ticketModal}
        onClose={setTicketModal}
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
