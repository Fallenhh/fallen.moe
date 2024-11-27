import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold px-3 py-2 rounded-md hover:bg-gray-100 transition-all inline-block"
        >
          Atelier Fallenhh
        </Link>
        <ul className="flex gap-8">
          <li>
            <Link
              href="/archive"
              className="text-xl font-medium px-3 py-2 rounded-md hover:bg-gray-100 transition-all inline-block"
            >
              Archive
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-xl font-medium px-3 py-2 rounded-md hover:bg-gray-100 transition-all inline-block"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
