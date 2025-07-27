import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetRoomTypesQuery,
  useCreateRoomTypeMutation,
  useUpdateRoomTypeMutation,
  useDeleteRoomTypeMutation,
  type TRoomTypeSelect,
  roomTypeSchema,
} from "../../features/api/roomTypeApi";
import { Plus, Edit, Trash2, X, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { SearchBar } from "../../components/common/SearchBar";

export const RoomTypes = () => {
  const { data: roomTypesData, isLoading, refetch } = useGetRoomTypesQuery();
  const [createRoomType] = useCreateRoomTypeMutation();
  const [updateRoomType] = useUpdateRoomTypeMutation();
  const [deleteRoomType] = useDeleteRoomTypeMutation();

  const roomTypes: RoomType[] = roomTypesData?.map((roomType) => ({
    ...roomType,
    description: roomType.description || "",
  })) || [];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const filteredRoomTypes = roomTypes.filter((type) =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomTypeFormData>({
    resolver: zodResolver(roomTypeSchema),
  });

  const closeDrawer = () => setIsDrawerOpen(false);

  const openCreateDrawer = () => {
    setEditingRoomType(null);
    reset({ name: "", description: "" });
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (roomType: RoomType) => {
    setEditingRoomType(roomType.roomTypeId);
    reset({ name: roomType.name, description: roomType.description });
    setIsDrawerOpen(true);
  };

  const onSubmit = async (data: RoomTypeFormData) => {
    try {
      if (editingRoomType) {
        await updateRoomType({ id: editingRoomType, updates: data }).unwrap();
        toast.success("Room type updated successfully");
      } else {
        await createRoomType(data).unwrap();
        toast.success("Room type created successfully");
      }
      closeDrawer();
      refetch();
    } catch (error) {
      toast.error("Something went wrong. Try again.");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteRoomType(id).unwrap();
        toast.success("Room type deleted successfully");
        refetch();
      } catch (err) {
        toast.error("Failed to delete room type");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        closeDrawer();
      }
    };
    if (isDrawerOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDrawerOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700">Room Types</h1>
          <button
            onClick={openCreateDrawer}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} /> Add Room Type
          </button>
        </div>

        <SearchBar
          placeholder="Search room types..."
          onSearch={(query) => setSearchQuery(query)}
        />

        {isLoading ? (
          <div className="bg-white shadow rounded-lg mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Name", "Description", "Created", "Actions"].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
                        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoomTypes.map((roomType) => (
                  <tr key={roomType.roomTypeId}>
                    <td className="px-6 py-4 whitespace-nowrap">{roomType.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{roomType.description || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(roomType.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button onClick={() => openEditDrawer(roomType)} className="text-blue-600 hover:text-blue-800">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(roomType.roomTypeId)} className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredRoomTypes.length === 0 && (
          <div className="text-center py-12 text-gray-500">No matching room types found.</div>
        )}

        {/* Right-side Drawer */}
        <div
          ref={drawerRef}
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">
              {editingRoomType ? "Edit Room Type" : "Create Room Type"}
            </h2>
            <button onClick={closeDrawer} className="text-gray-500 hover:text-gray-800">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name*</label>
              <input
                type="text"
                {...register("name")}
                className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                rows={3}
                {...register("description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={closeDrawer}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                <Check size={18} /> {editingRoomType ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


type RoomType = TRoomTypeSelect & {
  description: string;
};

type RoomTypeFormData = z.infer<typeof roomTypeSchema>;
