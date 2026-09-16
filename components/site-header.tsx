"use client";
import { useCallback, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ResilientImage from "./resilient-image";
import { aboutMenu, eatStayMenu, type NavNode, whatWeDoMenu } from "../app/navigation";

function NavAnchor({ href, children, onNavigate }: { href: string; children: React.ReactNode; onNavigate?: () => void }) {
  if (href.startsWith("http")) return <a href={href} target="_blank" rel="noreferrer" onClick={onNavigate}>{children}</a>;
  return <Link href={href} onClick={onNavigate}>{children}</Link>;
}

function navItemKey(item: NavNode, depth: number) {
  return `${depth}:${item.label}:${item.href ?? "group"}`;
}

function NavChildrenChevron() {
  return <FontAwesomeIcon className="nav-chevron-right" icon={faChevronRight} aria-hidden="true" />;
}

function NavTrigger({ label }: { label: string }) {
  return <span className="nav-summary-inner"><span className="nav-label">{label}</span><FontAwesomeIcon className="nav-chevron" icon={faChevronRight} aria-hidden="true" /></span>;
}

function clearFlyoutBranch(item: HTMLElement) {
  item.classList.remove("is-flyout-open");
  item.querySelectorAll(".nav-flyout-item.is-flyout-open").forEach(node => node.classList.remove("is-flyout-open"));
}

function clearSiblingFlyouts(item: HTMLElement) {
  item.parentElement?.querySelectorAll<HTMLElement>(":scope > .nav-flyout-item.is-flyout-open").forEach(sibling => {
    if (sibling !== item) clearFlyoutBranch(sibling);
  });
}

function openFlyoutItem(item: HTMLElement) {
  clearSiblingFlyouts(item);
  item.classList.add("is-flyout-open");
}

function resetFlyouts(root: HTMLElement | null | undefined) {
  root?.querySelectorAll(".nav-flyout-item.is-flyout-open").forEach(item => item.classList.remove("is-flyout-open"));
}

function NavBranch({ items, depth = 0, onNavigate }: { items: NavNode[]; depth?: number; onNavigate?: () => void }) {
  return <ul className={depth ? "nav-subflyout" : "nav-flyout"}>
    {items.map(item => <li
      key={navItemKey(item, depth)}
      className={item.children ? "nav-flyout-item has-children" : "nav-flyout-item"}
      onMouseEnter={event => {
        clearSiblingFlyouts(event.currentTarget);
        if (item.children) openFlyoutItem(event.currentTarget);
      }}
      onMouseLeave={event => {
        const related = event.relatedTarget as Node | null;
        if (related && event.currentTarget.contains(related)) return;
        if (item.children) clearFlyoutBranch(event.currentTarget);
      }}
    >
      {item.href
        ? <NavAnchor href={item.href} onNavigate={onNavigate}><span className="nav-flyout-link"><span>{item.label}</span>{item.children && <NavChildrenChevron />}</span></NavAnchor>
        : <span className="nav-flyout-label"><span>{item.label}</span><NavChildrenChevron /></span>}
      {item.children && <NavBranch items={item.children} depth={depth + 1} onNavigate={onNavigate} />}
    </li>)}
  </ul>;
}

function NavBranchMobile({ items, depth = 0, onNavigate }: { items: NavNode[]; depth?: number; onNavigate?: () => void }) {
  return <ul className={`nav-mobile-branch depth-${depth}`}>
    {items.map(item => item.children
      ? <li key={navItemKey(item, depth)}><details className="nav-mobile-nested"><summary><span className="nav-summary-inner"><span className="nav-label">{item.label}</span><NavChildrenChevron /></span></summary><NavBranchMobile items={item.children} depth={depth + 1} onNavigate={onNavigate} /></details></li>
      : <li key={navItemKey(item, depth)}><NavAnchor href={item.href!} onNavigate={onNavigate}>{item.label}</NavAnchor></li>)}
  </ul>;
}

function DesktopDropdown({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={`nav-group nav-hover ${className}`.trim()} onMouseEnter={event => {
    (event.currentTarget as HTMLElement).classList.remove("is-dismissed");
  }} onMouseLeave={event => {
    const element = event.currentTarget as HTMLElement;
    element.classList.remove("is-dismissed");
    resetFlyouts(element);
  }}>
    <button type="button" className="nav-trigger" aria-haspopup="true" onClick={event => {
      const group = event.currentTarget.closest<HTMLElement>(".nav-hover");
      group?.classList.add("is-dismissed");
      event.currentTarget.blur();
    }}><NavTrigger label={label} /></button>
    <div className="group-links" onClickCapture={event => {
      if (!(event.target as HTMLElement).closest("a")) return;
      event.currentTarget.closest<HTMLElement>(".nav-hover")?.classList.add("is-dismissed");
      (document.activeElement as HTMLElement | null)?.blur();
    }}>{children}</div>
  </div>;
}

function MobileDropdown({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <details className={`nav-group ${className}`.trim()}>
    <summary><NavTrigger label={label} /></summary>
    <div className="group-links">{children}</div>
  </details>;
}

function NavigationLinks({ onNavigate }: { onNavigate: () => void }) {
  return <>
    <DesktopDropdown label="What we do" className="nav-mega">
      <div className="mega-links"><NavBranch items={whatWeDoMenu} onNavigate={onNavigate} /></div>
    </DesktopDropdown>
    <Link href="/rooms-and-spaces/" onClick={onNavigate}>Rooms & spaces</Link>
    <Link href="/whats-on/" onClick={onNavigate}>What’s on</Link>
    <DesktopDropdown label="Eat & stay">{eatStayMenu.map(link => <NavAnchor key={`${link.label}-${link.href}`} href={link.href} onNavigate={onNavigate}>{link.label}</NavAnchor>)}</DesktopDropdown>
    <DesktopDropdown label="About">{aboutMenu.map(link => <NavAnchor key={`${link.label}-${link.href}`} href={link.href} onNavigate={onNavigate}>{link.label}</NavAnchor>)}</DesktopDropdown>
  </>;
}

function MobileNavigationLinks({ onNavigate }: { onNavigate: () => void }) {
  return <>
    <MobileDropdown label="What we do" className="nav-mega">
      <div className="mega-links"><NavBranchMobile items={whatWeDoMenu} onNavigate={onNavigate} /></div>
    </MobileDropdown>
    <Link href="/rooms-and-spaces/" onClick={onNavigate}>Rooms & spaces</Link>
    <Link href="/whats-on/" onClick={onNavigate}>What’s on</Link>
    <MobileDropdown label="Eat & stay">{eatStayMenu.map(link => <NavAnchor key={`${link.label}-${link.href}`} href={link.href} onNavigate={onNavigate}>{link.label}</NavAnchor>)}</MobileDropdown>
    <MobileDropdown label="About">{aboutMenu.map(link => <NavAnchor key={`${link.label}-${link.href}`} href={link.href} onNavigate={onNavigate}>{link.label}</NavAnchor>)}</MobileDropdown>
  </>;
}

export default function SiteHeader() {
  const header = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const closeMenus = useCallback(() => {
    resetFlyouts(header.current);
    header.current?.querySelectorAll<HTMLDetailsElement>("details.nav-mobile[open], .nav-mobile details[open]").forEach(details => { details.open = false; });
    header.current?.querySelectorAll<HTMLElement>(".primary-navigation .nav-hover").forEach(group => {
      group.classList.add("is-dismissed");
      group.querySelector<HTMLButtonElement>(".nav-trigger")?.blur();
    });
  }, []);
  useEffect(() => { closeMenus(); }, [pathname, closeMenus]);
  useEffect(() => {
    const onHashChange = () => closeMenus();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [closeMenus]);
  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement;
      const headerEl = header.current;
      if (!headerEl) return;
      if (!headerEl.contains(target)) {
        closeMenus();
        return;
      }
      const trigger = target.closest<HTMLButtonElement>(".primary-navigation .nav-trigger");
      const group = target.closest<HTMLElement>(".primary-navigation .nav-hover");
      if (trigger && group) {
        const isOpen = !group.classList.contains("is-dismissed") && (group.matches(":hover") || document.activeElement === trigger);
        if (isOpen) {
          group.classList.add("is-dismissed");
          trigger.blur();
          event.preventDefault();
        } else if (group.classList.contains("is-dismissed")) {
          group.classList.remove("is-dismissed");
        }
        return;
      }
      if (target.closest(".primary-navigation .nav-flyout a, .primary-navigation .group-links > a")) return;
      if (!target.closest(".primary-navigation .group-links")) closeMenus();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [closeMenus]);
  return <><header className="site-header" ref={header} onKeyDown={event => {
    if (event.key === "Escape") {
      closeMenus();
      const details = (event.target as HTMLElement).closest("details");
      if (details) { details.open = false; details.querySelector("summary")?.focus(); event.preventDefault(); }
    }
  }} onToggle={event => {
    const current = event.target as HTMLDetailsElement;
    if (current.open && current.classList.contains("nav-group")) current.closest(".nav-mobile")?.querySelectorAll<HTMLDetailsElement>(".nav-group[open]").forEach(other => { if (other !== current) other.open = false; });
  }}>
    <div className="shell brand-row"><Link href="/" aria-label="Heart of England home" onClick={closeMenus}><ResilientImage priority sizes="200px" src="/images/heart-of-england-logo.png" alt="Heart of England" /></Link><nav className="primary-navigation" aria-label="Primary navigation"><NavigationLinks onNavigate={closeMenus} /></nav><div className="header-tools"><a href="tel:01676540333">01676 540333</a><Link className="enquire" href="/contact-us/" onClick={closeMenus}>Make an enquiry ↗</Link></div>
      <details className="nav-mobile"><summary aria-label="Open navigation"><span className="menu-icon" aria-hidden="true"><i /><i /><i /></span></summary><nav aria-label="Mobile navigation"><MobileNavigationLinks onNavigate={closeMenus} /></nav></details>
    </div>
  </header><Link className="mobile-enquiry" href="/contact-us/" onClick={closeMenus}>Make an enquiry ↗</Link></>;
}
