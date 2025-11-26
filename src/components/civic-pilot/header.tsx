"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Help', href: '/help' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-2xl font-bold font-headline text-foreground">
            CivicPilot
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 p-6">
                  <Link href="/" className="text-2xl font-bold font-headline text-foreground" onClick={() => setIsOpen(false)}>
                    CivicPilot
                  </Link>
                  <nav className="flex flex-col gap-4 mt-4">
                    {navLinks.map((link) => (
                      <Link key={link.name} href={link.href} className="text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
