import { Link } from "react-router-dom";

interface AsideProps {
  title: string;
  links: Array<{
    to: string;
    label: string;
    isActive?: boolean;
  }>;
}

const Aside: React.FC<AsideProps> = ({ title, links }) => {
  return (
    <aside className="hidden bg-[#D7E0D8] md:block md:basis-[35%] lg:basis-[30%] xl:basis-[25%] 2xl:basis-[20%]">
      <h1 className="p-6 text-xl font-semibold md:px-8 lg:px-16 xl:px-24">
        {title}
      </h1>
      <nav className="flex flex-col">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-6 py-3 text-sm  md:px-8 lg:px-16 xl:px-24 ${
              link.isActive ? "bg-white font-semibold" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Aside;
