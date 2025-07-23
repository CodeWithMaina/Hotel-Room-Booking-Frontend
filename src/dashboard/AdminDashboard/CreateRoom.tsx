// // Updated CreateRoomForm.tsx with Amenities Selection and Full Preview

// import { useState } from "react";
// import { useForm, FormProvider, useFormContext } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Wifi, 
//   Tv, 
//   AirVent, 
//   BedDouble, 
//   ParkingCircle, 
//   Upload, 
//   X, 
//   Check,
//   ChevronRight,
//   ChevronLeft,
//   Star,
//   Users,
//   DollarSign,
//   Home,
//   Eye,
//   Plus
// } from "lucide-react";

// // Mock functions to simulate the original hooks
// const useImageUploader = () => ({
//   upload: async (file, context) => {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     return { secure_url: URL.createObjectURL(file) };
//   }
// });

// const useCreateRoomMutation = () => [
//   async (data) => {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     return { unwrap: () => ({ roomId: Math.random() * 1000 }) };
//   }
// ];

// const useCreateAmenityMutation = () => [
//   async (data) => {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return { unwrap: () => ({ id: Math.random() * 1000 }) };
//   }
// ];

// const useCreateEntityAmenityMutation = () => [
//   async (data) => {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     return { unwrap: () => ({}) };
//   }
// ];

// const toast = {
//   success: (msg) => console.log('✅', msg),
//   error: (msg) => console.log('❌', msg)
// };

// const allAmenities = [
//   { label: "WiFi", value: "wifi", icon: Wifi, color: "bg-blue-500" },
//   { label: "TV", value: "tv", icon: Tv, color: "bg-purple-500" },
//   { label: "Air Conditioning", value: "ac", icon: AirVent, color: "bg-cyan-500" },
//   { label: "Double Bed", value: "double_bed", icon: BedDouble, color: "bg-pink-500" },
//   { label: "Parking", value: "parking", icon: ParkingCircle, color: "bg-green-500" },
// ];

// const formSchema = z.object({
//   roomType: z.string().min(3, "Room type is required"),
//   pricePerNight: z.coerce.number().min(1, "Price must be greater than 0"),
//   capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
//   isAvailable: z.boolean(),
//   thumbnail: z.string().url("Thumbnail is required"),
//   gallery: z.array(z.string().url()).min(1, "At least one gallery image required"),
//   amenities: z.array(z.string()),
// });

// type FormData = z.infer<typeof formSchema>;

// const steps = [
//   { title: "Room Details", subtitle: "Basic information", icon: Home },
//   { title: "Amenities", subtitle: "Select features", icon: Star },
//   { title: "Thumbnail", subtitle: "Main image", icon: Upload },
//   { title: "Gallery", subtitle: "Additional photos", icon: Plus },
//   { title: "Review", subtitle: "Final check", icon: Eye }
// ];

// const CreateRoomForm = ({ hotelId = 1 }: { hotelId?: number }) => {
//   const [createAmenity] = useCreateAmenityMutation();
//   const [createEntityAmenity] = useCreateEntityAmenityMutation();

//   const methods = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       roomType: "",
//       pricePerNight: 0,
//       capacity: 1,
//       isAvailable: true,
//       thumbnail: "",
//       gallery: [],
//       amenities: [],
//     },
//   });

//   const [step, setStep] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { upload } = useImageUploader();
//   const [createRoom] = useCreateRoomMutation();

//   const stepFields: (keyof FormData)[][] = [
//     ["roomType", "pricePerNight", "capacity", "isAvailable"],
//     ["amenities"],
//     ["thumbnail"],
//     ["gallery"],
//     [],
//   ];

//   const handleNext = async () => {
//     const valid = await methods.trigger(stepFields[step]);
//     if (valid) setStep((prev) => prev + 1);
//   };

//   const handleBack = () => step > 0 && setStep((prev) => prev - 1);

//   const handleImageUpload = async (file: File, context: "thumbnail" | "gallery") => {
//     try {
//       const response = await upload(file, context);
//       const url = response?.secure_url;

//       if (!url) return toast.error("Image upload failed: No URL returned.");

