"use client";

import * as React from "react";
import Link from "next/link";
import { Sun, Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { solutions, company } from "@/data/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 relative flex items-center justify-center transition-transform group-hover:scale-110">
              <svg className="w-10 h-10 absolute" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="16" fill="#FACC15" />
                <g stroke="#FBBF24" strokeWidth="3">
                  <line x1="32" y1="0" x2="32" y2="12" />
                  <line x1="32" y1="52" x2="32" y2="64" />
                  <line x1="0" y1="32" x2="12" y2="32" />
                  <line x1="52" y1="32" x2="64" y2="32" />
                  <line x1="10" y1="10" x2="18" y2="18" />
                  <line x1="46" y1="46" x2="54" y2="54" />
                  <line x1="10" y1="54" x2="18" y2="46" />
                  <line x1="46" y1="18" x2="54" y2="10" />
                </g>
              </svg>
              <svg className="w-5 h-5 absolute text-accent" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="6" fill="currentColor" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-accent">
              Aqua<span className="text-primary">Solar</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {/* Solutions */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent">
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {solutions.map((item) => (
                      <ListItem key={item.title} title={item.title} href={item.href}>
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Product */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Link href="#features">Product</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Company */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent">
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {company.map((item) => (
                      <ListItem key={item.title} title={item.title} href={item.href}>
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Contact */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Link href="#contact">Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Buttons Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" asChild className="hover:bg-accent hover:text-accent-foreground">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-opacity"
              asChild
            >
              <Link href="/demo">Request Demo</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card border-border">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                    <Sun className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-primary">AquaSolar</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {/* Solutions Mobile */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Solutions</h3>
                  <div className="flex flex-col gap-2 pl-2">
                    {solutions.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="text-muted-foreground hover:text-primary transition-colors py-1"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Product Mobile */}
                <Link
                  href="#features"
                  className="font-semibold text-lg text-foreground hover:text-primary transition-colors"
                >
                  Product
                </Link>

                {/* Company Mobile */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Company</h3>
                  <div className="flex flex-col gap-2 pl-2">
                    {company.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="text-muted-foreground hover:text-primary transition-colors py-1"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Contact Mobile */}
                <Link
                  href="#contact"
                  className="font-semibold text-lg text-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>

                {/* CTA Buttons Mobile */}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                  <Button variant="outline" asChild className="w-full border-border hover:bg-accent hover:text-accent-foreground">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-opacity"
                    asChild
                  >
                    <Link href="/demo">Request Demo</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// ListItem Component
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
      </Link>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";
