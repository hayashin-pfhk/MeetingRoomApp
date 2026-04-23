"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/rooms", label: "会議室作成" },
  { href: "/reservations/new", label: "会議室予約" },
  { href: "/reservations", label: "予約一覧" },
  { href: "/availability", label: "空き状況確認" },
];

// 現在のパスに一致するナビ項目のうち、最も具体的（prefixが最長）なものを選ぶ
function getActiveHref(pathname: string): string | undefined {
  return navItems
    .map((item) => item.href)
    .filter((href) => pathname === href || pathname.startsWith(href + "/"))
    .sort((a, b) => b.length - a.length)[0];
}

export default function Sidebar() {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname);

  return (
    <aside className="w-56 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0">
      <div className="h-14 flex items-center px-5 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-bold">会議室予約</span>
      </div>
      <nav className="flex-1 py-3">
        <ul className="space-y-0.5 px-2">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block px-3 py-2 rounded text-sm ${
                  href === activeHref
                    ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