//       if (context === "thumbnail") {
//         methods.setValue("thumbnail", url);
//       } else {
//         const currentGallery = methods.getValues("gallery");
//         methods.setValue("gallery", [...currentGallery, url]);
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       toast.error("Image upload failed");
//     }
//   };

//   const handleSubmit = methods.handleSubmit(async (formData) => {
//     setIsSubmitting(true);
//     try {
//       const room = await createRoom({ ...formData, hotelId }).unwrap();
//       const roomId = room.roomId;

//       const selectedAmenityValues = formData.amenities;
      
//       for (const amenityValue of selectedAmenityValues) {
//         const amenityPayload = { name: amenityValue };
//         const createdAmenity = await createAmenity(amenityPayload).unwrap();

//         await createEntityAmenity({
//           amenityId: createdAmenity.id,
//           entityId: roomId,
//           entityType: "room",
//         });
//       }

//       toast.success("Room and amenities created successfully");
//       methods.reset();
//       setStep(0);
//     } catch (error) {
//       toast.error("Failed to create room or amenities");
//       console.error("Submission error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   });

//   const completedSteps = step;
//   const progress = ((completedSteps) / (steps.length - 1)) * 100;

//   return (
//     <FormProvider {...methods}>
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Room</h1>
//             <p className="text-gray-600">Add a beautiful room to your hotel collection</p>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between mb-4">
//               <span className="text-sm font-medium text-gray-700">Step {step + 1} of {steps.length}</span>
//               <span className="text-sm font-medium text-gray-700">{Math.round(progress)}% Complete</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <motion.div 
//                 className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
//                 initial={{ width: 0 }}
//                 animate={{ width: `${progress}%` }}
//                 transition={{ duration: 0.5, ease: "easeInOut" }}
//               />
//             </div>
//           </div>

//           {/* Step Navigation */}
//           <div className="flex justify-between mb-8 overflow-x-auto pb-4">
//             {steps.map((stepInfo, idx) => {
//               const Icon = stepInfo.icon;
//               const isActive = idx === step;
//               const isCompleted = idx < step;
              
//               return (
//                 <motion.div 
//                   key={idx} 
//                   className="flex-1 min-w-0 px-2"
//                   whileHover={idx <= step ? { scale: 1.02 } : {}}
//                 >
//                   <div className="flex flex-col items-center text-center">
//                     <motion.div
//                       className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 relative ${
//                         isCompleted
//                           ? "bg-green-500 text-white shadow-lg"
//                           : isActive
//                           ? "bg-blue-600 text-white shadow-lg ring-4 ring-blue-200"
//                           : "bg-gray-200 text-gray-500"
//                       }`}
//                       animate={isActive ? { scale: [1, 1.1, 1] } : {}}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {isCompleted ? (
//                         <Check className="w-6 h-6" />
//                       ) : (
//                         <Icon className="w-6 h-6" />
//                       )}
//                     </motion.div>
//                     <h3 className={`font-semibold text-sm ${isActive ? "text-blue-700" : isCompleted ? "text-green-600" : "text-gray-500"}`}>
//                       {stepInfo.title}
//                     </h3>
//                     <p className={`text-xs ${isActive ? "text-blue-600" : "text-gray-400"}`}>
//                       {stepInfo.subtitle}
//                     </p>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>

//           {/* Form Card */}
//           <motion.div 
//             className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 overflow-hidden"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <form onSubmit={handleSubmit} className="p-8">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={step}
//                   initial={{ opacity: 0, x: 50 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -50 }}
//                   transition={{ duration: 0.4, ease: "easeInOut" }}
//                   className="min-h-[400px]"
//                 >
//                   {step === 0 && <RoomDetails />}
//                   {step === 1 && <AmenitiesSelection />}
//                   {step === 2 && <ThumbnailUpload onUpload={handleImageUpload} />}
//                   {step === 3 && <GalleryUpload onUpload={handleImageUpload} />}
//                   {step === 4 && <ReviewSubmit />}
//                 </motion.div>
//               </AnimatePresence>

//               {/* Navigation Buttons */}
//               <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
//                 {step > 0 ? (
//                   <motion.button
//                     type="button"
//                     onClick={handleBack}
//                     className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                     Back
//                   </motion.button>
//                 ) : (
//                   <div />
//                 )}

