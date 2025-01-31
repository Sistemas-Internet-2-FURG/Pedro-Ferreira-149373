import { Users, Award, Clock } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Sobre o DreamHome</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Estamos dedicados a ajudá-lo a encontrar a propriedade perfeita que se adapte ao seu estilo de vida e sonhos.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12 mb-16">
        <div className="text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Equipe Especializada</h3>
          <p className="text-gray-600">Nossos agentes experientes estão aqui para orientá-lo em cada etapa</p>
        </div>
        <div className="text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Serviço Confiável</h3>
          <p className="text-gray-600">Serviço premiado com milhares de clientes satisfeitos</p>
        </div>
        <div className="text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Resultados Rápidos</h3>
          <p className="text-gray-600">Processo rápido e eficiente para ajudá-lo a encontrar a casa dos seus sonhos</p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Nossa Missão</h2>
        <p className="text-gray-700 text-center max-w-3xl mx-auto">
          No DreamHome, acreditamos que todos merecem encontrar a casa perfeita. Nossa missão é tornar o processo de
          busca por imóveis simples, agradável e bem-sucedido. Com nossa ampla rede e equipe dedicada,
          estamos comprometidos em ajudá-lo a alcançar seus objetivos imobiliários.
        </p>
      </div>
    </div>
  );
};

export default About;
