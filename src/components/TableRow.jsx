import React from 'react';

const TableRow = ({ customer, showUserInfo }) => {
  return (
    <tr className="text-sm">
      {showUserInfo && (
        <>
          <td className="py-4 px-4">
            <div className="flex items-center">
              <input type="checkbox" className="mr-4 rounded border-gray-300 text-purple-600" />
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-gray-500">{customer.username}</div>
                </div>
              </div>
            </div>
          </td>
          <td className="py-4 px-4 text-gray-600">{customer.email}</td>
        </>
      )}
      <td className="py-4 px-4 text-gray-600">FAC-{String(customer.id).padStart(4, '0')}</td>
      <td className="py-4 px-4 text-gray-600">{customer.date}</td>
      <td className="py-4 px-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {customer.status}
        </span>
      </td>
      <td className="py-4 px-4 text-gray-600">{customer.amount}</td>
      <td className="py-4 px-4">
        <button className="text-gray-400 hover:text-gray-600" title="Voir le détail">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
