// MainNav.tsx
import { Button } from '../ui/button';
import { Link, useLocation } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const menuItems = [
    { name: 'Home', path: '/'  },
    { name: 'Sections', path: '/sections'  },
    { name: 'Dishes', path: '/dishes'  },
    { name: 'Additions', path: '/additions'  },
    { name: 'Orders', path: '/orders'  },
    
  ];

export default function MainNav() {
  const location = useLocation();

  return (
    <div className="mr-4 hidden items-center gap-4 md:flex">
      <Select>
        <SelectTrigger className="w-[180px] h-8">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>

      {menuItems.map((item, index) => (
        <Link
        key={item.name}
        to={item.path}
        className={` p-2 rounded flex items-center  text-sm ${
          location.pathname === item.path
            ? 'flex h-7 items-center justify-center rounded-full px-4 text-center transition-colors hover:text-primary bg-muted font-medium text-primary self-center'
            : 'hover:text-primary'
        }`}
      >
        {item.name}
      </Link>
      ))}
    </div>
  );
}
