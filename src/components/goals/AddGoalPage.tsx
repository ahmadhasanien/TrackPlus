import { useRef, useState } from 'react';
import { Plus, Zap, Upload } from 'lucide-react';
import { SubpageHeader } from '../layout/SubpageHeader';
import './add-goal.css';

type Priority = 'عالية' | 'متوسطة' | 'منخفضة';
type Measurement = 'نسبة مئوية (%)' | 'رقم' | 'معدل' | 'مبلغ';
type Period = '' | '2026' | '2027' | '2028' | '2026 - 2028';

interface GoalForm {
  name: string;
  description: string;
  priority: Priority;
  period: Period;
  kpiDescription: string;
  baseline: string;
  target: string;
  measurement: Measurement;
}

interface LinkedProject {
  name: string;
  company: string;
  progress: number;
}

const EMPTY_PROJECT: LinkedProject = { name: '', company: 'شركة A', progress: 45 };

const INITIAL_FORM: GoalForm = {
  name: '',
  description: '',
  priority: 'عالية',
  period: '',
  kpiDescription: '',
  baseline: '10',
  target: '100%',
  measurement: 'نسبة مئوية (%)',
};

function CardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="add-goal__card">
      <div className="add-goal__card-title">{title}</div>
      <div className="add-goal__divider" />
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  compact = false,
}: {
  label: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <label className={`add-goal__field${compact ? ' add-goal__field--compact' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export interface SavedGoalData {
  name: string;
  description: string;
  priority: string;
  period: string;
  kpiDescription: string;
  baseline: string;
  target: string;
  measurement: string;
  projectCount: number;
}

interface AddGoalPageProps {
  onBack: () => void;
  onSave: (goal: SavedGoalData) => void;
}

export function AddGoalPage({ onBack, onSave }: AddGoalPageProps) {
  const [form, setForm] = useState<GoalForm>(INITIAL_FORM);
  const [projects, setProjects] = useState<LinkedProject[]>([]);
  const [fileName, setFileName] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const update = <K extends keyof GoalForm>(key: K, value: GoalForm[K]) => {
  setForm((prev) => ({ ...prev, [key]: value }));
};

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      { ...EMPTY_PROJECT, name: `مشروع جديد ${prev.length + 1}` },
    ]);
  };

  const removeProject = (index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setForm((prev) => ({
      ...prev,
      name: prev.name || file.name.replace(/\.[^/.]+$/, ''),
      description:
        prev.description || 'تم تحميل الملف — راجع البيانات المستخرجة قبل الحفظ.',
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert('يرجى إدخال اسم الهدف أولاً.');
      return;
    }
    onSave({
      name: form.name,
      description: form.description,
      priority: form.priority,
      period: form.period,
      kpiDescription: form.kpiDescription,
      baseline: form.baseline,
      target: form.target,
      measurement: form.measurement,
      projectCount: projects.length,
    });
    onBack();
  };

  return (
    <div className="dashboard-page" dir="rtl">
      <SubpageHeader parent="الأهداف الإستراتيجية" title="إضافة هدف استراتيجي جديد" onBack={onBack} />

      
      <div className="add-goal__scroll">
        
        <div className="add-goal__heading">
          <h1>إضافة هدف استراتيجي جديد</h1>
        </div>

        
        <section className="add-goal__upload">
          <button
            type="button"
            className="add-goal__upload-btn"
            onClick={() => fileInput.current?.click()}
            title="رفع ملف"
            aria-label="رفع ملف العقد"
          >
            <Upload size={20} strokeWidth={1.8} />
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.doc,.docx"
            hidden
            onChange={handleFile}
          />
          <div className="add-goal__upload-copy">
            <strong>ارفع ملف العقد وسيُعبئ النظام الحقول تلقائياً</strong>
            <span>
              يدعم PDF وWord — سيستخلص الاسم، الجهات، التواريخ، القيمة، وأطراف المشروع
              {fileName ? ` · ${fileName}` : ''}
            </span>
          </div>
          <div className="add-goal__upload-icon" aria-hidden>
            <Zap size={26} strokeWidth={2} />
          </div>
        </section>

        
        <CardSection title="معلومات الهدف الأساسية">
          <Field label="اسم الهدف">
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="مثال: رفع نسبة رضا العملاء"
            />
          </Field>

          <Field label="وصف الهدف">
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="أدخل وصفاً مفصلاً للهدف..."
            />
          </Field>

          <div className="add-goal__field-row">
            <Field label="الأولوية">
              <select
                value={form.priority}
                onChange={(e) => update('priority', e.target.value as Priority)}
              >
                <option>عالية</option>
                <option>متوسطة</option>
                <option>منخفضة</option>
              </select>
            </Field>

            <Field label="سنة / فترة الهدف">
              <select
                value={form.period}
                onChange={(e) => update('period', e.target.value as Period)}
              >
                <option value="">اختر الفترة</option>
                <option>2026</option>
                <option>2027</option>
                <option>2028</option>
                <option>2026 - 2028</option>
              </select>
            </Field>
          </div>
        </CardSection>

        
        <CardSection title="مؤشر الأداء الرئيسي (KPI)">
          <Field label="وصف المؤشر">
            <input
              value={form.kpiDescription}
              onChange={(e) => update('kpiDescription', e.target.value)}
              placeholder="مثال: نسبة الخدمات المرقمنة"
            />
          </Field>

          <div className={`add-goal__field-row add-goal__kpi-row`}>
            <Field label="القيمة الحالية (الأساس)" compact>
              <input
                value={form.baseline}
                onChange={(e) => update('baseline', e.target.value)}
              />
            </Field>

            <Field label="القيمة المستهدفة" compact>
              <input
                value={form.target}
                onChange={(e) => update('target', e.target.value)}
              />
            </Field>

            <Field label="نوع القياس">
              <select
                value={form.measurement}
                onChange={(e) => update('measurement', e.target.value as Measurement)}
              >
                <option>نسبة مئوية (%)</option>
                <option>رقم</option>
                <option>معدل</option>
                <option>مبلغ</option>
              </select>
            </Field>
          </div>
        </CardSection>

        
        <CardSection title="المشاريع المرتبطة">
          <div className="add-goal__projects-list">
            {projects.map((project, index) => (
              <div className="add-goal__project-row" key={index}>
                <div className="add-goal__project-actions">
                  <button
                    type="button"
                    className="add-goal__delete-btn"
                    onClick={() => removeProject(index)}
                    aria-label="حذف المشروع"
                  >
                    ×
                  </button>
                </div>

                <div className="add-goal__project-details">
                  <strong>{project.name || 'نظام إدارة المحتوى'}</strong>
                  <span>{project.name ? 'مشروع مرتبط' : `على المسار · %${project.progress}`}</span>
                  <span>{project.company}</span>
                </div>

                <span className="add-goal__status-dot" />
              </div>
            ))}
          </div>

          <button type="button" className="add-goal__link-project" onClick={addProject}>
            <Plus size={16} strokeWidth={2.5} />
            <span>ربط مشروع</span>
          </button>
        </CardSection>

        
        <div className="add-goal__actions">
          <button type="button" className="add-goal__save-draft" onClick={onBack}>
            <span>إلغاء</span>
          </button>
          <button type="button" className="add-goal__save-primary" onClick={handleSave}>
            حفظ الهدف
          </button>
        </div>
      </div>
    </div>
  );
}
