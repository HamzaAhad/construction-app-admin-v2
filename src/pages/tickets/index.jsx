import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Table from "@/components/base/Table";
import SearchFilter from "@/components/base/SearchFilter";
import PageContainer from "@/components/base/PageContainer";

import apiClient from "@/helpers/interceptor";
import AddTicket from "@/components/categories/AddTicket";
import { toast } from "react-toastify";
import EmptyDisplay from "@/components/base/EmptyDisplay";
import Pagination from "@/components/base/PaginationControls";

import { checkScope } from "@/helpers/checkScope";

const columns = [
  { name: "ID", minWidth: "70px", key: "id" },
  { name: "Email", minWidth: "150px", key: "email" },
  { name: "Description", minWidth: "250px", key: "description" },
  { name: "Company Name", minWidth: "200px", key: "companyName" },
  { name: "Status", minWidth: "150px", key: "status" },
  { name: "View Ticket", minWidth: "200px", key: "viewItem" },
  { name: "Action", minWidth: "200px", key: "updateStatus" },
];

const Index = ({ scopes, canEdit = true }) => {
  const [filterField, setFilterField] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketModal, setTicketModal] = useState(false);

  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkLoading, setChecktLoading] = useState(true); // New loading state
  const router = useRouter();
  const [openViewModal, setOpenViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for the current page

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/tickets");

      console.log(response);
      setData(JSON.parse(JSON.stringify(response?.data))); // Set the fetched data into the state
    } catch (err) {
      setError(err); // Handle error
    }
    setLoading(false);
  };
  const handleUpdate = async (id) => {
    const ticket = data.filter((item) => item.id === id);
    let status;
    if (ticket[0].status === "pending") {
      status = "active";
    } else {
      status = "closed";
    }
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
      setChecktLoading(false); // Only set loading to false if the user is authorized
      // }
    }
  }, [router]);

  // Render nothing or a loading state until the user role is determined
  if (checkLoading) {
    return null; // or a spinner/loading indicator if you prefer
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

  return (
    <PageContainer scopes={scopes} title="Tickets" currentPage="Manage Tickets">
      <div className="p-4 sm:p-8 w-full">
        <h1 className="text-2xl text-white lg:text-black font-bold my-4">
          Tickets Listing
        </h1>
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filterField={filterField}
          onFilterChange={handleFilterChange}
          columns={columns}
          buttonText="Add Ticket"
          buttonClick={handleClick}
          downloadAble={true}
          csvName="Tickets"
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
      <AddTicket
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
