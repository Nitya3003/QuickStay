import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext.jsx';
import { toast } from 'react-hot-toast';

const MyBookings = () => {
  const { axios, getToken, user } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const fetchUserBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const calculateNights = (checkIn, checkOut) => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diffTime = outDate - inDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
      <Title
        title='My Bookings'
        subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks'
        align='left'
      />

      <div className='max-w-6xl mt-8 w-full text-gray-800'>
        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
          <div className='w-1/3'>Hotels</div>
          <div className='w-1/3'>Date & Timings</div>
          <div className='w-1/3'>Payment</div>
        </div>

        {bookings.map((booking, index) => {
          const nights = calculateNights(booking.checkInDate, booking.checkOutDate);

          // Use safe access and Number conversion to avoid NaN
          const guests = Number(booking.guests || 0);
          const pricePerNight = Number(booking.room?.pricePerNight || 0);
          const totalPrice = guests * nights * pricePerNight;

          return (
            <div
              key={index}
              className='grid md:grid-cols-[3fr_2fr_1fr] border-b py-4 gap-4'
            >
              {/* --- Hotel Info --- */}
              <div className='flex max-md:flex-col md:items-center md:gap-6'>
                {booking?.room?.images?.[0] ? (
                  <img
                    src={booking.room.images[0]}
                    alt='hotel-img'
                    className='min-md:w-44 w-40 h-28 object-cover rounded shadow'
                  />
                ) : (
                  <div className='min-md:w-44 w-40 h-28 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500 shadow'>
                    No Image
                  </div>
                )}

                <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                  <p className='font-playfair text-2xl'>
                    {booking.hotel?.name || 'Hotel Name'}
                    <span className='font-inter text-sm px-1'>
                      ({booking.room?.roomType || 'Room'})
                    </span>
                  </p>

                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <img src={assets.locationIcon} alt='location-icon' />
                    <span>{booking.hotel?.address || 'No address available'}</span>
                  </div>
                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <img src={assets.guestsIcon} alt='guests-icon' />
                    <span>Guests: {booking.guests}</span>
                  </div>
                  <p className='text-base'>Total: ${totalPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* --- Date & Timings --- */}
              <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                <div>
                  <p>Check-In:</p>
                  <p className='text-gray-500 text-sm'>
                    {new Date(booking.checkInDate).toDateString()}
                  </p>
                </div>

                <div>
                  <p>Check-Out:</p>
                  <p className='text-gray-500 text-sm'>
                    {new Date(booking.checkOutDate).toDateString()}
                  </p>
                </div>
              </div>

              {/* --- Payment Status --- */}
              <div className='flex flex-col items-start justify-center pt-3'>
                <div className='flex items-center gap-2'>
                  <div
                    className={`h-3 w-3 rounded-full ${
                      booking.isPaid ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                  <p
                    className={`text-sm ${
                      booking.isPaid ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {booking.isPaid ? 'Paid' : 'Unpaid'}
                  </p>
                </div>

                {!booking.isPaid && (
                  <button className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'>
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;
