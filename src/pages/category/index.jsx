import React, { useState, useEffect } from "react";

import Table from "@/components/base/Table";
import SearchFilter from "@/components/base/SearchFilter";
import AddCategory from "@/components/categories/AddCategory";
import PageContainer from "@/components/base/PageContainer";

import apiClient from "@/helpers/interceptor";
import { useRouter } from "next/router";

import { FaArrowLeft } from "react-icons/fa";
import { checkScope } from "@/helpers/checkScope";

const columns = [
  { name: "ID", key: "id", minWidth: "100px" },
  { name: "Folder Name", key: "folderName", minWidth: "200px" },
  { name: "Created By", key: "authorName", minWidth: "200px" },
  { name: "Created At", key: "createdAt", minWidth: "250px" },
  { name: "Action", key: "categoryAction", minWidth: "150px" },
];

const Index = ({ scopes, canEdit = true }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterField, setFilterField] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const router = useRouter();
  const { stepSize } = router.query;

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
      const response = await apiClient.get("/folders");

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
  const handleBackToSetup = () => {
    const step = Number(stepSize) + 1;
    router.push(`/setup?stepSize=${step}`);
  };

  return (
    <PageContainer
      scopes={scopes}
      title="Categories"
      currentPage="Inspection Category"
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
          Inspection Category
        </h1>
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filterField={filterField}
          onFilterChange={handleFilterChange}
          columns={columns}
          buttonText="Add Category"
          buttonClick={handleModal}
          downloadAble={true}
          data={filteredRows}
          csvName="Categories"
          canEdit={canEdit}
        />
        <Table
          columns={columns}
          rows={filteredRows}
          refreshList={fetchData}
          // isEdit={openEditModal}
          isDelete={openDeleteModal}
          // onEditClose={setOpenEditModal}
          onDeleteClose={setOpenDeleteModal}
          deleteUrl="folders"
          redirect={true}
          redirectUrl="category"
          redirectText="Forms"
          canEdit={canEdit}
        />
      </div>
      <AddCategory
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
