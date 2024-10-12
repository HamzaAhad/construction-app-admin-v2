import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import ImportFeature from "@/components/import/ImportFeatures";
import FileUploadComponent from "@/components/import/FileUpload";
import SpreadsheetComponent from "@/components/import/SpreadSheet";
import PageContainer from "@/components/base/PageContainer";

import { FaArrowLeft } from "react-icons/fa";
import { checkScope } from "@/helpers/checkScope";

const Index = ({ scopes, canEdit = true }) => {
  const [selectedItem, setSelectedItem] = useState("clients");
  const [loading, setLoading] = useState(true); // New loading state
  const router = useRouter();
  const { stepSize } = router.query;
  console.log("stepSize", stepSize);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const roleTitle = loggedInUser?.user?.roleTitle;
      // if (roleTitle === "User") {
      // router.push("/404");
      // } else {
      setLoading(false);
      // setCheckLoading(false); // Only set loading to false if the user is authorized
      // }
    }
  }, [router]);

  // Render nothing or a loading state until the user role is determined
  if (loading) {
    return null; // or a spinner/loading indicator if you prefer
  }

  const handleBackToSetup = () => {
    const step = Number(stepSize) + 1;
    router.push(`/setup?stepSize=${step}`);
  };
  return (
    <PageContainer
      scopes={scopes}
      title="Manage Import"
      currentPage="Manage Import"
      step={stepSize ? true : false}
    >
      {stepSize ? (
        <button
          onClick={handleBackToSetup}
          className="px-6 py-2 mx-8 mt-4 flex justify-between space-x-2 text-white bg-buttonColorPrimary hover:bg-blue-500 rounded-lg"
        >
          <FaArrowLeft className="mt-1" />
          <span>Back to setup</span>
        </button>
      ) : null}
      <div className="w-full flex flex-col lg:flex-row">
        <div className="p-4 sm:p-8 w-full lg:w-8/12 mb-20 md:mb-0">
          <h1 className="text-2xl text-white lg:text-black font-bold my-3">
            Import Data
          </h1>
          <div className="w-full lg:hidden">
            <ImportFeature
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </div>
          <FileUploadComponent />
          {/* <ExcelLikeTable /> */}
          <SpreadsheetComponent selectedItem={selectedItem} />
        </div>
        <div className="hidden p-8 lg:block lg:w-4/12">
          <ImportFeature
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </div>
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
