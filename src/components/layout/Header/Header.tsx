import Menu from "@/components/layout/Menu";
import "./header.css";

/**
 * Site header — aircenter.space layout: burger (LEFT), logo (CENTER),
 * "Our Offices" (RIGHT). <Menu /> owns all three controls plus the single
 * shared overlay they drive; the header bar stays above the overlay so the
 * icons morph in place.
 */
export default function Header() {
  return (
    <header className="header">
      <div className="header__inner container-wide">
        <Menu />
      </div>
    </header>
  );
}
