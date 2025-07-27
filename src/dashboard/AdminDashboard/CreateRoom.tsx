import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useImageUploader } from "../../hook/useImageUploader";
import { useCreateRoomMutation } from "../../features/api/roomsApi";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useCreateAmenityMutation } from "../../features/api/amenitiesApi";
import { useCreateEntityAmenityMutation } from "../../features/api/entityAmenitiesApi";
import { useNavigate } from "react-router";
import { parseRTKError } from "../../utils/parseRTKError";
import { steps } from "../../components/room/constants";
import { formSchema } from "../../components/room/types";
import { ThumbnailUpload } from "../../components/room/ThumbnailUpload";
import { AmenitiesSelection } from "../../components/room/AmenitiesSelection";
import { GalleryUpload } from "../../components/room/GalleryUpload";
import { ReviewSubmit } from "../../components/room/ReviewSubmit";
import { useGetAmenitiesQuery } from "../../features/api/amenitiesApi";
import { useGetRoomTypesQuery } from "../../features/api/roomTypeApi";
import { RoomDetails } from "../../components/room/RoomDetails";

const CreateRoomForm = ({ hotelId }: { hotelId: number }) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { upload } = useImageUploader();
  const [createRoom] = useCreateRoomMutation();
  const navigate = useNavigate();
  const [createAmenity] = useCreateAmenityMutation();
  const [createEntityAmenity] = useCreateEntityAmenityMutation();
  const { data: roomTypesData, isLoading: isRoomTypesLoading } = useGetRoomTypesQuery();
const { data: amenitiesData, isLoading: isAmenitiesLoading } = useGetAmenitiesQuery();