//                 {step < steps.length - 1 ? (
//                   <motion.button
//                     type="button"
//                     onClick={handleNext}
//                     className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     Next
//                     <ChevronRight className="w-5 h-5" />
//                   </motion.button>
//                 ) : (
//                   <motion.button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                     whileHover={!isSubmitting ? { scale: 1.02 } : {}}
//                     whileTap={!isSubmitting ? { scale: 0.98 } : {}}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                         Creating...
//                       </>
//                     ) : (
//                       <>
//                         <Check className="w-5 h-5" />
//                         Create Room
//                       </>
//                     )}
//                   </motion.button>
//                 )}
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       </div>
//     </FormProvider>
//   );
// };

// const RoomDetails = () => {
//   const { register, formState: { errors } } = useFormContext<FormData>();
  
//   return (
//     <div className="space-y-6">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Room Information</h2>
//         <p className="text-gray-600">Tell us about your room's basic details</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <motion.div 
//           className="space-y-2"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//         >
//           <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//             <Home className="w-4 h-4" />
//             Room Type
//           </label>
//           <input
//             {...register("roomType")}
//             placeholder="e.g., Deluxe Suite, Standard Room"
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
//           />
//           {errors.roomType && (
//             <p className="text-red-500 text-sm">{errors.roomType.message}</p>
//           )}
//         </motion.div>

//         <motion.div 
//           className="space-y-2"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//             <DollarSign className="w-4 h-4" />
//             Price per Night ($)
//           </label>
//           <input
//             type="number"
//             {...register("pricePerNight")}
//             placeholder="100"
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
//           />
//           {errors.pricePerNight && (
//             <p className="text-red-500 text-sm">{errors.pricePerNight.message}</p>
//           )}
//         </motion.div>

//         <motion.div 
//           className="space-y-2"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//         >
//           <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//             <Users className="w-4 h-4" />
//             Maximum Capacity
//           </label>
//           <input
//             type="number"
//             {...register("capacity")}
//             placeholder="2"
//             min="1"
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
//           />
//           {errors.capacity && (
//             <p className="text-red-500 text-sm">{errors.capacity.message}</p>
//           )}
//         </motion.div>

//         <motion.div 
//           className="space-y-2"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//         >
//           <label className="text-sm font-medium text-gray-700 block mb-3">Availability Status</label>
//           <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
//             <input
//               type="checkbox"
//               {...register("isAvailable")}
//               className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//             />
//             <span className="font-medium text-gray-700">Room is available for booking</span>
//           </label>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// const AmenitiesSelection = () => {
//   const { watch, setValue } = useFormContext<FormData>();
//   const selected = watch("amenities");

//   const toggleAmenity = (value: string) => {
//     if (selected.includes(value)) {
//       setValue("amenities", selected.filter((v) => v !== value));
//     } else {
//       setValue("amenities", [...selected, value]);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Amenities</h2>
//         <p className="text-gray-600">Choose the features available in this room</p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {allAmenities.map(({ label, value, icon: Icon, color }, index) => {
//           const isSelected = selected.includes(value);
          
//           return (
//             <motion.button
//               type="button"
//               key={value}
//               onClick={() => toggleAmenity(value)}
//               className={`relative flex items-center gap-4 p-6 border-2 rounded-2xl transition-all duration-300 ${
//                 isSelected
//                   ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
//                   : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
//               }`}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               whileHover={{ y: -2 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
//                 <Icon className="w-6 h-6" />
//               </div>
//               <div className="flex-1 text-left">
//                 <h3 className="font-semibold text-gray-900">{label}</h3>
//               </div>
//               {isSelected && (
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center"
//                 >
//                   <Check className="w-4 h-4" />
//                 </motion.div>
//               )}
//             </motion.button>
//           );
//         })}
//       </div>

