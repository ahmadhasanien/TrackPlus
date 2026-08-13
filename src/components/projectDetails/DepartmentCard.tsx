import React from 'react';
import { Landmark } from 'lucide-react';

export interface DepartmentCardProps {
  title: string;
  subtitle?: string;
  tag?: string;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  title,
  subtitle = 'مؤسسة تقنية متخصصة في تطوير الحلول الرقمية',
  tag = 'إدارة داخلية',
}) => {
  return (
    <div className="project-detail__company-card" dir="rtl">
      <div className="project-detail__company-main">
        <span className="project-detail__section-icon">
          <Landmark size={25} />
        </span>
        <div>
          <h2 >{title}</h2>
          <p >{subtitle}</p>
        </div>
      </div>
      <span className="project-detail__company-link">{tag}</span>
    </div>
  );
};

export default DepartmentCard;
