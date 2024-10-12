import { useRouter } from "next/router";
import React from "react";
import PageContainer from "@/components/base/PageContainer";
import Breadcrumb from "@/components/base/Breadcrumb";
import PermissionListing from "@/components/roles/PermissionListing";

import { checkScope } from "@/helpers/checkScope";

const Index = ({ scopes }) => {
  const router = useRouter();
  const { id } = router.query;

  const breadcrumbItems = [
    { label: "Roles", href: "/roles" },
    { label: id, href: null },
    { label: `Permission`, href: null },
  ];

  return (
    <PageContainer
      scopes={scopes}
      title="Set Permission"
      currentPage="Manage Roles"
    >
      <div className="p-4 sm:p-8 w-full">
        <Breadcrumb items={breadcrumbItems} /> {/* Add Breadcrumb here */}
        <h1 className="text-2xl text-white lg:text-black font-bold my-4">
          Set Permission
        </h1>
        <PermissionListing />
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
