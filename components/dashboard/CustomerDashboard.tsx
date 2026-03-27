type Props = {
  activeTab: string;
};

export default function CustomerDashboard({ activeTab }: Props) {
  return <div className="p-6">Customer: {activeTab}</div>;
}
