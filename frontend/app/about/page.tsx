'use client';
import Link from 'next/link';
import { Scale, BookOpen, Compass, Target, ArrowRight, Layers, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';

export default function AboutUsPage() {
  const { t } = useTranslation();
  const pillars = [
    ['about_pillar_1_title','about_pillar_1_subtitle','about_pillar_1_desc',Scale,'text-amber-400'],
    ['about_pillar_2_title','about_pillar_2_subtitle','about_pillar_2_desc',BookOpen,'text-blue-400'],
    ['about_pillar_3_title','about_pillar_3_subtitle','about_pillar_3_desc',Lock,'text-emerald-400'],
    ['about_pillar_4_title','about_pillar_4_subtitle','about_pillar_4_desc',Sparkles,'text-purple-400'],
  ] as const;
  return <main className="min-h-screen bg-[#070D1B] text-white relative overflow-hidden font-sans">
    <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-[#FF7828]/10 rounded-full blur-[130px] pointer-events-none" />
    <div className="absolute top-96 left-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 relative z-10 space-y-12">
      <header className="space-y-4 max-w-3xl">
        <div className="inline-flex gap-2 px-3 py-1 rounded-full bg-[#0C1B36] border border-[#1E355B] text-xs font-semibold text-slate-300"><span className="text-[#FF7828]">{t('about_badge')}</span><span>•</span><span>{t('about_project')}</span></div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">{t('about_title')}</h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{t('about_intro')}</p>
      </header>
      <section className="grid md:grid-cols-2 gap-6">
        <InfoCard icon={AlertCircle} title={t('about_challenge_title')} intro={t('about_challenge_intro')} tone="red" items={[1,2,3].map(n => <span key={n}><strong>{t((`about_challenge_${n}_title`) as any)}:</strong> {t((`about_challenge_${n}_text`) as any)}</span>)} />
        <InfoCard icon={Compass} title={t('about_approach_title')} intro={t('about_approach_intro')} tone="emerald" items={[1,2,3].map(n => <span key={n}><strong>{t((`about_approach_${n}_title`) as any)}:</strong> {t((`about_approach_${n}_text`) as any)}</span>)} />
      </section>
      <section className="bg-gradient-to-br from-[#0C1B36] to-[#0A1428] border border-[#1E355B] rounded-2xl p-6 sm:p-8 space-y-4"><div className="flex gap-2 text-xs font-bold text-[#FF9933]"><Target size={15}/>{t('about_core_principle')}</div><h2 className="text-xl sm:text-2xl font-bold">{t('about_parameter_title')}</h2><p className="text-sm text-slate-300 leading-relaxed">{t('about_parameter_text_1')}</p><p className="text-sm text-slate-300 leading-relaxed">{t('about_parameter_text_2')}</p></section>
      <section className="space-y-6"><div><h2 className="text-xl sm:text-2xl font-bold">{t('about_architecture_title')}</h2><p className="text-sm text-slate-400 mt-1">{t('about_architecture_desc')}</p></div><div className="grid md:grid-cols-2 gap-6">{pillars.map(([a,b,c,Icon,color])=><div key={a} className="bg-[#0A1224] border border-slate-800 rounded-xl p-6 space-y-3"><div className="flex gap-3 items-center"><div className={`p-2 rounded-lg bg-[#102242] border border-[#1E3865] ${color}`}><Icon size={20}/></div><div><h3 className="font-bold">{t(a as any)}</h3><span className="text-[11px] text-slate-400">{t(b as any)}</span></div></div><p className="text-sm text-slate-300 leading-relaxed">{t(c as any)}</p></div>)}</div></section>
      <section className="bg-[#091122] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4"><div className="flex gap-2 text-xs font-bold text-slate-400"><Layers size={15} className="text-[#FF7828]"/>{t('about_scope_label')}</div><h2 className="text-xl font-bold">{t('about_mission_title')}</h2><p className="text-sm text-slate-300 leading-relaxed">{t('about_mission_text')}</p><div className="flex flex-wrap gap-4"><Link href="/how-it-works" className="bg-[#FF7828] text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2">{t('about_how_link')}<ArrowRight size={14}/></Link><Link href="/sources" className="border border-slate-700 text-slate-300 font-semibold text-xs px-5 py-2.5 rounded-lg">{t('about_sources_link')}</Link></div></section>
    </div>
  </main>;
}
function InfoCard({icon:Icon,title,intro,tone,items}:{icon:any,title:string,intro:string,tone:'red'|'emerald',items:React.ReactNode[]}) { return <div className="bg-[#0A1224] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl"><div className={`w-10 h-10 rounded-xl bg-${tone}-500/10 border border-${tone}-500/30 flex items-center justify-center text-${tone}-400`}><Icon size={20}/></div><h2 className="text-xl font-bold">{title}</h2><p className="text-sm text-slate-300">{intro}</p><ul className="space-y-3 text-sm text-slate-300">{items.map((x,i)=><li key={i} className="flex gap-2.5"><span className={`w-1.5 h-1.5 rounded-full bg-${tone}-400 mt-2 flex-shrink-0`}/><span>{x}</span></li>)}</ul></div> }
