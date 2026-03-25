"use client";
import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../components/theme-toggle';
import { 
  BrainCircuit, 
  Sparkles, 
  ChevronRight, 
  User, 
  ShieldCheck, 
  BookOpen, 
  Target, 
  Zap, 
  ArrowRight,
  GraduationCap,
  History,
  Lock,
  Globe,
  Monitor,
  CheckCircle
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-all selection:bg-violet-100 selection:text-violet-900">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-none group-hover:scale-110 transition-transform">
               <BrainCircuit size={22} />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Socratic<span className="text-violet-600">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 dark:text-slate-400">
             <a href="#features" className="hover:text-violet-600 transition-colors">Features</a>
             <a href="#method" className="hover:text-violet-600 transition-colors">The Method</a>
             <a href="#pricing" className="hover:text-violet-600 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block text-sm font-black text-slate-700 dark:text-slate-300 hover:text-violet-600 transition-colors">
               Log In
            </Link>
            <Link href="/login?mode=register" className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-widest hover:scale-105 transition active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none">
               GET STARTED
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800 text-[10px] font-black uppercase tracking-[0.2em]">
                <Sparkles size={12} className="animate-pulse" />
                Next-Gen Socratic Learning
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tighter">
                Learn by <span className="text-violet-600 italic">Thinking</span>,
                Not Copying.
              </h1>
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed font-semibold">
                An AI tutor that guides you step-by-step using questions, hints, and reasoning — instead of giving direct answers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login?mode=register" className="px-10 py-5 rounded-2xl bg-violet-600 text-white font-black text-lg shadow-2xl shadow-violet-200 hover:bg-violet-700 hover:-translate-y-1 transition active:translate-y-0 text-center flex items-center justify-center gap-2 group">
                   Get Started Free
                   <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                 <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                     </div>
                   ))}
                 </div>
                 <p className="text-xs font-bold text-slate-400">
                    <span className="text-slate-900 dark:text-white font-black">2,400+</span> students studying today
                 </p>
              </div>
            </div>

            {/* Premium Bento Visual */}
            <div className="relative grid grid-cols-12 grid-rows-12 gap-4 h-[600px] animate-in fade-in slide-in-from-right duration-1000 px-4 md:px-0">
               {/* Main Visual */}
               <div className="col-span-12 row-span-7 rounded-[2.5rem] bg-slate-200 overflow-hidden shadow-2xl relative group">
                  <img alt="Student learning" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                     <p className="text-white text-2xl font-black tracking-tight leading-tight">Master Complex Systems through Inquiry.</p>
                     <div className="mt-4 flex items-center gap-4">
                        <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20">Active Learning</div>
                        <div className="px-3 py-1 rounded-full bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-900/50">Quantum Physics</div>
                     </div>
                  </div>
               </div>

               {/* Stat Card */}
               <div className="col-span-5 row-span-5 rounded-[2.5rem] bg-violet-600 p-8 text-white shadow-2xl shadow-violet-200 dark:shadow-none flex flex-col justify-between group overflow-hidden relative">
                  <Zap size={40} className="text-white/20 absolute -top-2 -right-2 group-hover:scale-150 transition-transform duration-700" />
                  <Zap size={28} className="relative z-10" />
                  <div className="relative z-10">
                    <div className="text-4xl font-black leading-none mb-1">98%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Retainment Rate</div>
                  </div>
               </div>

               {/* Interaction Card */}
               <div className="col-span-7 row-span-5 rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
                       <Sparkles size={20} />
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Conceptual Analysis</span>
                  </div>
                  <div className="space-y-3 pt-2">
                     <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-600 w-[75%] rounded-full shadow-[0_0_12px_rgba(139,92,246,0.4)]"></div>
                     </div>
                     <div className="h-2 w-[60%] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[90%] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
                     </div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-auto">Multi-agent Cognitive Assessment Active</p>
               </div>
            </div>
          </div>

          {/* Background Blobs */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-200/20 dark:bg-violet-900/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        </section>

        {/* Guided Experience Preview */}
        <section id="method" className="py-32 bg-slate-900 relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.1),_transparent_70%)]"></div>
           <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400">The Guided Experience</p>
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[0.95]">Experience High-Fidelity Cognitive Tutoring.</h2>
                 <p className="text-lg text-slate-400 font-medium">Unlike generic chatbots, our system builds a mental model of your understanding to guide you toward the "Aha!" moment.</p>
               </div>
               <div className="max-w-5xl mx-auto group">
                  <div className="relative rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:scale-[1.01]">
                     <img 
                       src="/landing/guided-session.png" 
                       alt="Guided Socratic Session" 
                       className="w-full h-auto object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
               </div>
           </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 px-6">
           <div className="max-w-7xl mx-auto space-y-16">
              <div className="grid md:grid-cols-3 gap-8">
                 {/* Feature 1 */}
                 <div className="group p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-violet-100 transition-all duration-500">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3">
                       <BookOpen size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Master Disciplines</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">From Quantum Physics to Renaissance Art, our AI is trained across the entire spectrum of human knowledge.</p>
                 </div>

                 {/* Feature 2 */}
                 <div className="group p-10 rounded-[2.5rem] bg-violet-600 text-white shadow-2xl shadow-violet-200 dark:shadow-none transition-all duration-500 hover:-translate-y-2">
                    <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-8 transition-transform group-hover:scale-110 group-hover:-rotate-3">
                       <Target size={32} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight mb-4">Accelerated Growth</h3>
                    <p className="text-white/80 font-bold leading-relaxed">Our method is proven to increase concept mastery by 3x compared to traditional video-based learning systems.</p>
                 </div>

                 {/* Feature 3 */}
                 <div className="group p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
                    <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3">
                       <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Academic Integrity</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">We focus on the journey of understanding. Our AI will never provide a direct answer, ensuring true mastery.</p>
                 </div>
              </div>

              {/* Wide Bento Feature */}
              <div className="rounded-[3rem] bg-slate-100 dark:bg-slate-900/50 p-12 overflow-hidden flex flex-col lg:flex-row items-center gap-16 group border border-slate-200 dark:border-slate-800">
                 <div className="lg:w-1/2 space-y-6">
                    <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                       <Zap size={24} />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Your Cognitive Identity</h3>
                    <p className="text-lg text-slate-500 font-bold leading-relaxed">Visualize your growth with dynamic knowledge trees that evolve as you master concepts. It's more than a grade—it's your mind, mapped.</p>
                    <div className="flex items-center gap-8 pt-4">
                       <div>
                          <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">4.8x</p>
                          <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Faster Recall</p>
                       </div>
                       <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
                       <div>
                          <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">12min</p>
                          <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Deep Focus Peak</p>
                       </div>
                    </div>
                 </div>
                 <div className="lg:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 rounded-[2rem] blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                    <div className="relative rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl">
                       <div className="grid grid-cols-3 gap-3">
                          {[1,2,3,4,5,6,7,8,9].map(i => (
                             <div key={i} className={`h-20 rounded-xl ${i % 3 === 0 ? 'bg-violet-600 shadow-lg shadow-violet-200' : 'bg-slate-50 dark:bg-slate-800'} flex items-center justify-center animate-in zoom-in duration-500`} style={{ animationDelay: `${i * 100}ms` }}>
                                {i % 3 === 0 && <CheckCircle size={24} className="text-white" />}
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
           <div className="max-w-5xl mx-auto rounded-[3.5rem] bg-slate-900 relative overflow-hidden p-12 md:p-24 text-center space-y-8 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(139,92,246,0.3),_transparent_40%)]"></div>
              <p className="text-violet-400 text-[10px] font-black uppercase tracking-[0.5em] relative z-10">Start Your Journey</p>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter relative z-10 leading-[0.95]">Ready to redefine your <br/><span className="italic text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">intellectual potential?</span></h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 pt-4">
                 <Link href="/login?mode=register" className="px-12 py-5 rounded-[2rem] bg-white text-slate-900 font-black text-xl hover:scale-105 transition active:scale-95 shadow-2xl shadow-white/10">
                    Apply for Access
                 </Link>
                 <Link href="/contact" className="text-white font-black hover:text-violet-300 transition-colors underline decoration-violet-500 decoration-2 underline-offset-8">
                    Learn about Institutional Licensing
                 </Link>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 px-6 py-20 border-t border-slate-100 dark:border-slate-900">
         <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-6 gap-12">
            <div className="col-span-2 space-y-6">
               <div className="flex items-center gap-2 group cursor-pointer inline-flex">
                 <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white">
                    <BrainCircuit size={22} />
                 </div>
                 <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Socratic<span className="text-violet-600">AI</span></span>
               </div>
               <p className="text-slate-500 font-bold max-w-xs text-sm leading-relaxed italic">
                 "Developing minds that don't just find answers, but understand why they matter."
               </p>
               <div className="flex gap-4">
                  {[Globe, Lock, Monitor].map((Icon, i) => (
                    <div key={i} className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-violet-600 transition-colors cursor-pointer border border-slate-100 dark:border-slate-800">
                       <Icon size={18} />
                    </div>
                  ))}
               </div>
            </div>
            {[
              { title: 'The Platform', links: ['Curriculum', 'Socratic GPT-4', 'Knowledge Maps', 'Pricing'] },
              { title: 'Subjects', links: ['Mathematics', 'Humanities', 'Applied Science', 'Fine Arts'] },
              { title: 'Company', links: ['Our Mission', 'Research', 'Security', 'Contact'] },
              { title: 'Privacy', links: ['Terms', 'Data Policy', 'Cookies', 'Settings'] }
            ].map((col, i) => (
              <div key={i} className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{col.title}</h4>
                 <ul className="space-y-4">
                    {col.links.map(link => (
                      <li key={link}>
                         <a href="#" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-violet-600 transition-colors">{link}</a>
                      </li>
                    ))}
                 </ul>
              </div>
            ))}
         </div>
         <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-slate-400">© 2026 Socratic Cognitive Systems Inc. All rights reserved.</p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
               <ShieldCheck size={12} />
               ISO 27001 Certified Learning Environment
            </div>
         </div>
      </footer>
    </div>
  );
}
