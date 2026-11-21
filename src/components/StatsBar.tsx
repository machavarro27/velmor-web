import { useTranslation } from 'react-i18next';

export function StatsBar() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#EBF4FA] border-t border-[#004B87]/15 py-2 px-4 text-center text-xs text-[#004B87] font-semibold">
      {t('stats.protein')} {t('stats.proteinLabel')} · {t('stats.natural')} {t('stats.naturalLabel')}
    </div>
  );
}
