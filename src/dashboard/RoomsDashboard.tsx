import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { DashboardRoomCard } from '../components/room/DashboardRoomCard';
import { Loading } from '../components/common/Loading';
import { Error } from '../components/common/Error';
import { useGetRoomByHotelIdQuery, useGetRoomsQuery } from '../features/api/roomsApi';

export const RoomsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userType, userId } = useSelector((state: RootState) => state.auth);
  const { data: allRooms, isLoading: isLoadingAll, error: allRoomsError } = useGetRoomsQuery();
  const { data: ownerRooms, isLoading: isLoadingOwner, error: ownerRoomsError } = useGetRoomByHotelIdQuery(userId as number, {
    skip: userType !== 'owner',
  });

  // Redirect users who aren't admin or owner
  React.useEffect(() => {
    if (userType === 'user') {
      navigate('/user/dashboard');
    }
  }, [userType, navigate]);

  if (userType === 'user') {
    return null; // Will redirect immediately
  }

  if ((userType === 'admin' && isLoadingAll) || (userType === 'owner' && isLoadingOwner)) {
    return <Loading />;
  }

  if ((userType === 'admin' && allRoomsError) || (userType === 'owner' && ownerRoomsError)) {
    return <Error message="Failed to load rooms. Please try again later." />;
  }

  const roomsToDisplay = userType === 'admin' ? allRooms : ownerRooms;

  if (!roomsToDisplay || roomsToDisplay.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Rooms Found</h2>
        <p className="text-muted">
          {userType === 'admin' 
            ? 'There are currently no rooms in the system.' 
            : 'You have not added any rooms to your hotel yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {userType === 'admin' ? 'All Rooms' : 'Your Hotel Rooms'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {roomsToDisplay.map((room) => (
          <DashboardRoomCard 
            key={room.roomId} 
            room={{
              roomId: room.roomId,
              roomType: room.roomType,
              pricePerNight: room.pricePerNight,
              capacity: room.capacity,
              isAvailable: room.isAvailable,
              thumbnail: room.thumbnail || '',
            }} 
          />
        ))}
      </div>
    </div>
  );
};