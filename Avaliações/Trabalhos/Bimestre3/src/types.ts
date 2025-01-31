export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl: string;
  type: 'sale' | 'rent';
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  register: (email: string, password: string, role: 'user' | 'admin') => void;
  login: (email: string, password: string) => void;
  logout: () => void;
}