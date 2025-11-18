// Dữ liệu chung cho cả 2 menu để tránh lặp lại code
const NAV_ITEMS = [
  { label: "NEW", href: "#" },
  { label: "BEST", href: "#" },
  { label: "SHOP", href: "#" },
  { label: "LEGACY", href: "#" },
  { label: "COMMUNITY", href: "#" },
  { label: "Q&A", href: "#" },
];

// 1. For Medal
export const NavMenuListModal = () => {
  return (
    <ul className="flex flex-col gap-0">
      {NAV_ITEMS.map((item) => (
        <li key={item.label} className="border border-gray-100 px-2 py-2">
          <a href={item.href}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

// 2. For Nav
export const NavMenuListMedium = () => {
  return (
    <ul className="flex flex-row gap-[3vw]">
      {NAV_ITEMS.map((item) => (
        <li key={item.label} className="border-0 p-0">
          <a
            href={item.href}
            className="hover:underline hover:underline-offset-2 hover:decoration-[#e2012d]"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
};