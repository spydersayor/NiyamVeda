'use client';
import Link from 'next/link';
import { ArrowRight, FileText, Cpu, ShieldAlert, Layers, Sliders, Scale, Database, FileSpreadsheet, Play, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';

export default function HowItWorksPage() {
 const { t } = useTranslation();
 const steps = [
  [t('how_step_1_title'), t('how_step_1_cat'), FileText, t('how_step_1_desc'), t('how_step_1_detail')],
  [t('how_step_2_title'), t('how_step_2_cat'), FileSpreadsheet, t('how_step_2_desc'), t('how_step_2_detail')],
  [t('how_step_3_title'), t('how_step_3_cat'), Cpu, t('how_step_3_desc'), t('how_step_3_detail')],
  [t('how_step_4_title'), t('how_step_4_cat'), Scale, t('how_step_4_desc'), t('how_step_4_detail')],
  [t('how_step_5_title'), t('how_step_5_cat'), Database, t('how_step_5_desc'), t('how_step_5_detail')],
  [t('how_step_6_title'), t('how_step_6_cat'), Layers, t('how_step_6_desc'), t('how_step_6_detail')],
  [t('how_step_7_title'), t('how_step_7_cat'), ShieldAlert, t('how_step_7_desc'), t('how_step_7_detail')],
  [t('how_step_8_title'), t('how_step_8_cat'), Sliders, t('how_step_8_desc'), t('how_step_8_detail')],
 ] as const;
 const flowPills = [
  t('how_flow_1'), t('how_flow_2'), t('how_flow_3'), t('how_flow_4'),
  t('how_flow_5'), t('how_flow_6'), t('how_flow_7'), t('how_flow_8')
 ];
 return <main className="min-h-screen bg-[#070D1B] text-white relative overflow-hidden font-sans"><div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 py-8 sm:py-12 relative z-10 space-y-10 sm:space-y-12">
  <header className="space-y-4 max-w-3xl"><div className="inline-flex flex-wrap gap-2 px-3 py-1 rounded-full bg-[#0C1B36] border border-[#1E355B] text-xs font-semibold"><span className="text-[#FF7828]">{t('how_badge')}</span><span>•</span><span>{t('how_project')}</span></div><h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight break-words">{t('how_title')}</h1><p className="text-sm sm:text-base text-slate-300 leading-relaxed">{t('how_intro')}</p></header>
  <section className="bg-[#0A1428] border border-blue-500/30 rounded-2xl p-5 sm:p-8"><div className="grid md:grid-cols-3 gap-6 items-center"><div className="md:col-span-2 space-y-2"><div className="flex gap-2 text-xs font-bold text-blue-400"><Sparkles size={15}/>{t('how_engine_label')}</div><h2 className="text-xl font-bold break-words">{t('how_dynamic_title')}</h2><p className="text-sm text-slate-300">{t('how_dynamic_text')}</p></div><div className="flex flex-col gap-3"><Link href="/product/new" className="bg-[#FF7828] text-white font-bold text-xs px-5 py-3 rounded-lg flex justify-center items-center gap-2">{t('how_test_product')}<ArrowRight size={14}/></Link><Link href="/product/demo-purifier-001/analysis" className="bg-[#0C1B36] border border-slate-700 text-slate-300 font-semibold text-xs px-5 py-3 rounded-lg flex justify-center items-center gap-2"><Play size={12}/>{t('how_live_demo')}</Link></div></div></section>
  <section className="bg-[#0A1224] border border-slate-800 rounded-xl p-4"><span className="text-[10px] font-bold text-slate-400 block mb-2">{t('how_dataflow')}</span><div className="flex gap-2 overflow-x-auto no-scrollbar text-xs font-semibold pb-1">{flowPills.map((x,i)=><span key={x} className="contents">{i>0&&<span className="text-slate-500 self-center">→</span>}<span className="px-2.5 py-1 rounded bg-[#102242] text-blue-300 border border-[#1E3865] whitespace-nowrap">{i+1}. {x}</span></span>)}</div></section>
  <section className="space-y-6"><div><h2 className="text-xl sm:text-2xl font-bold">{t('how_pipeline_title')}</h2><p className="text-sm text-slate-400 mt-1">{t('how_pipeline_desc')}</p></div><div className="grid md:grid-cols-2 gap-5">{steps.map(([title,cat,Icon,desc,detail],i)=><article key={i} className="bg-[#0A1224] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4"><div className="flex justify-between"><div className="flex gap-3 items-center"><span className="w-8 h-8 rounded-lg bg-[#102242] border border-[#1E3865] flex items-center justify-center text-[#FF9933] font-bold flex-shrink-0">{i+1}</span><span className="text-[11px] font-bold uppercase text-slate-400">{cat}</span></div><Icon size={22} className="text-slate-500 flex-shrink-0"/></div><h3 className="font-bold break-words">{title}</h3><p className="text-sm text-slate-300">{desc}</p><div className="pt-3 border-t border-slate-800 text-xs text-slate-400"><span className="font-semibold">{t('how_operates')} </span>{detail}</div></article>)}</div></section>
  <section className="bg-[#0C152B] border border-amber-500/30 rounded-2xl p-5 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-5"><ShieldAlert className="text-amber-400 flex-shrink-0" size={28}/><div><span className="text-[10px] font-bold text-amber-300">{t('how_abstention_badge')}</span><h3 className="text-lg font-bold mt-1 break-words">{t('how_abstention_title')}</h3><p className="text-sm text-slate-300 mt-2">{t('how_abstention_text')}</p></div></section>
  <section className="bg-[#0C1B36] border border-[#1E355B] rounded-2xl p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"><div><div className="flex gap-2 text-xs font-bold text-[#FF9933]"><Sliders size={15}/>{t('how_whatif_label')}</div><h3 className="text-xl font-bold mt-2 break-words">{t('how_whatif_title')}</h3><p className="text-sm text-slate-300 mt-2">{t('how_whatif_text')}</p></div><Link href="/product/demo-purifier-001/simulation" className="bg-[#FF7828] text-white font-bold text-xs px-6 py-3 rounded-lg flex items-center gap-2 whitespace-nowrap">{t('how_whatif_button')}<ArrowRight size={14}/></Link></section>
 </div></main>;
}
