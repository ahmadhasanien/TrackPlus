import React from 'react';
import { WalletCards, CalendarDays, Landmark, ClipboardList } from 'lucide-react';
import DetailCardHeader from './DetailCardHeader';
import type { BudgetDetails } from '../../types/projectDetails';

export interface BudgetDetailsCardProps {
  details: BudgetDetails;
}

const formatAmount = (value: number) => value.toLocaleString('en-US');

const Row: React.FC<{ label: string; value: number; icon: React.ReactNode; total?: boolean }> = ({
  label,
  value,
  icon,
  total,
}) => (
  <div
    className={`project-detail__summary-row ${total ? 'project-detail__summary-total' : ''}`}
  >
    <span className="text-[9px] text-[#96989f]">{label}</span>
    <strong className="text-[12px] font-bold text-[#111214]">{formatAmount(value)}</strong>
    <span className="text-[#96989f]">{icon}</span>
  </div>
);

const BudgetDetailsCard: React.FC<BudgetDetailsCardProps> = ({ details }) => {
  const { spent, remaining, total } = details;

  return (
    <div className="project-detail__card project-detail__budget-summary-card" dir="rtl">
      <DetailCardHeader title="الميزانية" icon={<WalletCards size={22} />} />
      <Row label="المصروف" value={spent} icon={<CalendarDays size={18} />} />
      <Row label="المتبقي" value={remaining} icon={<Landmark size={18} />} />
      <Row label="الميزانية الإجمالية" value={total} icon={<ClipboardList size={18} />} total />
    </div>
  );
};

export default BudgetDetailsCard;
