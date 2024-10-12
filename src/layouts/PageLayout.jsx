import Sidebar from "@/components/base/Sidebar";

const PageLayout = ({ children, currentPage }) => {
  return (
    <div className="flex overflow-hidden">
      <Sidebar currentPage={currentPage} />
      <div className="p-4 lg:min-w-[82%] lg:max-w-[82%] xl:min-w-[87%] xl:max-w-[87%] flex justify-start bg-[#edf5fa]">
        <div className="p-8 w-full">{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
