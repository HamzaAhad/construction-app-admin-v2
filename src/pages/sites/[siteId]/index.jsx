import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Table from "@/components/base/Table";
import SearchFilter from "@/components/base/SearchFilter";
import Breadcrumb from "@/components/base/Breadcrumb";
import PageContainer from "@/components/base/PageContainer";
import AddForm from "@/components/formbuilder/AddForm";

import apiClient from "@/helpers/interceptor";

import dynamic from "next/dynamic";
import EmptyDisplay from "@/components/base/EmptyDisplay";
import AddCategory from "@/components/categories/AddCategory";
import AddSubSite from "@/components/sites/AddSubSite";

import { checkScope } from "@/helpers/checkScope";

// Dynamically import AddSite with SSR disabled
const AddSite = dynamic(
  () => import("../../../components/categories/AddSite"),
  {
    ssr: false,
  }
);

const columns = [
  { name: "ID", minWidth: "70px", key: "id" },
  { name: "Created By", minWidth: "250px", key: "inspectorName" },
  { name: "Site Name", minWidth: "250px", key: "name", link: false },
  { name: "Created At", minWidth: "250px", key: "createdAt" },
  { name: "Action", minWidth: "150px", key: "categoryAction" },
];

const Index = ({ scopes, canEdit = true }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [ticketModal, setTicketModal] = useState(false);

  const [filterField, setFilterField] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [siteName, setSiteName] = useState("");
  const router = useRouter();
  const { siteId } = router.query;
  const handleFilterChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleModal = () => {
    setTicketModal(true);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/sub-sites/${siteId}/site`);

      setData(JSON.parse(JSON.stringify(response?.data))); // Set the fetched data into the state
    } catch (err) {
      setError(err); // Handle error
    }
    setLoading(false);
  };
  const getSite = async () => {
    try {
      const response = await apiClient.get(`sites/${siteId}`);
      console.log("name", response);
      const val = response.data.result.name;
      setSiteName(val);
    } catch (err) {
      console.log("err", err);
    }
  };
  useEffect(() => {
    if (siteId) {
      fetchData();
      getSite();
    } // Call the fetch function
  }, [siteId]);

  const filteredRows = data.filter((row) =>
    String(row[filterField])
      ?.toLowerCase()
      .includes(String(searchQuery)?.toLowerCase())
  );
  const breadcrumbItems = [
    { label: "Sites", href: "/sites" },
    { label: siteId, href: null },
  ];

  return (
    <PageContainer scopes={scopes} title="Sub Sites" currentPage="Manage Sites">
      <div className="p-8 w-full">
        <Breadcrumb items={breadcrumbItems} /> {/* Add Breadcrumb here */}
        <h1 className="text-2xl font-bold my-4">{siteName} Sub Sites</h1>
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filterField={filterField}
          onFilterChange={handleFilterChange}
          columns={columns}
          buttonText="Add Sub Site"
          buttonClick={handleModal}
          downloadAble={true}
          data={filteredRows}
          csvName="SubSites"
          canEdit={canEdit}
          // linkText={`category/${categoryId}/formbuilder`}
        />
        {filteredRows.length > 0 ? (
          <Table
            columns={columns}
            rows={filteredRows}
            isDelete={openDeleteModal}
            onDeleteClose={setOpenDeleteModal}
            deleteUrl="sub-sites"
            refreshList={fetchData}
            previewKey={"jsonContent"}
            // redirect={true}
            // redirectUrl="sites"
            canEdit={canEdit}
          />
        ) : (
          <EmptyDisplay />
        )}
        <AddSubSite
          isOpen={ticketModal}
          onClose={setTicketModal}
          refreshList={fetchData}
          siteId={siteId}
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
