import React, { useState } from "react";
import Table from "@/components/base/Table";
import Sidebar from "@/components/base/Sidebar";
import SearchFilter from "@/components/base/SearchFilter";
import PageLayout from "@/layouts/PageLayout";
import Head from "next/head";

import { checkScope } from "@/helpers/checkScope";

const columns = [
  { name: "ID", key: "id", minWidth: "100px" },
  { name: "Full Name", key: "fullName", minWidth: "200px" },
  { name: "Email", key: "email", minWidth: "250px" },
  { name: "Company Name", key: "company", minWidth: "150px" },
  { name: "Status", key: "status", minWidth: "100px" },
];

const rows = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: "john.doe@example.com",
    company: "Pinnacle Builders",
    status: "Active",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    company: "Skyline Construction Co.",
    status: "Inactive",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Johnson",
    fullName: "Michael Johnson",
    email: "michael.johnson@example.com",
    company: "Foundation Works Ltd.",
    status: "Pending",
  },
  {
    id: "4",
    firstName: "Alice",
    lastName: "Brown",
    fullName: "Alice Brown",
    email: "alice.brown@example.com",
    company: "Titan Structures",
    status: "Active",
  },
  {
    id: "5",
    firstName: "Robert",
    lastName: "Davis",
    fullName: "Robert Davis",
    email: "robert.davis@example.com",
    company: "Blueprint Construction",
    status: "Inactive",
  },
  {
    id: "6",
    firstName: "Emily",
    lastName: "Wilson",
    fullName: "Emily Wilson",
    email: "emily.wilson@example.com",
    company: "Summit Engineering Group",
    status: "Active",
  },
  {
    id: "7",
    firstName: "Daniel",
    lastName: "Miller",
    fullName: "Daniel Miller",
    email: "daniel.miller@example.com",
    company: "Prime Build Solutions",
    status: "Pending",
  },
  {
    id: "8",
    firstName: "Olivia",
    lastName: "Martinez",
    fullName: "Olivia Martinez",
    email: "olivia.martinez@example.com",
    company: "Cornerstone Development",
    status: "Active",
  },
  {
    id: "9",
    firstName: "Matthew",
    lastName: "Garcia",
    fullName: "Matthew Garcia",
    email: "matthew.garcia@example.com",
    company: "NexGen Construction",
    status: "Inactive",
  },
  {
    id: "10",
    firstName: "Sophia",
    lastName: "Anderson",
    fullName: "Sophia Anderson",
    email: "sophia.anderson@example.com",
    company: "Elevate Contracting",
    status: "Active",
  },
];

const Index = () => {
  const [filterField, setFilterField] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRows = rows.filter((row) =>
    row[filterField]?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex overflow-hidden">
      <Sidebar currentPage="Manage Client" />
      <Head>
        <title>Clients</title>
        <meta name="description" content="A simple custom form builder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="lg:min-w-[77%] lg:max-w-[77%] xl:min-w-[81%] xl:max-w-[81%] flex justify-start bg-[#edf5fa]">
        <div className="p-8 w-full">
          <h1 className="text-2xl font-bold my-4">Client Listing</h1>
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            filterField={filterField}
            onFilterChange={handleFilterChange}
            columns={columns}
            buttonText="Add Client"
            linkText="client/add-client"
          />
          <Table columns={columns} rows={filteredRows} />
        </div>
      </div>
    </div>
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
