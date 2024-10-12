import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Dashboard from "@/components/dashboard/Main";
import PageContainer from "@/components/base/PageContainer";

import { checkScope } from "@/helpers/checkScope";

const inter = Inter({ subsets: ["latin"] });

import axios from "axios";
import { notFound } from "next/navigation";

export default function Home({ scopes }) {
  const [checkLoading, setChecktLoading] = useState(true); // New loading state
  const router = useRouter();

  useEffect(() => {
    console.log(router.asPath);
    if (typeof window !== "undefined") {
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

  return (
    <PageContainer scopes={scopes} title="Dashboard" currentPage="Dashboard">
      <div className="px-4 lg:p-8 w-full">
        <h1 className="text-white lg:text-black text-2xl font-bold my-4 mx-2 lg:px-8">
          Dashboard
        </h1>
        <Dashboard />
      </div>
    </PageContainer>
  );
}

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
