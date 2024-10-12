import Link from "next/link";

const Breadcrumb = ({ items }) => {
  return (
    <nav className="text-sm font-medium text-gray-500">
      <ol className="list-reset flex">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {item.href ? (
              <Link href={item.href}>
                <div className="text-gray-300 lg:text-buttonColorPrimary hover:underline">
                  {item.label}
                </div>
              </Link>
            ) : (
              <span className="text-gray-400 lg:text-black">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
