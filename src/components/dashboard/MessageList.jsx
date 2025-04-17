import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations, setActiveConversation } from '../../features/social/socialSlice';
import { initSocket } from '../../sockets/socket';
import { Send, User } from 'lucide-react';

const MessageList = () => {
  const dispatch = useDispatch();
  const { conversations, activeConversation } = useSelector((state) => state.social);
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchConversations());
    
    const socket = initSocket();
    socket.on('newMessage', () => {
      dispatch(fetchConversations());
    });
    
    return () => {
      socket.off('newMessage');
    };
  }, [dispatch]);

  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.participants.find(p => p._id !== user._id);
    return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Messages</h2>
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search conversations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No matching conversations' : 'No conversations yet'}
          </div>
        ) : (
          <ul>
            {filteredConversations.map((conversation) => {
              const otherUser = conversation.participants.find(p => p._id !== user._id);
              const lastMessage = conversation.messages[conversation.messages.length - 1];
              const isActive = activeConversation?._id === conversation._id;
              
              return (
                <li 
                  key={conversation._id}
                  onClick={() => dispatch(setActiveConversation(conversation))}
                  className={`border-b border-gray-200 cursor-pointer ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center p-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                      {otherUser?.avatar ? (
                        <img 
                          src={otherUser.avatar} 
                          alt={otherUser.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-full w-full text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {otherUser?.name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-500 truncate">
                          {lastMessage?.content || 'No messages yet'}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Send className="h-5 w-5 mr-2" />
          New Message
        </button>
      </div>
    </div>
  );
};

export default MessageList;