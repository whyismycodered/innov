import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { ReactNode } from 'react';

type ServiceCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
};

export default function ServiceCard({ icon, title, description, href }: ServiceCardProps) {
  return (
    <Link href={href} className="group block text-center">
      <Card className="h-full rounded-2xl shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 ease-in-out p-8 bg-card">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-0">
          <div className="bg-secondary p-5 rounded-full">
            {icon}
          </div>
          <div className="space-y-1">
            <h3 className="font-headline text-2xl font-bold text-card-foreground">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
