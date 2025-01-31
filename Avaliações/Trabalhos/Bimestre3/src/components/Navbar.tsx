import { Link } from 'react-router-dom';
import { Building2, Home, Info, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">DreamHome</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/properties" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <Building2 className="h-5 w-5" />
              <span>Propriedades</span>
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin/add-property" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                <Plus className="h-5 w-5" />
                <span>Nova Propriedade</span>
              </Link>
            )}
            <Link to="/about" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <Info className="h-5 w-5" />
              <span>Sobre</span>
            </Link>
            {user ? (
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                <LogOut className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar