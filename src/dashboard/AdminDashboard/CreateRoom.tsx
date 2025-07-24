import { useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useImageUploader } from "../../hook/useImageUploader";
import { useCreateRoomMutation } from "../../features/api/roomsApi";
import {  Wifi, Tv, AirVent, BedDouble, ParkingCircle, Users, DollarSign, Home, Check, Upload, Plus, X, Star, Camera, ImageIcon } from "lucide-react";
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
  const { register, formState: { errors } } = useFormContext<FormData>();
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Room Information</h2>
        <p className="text-gray-600 text-lg">Tell us about your room's basic details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Home className="w-4 h-4" />
            Room Type
          </label>
          <input
            {...register("roomType")}
            placeholder="e.g., Deluxe Suite, Standard Room"
            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
          />
          {errors.roomType && (
            <motion.p 
              className="text-red-500 text-sm flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.roomType.message}
            </motion.p>
          )}
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <DollarSign className="w-4 h-4" />
            Price per Night ($)
          </label>
          <input
            type="number"
            {...register("pricePerNight")}
            placeholder="100"
            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
          />
          {errors.pricePerNight && (
            <motion.p 
              className="text-red-500 text-sm flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.pricePerNight.message}
            </motion.p>
          )}
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Users className="w-4 h-4" />
            Maximum Capacity
          </label>
          <input
            type="number"
            {...register("capacity")}
            placeholder="2"
            min="1"
            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
          />
          {errors.capacity && (
            <motion.p 
              className="text-red-500 text-sm flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.capacity.message}
            </motion.p>
          )}
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="text-sm font-semibold text-gray-700 block mb-3">Availability Status</label>
          <motion.label 
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all duration-200 border border-gray-200"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input
              type="checkbox"
              {...register("isAvailable")}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="font-medium text-gray-700">Room is available for booking</span>
          </motion.label>
        </motion.div>
      </div>
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
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Select Amenities</h2>
        <p className="text-gray-600 text-lg">Choose the features available in this room</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAmenities.map(({ label, value, icon: Icon }, index) => {
          const isSelected = selected.includes(value);
          
          return (
            <motion.button
              type="button"
              key={value}
              onClick={() => toggleAmenity(value)}
              className={`relative flex items-center gap-4 p-6 border-2 rounded-2xl transition-all duration-300 ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                isSelected 
                  ? "bg-blue-500 text-white shadow-lg" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">{label}</h3>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <p className="text-blue-800 font-medium text-center">
            ✓ Selected {selected.length} amenities: {selected.map(s => allAmenities.find(a => a.value === s)?.label).join(", ")}
          </p>
        </motion.div>
      )}
    </div>
  );
};


const ThumbnailUpload = ({ onUpload }: { onUpload: (file: File, context: "thumbnail") => void }) => {
  const { getValues } = useFormContext<FormData>();
  const [isDragging, setIsDragging] = useState(false);
  const thumbnail = getValues("thumbnail");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onUpload(file, "thumbnail");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, "thumbnail");
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Upload Thumbnail</h2>
        <p className="text-gray-600 text-lg">Choose a stunning main image for your room</p>
      </div>

      {!thumbnail ? (
        <motion.div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.01 }}
        >
          <Upload className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">
            Drop your image here, or browse
          </h3>
          <p className="text-gray-500 mb-8 text-lg">Supports: JPG, PNG, WebP (Max 10MB)</p>
          <label className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
            <Upload className="w-5 h-5" />
            Choose File
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="relative group">
            <img
              src={thumbnail}
              alt="Thumbnail Preview"
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl flex items-center justify-center">
              <label className="flex items-center gap-3 px-8 py-4 bg-white text-gray-700 rounded-xl font-medium cursor-pointer hover:bg-gray-100 transition-colors shadow-lg">
                <Upload className="w-5 h-5" />
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="text-center">
            <p className="text-green-600 font-semibold text-lg flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Thumbnail uploaded successfully
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const GalleryUpload = ({ onUpload }: { onUpload: (file: File, context: "gallery") => void }) => {
  const { getValues, setValue } = useFormContext<FormData>();
  const gallery = getValues("gallery");
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        onUpload(file, "gallery");
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => onUpload(file, "gallery"));
    }
  };

  const removeImage = (index: number) => {
    setValue("gallery", gallery.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Gallery Images</h2>
        <p className="text-gray-600 text-lg">Add more photos to showcase your room</p>
      </div>

      <motion.div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
      >
        <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Add Gallery Images
        </h3>
        <p className="text-gray-500 mb-6">Multiple images allowed - drag & drop or browse</p>
        <label className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium cursor-pointer transition-all duration-200 shadow-lg">
          <Upload className="w-5 h-5" />
          Choose Files
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </motion.div>

      {gallery.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Gallery Images ({gallery.length})
            </h3>
            <p className="text-gray-600">Click the × button to remove any image</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((url, idx) => (
              <motion.div
                key={idx}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <img
                  src={url}
                  alt={`Gallery Image ${idx + 1}`}
                  className="w-full h-48 object-cover rounded-xl shadow-lg"
                />
                <motion.button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-medium">
                  {idx + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const ReviewSubmit = () => {
  const { getValues } = useFormContext<FormData>();
  const values = getValues();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Review Your Room</h2>
        <p className="text-gray-600 text-lg">Double-check everything looks perfect before submitting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Room Details */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-6 space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5" />
            Room Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">Room Type:</span>
              <span className="text-gray-900 font-semibold">{values.roomType}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">Price Per Night:</span>
              <span className="text-green-600 font-bold">${values.pricePerNight}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">Capacity:</span>
              <span className="text-gray-900 font-semibold">{values.capacity} guests</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">Available:</span>
              <span className={`font-semibold ${values.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {values.isAvailable ? "✓ Yes" : "✗ No"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Amenities */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-6 space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Selected Amenities ({values.amenities.length})
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {values.amenities.length > 0 ? (
              values.amenities.map((amenityValue, i) => {
                const amenity = allAmenities.find((am) => am.value === amenityValue);
                const Icon = amenity?.icon || Star;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">{amenity?.label || amenityValue}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 italic p-3 bg-white rounded-lg">No amenities selected</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Images Preview */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Thumbnail */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Thumbnail Image
          </h3>
          <div className="relative">
            <img 
              src={values.thumbnail} 
              alt="Room Thumbnail" 
              className="w-full max-w-md mx-auto h-64 object-cover rounded-xl shadow-lg" 
            />
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
              Main Image
            </div>
          </div>
        </div>

        {/* Gallery */}
        {values.gallery.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Gallery Images ({values.gallery.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {values.gallery.map((url, idx) => (
                <div key={idx} className="relative">
                  <img 
                    src={url} 
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-md" 
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Check className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-semibold text-lg">Ready to Create Room</span>
        </div>
        <p className="text-blue-700">All information has been reviewed and is ready for submission.</p>
      </motion.div>
    </div>
  );
};



