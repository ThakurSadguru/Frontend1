import { Mail, Phone, MessageSquare, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <HelpCircle className="mx-auto text-red-600 mb-2" size={48} />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Acess Denied !</h1>
          <p className="text-gray-600">
            Need help? Please Contact Your Administrator.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <Mail className="text-blue-600 mr-3" size={20} />
              <div>
                <h2 className="font-medium text-gray-800">Email Support</h2>
                <a href="mailto:help@clarovate.com" className="text-blue-600 hover:underline">
                  help@clarovate.com
                </a>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <Phone className="text-green-600 mr-3" size={20} />
              <div>
                <h2 className="font-medium text-gray-800">Phone Support</h2>
                <a href="tel:+18001234567" className="text-green-600 hover:underline">
                  +1 (800) 123-4567
                </a>
              </div>
            </div>
          </div>

          
        </div>

       
      </div>
    </div>
  );
}
