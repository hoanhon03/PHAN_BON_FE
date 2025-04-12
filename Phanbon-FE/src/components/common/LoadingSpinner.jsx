import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="relative">
        <div className="w-20 h-20 border-green-200 border-2 rounded-full"></div>
        <div className="w-20 h-20 border-green-500 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 bg-gradient-to-tr from-green-400 to-green-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="ml-4 text-xl font-semibold text-green-700 animate-pulse">
        Đang tải...
      </div>
    </div>
  );
};

export default LoadingSpinner;