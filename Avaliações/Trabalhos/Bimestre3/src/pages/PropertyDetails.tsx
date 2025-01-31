import { useNavigate, useParams, Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, ArrowLeft, Pencil, Trash } from 'lucide-react';
import { properties } from '../data/properties';
import { useAuth } from '../context/AuthContext';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const property = properties.find(p => p.id === Number(id));

  const handleDelete = () => {
    const index = properties.findIndex(p => p.id === Number(id));
    if (index !== -1) {
      properties.splice(index, 1);
      navigate('/properties');
    }
  };

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Propriedade não encontrada</h1>
        <Link to="/properties" className="text-blue-600 hover:underline">
          Voltar para propriedades
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to="/properties"
        className="inline-flex items-center text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar para propriedades
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-[400px] object-cover rounded-lg"
        />
        
        <div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{property.title}</h1>
            {user?.role === 'admin' && (
              <div className="flex space-x-2">
                <Link
                  to={`/admin/edit-property/${property.id}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Pencil className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center mb-4 text-gray-600">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{property.location}</span>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              ${property.price.toLocaleString()}
              {property.type === 'rent' && '/month'}
            </h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center">
                <Bed className="h-5 w-5 mr-2 text-blue-600" />
                <span>{property.bedrooms} Quartos</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-5 w-5 mr-2 text-blue-600" />
                <span>{property.bathrooms} Banheiros</span>
              </div>
              <div className="flex items-center">
                <Square className="h-5 w-5 mr-2 text-blue-600" />
                <span>{property.sqft} m²</span>
              </div>
            </div>
          </div>
          
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Contatar corretor
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails