import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Table from "@/components/base/Table";
import SearchFilter from "@/components/base/SearchFilter";
import Breadcrumb from "@/components/base/Breadcrumb";
import PageContainer from "@/components/base/PageContainer";
import AddForm from "@/components/formbuilder/AddForm";

import apiClient from "@/helpers/interceptor";
import { checkScope } from "@/helpers/checkScope";

const columns = [
  { name: "ID", minWidth: "70px", key: "id" },
  { name: "Form Name", minWidth: "250px", key: "formName" },
  { name: "Created At", minWidth: "180px", key: "createdAt" },
  { name: "Status", minWidth: "250px", key: "status" },
  { name: "Action", minWidth: "150px", key: "categoryAction" },
];

const Index = ({ scopes, canEdit = true }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const [filterField, setFilterField] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const { categoryId } = router.query;
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
      const response = await apiClient.get(`/forms/${categoryId}/folder`);

      console.log(response);
      setData(JSON.parse(JSON.stringify(response?.data))); // Set the fetched data into the state
    } catch (err) {
      setError(err); // Handle error
    }
    setLoading(false);
  };
  const getFolder = async () => {
    try {
      const response = await apiClient.get(`folders/${categoryId}`);
      console.log("name", response);
      const val = response.data.title;
      setName(val);
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchData();
      getFolder();
    } // Call the fetch function
  }, [categoryId]);

  const filteredRows = data.filter((row) =>
    String(row[filterField])
      ?.toLowerCase()
      .includes(String(searchQuery)?.toLowerCase())
  );
  const breadcrumbItems = [
    { label: "Categories", href: "/category" },
    { label: categoryId, href: null },
  ];

  return (
    <PageContainer
      scopes={scopes}
      title="Category Forms"
      currentPage="Inspection Category">
      <div className="p-8 w-full">
        <Breadcrumb items={breadcrumbItems} /> {/* Add Breadcrumb here */}
        <h1 className="text-2xl font-bold my-4">{name} Forms</h1>
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filterField={filterField}
          onFilterChange={handleFilterChange}
          columns={columns}
          buttonText="Add Form"
          buttonClick={handleModal}
          canEdit={canEdit}
          downloadAble={true}
          data={filteredRows}
          csvName="Forms"
          // linkText={`category/${categoryId}/formbuilder`}
        />
        <Table
          columns={columns}
          rows={filteredRows}
          isDelete={openDeleteModal}
          onDeleteClose={setOpenDeleteModal}
          deleteUrl="forms"
          refreshList={fetchData}
          isPreview={openPreviewModal}
          previewKey={"jsonContent"}
          onPreviewClose={setOpenPreviewModal}
          redirect={true}
          redirectUrl="formbuilder"
          redirectText="Create"
          canEdit={canEdit}
        />
      </div>
      <AddForm
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
