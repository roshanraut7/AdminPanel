// app/download/page.tsx
'use client';

import { useState } from 'react';
import { Download, Star, Shield, Zap } from 'lucide-react';

export default function KamkuroDownloadPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    
    const link = document.createElement('a');
    link.href = 'https://cdn.kamkuro.com/store/app/kamkuro.apk';
    link.download = 'kamkuro.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Reset button after 2 seconds
    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
              <span className="text-primary-foreground text-2xl font-bold">K</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter">kamkuro</h1>
          </div>
          
          <div className="flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <button 
              onClick={handleDownload}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-semibold transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-background via-background to-accent/30">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-1.5 mb-6 text-sm">
            <div className="w-2 h-2 bg-[#1bd488] rounded-full animate-pulse" />
            Version 1.0.0 • Now available for Android
          </div>

          <h1 className="text-7xl md:text-[5.5rem] font-bold tracking-tighter leading-none mb-6">
            Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#1bd488]">Kamkuro</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-2xl mx-auto mb-10">
            The ultimate mobile experience.<br />Fast. Beautiful. Yours.
          </p>

          {/* Trust signals */}
          <div className="flex justify-center items-center gap-8 mb-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-[#1bd488]" />
              4.9 • 128k ratings
            </div>
            <div className="h-3 w-px bg-border" />
            <div>50M+ Downloads</div>
            <div className="h-3 w-px bg-border" />
            <div>Free Forever</div>
          </div>

          {/* Big Download Button */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="group relative bg-gradient-to-r from-primary to-[#1bd488] hover:brightness-110 text-primary-foreground font-semibold text-2xl px-16 py-8 rounded-3xl flex items-center gap-6 transition-all active:scale-[0.97] shadow-2xl shadow-primary/30 disabled:opacity-80"
            >
              <div className="flex flex-col items-start">
                <span className="text-sm tracking-widest opacity-80">DOWNLOAD FOR ANDROID</span>
                <span className="text-4xl">kamkuro.apk</span>
              </div>
              <Download className="w-12 h-12 group-active:rotate-12 transition-transform" />
            </button>

            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Safe &amp; Verified • Direct from official CDN
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight mb-4">Why millions love Kamkuro</h2>
            <p className="text-xl text-muted-foreground">Built for speed and simplicity</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-10 h-10 text-[#1bd488]" />,
                title: "Lightning Fast",
                desc: "Optimized performance with minimal battery usage"
              },
              {
                icon: <Shield className="w-10 h-10 text-[#1bd488]" />,
                title: "Secure by Default",
                desc: "Enterprise-grade encryption and privacy protection"
              },
              {
                icon: <Star className="w-10 h-10 text-[#1bd488]" />,
                title: "Stunning Design",
                desc: "Modern UI that feels premium on every device"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-background border border-border rounded-3xl p-10 hover:border-primary/50 transition-colors group">
                <div className="mb-8">{feature.icon}</div>
                <h3 className="text-3xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold tracking-tight mb-6">Ready to join the Kamkuro family?</h2>
          <p className="text-2xl mb-12 opacity-90">Download now and start exploring</p>
          
          <button
            onClick={handleDownload}
            className="bg-white text-primary hover:bg-white/90 font-semibold text-xl px-12 py-6 rounded-3xl inline-flex items-center gap-4 transition-all active:scale-95"
          >
            <Download className="w-7 h-7" />
            DOWNLOAD KAMKURO APK
          </button>
          
          <p className="mt-8 text-sm opacity-70">File size: ~48MB • Android 8.0+</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2026 Kamkuro. All rights reserved.
          <div className="mt-2">Made with passion for a better mobile experience.</div>
        </div>
      </footer>
    </div>
  );
}