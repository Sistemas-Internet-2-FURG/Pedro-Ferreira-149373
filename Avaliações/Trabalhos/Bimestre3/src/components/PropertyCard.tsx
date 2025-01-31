import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    return property.type === 'rent'
      ? `R$ ${price.toLocaleString()}/month`
      : `R$ ${price.toLocaleString()}`;
  };

  return (
    <Link to={`/property/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">{property.title}</h3>
          <div className="flex items-center mt-2 text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(property.price)}
            </span>
            <span className="text-sm text-white bg-blue-600 px-2 py-1 rounded">
              Para {property.type === 'sale' ? 'Venda' : 'Aluguel'}
            </span>
          </div>
          <div className="mt-4 flex justify-between text-gray-600">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bedrooms} quartos</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bathrooms} banheiros</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.sqft} m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;