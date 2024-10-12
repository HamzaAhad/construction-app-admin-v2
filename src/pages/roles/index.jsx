import React, { useState, useEffect } from "react";

import Table from "@/components/base/Table";
import SearchFilter from "@/components/base/SearchFilter";
import AddCategory from "@/components/categories/AddCategory";
import PageContainer from "@/components/base/PageContainer";

import apiClient from "@/helpers/interceptor";
import { useRouter } from "next/router";
import AddRole from "@/components/roles/AddRole";

import { checkScope } from "@/helpers/checkScope";

const columns = [
  { name: "ID", key: "id", minWidth: "100px" },
  { name: "Role", key: "title", minWidth: "200px" },
  { name: "Actions", key: "roleActions", minWidth: "400px" },
  // { name: "Delete", key: "categoryAction", minWidth: "150px" },
];

const Index = ({ scopes }) => {
  const [data, setData] = useState([]);
  const [filterField, setFilterField] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleFilterChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleModal = () => {
    setOpenAddModal(true);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/roles`);

      console.log(response);
      setData(JSON.parse(JSON.stringify(response?.data))); // Set the fetched data into the state
    } catch (err) {
      setError(err); // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(); // Call the fetch function
  }, []);

  const filteredRows = data.filter((row) =>
    String(row[filterField])
      ?.toLowerCase()
      .includes(String(searchQuery)?.toLowerCase())
  );

  const handleClick = (id, path) => {
    router.push(`/roles/${id}/${path}`);
  };

  return (
    <PageContainer scopes={scopes} title="Roles" currentPage="Manage Roles">
      <div className="p-4 sm:p-8 w-full">
        <h1 className="text-2xl text-white lg:text-black font-bold my-4">
          Roles
        </h1>
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filterField={filterField}
          onFilterChange={handleFilterChange}
          columns={columns}
          buttonText="Add Role"
          buttonClick={handleModal}
        />
        <Table
          columns={columns}
          rows={data}
          refreshList={fetchData}
          isDelete={openDeleteModal}
          onDeleteClose={setOpenDeleteModal}
          deleteUrl="roles"
          handleUpdate={handleClick}
        />
      </div>
      <AddRole
        isOpen={openAddModal}
        onClose={setOpenAddModal}
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
