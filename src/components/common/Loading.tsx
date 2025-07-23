import { Loader } from "lucide-react"

export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-600 w-8 h-8" />
      </div>
  )
}
