// Updated CreateRoomForm.tsx with Amenities Selection and Full Preview

import { useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useImageUploader } from "../../hook/useImageUploader";
import { useCreateRoomMutation } from "../../features/api/roomsApi";
import {  Wifi, Tv, AirVent, BedDouble, ParkingCircle } from "lucide-react";
import { useCreateAmenityMutation } from "../../features/api/amenitiesApi";
import { useCreateEntityAmenityMutation } from "../../features/api/entityAmenitiesApi";

const allAmenities = [
  { label: "WiFi", value: "wifi", icon: Wifi },
  { label: "TV", value: "tv", icon: Tv },
  { label: "Air Conditioning", value: "ac", icon: AirVent },
  { label: "Double Bed", value: "double_bed", icon: BedDouble },
  { label: "Parking", value: "parking", icon: ParkingCircle },
];

const formSchema = z.object({
  roomType: z.string().min(3, "Room type is required"),
  pricePerNight: z.coerce.number().min(1, "Price must be greater than 0"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  isAvailable: z.boolean(),
  thumbnail: z.string().url("Thumbnail is required"),
  gallery: z.array(z.string().url()).min(1, "At least one gallery image required"),
  amenities: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

const steps = ["Room Details", "Amenities", "Thumbnail Upload", "Gallery Upload", "Review & Submit"];

const CreateRoomForm = ({ hotelId }: { hotelId: number }) => {

  const [createAmenity] = useCreateAmenityMutation();
const [createEntityAmenity] = useCreateEntityAmenityMutation();


  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomType: "",
      pricePerNight: 0,
      capacity: 1,
      isAvailable: true,
      thumbnail: "",
      gallery: [],
      amenities: [],
    },
  });

  const [step, setStep] = useState(0);
  const { upload } = useImageUploader();
  const [createRoom] = useCreateRoomMutation();

  const stepFields: (keyof FormData)[][] = [
    ["roomType", "pricePerNight", "capacity", "isAvailable"],
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

  const handleImageUpload = async (file: File, context: "thumbnail" | "gallery") => {
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
  try {
    // 1. Create the room
    const room = await createRoom({ ...formData, hotelId }).unwrap();
    const roomId = room.roomId;

    // 2. Map selected amenities to backend
    const selectedAmenityValues = formData.amenities; // e.g., ['wifi', 'tv']
    
    for (const amenityValue of selectedAmenityValues) {
      // Optional: you could check if amenity already exists to avoid duplicates
      const amenityPayload = { name: amenityValue };
      const createdAmenity = await createAmenity(amenityPayload).unwrap();

      // 3. Create entity-amenity relationship
      await createEntityAmenity({
        amenityId: createdAmenity.id,
        entityId: roomId,
        entityType: "room",
      });
    }

    toast.success("Room and amenities created successfully");
    methods.reset();
    setStep(0);
  } catch (error) {
    toast.error("Failed to create room or amenities");
    console.error("Submission error:", error);
  }
});


  return (
    <FormProvider {...methods}>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
        <div className="flex justify-between mb-8">
          {steps.map((label, idx) => (
            <div key={idx} className="flex-1 text-center">
              <div
                className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center text-white ${idx <= step ? "bg-blue-600" : "bg-gray-300"}`}
              >
                {idx + 1}
              </div>
              <span className={`text-xs ${idx === step ? "font-bold text-blue-700" : "text-gray-500"}`}>{label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && <RoomDetails />}
              {step === 1 && <AmenitiesSelection />}
              {step === 2 && <ThumbnailUpload onUpload={handleImageUpload} />}
              {step === 3 && <GalleryUpload onUpload={handleImageUpload} />}
              {step === 4 && <ReviewSubmit />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-between">
            {step > 0 ? (
              <button type="button" onClick={handleBack} className="btn btn-secondary">Back</button>
            ) : (
              <span />
            )}
            {step < steps.length - 1 ? (
              <button type="button" onClick={handleNext} className="btn btn-primary">Next</button>
            ) : (
              <button type="submit" className="btn btn-success">Submit</button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default CreateRoomForm;

const RoomDetails = () => {
  const { register } = useFormContext<FormData>();
  return (
    <div className="grid grid-cols-1 gap-4">
      <input {...register("roomType")} placeholder="Room Type" className="input input-bordered" />
      <input type="number" {...register("pricePerNight")} placeholder="Price per night" className="input input-bordered" />
      <input type="number" {...register("capacity")} placeholder="Capacity" className="input input-bordered" />
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("isAvailable")} className="checkbox" />
        <span>Available</span>
      </label>
    </div>
  );
};

const AmenitiesSelection = () => {
  const { watch, setValue } = useFormContext<FormData>();
  const selected = watch("amenities");

  const toggleAmenity = (value: string) => {
    if (selected.includes(value)) {
      setValue("amenities", selected.filter((v) => v !== value));
    } else {
      setValue("amenities", [...selected, value]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {allAmenities.map(({ label, value, icon: Icon }) => (
        <button
          type="button"
          key={value}
          onClick={() => toggleAmenity(value)}
          className={`flex items-center gap-2 border rounded-lg p-2 transition-all ${selected.includes(value) ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

const ThumbnailUpload = ({ onUpload }: { onUpload: (file: File, context: "thumbnail") => void }) => {
  const { getValues } = useFormContext<FormData>();
  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], "thumbnail")} />
      {getValues("thumbnail") && (
        <img src={getValues("thumbnail")} alt="Thumbnail Preview" className="w-full h-48 object-cover rounded" />
      )}
    </div>
  );
};

const GalleryUpload = ({ onUpload }: { onUpload: (file: File, context: "gallery") => void }) => {
  const { getValues, setValue } = useFormContext<FormData>();
  const gallery = getValues("gallery");
  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && Array.from(e.target.files).forEach((file) => onUpload(file, "gallery"))} />
      <div className="grid grid-cols-3 gap-2">
        {gallery.map((url, idx) => (
          <div key={idx} className="relative">
            <img src={url} alt="Gallery Image" className="w-full h-28 object-cover rounded" />
            <button
              type="button"
              onClick={() => setValue("gallery", gallery.filter((_, i) => i !== idx))}
              className="absolute top-1 right-1 text-white bg-black/50 rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewSubmit = () => {
  const { getValues } = useFormContext<FormData>();
  const values = getValues();

  return (
    <div className="space-y-4">
      <div><strong>Room Type:</strong> {values.roomType}</div>
      <div><strong>Price Per Night:</strong> ${values.pricePerNight}</div>
      <div><strong>Capacity:</strong> {values.capacity} guests</div>
      <div><strong>Available:</strong> {values.isAvailable ? "Yes" : "No"}</div>
      <div>
        <strong>Amenities:</strong>
        <ul className="list-disc list-inside">
          {values.amenities.map((a, i) => (
            <li key={i}>{allAmenities.find((am) => am.value === a)?.label || a}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Thumbnail:</strong>
        <img src={values.thumbnail} alt="Thumbnail" className="w-full h-32 object-cover rounded" />
      </div>
      <div>
        <strong>Gallery:</strong>
        <div className="grid grid-cols-3 gap-2">
          {values.gallery.map((url, idx) => (
            <img key={idx} src={url} className="w-full h-24 object-cover rounded" />
          ))}
        </div>
      </div>
    </div>
  );
};
