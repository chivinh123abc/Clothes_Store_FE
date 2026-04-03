// Dữ liệu chung cho cả 2 menu để tránh lặp lại code
// const NAV_ITEMS = [
//   { label: "NEW", href: "#" },
//   { label: "BEST", href: "#" },
//   { label: "SHOP", href: "#" },
//   { label: "LEGACY", href: "#" },
//   { label: "COMMUNITY", href: "#" },
//   { label: "Q&A", href: "#" },
// ];

import { useState } from "react";
import { FlyoutLink } from "../DropdownLanguage/DropdownLanguage";
import angleDownIcon from "~/assets/FAIcon/angle-down-solid-full.svg";
import { Link } from "react-router-dom";

// 1. For Medal
export const NavMenuListModal = () => {
  const [activeMenu, setActiveMenu] = useState<
    "shop" | "legacy" | "community" | null
  >(null);

  const onFocusShop = () => {
    setActiveMenu(activeMenu === "shop" ? null : "shop");
  };

  const onFocusLegacy = () => {
    setActiveMenu(activeMenu === "legacy" ? null : "legacy");
  };

  const onFocusCommunity = () => {
    setActiveMenu(activeMenu === "community" ? null : "community");
  };

  return (
    <ul className="flex flex-col gap-0">
      <li className="border border-gray-100 px-2 py-2">
        <a href="">NEW</a>
      </li>
      <li className="border border-gray-100 px-2 py-2">
        <Link to="/BEST">BEST</Link>
      </li>
      <li className="relative border border-gray-100 px-2 py-2">
        <a href="" className="">
          SHOP
        </a>
        <input
          onClick={onFocusShop}
          type="image"
          src={angleDownIcon}
          className={`w-5 h-5 absolute inset-0 translate-y-1/3 translate-x-40 z-20 transition-transform duration-300 ease-linear ${activeMenu === "shop" ? "rotate-180" : "rotate-0"}`}
        />
        <ShopExpand active={activeMenu === "shop"} />
      </li>
      <li className="relative border border-gray-100 px-2 py-2">
        <a href="" className="">
          LEGACY
        </a>
        <input
          onClick={onFocusLegacy}
          type="image"
          src={angleDownIcon}
          className={`w-5 h-5 absolute inset-0 translate-y-1/3 translate-x-40 z-20 transition-transform duration-300 ${activeMenu === "legacy" ? "rotate-180" : "rotate-0"}`}
        />
        <LegacyExpand active={activeMenu === "legacy"} />
      </li>
      <li className="relative border border-gray-100 px-2 py-2">
        <a href="" className="">
          COMMUNITY
        </a>
        <input
          onClick={onFocusCommunity}
          type="image"
          src={angleDownIcon}
          className={`w-5 h-5 absolute inset-0 translate-y-1/3 translate-x-40 z-20 transition-transform duration-300 ${activeMenu === "community" ? "rotate-180" : "rotate-0"}`}
        />
        <CommunityExpand active={activeMenu === "community"} />
      </li>
      <li className="border border-gray-100 px-2 py-2">
        <a href="">Q&A</a>
      </li>
    </ul>
  );
};

const ShopExpand = ({ active }: { active: boolean }) => {
  return (
    <ul
      className={`font-light bg-gray-50 transition-all duration-600 overflow-hidden pl-4 ${active ? "max-h-96 opacity-100 py-2 ease-in" : "max-h-0 opacity-0 ease-out"}`}
    >
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          ALL
        </a>
      </li>
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          TEAM KIT
        </a>
      </li>
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          COLLECTION
        </a>
      </li>
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          COLLABORATION
        </a>
      </li>
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          SALE
        </a>
      </li>
    </ul>
  );
};

const LegacyExpand = ({ active }: { active: boolean }) => {
  return (
    <ul
      className={`font-light bg-gray-50 transition-all duration-600 overflow-hidden pl-4 ${active ? "max-h-96 opacity-100 py-2 ease-in" : "max-h-0 opacity-0 ease-out"}`}
    >
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          2025 WORLD COLLECTION
        </a>
      </li>
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          2024 WORLD COLLECTION
        </a>
      </li>
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          2023 WORLD COLLECTION
        </a>
      </li>
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          APPAREL
        </a>
      </li>
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          GIFT & ACCESSORIES
        </a>
      </li>
    </ul>
  );
};

const CommunityExpand = ({ active }: { active: boolean }) => {
  return (
    <ul
      className={`font-light bg-gray-50 transition-all duration-600 overflow-hidden pl-4 ${active ? "max-h-96 opacity-100 py-2 ease-in" : "max-h-0 opacity-0 ease-out"}`}
    >
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          NOTICE
        </a>
      </li>
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          REVIEW
        </a>
      </li>
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          EVENT
        </a>
      </li>
      <li className="pb-2">
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          FAQ
        </a>
      </li>
    </ul>
  );
};

// 2. For Nav
export const NavMenuListMedium = () => {
  return (
    <ul className="flex flex-row gap-[3vw]">
      <li>
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          NEW
        </a>
      </li>
      <li>
        <Link
          to="/BEST"
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          BEST
        </Link>
      </li>
      <li>
        <DropdownItem title="SHOP" content={ShopContent} />
      </li>
      <li>
        <DropdownItem title="LEGACY" content={LegacyContent} />
      </li>
      <li>
        <DropdownItem title="COMMUNITY" content={CommunityContent} />
      </li>
      <li>
        <a
          href=""
          className="hover:underline hover:underline-offset-2 hover:decoration-blood-red"
        >
          Q&A
        </a>
      </li>
    </ul>
  );
};

const DropdownItem = ({
  title,
  content,
}: {
  title: string;
  content: React.ComponentType;
}) => {
  return (
    <div className="flex justify-center hover:underline hover:underline-offset-2 hover:decoration-blood-red">
      <FlyoutLink href="#" FlyoutContent={content}>
        <div className="flex justify-center items-center">
          <span className="">{title}</span>
        </div>
      </FlyoutLink>
    </div>
  );
};

const ShopContent = () => {
  return (
    <div className="w-auto bg-white shadow-xl">
      <a href="" className="block text-xs py-1 px-3">
        ALL
      </a>
      <a href="" className="block text-xs py-1 px-3">
        TEAM KIT
      </a>
      <a href="" className="block text-xs py-1 px-3">
        COLLECTION
      </a>
      <a href="" className="block text-xs py-1 px-3">
        COLABORATION
      </a>
      <a href="" className="block text-xs py-1 px-3">
        SALE
      </a>
    </div>
  );
};

const LegacyContent = () => {
  return (
    <div className="w-auto whitespace-nowrap bg-white shadow-xl">
      <a href="" className="block text-xs py-1 px-3">
        2025 WORLD COLLECTION
      </a>
      <a href="" className="block text-xs py-1 px-3">
        2024 WORLD COLLECTION
      </a>
      <a href="" className="block text-xs py-1 px-3">
        2023 WORLD COLLECTION
      </a>
      <a href="" className="block text-xs py-1 px-3">
        APPAREL
      </a>
      <a href="" className="block text-xs py-1 px-3">
        GIFT & ACCESSORIES
      </a>
    </div>
  );
};

const CommunityContent = () => {
  return (
    <div className="w-auto bg-white shadow-xl">
      <a href="" className="block text-xs py-1 px-3">
        NOTICE
      </a>
      <a href="" className="block text-xs py-1 px-3">
        REVIEW
      </a>
      <a href="" className="block text-xs py-1 px-3">
        EVENT
      </a>
      <a href="" className="block text-xs py-1 px-3">
        FAQ
      </a>
    </div>
  );
};
