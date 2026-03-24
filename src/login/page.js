"use client";
import React, { useState } from 'react';

export default function LoginPage() {
  const [isLoginTab, setIsLoginTab] = useState(true);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      <button 
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-surface-container-high dark:bg-inverse-surface shadow-lg hover:scale-110 transition-transform" 
        onClick={toggleTheme}
      >
        <span className="material-symbols-outlined dark:hidden">dark_mode</span>
        <span className="material-symbols-outlined hidden dark:block text-primary-fixed">light_mode</span>
      </button>

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] rounded-full bg-secondary/5 dark:bg-secondary/10 blur-[100px]"></div>
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Header */}
          <header className="text-center lg:text-left space-y-6">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-2xl">
                <span className="material-symbols-outlined text-5xl lg:text-6xl text-primary dark:text-primary-fixed" style={{fontVariationSettings: "'FILL' 1"}}>menu_book</span>
              </div>
              <h1 className="font-headline text-4xl lg:text-6xl font-extrabold tracking-tight text-primary dark:text-primary-fixed italic">Socratic AI Tutor</h1>
            </div>
            <div className="space-y-4">
              <h2 className="font-headline text-2xl lg:text-4xl font-bold text-on-surface dark:text-surface-bright leading-tight">
                Your Personal Atheneum for <span className="text-primary dark:text-primary-fixed-dim">Guided Discovery</span>.
              </h2>
              <p className="font-headline text-on-surface-variant dark:text-outline-variant text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Step away from rote memorization. Engage with an AI designed to ask the right questions, helping you build deep, lasting intuition in any subject.
              </p>
            </div>
            
            <div className="hidden lg:grid grid-cols-2 gap-4 mt-12">
              <div className="p-4 rounded-xl bg-surface-container-low dark:bg-inverse-surface/30 border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary mb-2">Psychology</span>
                <h4 className="font-bold text-sm">Active Inquiry</h4>
                <p className="text-xs opacity-70">Master topics through dialogue, not monologues.</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-low dark:bg-inverse-surface/30 border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary mb-2">Self_Improvement</span>
                <h4 className="font-bold text-sm">Deep Focus</h4>
                <p className="text-xs opacity-70">A distraction-free environment for serious scholars.</p>
              </div>
            </div>
          </header>

          {/* Authentication Card */}
          <div className="w-full max-w-xl mx-auto">
            <div className="glass-panel rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 dark:border-white/5 transition-all">
              
              <div>
                <div className="tab-labels flex bg-surface-container-low dark:bg-inverse-surface/50 px-8 pt-6 border-b border-outline-variant/10">
                  <button 
                    onClick={() => setIsLoginTab(true)}
                    className={`px-8 py-4 font-headline font-bold text-xs tracking-widest cursor-pointer transition-all duration-300 border-b-2 ${isLoginTab ? 'text-primary border-primary dark:text-primary-fixed dark:border-primary-fixed' : 'border-transparent text-slate-400 dark:text-outline hover:text-on-surface-variant dark:hover:text-surface-bright'}`}
                  >
                    LOGIN
                  </button>
                  <button 
                    onClick={() => setIsLoginTab(false)}
                    className={`px-8 py-4 font-headline font-bold text-xs tracking-widest cursor-pointer transition-all duration-300 border-b-2 ${!isLoginTab ? 'text-primary border-primary dark:text-primary-fixed dark:border-primary-fixed' : 'border-transparent text-slate-400 dark:text-outline hover:text-on-surface-variant dark:hover:text-surface-bright'}`}
                  >
                    REGISTER
                  </button>
                </div>
                
                <div className="form-container p-8 lg:p-12 bg-surface-container-lowest dark:bg-transparent">
                  {isLoginTab ? (
                    <form action="#" className="space-y-6" id="login-form">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/70 dark:text-outline-variant ml-1">Email Address</label>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">mail</span>
                          <input className="w-full pl-12 pr-4 py-4 bg-surface-container-low dark:bg-inverse-surface/50 border-none rounded-DEFAULT focus:ring-0 focus:bg-surface-container-lowest dark:focus:bg-inverse-surface border-b-2 border-transparent focus:border-primary transition-all font-medium text-on-surface dark:text-white placeholder:text-outline-variant/50" placeholder="scholar@atheneum.edu" type="email" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/70 dark:text-outline-variant">Password</label>
                          <a className="text-[10px] font-bold text-primary dark:text-primary-fixed-dim hover:underline transition-colors uppercase tracking-widest" href="#">Forgot?</a>
                        </div>
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">lock</span>
                          <input className="w-full pl-12 pr-4 py-4 bg-surface-container-low dark:bg-inverse-surface/50 border-none rounded-DEFAULT focus:ring-0 focus:bg-surface-container-lowest dark:focus:bg-inverse-surface border-b-2 border-transparent focus:border-primary transition-all font-medium text-on-surface dark:text-white placeholder:text-outline-variant/50" placeholder="••••••••" type="password" />
                        </div>
                      </div>
                      <button className="w-full py-5 px-6 bg-gradient-to-br from-primary to-primary-container dark:from-primary-fixed dark:to-primary text-on-primary-container dark:text-on-primary font-headline font-bold rounded-DEFAULT shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 dark:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-3" type="submit">
                        <span className="tracking-wide">Enter the Session</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </button>
                    </form>
                  ) : (
                    <form action="#" className="space-y-5" id="register-form">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/70 dark:text-outline-variant ml-1">Full Name</label>
                          <input className="w-full px-4 py-3.5 bg-surface-container-low dark:bg-inverse-surface/50 border-none rounded-DEFAULT focus:ring-0 focus:bg-surface-container-lowest dark:focus:bg-inverse-surface border-b-2 border-transparent focus:border-primary transition-all font-medium text-on-surface dark:text-white" placeholder="Aristotle" type="text" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/70 dark:text-outline-variant ml-1">Email</label>
                          <input className="w-full px-4 py-3.5 bg-surface-container-low dark:bg-inverse-surface/50 border-none rounded-DEFAULT focus:ring-0 focus:bg-surface-container-lowest dark:focus:bg-inverse-surface border-b-2 border-transparent focus:border-primary transition-all font-medium text-on-surface dark:text-white" placeholder="lyceum@edu.com" type="email" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/70 dark:text-outline-variant ml-1">Create Password</label>
                        <input className="w-full px-4 py-3.5 bg-surface-container-low dark:bg-inverse-surface/50 border-none rounded-DEFAULT focus:ring-0 focus:bg-surface-container-lowest dark:focus:bg-inverse-surface border-b-2 border-transparent focus:border-primary transition-all font-medium text-on-surface dark:text-white" placeholder="••••••••" type="password" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-error dark:text-error/80 ml-1">Confirm Password</label>
                        <input className="w-full px-4 py-3.5 bg-error-container/20 dark:bg-error/10 border-none rounded-DEFAULT focus:ring-0 focus:bg-surface-container-lowest dark:focus:bg-inverse-surface border-b-2 border-error transition-all font-medium text-on-surface dark:text-white" placeholder="••••••••" type="password" />
                        <p className="text-[10px] text-error font-semibold flex items-center gap-1 mt-1 ml-1">
                          <span className="material-symbols-outlined text-[14px]">info</span>
                          Passwords do not match
                        </p>
                      </div>
                      <div className="flex items-start gap-3 py-2">
                        <input className="mt-1 rounded-sm text-primary dark:text-primary-fixed focus:ring-primary border-outline-variant dark:bg-on-surface/50" id="terms" type="checkbox" />
                        <label className="text-[11px] text-on-surface-variant dark:text-outline-variant leading-relaxed" htmlFor="terms">
                          I agree to the <span className="text-primary dark:text-primary-fixed-dim font-bold cursor-pointer">Terms of Enlightenment</span> and acknowledge the Privacy Protocol of the Socratic AI.
                        </label>
                      </div>
                      <button className="w-full py-4 px-6 bg-surface-container-high dark:bg-inverse-surface text-on-surface dark:text-surface-bright font-headline font-bold rounded-DEFAULT hover:bg-surface-variant dark:hover:bg-on-surface-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-outline-variant/10" type="submit">
                        <span>Create My Account</span>
                        <span className="material-symbols-outlined text-lg">person_add</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
              
              {/* Social Authentication */}
              <div className="px-8 pb-12 flex flex-col items-center">
                <div className="w-full flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-outline-variant/20"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-outline-variant dark:text-outline">Alternative Entry</span>
                  <div className="h-px flex-1 bg-outline-variant/20"></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-surface-container-low dark:bg-inverse-surface/30 rounded-DEFAULT hover:bg-surface-container-high dark:hover:bg-inverse-surface transition-colors text-sm font-semibold border border-outline-variant/5">
                    <img alt="Google" className="w-5 h-5 opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQjkclMarxkA4BRpqep8zrZMYsE8TWLJ5dCuR_c5fFtDthb11q1lgFCRSuMpnvdsaECWqjcQOO6wg7_vkMWrqfOv1p-h2XZ6p9JHe1WmD1kgzxiTqKDBet7-qA89bI_T8PsnOtLgIOEbRgaZnhTWK7Y03NFuKuCgZuiLdquWh7Ok8pj52PlqGmv1Adsjm9cPTqgqxl2sdXte22HeB3VGZFFPOA6GzqGCQLliANN_lbWIB3iSgwb0Ndfta4uh-LcGbgqARpNK7n7o8X" />
                    <span>Google Account</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-surface-container-low dark:bg-inverse-surface/30 rounded-DEFAULT hover:bg-surface-container-high dark:hover:bg-inverse-surface transition-colors text-sm font-semibold border border-outline-variant/5">
                    <span className="material-symbols-outlined text-xl text-on-surface-variant dark:text-outline-variant">terminal</span>
                    <span>GitHub Dev</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <footer className="mt-10 text-center lg:text-left text-on-surface-variant/60 dark:text-outline-variant/50 text-[11px] font-medium tracking-wide">
            <p>© 2024 Socratic AI Tutor. All queries lead to wisdom.</p>
            <div className="flex justify-center lg:justify-start gap-6 mt-4">
              <a className="hover:text-primary dark:hover:text-primary-fixed-dim transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary dark:hover:text-primary-fixed-dim transition-colors" href="#">Security Protocols</a>
              <a className="hover:text-primary dark:hover:text-primary-fixed-dim transition-colors" href="#">Contact Proctors</a>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
