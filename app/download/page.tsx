// app/download/page.tsx
'use client';

import { useState } from 'react';
import { Download, Zap, Users, MessageCircle, Share2, Mic } from 'lucide-react';

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

    setTimeout(() => {
      setIsDownloading(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/kamkuro.png" 
              alt="Kamkuro" 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl object-contain" 
            />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter">kamkuro</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#community" className="hover:text-primary transition-colors">Community</a>
          </div>

          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-semibold transition-all active:scale-95 disabled:opacity-70"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download APK</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 bg-gradient-to-br from-background via-background to-accent/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-1.5 mb-6 text-sm mx-auto lg:mx-0">
                <div className="w-2 h-2 bg-[#1bd488] rounded-full animate-pulse" />
                Version 1.0.0 • Android
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-none mb-6">
                Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#1bd488]">Kamkuro</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-10">
                Your ultimate electronic marketplace.<br />Connect, trade, and grow together.
              </p>

              {/* Big Download Button */}
              <div className="flex flex-col items-center lg:items-start gap-4">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="group relative w-full sm:w-auto bg-gradient-to-r from-primary to-[#1bd488] hover:brightness-110 text-primary-foreground font-semibold text-xl sm:text-2xl px-10 sm:px-16 py-6 sm:py-8 rounded-3xl flex items-center justify-center sm:justify-start gap-4 sm:gap-6 transition-all active:scale-[0.97] shadow-2xl shadow-primary/30 disabled:opacity-80"
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xs sm:text-sm tracking-widest opacity-80">DOWNLOAD FOR ANDROID</span>
                    <span className="text-3xl sm:text-4xl">kamkuro.apk</span>
                  </div>
                  <Download className="w-10 h-10 sm:w-12 sm:h-12 group-active:rotate-12 transition-transform flex-shrink-0" />
                </button>

                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  Safe &amp; Verified • Direct from official servers
                </p>
              </div>
            </div>

            {/* Right Mobile Mockup - Using your home.jpeg */}
            <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="relative w-[280px] sm:w-[320px] h-[560px] sm:h-[620px] bg-black rounded-[3rem] border-8 border-black shadow-2xl overflow-hidden">
                <img 
                  src="/explore.jpeg" 
                  alt="Kamkuro App Home" 
                  className="w-full h-full object-cover"
                />
                {/* Status bar overlay */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-black/70 flex items-center px-6 text-white text-[10px]">
                  <div className="flex-1">9:41</div>
                  <div className="flex gap-1">
                    <div>5G</div>
                    <div>92%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
     {/* About Us Section */}
{/* About Us Section */}
<section id="about" className="py-20 bg-card border-t border-border">
  <div className="max-w-5xl mx-auto px-4 sm:px-6">
    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div>
        <div className="uppercase tracking-widest text-sm text-primary mb-4">OUR STORY</div>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">The marketplace for electronics enthusiasts</h2>
        <div className="space-y-6 text-lg text-muted-foreground">
          <p>
            Kamkuro is more than just a buying and selling platform — it's a thriving community for people who love technology, gadgets, and innovation.
          </p>
          <p>
            We built Kamkuro to make trading electronics seamless, safe, and social. Find the latest gadgets or rare components with trusted buyers and sellers.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="aspect-[9/16] md:aspect-[4/5] bg-zinc-900 rounded-3xl overflow-hidden border border-border shadow-xl">
          <img 
            src="/kamkuro.png" 
            alt="Kamkuro Messages" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Why people choose Kamkuro</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Built for electronics lovers</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-10 h-10 text-[#1bd488]" />, title: "Lightning Fast Listings", desc: "Post your electronics in seconds with smart categorization." },
              { icon: <MessageCircle className="w-10 h-10 text-[#1bd488]" />, title: "Real-time Chat", desc: "Negotiate deals instantly with buyers and sellers." },
              { icon: <Share2 className="w-10 h-10 text-[#1bd488]" />, title: "Discussion Sharing", desc: "Create and join meaningful discussions about gadgets." },
              { icon: <Mic className="w-10 h-10 text-[#1bd488]" />, title: "Live Rooms", desc: "Join voice chats and weekly tech talks." },
              { icon: <Users className="w-10 h-10 text-[#1bd488]" />, title: "Thriving Community", desc: "Connect with fellow tech enthusiasts." },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-card border border-border rounded-3xl p-8 hover:border-primary/50 hover:shadow-xl transition-all group"
              >
                <div className="mb-8">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Highlight */}
      <section id="community" className="py-20 bg-card border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight mb-6">Built for the community</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Kamkuro is where tech lovers gather to discuss, share, and grow together.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-background border border-border rounded-3xl p-8">
              <div className="text-[#1bd488] mb-6">
                <MessageCircle className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="font-semibold text-xl mb-2">Live Chats</h4>
              <p className="text-muted-foreground">Instant messaging with buyers and sellers</p>
            </div>
            <div className="bg-background border border-border rounded-3xl p-8">
              <div className="text-[#1bd488] mb-6">
                <Share2 className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="font-semibold text-xl mb-2">Share Discussions</h4>
              <p className="text-muted-foreground">Viral threads and expert advice</p>
            </div>
            <div className="bg-background border border-border rounded-3xl p-8">
              <div className="text-[#1bd488] mb-6">
                <Mic className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="font-semibold text-xl mb-2">Live Rooms</h4>
              <p className="text-muted-foreground">Weekly AMAs and tech talks</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">Ready to join the Kamkuro community?</h2>
          <p className="text-xl sm:text-2xl mb-12 opacity-90">Download now and start trading smarter</p>
          
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-white text-primary hover:bg-white/90 font-semibold text-xl px-12 py-6 rounded-3xl inline-flex items-center gap-4 transition-all active:scale-95 disabled:opacity-70 w-full sm:w-auto justify-center"
          >
            <Download className="w-7 h-7" />
            DOWNLOAD KAMKURO APK
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          © 2026 Kamkuro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}