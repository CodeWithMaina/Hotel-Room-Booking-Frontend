import { useSelector } from "react-redux";
import HeaderCard from "../../components/dashboard/HeaderCard"
import type { RootState } from "../../app/store";

export const Settings = () => {
  const {firstName, userType} = useSelector((state:RootState)=> state.auth);

  return (
    <div>
      <HeaderCard userName={firstName ?? ""} userRole={userType ?? ""}/>
      
    </div>
  )
}
