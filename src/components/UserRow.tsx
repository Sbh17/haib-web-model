
import React from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface UserRowProps {
  user: User;
  onResetPassword: () => void;
  onDelete: () => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onResetPassword, onDelete }) => {
  const createdDate = new Date(user.createdAt);
  const roleColors = {
    user: "bg-blue-100 text-blue-800",
    salon_owner: "bg-purple-100 text-purple-800",
    admin: "bg-red-100 text-red-800"
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="flex items-center mt-1">
            <span className={`text-xs px-2 py-1 rounded-full ${roleColors[user.role]}`}>
              {user.role === "salon_owner" ? "Salon Owner" : 
               user.role === "admin" ? "Admin" : "User"}
            </span>
            <span className="text-xs text-gray-400 ml-2">
              Joined {format(createdDate, 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onResetPassword}
        >
          Reset Password
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default UserRow;
