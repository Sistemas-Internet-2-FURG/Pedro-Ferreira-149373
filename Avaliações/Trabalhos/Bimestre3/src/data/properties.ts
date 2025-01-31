import { Property } from '../types';

export const properties: Property[] = [
  {
    id: 1,
    title: 'Apartamento Moderno no Centro',
    price: 450000,
    location: 'Centro, Rio Grande',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80',
    type: 'sale'
  },
  {
    id: 2,
    title: 'Casa de Praia',
    price: 850000,
    location: 'Cassino',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80',
    type: 'sale'
  },
  {
    id: 3,
    title: 'Apartamento Estúdio',
    price: 1800,
    location: 'Rio Grande',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 600,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80',
    type: 'rent'
  }
];