
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const Index = () => {
  return (
    <MainLayout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Streamline Your Inventory Management
              </h1>
              <p className="text-lg mb-8">
                Logicall provides a seamless connection between clients and warehouse
                staff, making inventory management efficient and transparent.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/client/login" className="inventory-btn-primary">
                  Client Access
                </Link>
                <Link to="/staff/login" className="inventory-btn-accent">
                  Staff Login
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-inventory-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Real-time inventory tracking for clients</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-inventory-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Efficient warehouse management for staff</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-inventory-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Detailed inventory reports and analytics</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-inventory-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure client and staff portals</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-inventory-secondary h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-inventory-primary font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Client Registration</h3>
              <p>Clients are registered in our system with secure access to their inventory records.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-inventory-secondary h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-inventory-primary font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Inventory Management</h3>
              <p>Staff manages inventory updates, additions, and reports in real-time.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-inventory-secondary h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-inventory-primary font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Access</h3>
              <p>Clients can view their current inventory status from anywhere, anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
