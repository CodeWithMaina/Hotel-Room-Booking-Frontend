type Props = {
  orderCount: number;
  joinYear: number;
  status: string;
};

export const ProfileSidebar: React.FC<Props> = ({ orderCount, joinYear, status }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow border border-slate-200 space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Account Overview</h3>
      <div className="flex justify-between text-gray-700">
        <span>Total Orders</span>
        <span className="font-semibold">{orderCount}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Status</span>
        <span className="font-semibold capitalize">{status}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Member Since</span>
        <span className="font-semibold">{joinYear}</span>
      </div>
    </div>
  );
};
