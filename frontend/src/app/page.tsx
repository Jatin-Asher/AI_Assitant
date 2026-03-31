"use client";
import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../components/theme-toggle';

export default function LandingPage() {
  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400 font-headline tracking-tight">Socratic AI</span>

          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-primary-fixed dark:bg-purple-900/40 flex items-center justify-center overflow-hidden border border-outline-variant/30">
              <img alt="User avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5VfV-ZRKHSbadao7w1xGpRfYq_TTanX3C521RfoiRZnKwTQX1lH-qfLZSWT1x2kvvBppF5iPtnmF16jXmxNQ-Kr5mo01ORGymeefn1YJsfvjNbAKuPzNuHX9TPA1uMlovvdJau51BJfJzkpaR9fZXBKWcBJhSthqE4CfJyL88PJ12S5rU8ORxb_KB27kNKOou6Rnwe5KZ5mNKzeoQz7TvoiADOfFc0f0T4NmHp10k8GFKYBtGEETB1FGgjqUoYtiTR-0E4b5Ojc34" />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-0">
        {/* Hero Section */}
        <section className="relative min-h-screen lg:min-h-[921px] flex items-center overflow-hidden px-4 md:px-6 py-24 lg:py-0">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container dark:bg-purple-900/60 text-on-secondary-container dark:text-purple-200 mb-6 text-sm font-semibold tracking-wide">
                <span className="material-symbols-outlined text-sm" data-icon="auto_awesome">auto_awesome</span>
                EDUCATIONAL EXCELLENCE
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-on-surface dark:text-gray-100 leading-[1.1] mb-6 tracking-tight">
                Learn by Thinking,
                Not by Copying Answers
              </h1>
              <p className="text-xl text-on-surface-variant dark:text-gray-300 mb-10 max-w-lg leading-relaxed font-body">
                An AI tutor that guides you step-by-step using questions, hints, and reasoning — instead of giving direct answers.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <Link href="/login?mode=register" className="px-6 md:px-8 py-3 md:py-4 rounded-DEFAULT bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold text-base md:text-lg shadow-lg hover:shadow-primary/20 transition-all active:scale-95 w-full sm:w-auto text-center inline-block">
                  Get Started
                </Link>

                <Link href="/login" className="px-6 md:px-8 py-3 md:py-4 rounded-DEFAULT bg-surface-container-high dark:bg-gray-800 text-on-surface dark:text-gray-100 font-semibold text-base md:text-lg hover:bg-surface-container-highest dark:hover:bg-gray-700 transition-all active:scale-95 w-full sm:w-auto text-center inline-block">
                  Log In
                </Link>
              </div>
              <p className="text-sm text-primary font-medium mt-4">
                <span role="img" aria-label="Not a chatbot">🚫</span> Not a chatbot. A guided learning system.
              </p>
            </div>

            {/* Bento Style Visual */}
            <div className="relative flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-12 gap-4 lg:h-[600px] w-full mt-12 lg:mt-0">
              <div className="lg:col-span-8 lg:row-span-7 bg-surface-container-lowest dark:bg-black rounded-lg overflow-hidden shadow-sm border border-outline-variant/10 relative group min-h-[300px] lg:min-h-0">
                <img alt="Student learning" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbVHF7B0VizTPDS97UGg73sjyU1i-EWA10SWJg5P6UwUuU3sjdNK7H952jelErD9TqQdwI6A0vzMVA9RIIksrEKo7ox2r3hTpaSJMzXYxqdjCfMUZ888l-JxscIE2ioXf0FfuY3oA60tkHx49Kmr5KkMkoPoihxFYFoA-lb7nW0VuG-OhZIZ4gRTX5m0ewtGoAB7lhnaS3ffC8MMCrgjV5lv1w8S3ljT1jqstN0Q7TRebBp6kdPS1mvKiCnf_7fFwgjCP4Scw8ImZ1" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white font-headline font-bold text-xl">Interactive Dialogue</p>
                </div>
              </div>
              <div className="lg:col-span-4 lg:row-span-4 bg-primary text-on-primary rounded-lg p-6 flex flex-col justify-between min-h-[200px] lg:min-h-0">
                <span className="material-symbols-outlined text-4xl" data-icon="psychology">psychology</span>
                <div className="mt-auto lg:mt-0">
                  <div className="text-3xl font-bold">98%</div>
                  <div className="text-sm opacity-80">Retainment Rate</div>
                </div>
              </div>
              <div className="lg:col-span-4 lg:row-span-5 bg-secondary-container dark:bg-purple-900/60 rounded-lg p-6 flex items-center justify-center min-h-[200px] lg:min-h-0">
                <span className="material-symbols-outlined text-6xl text-on-secondary-container dark:text-purple-200" data-icon="functions">functions</span>
              </div>
              <div className="lg:col-span-7 lg:row-span-5 bg-surface-container-low dark:bg-gray-900 rounded-lg p-6 flex flex-col gap-3 border border-outline-variant/20 min-h-[200px] lg:min-h-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-purple-900 flex items-center justify-center text-primary dark:text-purple-300">
                    <span className="material-symbols-outlined" data-icon="terminal">terminal</span>
                  </div>
                  <span className="font-semibold text-on-surface">Critical Thinking</span>
                </div>
                <p className="text-sm text-on-surface-variant">Master logic and problem solving through structured guidance.</p>
                <div className="mt-auto h-2 w-full bg-white/50 dark:bg-purple-900/50 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-primary rounded-full"></div>
                </div>
              </div>
              <div className="lg:col-span-5 lg:row-span-3 bg-tertiary-fixed dark:bg-purple-950/50 rounded-lg flex items-center justify-center min-h-[150px] lg:min-h-0">
                <span className="material-symbols-outlined text-3xl text-on-tertiary-fixed dark:text-purple-300" data-icon="history_edu">history_edu</span>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10"></div>
        </section>

        {/* Socratic Interface Preview */}
        <section className="py-16 md:py-24 px-4 md:px-6 bg-surface-container-low dark:bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-on-surface dark:text-gray-100 mb-4">The Guided Experience</h2>
              <p className="text-base md:text-lg text-on-surface-variant dark:text-gray-300 max-w-2xl mx-auto">Experience a learning environment designed for deep focus and academic rigor.</p>
            </div>
            <div className="glass-panel p-4 md:p-8 rounded-lg shadow-xl border border-outline-variant/20 max-w-4xl mx-auto">
              {/* Tutor Bubble */}
              <div className="flex gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-fixed dark:bg-purple-900/40 flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm md:text-base" data-icon="psychology">psychology</span>
                </div>
                <div className="bg-surface-container-lowest dark:bg-black p-4 md:p-6 rounded-lg rounded-tl-none border-l-4 border-primary shadow-sm max-w-xl">
                  <p className="text-on-surface dark:text-gray-100 leading-relaxed text-base md:text-lg font-body">
                    That's an interesting observation about the Pythagorean theorem. Instead of just looking at the formula, what happens to the area of the squares if we double the length of the sides?
                  </p>
                </div>
              </div>

              {/* Student Bubble */}
              <div className="flex flex-row-reverse gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary-container dark:bg-purple-900/60 flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container dark:text-gray-100 text-sm md:text-base" data-icon="person" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                </div>
                <div className="bg-secondary-container dark:bg-purple-900/60 p-4 md:p-6 rounded-lg rounded-tr-none shadow-sm max-w-xl">
                  <p className="text-on-secondary-container dark:text-gray-100 leading-relaxed font-medium font-body text-base md:text-lg">
                    I think the area would quadruple, because each side is squared in the area calculation?
                  </p>
                </div>
              </div>

              {/* Thinking Indicator */}
              <div className="flex gap-3 md:gap-4 opacity-60">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-highest flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined animate-pulse text-sm md:text-base" data-icon="auto_awesome">auto_awesome</span>
                </div>
                <div className="flex gap-2 items-center py-2 md:py-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>

              {/* Input Area */}
              <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-outline-variant/30">
                <div className="relative group">
                  <input className="font-body w-full bg-surface-container-low dark:bg-gray-800 dark:text-gray-100 border-none border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-DEFAULT pl-4 md:pl-6 pr-14 md:pr-16 py-3 md:py-4 text-base md:text-lg transition-all placeholder:text-outline" placeholder="Share your thoughts..." type="text" />
                  <button className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-90 transition-transform">
                    <span className="material-symbols-outlined text-sm md:text-base" data-icon="send">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-surface-container-lowest dark:bg-black p-10 rounded-lg border border-outline-variant/10 group">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h3 className="text-3xl font-bold mb-4 font-headline">Master Every Discipline</h3>
                    <p className="text-on-surface-variant dark:text-gray-300 max-w-md font-body">From Quantum Physics to Renaissance Art, our AI is trained across the entire spectrum of human knowledge.</p>
                  </div>
                  <span className="material-symbols-outlined text-5xl text-primary/20 group-hover:text-primary/60 transition-colors" data-icon="menu_book">menu_book</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full bg-surface-container-high dark:bg-gray-800 text-sm font-medium font-body">Mathematics</span>
                  <span className="px-4 py-2 rounded-full bg-surface-container-high dark:bg-gray-800 text-sm font-medium font-body">Philosophy</span>
                  <span className="px-4 py-2 rounded-full bg-surface-container-high dark:bg-gray-800 text-sm font-medium font-body">Computer Science</span>
                  <span className="px-4 py-2 rounded-full bg-surface-container-high dark:bg-gray-800 text-sm font-medium font-body">History</span>
                  <span className="px-4 py-2 rounded-full bg-surface-container-high dark:bg-gray-800 text-sm font-medium font-body">Literature</span>
                  <span className="px-4 py-2 rounded-full bg-surface-container-high dark:bg-gray-800 text-sm font-medium font-body">Economics</span>
                </div>
              </div>
              <div className="bg-primary p-10 rounded-lg text-on-primary flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-4xl mb-6" data-icon="bolt">bolt</span>
                  <h3 className="text-2xl font-bold mb-4 font-headline">Accelerated Growth</h3>
                  <p className="opacity-80 font-body">Our method is proven to increase concept mastery by 3x compared to traditional video-based learning.</p>
                </div>
                <a className="inline-flex items-center gap-2 font-bold group font-body" href="#">
                  Read the Study
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
                </a>
              </div>
              <div className="bg-secondary-container dark:bg-purple-900/60 p-10 rounded-lg text-on-secondary-container dark:text-purple-200">
                <span className="material-symbols-outlined text-4xl mb-6" data-icon="verified_user">verified_user</span>
                <h3 className="text-2xl font-bold mb-4 font-headline">Academic Integrity</h3>
                <p className="font-body">We focus on the journey of understanding. Our AI will never provide a direct answer, ensuring you truly learn the material.</p>
              </div>
              <div className="md:col-span-2 bg-surface-container-high dark:bg-gray-800 p-10 rounded-lg relative overflow-hidden group">
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-3xl font-bold mb-4 font-headline">Track Your Cognitive Journey</h3>
                  <p className="text-on-surface-variant dark:text-gray-300 max-w-sm mb-8 font-body">Visualize your progress through knowledge trees and conceptual maps.</p>
                  <div className="mt-auto flex gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-white/30 border-t-primary animate-spin"></div>
                    <div>
                      <div className="text-xl font-bold font-headline">Analysis in Progress</div>
                      <div className="text-sm opacity-60 font-body">Building your personalized path</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity">
                  <img alt="Data visualization" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNpuPsffYZ_zq7YCFoxgqt0d9fTqVTc5v_MzE1IWUz7LcEkmfqPM-ZpZ6yWuRwIgP-Ge5deMUusnc1q5knYCRDh2RF_2iTfOR0wL014guMtTAJeCb5fMM4v7XZFImNC_bp30ZpjYDFVeEBwjpDChW0FG9VwDtRVaz2fNoVi-T9v64GetspNKD_F0RcVVvWIgtT5Fwz1oMFCxC2DNMOiBYCVFJ0lgpyp4W9Fjm6P7FQQUBivUJYeOjA35q7LgY60ch45qgRfFp0DmpJ" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-32 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center bg-surface-container-lowest dark:bg-black p-8 md:p-16 rounded-xl shadow-sm border border-outline-variant/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
            <h2 className="text-3xl md:text-5xl font-bold text-on-surface dark:text-gray-100 mb-4 md:mb-6 font-headline">Ready to expand your mind?</h2>
            <p className="text-base md:text-xl text-on-surface-variant dark:text-gray-300 mb-8 md:mb-10 max-w-xl mx-auto font-body">
              Join thousands of students and lifelong learners who are mastering complex subjects through inquiry.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login?mode=register" className="px-8 md:px-10 py-4 md:py-5 rounded-DEFAULT bg-primary text-on-primary font-bold text-base md:text-lg hover:bg-primary-container transition-all shadow-lg hover:shadow-primary/30 font-headline text-center inline-block">
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest/30 dark:bg-black pt-16 md:pt-20 pb-8 md:pb-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-16">
            <div className="col-span-2">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-headline mb-6 block">Socratic AI</span>
              <p className="text-on-surface-variant dark:text-gray-300 max-w-xs leading-relaxed mb-6 font-body">
                Revolutionizing education through guided discovery and cognitive engagement.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-on-surface" data-icon="public">public</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-on-surface" data-icon="school">school</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-on-surface dark:text-gray-100 mb-6 font-headline">Product</h4>
              <ul className="space-y-4 text-on-surface-variant dark:text-gray-300 font-body">
                <li><a className="hover:text-primary transition-colors" href="#">Features</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Institutions</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-on-surface dark:text-gray-100 mb-6 font-headline">Subjects</h4>
              <ul className="space-y-4 text-on-surface-variant dark:text-gray-300 font-body">
                <li><a className="hover:text-primary transition-colors" href="#">Mathematics</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Humanities</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Engineering</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Sciences</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-on-surface dark:text-gray-100 mb-6 font-headline">Company</h4>
              <ul className="space-y-4 text-on-surface-variant dark:text-gray-300 font-body">
                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-on-surface-variant dark:text-gray-300 font-body">
            <p>© 2024 Socratic AI Tutor. All rights reserved.</p>
            <div className="flex gap-8">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
