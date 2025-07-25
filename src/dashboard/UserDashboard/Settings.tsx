// import { useState } from "react";
// import {
//   Mail,
//   Phone,
//   Lock,
//   CheckCircle,
//   XCircle,
//   MailCheck,
//   MailX,
//   Bell,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { toast } from "react-hot-toast";

// export const UserSettings = () => {
//   const [email, setEmail] = useState("user@example.com");
//   const [newEmail, setNewEmail] = useState("");
//   const [phone, setPhone] = useState("+2547...");
//   const [verifiedEmail, setVerifiedEmail] = useState(false);
//   const [verifiedPhone, setVerifiedPhone] = useState(false);
//   const [newsletter, setNewsletter] = useState(true);
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handlePasswordUpdate = () => {
//     if (newPassword !== confirmPassword) {
//       return toast.error("Passwords do not match");
//     }
//     // Simulate password update
//     toast.success("Password updated");
//   };

//   const handleEmailChange = () => {
//     // Simulate email change
//     setEmail(newEmail);
//     setNewEmail("");
//     setVerifiedEmail(false);
//     toast.success("Email updated, verification required");
//   };

//   const handleVerifyEmail = () => {
//     setVerifiedEmail(true);
//     toast.success("Email verified");
//   };

//   const handleVerifyPhone = () => {
//     setVerifiedPhone(true);
//     toast.success("Phone number verified");
//   };

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 bg-white">
//       <h1 className="text-2xl font-bold text-gray-800 mb-4">User Settings</h1>

//       {/* Email Settings */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Mail className="w-5 h-5 text-gray-500" />
//             Email Settings
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label>Current Email</Label>
//             <Input disabled value={email} />
//           </div>
//           <div className="flex items-center gap-2">
//             <Button onClick={handleVerifyEmail} variant="outline">
//               {verifiedEmail ? (
//                 <CheckCircle className="w-4 h-4 text-green-500" />
//               ) : (
//                 <MailCheck className="w-4 h-4 text-blue-500" />
//               )}
//               <span className="ml-1">
//                 {verifiedEmail ? "Email Verified" : "Verify Email"}
//               </span>
//             </Button>
//           </div>
//           <div>
//             <Label>Change Email</Label>
//             <Input
//               type="email"
//               placeholder="Enter new email"
//               value={newEmail}
//               onChange={(e) => setNewEmail(e.target.value)}
//             />
//             <Button className="mt-2" onClick={handleEmailChange}>
//               Update Email
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Phone Verification */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Phone className="w-5 h-5 text-gray-500" />
//             Phone Verification
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label>Phone Number</Label>
//             <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
//           </div>
//           <Button onClick={handleVerifyPhone} variant="outline">
//             {verifiedPhone ? (
//               <CheckCircle className="w-4 h-4 text-green-500" />
//             ) : (
//               <Phone className="w-4 h-4 text-blue-500" />
//             )}
//             <span className="ml-1">
//               {verifiedPhone ? "Phone Verified" : "Verify Phone"}
//             </span>
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Password Update */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Lock className="w-5 h-5 text-gray-500" />
//             Update Password
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label>New Password</Label>
//             <Input
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//             />
//           </div>
//           <div>
//             <Label>Confirm New Password</Label>
//             <Input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//           </div>
//           <Button onClick={handlePasswordUpdate}>Change Password</Button>
//         </CardContent>
//       </Card>

//       {/* Newsletter Settings */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Bell className="w-5 h-5 text-gray-500" />
//             Newsletter
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="flex items-center justify-between">
//           <span className="text-gray-700">Receive weekly updates</span>
//           <Switch
//             checked={newsletter}
//             onCheckedChange={setNewsletter}
//           />
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

export const Settings = () => {
  return (
    <div>Settings</div>
  )
}
