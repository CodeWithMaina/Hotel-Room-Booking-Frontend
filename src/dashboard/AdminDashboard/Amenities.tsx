import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  amenitySchema,
  type AmenityFormValues,
  type TAmenitySelect,
} from "../../types/amenities.schema";
import {
  useCreateAmenityMutation,
  useDeleteAmenityMutation,
  useGetAmenitiesQuery,
  useUpdateAmenityMutation,
} from "../../features/api/amenitiesApi";
import * as LucideIcons from "lucide-react";
import {
  Trash2,
  PencilLine,
  Plus,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { SearchBar } from "../../components/common/SearchBar";
import { parseRTKError } from "../../utils/parseRTKError";

const MySwal = withReactContent(Swal);

export const Amenities = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<TAmenitySelect | null>(
    null
  );
  const [IconComponent, setIconComponent] = useState<LucideIcon | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: amenities, isLoading, isError } = useGetAmenitiesQuery();
  const [createAmenity] = useCreateAmenityMutation();
  const [updateAmenity] = useUpdateAmenityMutation();
  const [deleteAmenity] = useDeleteAmenityMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AmenityFormValues>({
    resolver: zodResolver(amenitySchema),
    defaultValues: { name: "", description: "", icon: "" },
  });

  const iconName = watch("icon");

  useEffect(() => {
    const Raw = LucideIcons[iconName as keyof typeof LucideIcons];
    if (typeof Raw === "function" && "displayName" in Raw) {
      setIconComponent(() => Raw as LucideIcon);
    } else {
      setIconComponent(() => XCircle);
    }
  }, [iconName]);

  const showDrawer = (amenity: TAmenitySelect | null = null) => {
    setEditingAmenity(amenity);
    reset({
      name: amenity?.name || "",
      description: amenity?.description || "",
      icon: amenity?.icon || "",
    });
    setDrawerOpen(true);
  };

  const onClose = () => {
    setDrawerOpen(false);
    setEditingAmenity(null);
  };

  const onSubmit = async (values: AmenityFormValues) => {
    try {
      if (editingAmenity) {
        await updateAmenity({
          id: editingAmenity.amenityId,
          data: values,
        }).unwrap();
        toast.success("Amenity updated successfully");
      } else {
        await createAmenity(values).unwrap();
        toast.success("Amenity created successfully");
      }
      onClose();
    } catch (err) {
      const errorMessage = parseRTKError(
        err,
        "Something went wrong. Please try again."
      );
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteAmenity(id).unwrap();
        toast.success("Amenity deleted successfully");
      } catch (err) {
        const errorMessage = parseRTKError(
          err,
          "Something went wrong. Please try again."
        );
        toast.error(errorMessage);
      }
    }
  };

  const filteredAmenities = amenities?.filter(
    (amenity) =>
      amenity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (amenity.description ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Amenities Management</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => showDrawer()}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Amenity
          </button>
        </div>

        <div className="mb-4">
          <SearchBar
            placeholder="Search amenities..."
            onSearch={setSearchQuery}
            isLoading={isLoading}
          />
        </div>

        {isError && <div className="text-red-500">Error loading amenities</div>}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="skeleton h-12 w-full rounded-lg bg-slate-200 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Icon</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAmenities?.map((amenity, index) => {
                  const RawIcon =
                    LucideIcons[amenity.icon as keyof typeof LucideIcons];
                  const Icon: LucideIcon =
                    typeof RawIcon === "function" && "displayName" in RawIcon
                      ? (RawIcon as LucideIcon)
                      : XCircle;

                  return (
                    <tr
                      key={amenity.amenityId}
                      className={index % 2 !== 0 ? "bg-slate-100" : ""}
                    >
                      <td>{amenity.name}</td>
                      <td>{amenity.description || "-"}</td>
                      <td>
                        <span className="flex items-center gap-1 text-gray-700">
                          <Icon className="w-4 h-4" />
                          <span>{amenity.icon}</span>
                        </span>
                      </td>
                      <td>{new Date(amenity.createdAt).toLocaleString()}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => showDrawer(amenity)}
                          >
                            <PencilLine className="w-4 h-4" />
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleDelete(amenity.amenityId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer Form */}
      <div
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative h-full flex flex-col p-6">
          <button
            className="absolute top-4 right-4 btn btn-sm btn-circle"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="text-xl font-semibold mb-4 mt-2">
            {editingAmenity ? "Edit Amenity" : "Create Amenity"}
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 overflow-auto"
          >
            <div>
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                {...register("name")}
                className="input input-bordered w-full"
                placeholder="Amenity name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register("description")}
                className="textarea textarea-bordered w-full"
                rows={3}
                placeholder="Description (optional)"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <label className="label">
                <span className="label-text">Icon</span>
              </label>
              <input
                type="text"
                {...register("icon")}
                className="input input-bordered w-full"
                placeholder="Icon name (e.g. Wifi, Tv)"
              />
              {errors.icon && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.icon.message}
                </p>
              )}
              {IconComponent && (
                <IconComponent className="w-5 h-5 mt-2 text-slate-500" />
              )}
            </div>
            <div className="pt-2">
              <button type="submit" className="btn btn-primary w-full">
                {editingAmenity ? "Update Amenity" : "Create Amenity"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
