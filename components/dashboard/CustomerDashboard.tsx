type Props = {
  activeTab: string;
};

export default function CustomerDashboard({ activeTab }: Props) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 text-black dark:text-white transition-colors duration-300">
      Customer: {activeTab}
    </div>
  );
}
