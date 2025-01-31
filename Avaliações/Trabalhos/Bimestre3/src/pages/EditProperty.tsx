import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Property } from '../types';
import { properties } from '../data/properties';

const EditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState({
    title: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    imageUrl: '',
    type: 'sale' as 'sale' | 'rent',
  });

  useEffect(() => {
    const propertyToEdit = properties.find(p => p.id === Number(id));
    if (propertyToEdit) {
      setProperty({
        title: propertyToEdit.title,
        price: propertyToEdit.price.toString(),
        location: propertyToEdit.location,
        bedrooms: propertyToEdit.bedrooms.toString(),
        bathrooms: propertyToEdit.bathrooms.toString(),
        sqft: propertyToEdit.sqft.toString(),
        imageUrl: propertyToEdit.imageUrl,
        type: propertyToEdit.type,
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProperty: Property = {
      id: Number(id),
      ...property,
      price: Number(property.price),
      bedrooms: Number(property.bedrooms),
      bathrooms: Number(property.bathrooms),
      sqft: Number(property.sqft),
    };
    
    const index = properties.findIndex(p => p.id === Number(id));
    if (index !== -1) {
      properties[index] = updatedProperty;
    }
    
    navigate('/properties');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProperty(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <Building2 className="h-8 w-8 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold">Editar Propriedade</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titulo
          </label>
          <input
            type="text"
            name="title"
            value={property.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço
            </label>
            <input
              type="number"
              name="price"
              value={property.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              name="type"
              value={property.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sale">Para Vender</option>
              <option value="rent">Para Alugar</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Localização
          </label>
          <input
            type="text"
            name="location"
            value={property.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quartos
            </label>
            <input
              type="number"
              name="bedrooms"
              value={property.bedrooms}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banheiros
            </label>
            <input
              type="number"
              name="bathrooms"
              value={property.bathrooms}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              m²
            </label>
            <input
              type="number"
              name="sqft"
              value={property.sqft}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL da Imagem
          </label>
          <input
            type="url"
            name="imageUrl"
            value={property.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Atualizar Propriedade
        </button>
      </form>
    </div>
  );
};

export default EditProperty;