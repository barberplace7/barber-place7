'use client';
import { useState } from 'react';

export default function MasterDataTab({ activeTab, adminData }: any) {
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  if (activeTab === 'services') {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Service Packages</h2>
          <button 
            onClick={() => setShowServiceForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add New Service
          </button>
        </div>
        
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminData.serviceList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No services yet. Add your first service to get started.
                  </td>
                </tr>
              ) : (
                adminData.serviceList.map((service: any) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{service.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.category === 'HAIRCUT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {service.category === 'HAIRCUT' ? 'Hair Cut' : 'Treatment'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {service.basePrice.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(service.commissionRate * 100).toFixed(1)}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === 'products') {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Products</h2>
          <button 
            onClick={() => setShowProductForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add New Product
          </button>
        </div>
        
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission Per Unit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminData.productList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No products yet. Add your first product to get started.
                  </td>
                </tr>
              ) : (
                adminData.productList.map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {product.basePrice.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {product.commissionPerUnit.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === 'gallery') {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Gallery Images (6 slots)</h2>
          <p className="text-gray-600 text-sm">Upload images for landing page gallery</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((slot) => (
            <div key={slot} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative group">
              <div className="w-full h-full flex flex-col items-center justify-center">
                <span className="text-gray-500 mb-2">Slot {slot}</span>
                <label className="bg-purple-600 text-white px-3 py-1 rounded text-sm cursor-pointer hover:bg-purple-700">
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div>Tab not found</div>;
}