console.log(roomTypesData);
console.log(amenitiesData);
  const transformedRoomTypes = useMemo(() => 
  roomTypesData?.map((roomType) => ({
    roomTypeId: roomType.roomTypeId,
    name: roomType.name,
  })) || [],
  [roomTypesData]
);

  // const transformedAmenities = amenitiesData?.map((amenity) => ({
  //   amenityId: amenity.amenityId,
  //   name: amenity.name,
  // })) || [];


  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomTypeId: 0,
      pricePerNight: 0,
      capacity: 1,
      description: "",
      isAvailable: true,
      thumbnail: "",
      gallery: [],
      amenities: [],
    },
  });

  if (isRoomTypesLoading || isAmenitiesLoading) {
  return <div>Loading...</div>;
}


  const stepFields: (keyof typeof formSchema.shape)[][] = [
    ["roomTypeId", "pricePerNight", "capacity", "description", "isAvailable"],
    ["amenities"],
    ["thumbnail"],
    ["gallery"],
    [],
  ];

  const handleNext = async () => {
    const valid = await methods.trigger(stepFields[step]);
    if (valid) setStep((prev) => prev + 1);
  };

  const handleBack = () => step > 0 && setStep((prev) => prev - 1);

  const handleImageUpload = async (
    file: File,
    context: "thumbnail" | "gallery"
  ) => {
    try {
      const response = await upload(file, context);
      const url = response?.secure_url;

      if (!url) return toast.error("Image upload failed: No URL returned.");

      if (context === "thumbnail") {
        methods.setValue("thumbnail", url);
      } else {
        const currentGallery = methods.getValues("gallery");
        methods.setValue("gallery", [...currentGallery, url]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = methods.handleSubmit(async (formData) => {
    setIsSubmitting(true);
    try {
      // 1. First create the room
      const roomPayload = {
        hotelId,
        roomTypeId: Number(formData.roomTypeId),
        pricePerNight: Number(formData.pricePerNight),
        capacity: formData.capacity,
        description: formData.description,
        isAvailable: formData.isAvailable,
        thumbnail: formData.thumbnail,
        gallery: formData.gallery,
      };

      const roomResponse = await createRoom(roomPayload).unwrap();
      const roomId = roomResponse.roomId;

      // 2. Handle amenities if any were selected
      if (formData.amenities && formData.amenities.length > 0) {
        for (const amenityValue of formData.amenities) {
          try {
            // First try to find if amenity already exists
            const existingAmenity = amenitiesData?.find(
              (a) => a.name === amenityValue
            );

            let amenityId;

            if (existingAmenity?.amenityId) {
              // Use existing amenity ID if available
              amenityId = existingAmenity.amenityId;
            } else {
              // Create new amenity if it doesn't exist
              const amenityResponse = await createAmenity({
                name: amenityValue,
              }).unwrap();

              if (!amenityResponse?.amenityId) {
                throw new Error(`Amenity creation failed for ${amenityValue}`);
              }

              amenityId = amenityResponse.amenityId;
            }

            // Link amenity to room
            await createEntityAmenity({
              amenityId,
              entityId: roomId,
              entityType: "room",
            }).unwrap();
          } catch (error) {
            console.error(`Error processing amenity ${amenityValue}:`, error);
            // Continue with next amenity even if one fails
            continue;
          }
        }
      }

      // 3. Success handling
      toast.success("Room created successfully!");
      methods.reset();
      setStep(0);
      navigate("-1");
    } catch (error) {
      const errorMessage = parseRTKError(
        error,
        "Failed to create room. Please try again."
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  });

  const progress = (step / (steps.length - 1)) * 100;

  return (
    <FormProvider key={roomTypesData ? 'loaded' : 'loading'} {...methods}>
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Create New Room
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Add a beautiful room to your hotel collection with our
              step-by-step guide
            </p>
          </motion.div>

          {/* Enhanced Progress Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                Step {step + 1} of {steps.length}
              </span>
              <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                {Math.round(progress)}% Complete
              </span>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-3 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Step Navigation */}
          <div className="mb-12">
            <div className="flex justify-between items-center overflow-x-auto pb-4">
              {steps.map((stepInfo, idx) => {
                const Icon = stepInfo.icon;
                const isActive = idx === step;
                const isCompleted = idx < step;

                return (
                  <motion.div
                    key={idx}
                    className="flex-1 min-w-0 px-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={idx <= step ? { scale: 1.02 } : {}}
                  >
                    <div className="flex flex-col items-center text-center">
                      <motion.div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 relative transition-all duration-300 ${
                          isCompleted
                            ? "bg-green-500 text-white shadow-lg shadow-green-200"
                            : isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-100"
                            : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                        }`}
                        animate={
                          isActive
                            ? {
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                  "0 4px 14px 0 rgba(59, 130, 246, 0.2)",
                                  "0 6px 20px 0 rgba(59, 130, 246, 0.3)",
                                  "0 4px 14px 0 rgba(59, 130, 246, 0.2)",
                                ],
                              }
                            : {}
                        }
                        transition={{
                          duration: 2,
                          repeat: isActive ? Infinity : 0,
                        }}
                      >
                        {isCompleted ? (
                          <Check className="w-7 h-7" />
                        ) : (
                          <Icon className="w-7 h-7" />
                        )}
                      </motion.div>
                      <h3
                        className={`font-semibold text-sm mb-1 transition-colors duration-200 ${
                          isActive
                            ? "text-blue-700"
                            : isCompleted
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {stepInfo.title}
                      </h3>
                      <p
                        className={`text-xs transition-colors duration-200 ${
                          isActive ? "text-blue-600" : "text-gray-400"
                        }`}
                      >
                        {stepInfo.subtitle}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Form Card */}
          <motion.div
            className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="min-h-[500px]"
                >
                  {step === 0 && <RoomDetails roomTypes={transformedRoomTypes || []} />}
                  {step === 1 && <AmenitiesSelection amenities={amenitiesData || []} />}
                  {step === 2 && (
                    <ThumbnailUpload onUpload={handleImageUpload} />
                  )}
                  {step === 3 && <GalleryUpload onUpload={handleImageUpload} />}
                  {step === 4 && <ReviewSubmit roomTypes={roomTypesData || []} amenities={amenitiesData || []} />}
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-100">
                {step > 0 ? (
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-all duration-200 border border-gray-200"
                    whileHover={{ scale: 1.02, x: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                ) : (
                  <div />
                )}

                {step < steps.length - 1 ? (
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Create Room
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </FormProvider>
  );
};

export default CreateRoomForm;