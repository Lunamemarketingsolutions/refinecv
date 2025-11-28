import { TrendingUp, CheckCircle, FileText, Clock } from 'lucide-react';

interface QuickStatsProps {
  stats: {
    totalAnalyses: number;
    atsPassRate: number;
    cvsUploaded: number;
    timeSaved: number;
  };
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const statCards = [
    {
      icon: TrendingUp,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      value: stats.totalAnalyses.toString(),
      label: 'Total Analyses',
      substat: '+5 this week',
      substatColor: 'text-success',
      substatIcon: '↑',
    },
    {
      icon: CheckCircle,
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      value: `${stats.atsPassRate}%`,
      label: 'Avg ATS Pass Rate',
      substat: '+8% from last month',
      substatColor: 'text-success',
      substatIcon: '↑',
      valueColor: 'text-success',
    },
    {
      icon: FileText,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      value: stats.cvsUploaded.toString(),
      label: 'CVs Uploaded',
      substat: '5 versions saved',
      substatColor: 'text-gray-500',
    },
    {
      icon: Clock,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      value: `${stats.timeSaved} hrs`,
      label: 'Time Saved',
      substat: 'vs manual tailoring',
      substatColor: 'text-gray-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow"
        >
          <div className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
            <card.icon className={`w-7 h-7 ${card.iconColor}`} />
          </div>
          <div className={`text-5xl font-black mb-2 ${card.valueColor || 'text-secondary'}`}>
            {card.value}
          </div>
          <div className="text-sm text-gray-600 font-medium mb-1">{card.label}</div>
          <div className={`text-xs ${card.substatColor} font-medium`}>
            {card.substatIcon && <span className="mr-1">{card.substatIcon}</span>}
            {card.substat}
          </div>
        </div>
      ))}
    </div>
  );
}
