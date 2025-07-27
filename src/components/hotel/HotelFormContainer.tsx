import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { HotelFormPage } from "./HotelFormPage";
import { 
  useCreateHotelMutation, 
  useUpdateHotelMutation,
  useGetHotelByIdQuery
} from "../../features/api/hotelsApi";
import { Loading } from "../common/Loading";
import { Error } from "../common/Error";
import type { HotelFormData } from "../../validation/hotelFormSchema";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

type HotelFormContainerProps = {
  mode: "create" | "edit";
  hotelId?: number;
  defaultValues?: Partial<HotelFormData>;
  onSuccess?: () => void;
};

export const HotelFormContainer = ({
  mode,
  hotelId,
  defaultValues,
  onSuccess,
}: HotelFormContainerProps) => {
  const navigate = useNavigate();
  const {userId} = useSelector((state: RootState) => state.auth);
  const [createHotel, { isLoading: isCreating }] = useCreateHotelMutation();
  const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();
  
  const id = Number(userId);
  // For edit mode, fetch the full hotel data if only ID was provided
  const { data: existingHotel, isLoading: isFetchingHotel } = useGetHotelByIdQuery(
    hotelId as number,
    { skip: mode !== "edit" || !hotelId }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: HotelFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        location: data.location,
        description: data.description,
        contactPhone: data.contactPhone,
        category: data.category,
        thumbnail: data.thumbnail,
        amenities: data.amenities,
        gallery: data.gallery,
        ownerId: id,
      };

      if (mode === "create") {
        await createHotel(payload).unwrap();
        toast.success("Hotel created successfully!");
      } else if (mode === "edit" && hotelId) {
        const id = Number(hotelId);
        await updateHotel({ 
          hotelId: id,
          ...payload 
        }).unwrap();
        toast.success("Hotel updated successfully!");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/hotels");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        mode === "create" 
          ? "Failed to create hotel. Please try again."
          : "Failed to update hotel. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // If in edit mode and we're fetching the hotel data, show loading state
  if (mode === "edit" && isFetchingHotel) {
    return <Loading />;
  }

  // If in edit mode and we failed to fetch the hotel, show error
  if (mode === "edit" && hotelId && !existingHotel) {
    return (
      <Error
        message="Failed to load hotel data"
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Combine defaultValues with existing hotel data (for edit mode)
  const initialValues = mode === "edit" && existingHotel ? {
    name: existingHotel.name,
    location: existingHotel.location ?? "",
    description: existingHotel.description ?? "",
    contactPhone: existingHotel.contactPhone ?? "",
    category: existingHotel.category ?? "",
    thumbnail: existingHotel.thumbnail ?? "",
    amenities: existingHotel.amenities ?? [],
    gallery: existingHotel.gallery ?? [],
    ...defaultValues, // Allow override from props
  } : defaultValues;

  return (
    <HotelFormPage
      mode={mode}
      defaultValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting || isCreating || isUpdating}
      onCancel={() => navigate("/admin/hotels")}
    />
  );
};