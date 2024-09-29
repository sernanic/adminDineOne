// MobileNav.tsx
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu as MenuIcon, Home, Layers, PlusCircle, ShoppingCart, Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const mobileItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Sections', path: '/sections', icon: Layers },
  { name: 'Additions', path: '/additions', icon: PlusCircle },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Dishes', path: '/dishes', icon: Utensils },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pt-10">
        <div className="flex flex-col items-start">
          {mobileItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`p-2 rounded flex items-center text-sm w-full ${
                  useLocation().pathname === item.path ? 'bg-black text-white' : ''
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
