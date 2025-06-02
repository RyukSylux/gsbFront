import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationItem = ({ notification }) => {
  const { removeNotification } = useNotification();
  
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };
  return (
    <div
      className={`transform transition-all duration-300 ease-in-out w-full rounded-lg shadow-lg border ${getBgColor()}`}
      role="alert"
    >
      <div className="flex items-center p-3 sm:p-4">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className={`${getTextColor()} flex-1 ml-3`}>
          <p className="text-sm sm:text-base font-medium">{notification.message}</p>
        </div>
        <button
          onClick={() => removeNotification(notification.id)}
          className={`flex-shrink-0 ml-4 ${getTextColor()} hover:opacity-75 focus:outline-none`}
        >
          <span className="sr-only">Fermer</span>
          <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const NotificationsContainer = () => {
  const { notifications } = useNotification();
  
  return (
    <div className="fixed left-0 right-0 top-0 z-50 pointer-events-none">
      <div className="max-w-sm mx-auto px-4 sm:px-6 pt-20 sm:pt-24">
        <div className="space-y-4 pointer-events-auto">
          {notifications.map(notification => (
            <NotificationItem 
              key={notification.id} 
              notification={notification}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsContainer;
