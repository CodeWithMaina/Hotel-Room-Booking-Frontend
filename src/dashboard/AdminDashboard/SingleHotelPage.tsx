import { useParams } from 'react-router'

export const SingleHotelPage = () => {
    const {id} = useParams();
    const hotelId = Number(id);
    console.log(hotelId)
  return (
    <div>SingleHotelPage</div>
  )
}
