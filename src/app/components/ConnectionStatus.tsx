import React from 'react';
import { ConnectionStatus as StatusType } from '../types/market';

interface Props {
  status: StatusType;
}

export const ConnectionStatus: React.FC<Props> = ({ status }) => {
  const statusConfig = {
    connecting: { color: 'bg-yellow-500', text: 'Connecting...' },
    connected: { color: 'bg-green-500', text: 'Connected' },
    disconnected: { color: 'bg-red-500', text: 'Disconnected' },
    error: { color: 'bg-red-600', text: 'Error' },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-800">
      <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
      <span className="text-sm text-gray-300">{config.text}</span>
    </div>
  );
};