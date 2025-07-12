import { User, Phone, Mail, Star, WholeWord } from "lucide-react";

interface InfoProps {
  firstName: string;
  lastName: string;
  bio?: string;
  contactPhone?: string;
  email: string;
  role?: string;
}

export const ProfileInfoDisplay = ({
  firstName,
  lastName,
  bio,
  contactPhone,
  email,
  role,
}: InfoProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-[#FCA311]" />
        <span>{firstName} {lastName}</span>
      </div>
      <div className="flex items-center gap-2">
        <WholeWord className="w-5 h-5 text-[#FCA311]" />
        <span>{bio}</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="w-5 h-5 text-[#FCA311]" />
        <span>{contactPhone}</span>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="w-5 h-5 text-[#FCA311]" />
        <span>{email}</span>
      </div>
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-[#FCA311]" />
        <span className="capitalize">{role}</span>
      </div>
    </div>
  );
};