//       {selected.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-blue-50 border border-blue-200 rounded-xl p-4"
//         >
//           <p className="text-blue-800 font-medium">
//             Selected {selected.length} amenities: {selected.map(s => allAmenities.find(a => a.value === s)?.label).join(", ")}
//           </p>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// const ThumbnailUpload = ({ onUpload }: { onUpload: (file: File, context: "thumbnail") => void }) => {
//   const { getValues } = useFormContext<FormData>();
//   const [isDragging, setIsDragging] = useState(false);
//   const thumbnail = getValues("thumbnail");

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith('image/')) {
//       onUpload(file, "thumbnail");
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       onUpload(file, "thumbnail");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Thumbnail</h2>
//         <p className="text-gray-600">Choose a stunning main image for your room</p>
//       </div>

//       {!thumbnail ? (
//         <motion.div
//           className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
//             isDragging
//               ? "border-blue-500 bg-blue-50"
//               : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
//           }`}
//           onDragOver={(e) => e.preventDefault()}
//           onDragEnter={() => setIsDragging(true)}
//           onDragLeave={() => setIsDragging(false)}
//           onDrop={handleDrop}
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//         >
//           <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-xl font-semibold text-gray-700 mb-2">
//             Drop your image here, or browse
//           </h3>
//           <p className="text-gray-500 mb-6">Supports: JPG, PNG, WebP (Max 10MB)</p>
//           <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium cursor-pointer transition-colors">
//             <Upload className="w-5 h-5" />
//             Choose File
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="hidden"
//             />
//           </label>
//         </motion.div>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="space-y-4"
//         >
//           <div className="relative group">
//             <img
//               src={thumbnail}
//               alt="Thumbnail Preview"
//               className="w-full h-80 object-cover rounded-2xl shadow-lg"
//             />
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
//               <label className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-medium cursor-pointer hover:bg-gray-100 transition-colors">
//                 <Upload className="w-5 h-5" />
//                 Change Image
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </label>
//             </div>
//           </div>
//           <p className="text-center text-green-600 font-medium">
//             ✓ Thumbnail uploaded successfully
//           </p>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// const GalleryUpload = ({ onUpload }: { onUpload: (file: File, context: "gallery") => void }) => {
//   const { getValues, setValue } = useFormContext<FormData>();
//   const gallery = getValues("gallery");
//   const [isDragging, setIsDragging] = useState(false);

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const files = Array.from(e.dataTransfer.files);
//     files.forEach((file) => {
//       if (file.type.startsWith('image/')) {
//         onUpload(file, "gallery");
//       }
//     });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       Array.from(files).forEach((file) => onUpload(file, "gallery"));
//     }
//   };

//   const removeImage = (index: number) => {
//     setValue("gallery", gallery.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="space-y-6">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Gallery Images</h2>
//         <p className="text-gray-600">Add more photos to showcase your room</p>
//       </div>

//       <motion.div
//         className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
//           isDragging
//             ? "border-blue-500 bg-blue-50"
//             : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
//         }`}
//         onDragOver={(e) => e.preventDefault()}
//         onDragEnter={() => setIsDragging(true)}
//         onDragLeave={() => setIsDragging(false)}
//         onDrop={handleDrop}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <h3 className="text-lg font-semibold text-gray-700 mb-2">
//           Add Gallery Images
//         </h3>
//         <p className="text-gray-500 mb-4">Multiple images allowed</p>
//         <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium cursor-pointer transition-colors">
//           <Upload className="w-5 h-5" />
//           Choose Files
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleFileChange}
//             className="hidden"
//           />
//         </label>
//       </motion.div>

//       {gallery.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="space-y-4"
//         >
//           <h3 className="text-lg font-semibold text-gray-900">
//             Gallery Images ({gallery.length})
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {gallery.map((url, idx) => (
//               <motion.div
//                 key={idx}
//                 className="relative group"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: idx * 0.1 }}
//               >
//                 <img
//                   src={url}
//                   alt={`Gallery Image ${idx + 1}`}
//                   className="w-full h-40 object-cover rounded-xl shadow-md"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeImage(idx)}
//                   className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// const ReviewSubmit = () => {
//   const { getValues } = useFormContext<FormData>();
//   const values = getValues();

//   return (
//     <div className="space-y-8">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Room</h2>
//         <p className="text-gray-600">Double-check everything looks perfect</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Room Details */}
//         <motion.div
//           className="bg-gray-50 rounded-2xl p-6 space-y-4"
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//         >
//           <h3 className="text-lg font-semibol

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
