import React from 'react';

const TableRow = ({ customer }) => {
  return (
    <tr className="text-sm">
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
      <td className="py-4 px-4 text-gray-600">{customer.date}</td>
      <td className="py-4 px-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {customer.status}
        </span>
      </td>
      <td className="py-4 px-4 text-gray-600">{customer.amount}</td>
      <td className="py-4 px-4">
        <button className="text-gray-400 hover:text-gray-600" title="Modifier">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
