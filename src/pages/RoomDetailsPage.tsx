import { useParams } from "react-router"

export const RoomDetailsPage = () => {
    const {id} = useParams<{id: string}>();
    const roomId = Number(id);
  return (
    <div>Room {roomId}</div>
  )
}
