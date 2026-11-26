import Link from "next/link";
import { ActionLink } from "./action-button";
import { Logo, Wordmark } from "./logo";

export function SiteHeader() {
  return (
    <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
      <Link
        href="/"
        className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        aria-label="voca, inicio"
      >
        <Logo />
        <Wordmark />
      </Link>

      <nav className="hidden items-center gap-8 text-[13px] text-white/55 md:flex">
        <a href="#como-funciona" className="transition-colors hover:text-white">
          Cómo funciona
        </a>
        <a href="#intereses" className="transition-colors hover:text-white">
          Los 6 intereses
        </a>
      </nav>

      <ActionLink href="/test" size="sm" variant="glass" className="pr-4">
        Empezar
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </ActionLink>
    </header>
  );
}
