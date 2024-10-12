import { useRouter } from "next/router";

import FormBuilder from "@/components/formbuilder/FormBuilder";
import Breadcrumb from "@/components/base/Breadcrumb";
import PageContainer from "@/components/base/PageContainer";

import { checkScope } from "@/helpers/checkScope";

const Index = ({ scopes, canEdit = true }) => {
  const router = useRouter();
  const { categoryId } = router.query;
  const breadcrumbItems = [
    { label: "Categories", href: "/category" },
    { label: categoryId, href: `/category/${categoryId}` },
    { label: `Update Form`, href: null },
  ];
  return (
    <PageContainer
      scopes={scopes}
      title="Add Form"
      currentPage="Inspection Category"
    >
      <div className="p-4 sm:p-8 w-full">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-white text-2xl lg:text-black font-bold mb-4">
          Custom Form Builder
        </h1>
        <FormBuilder canEdit={canEdit} />
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
