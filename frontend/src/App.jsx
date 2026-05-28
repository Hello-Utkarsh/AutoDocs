import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  PenLine,
  BookOpen,
  Sparkles,
  Share2,
  Eye,
  Zap,
  Menu,
  X,
  MessageSquare,
  FileText,
  Globe,
  CheckCircle2,
  ArrowRight,
  // Github,
  // Twitter
} from 'lucide-react';
import { Star, Heart, Cloud } from 'lucide-react';

function App() {

  const user = useUser()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  useEffect(() => {
    if (user.isSignedIn) {
      navigate('/main')
    }
  })

  return (
    <div className="min-h-screen bg-[#FCF9F4]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FCF9F4] border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <PenLine className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">AutoDocs</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#platforms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Platforms
              </a>
              <a href="#get-started" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Get Started
              </a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button className="px-4 py-2 text-sm text-foreground hover:text-primary transition-colors">
                Sign In
              </button>
              <button className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-all shadow-sm">
                Start Writing
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#platforms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Platforms
                </a>
                <a href="#get-started" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Get Started
                </a>
                <div className="flex flex-col gap-2 pt-2">
                  <button className="px-4 py-2 text-sm text-foreground hover:text-primary transition-colors text-left">
                    Sign In
                  </button>
                  <button className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-all">
                    Start Writing
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CE9C4D] rounded-full text-sm text-accent-foreground mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Powered by Gemini AI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">
              Write Once,
              <br />
              <span className="text-primary">Publish Everywhere</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Craft beautiful notes and blogs with our markdown editor.
              Publish to Medium, Dev.to, X, and more platforms with a single click.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-3.5 bg-[#CE9C4D] text-black rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-base font-medium">
                Start Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-3.5 bg-card text-card-foreground border border-border rounded-xl hover:bg-accent transition-all flex items-center justify-center gap-2 text-base">
                <Eye className="w-5 h-5" />
                View Demo
              </button>
            </div>

            {/* Hero Image/Editor Preview */}
            <div className="mt-16 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-2xl" />
              <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                    <div className="w-3 h-3 rounded-full bg-primary/60" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-4">Untitled Document</span>
                </div>
                <div className="p-8 text-left bg-gradient-to-br from-background to-accent/10">
                  <div className="space-y-4">
                    <div className="h-8 bg-muted/40 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-muted/30 rounded w-full" />
                    <div className="h-4 bg-muted/30 rounded w-5/6" />
                    <div className="h-4 bg-muted/30 rounded w-4/6" />
                    <div className="h-12 bg-accent/50 rounded-lg mt-6 flex items-center px-4 text-sm text-muted-foreground">
                      Start writing your thoughts...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-gradient-to-b from-transparent to-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Write & Publish</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for writers who want to focus on content, not complexity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<PenLine className="w-6 h-6" />}
              title="Markdown Editor"
              description="Write with ease using our intuitive markdown editor. Format text naturally with simple syntax."
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Notes & Blogs"
              description="Organize your ideas as notes or craft detailed blog posts. Switch between formats effortlessly."
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="AI Writing Assistant"
              description="Gemini-powered chat helps you brainstorm, edit, and refine your content in real-time."
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6" />}
              title="Multi-Platform Publishing"
              description="Publish to Medium, Dev.to, X, and more platforms simultaneously with one click."
            />
            <FeatureCard
              icon={<Eye className="w-6 h-6" />}
              title="Live Preview"
              description="See exactly how your content will look as you write. No surprises, just beautiful formatting."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Lightning Fast"
              description="Distraction-free interface that loads instantly. Focus on writing, not waiting."
            />
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="sm:py-28 h-180">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className='flex justify-between'>
            <div className="text-start mb-10 w-5/12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CE9C4D] rounded-full text-sm text-accent-foreground">
                <Globe className="w-4 h-4 text-primary" />
                <span className=''>Currently Supporting 4 Platforms</span>
              </div>
              <h2 className="sm:text-5xl font-bold mt-6 mb-2">
                Publish to Your Favorite Platforms
              </h2>
              <p className="text-lg mt-2 text-muted-foreground max-w-2xl mx-auto">
                Connect your accounts once, publish everywhere. Just provide your API keys and you're ready to go.
              </p>
              <div className="mt-6 text-start">
                <p className="text-sm text-muted-foreground mb-6">
                  Simple setup • Secure API key storage • Publish with one click
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>No scheduling hassles</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Cross-post in seconds</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Track all your posts</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="relative w-5/12 rounded-2xl overflow-visible flex items-center justify-center border border-white/10"
            >
              <div className="absolute h-120 -top-20 inset-0 scale-125 opacity-80 bg-[radial-gradient(circle,rgba(206,156,77,1)_0%,rgba(252,249,244,1)_70%)]" />

              {/* --- FLOATING ICONS (Absolute Positioned) --- */}

              {/* Icon 1: Top Left */}
              <div
                className="absolute top-20 left-16 p-4 bg-white/80 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm text-amber-700 animate-[bounce_3s_infinite]"
              >
                <Sparkles size={28} />
              </div>

              {/* Icon 2: Top Right */}
              <div
                className="absolute top-10 right-40 p-3 bg-white/80 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm text-amber-700 animate-[bounce_4s_infinite_1s]"
              >
                <Star size={24} />
              </div>

              {/* Icon 3: Bottom Left */}
              <div
                className="absolute bottom-16 left-40 p-3 bg-white/80 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm text-amber-700 animate-[bounce_3.5s_infinite_0.5s]"
              >
                <Heart size={24} />
              </div>

              {/* Icon 4: Bottom Right */}
              <div
                className="absolute bottom-20 right-20 p-4 bg-white/80 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm text-amber-700 animate-[bounce_4.5s_infinite]"
              >
                <Cloud size={28} />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* AI Chat Feature */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-accent/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/30 rounded-full blur-3xl" />

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-sm text-accent-foreground mb-6">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Gemini AI Integration</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Your AI Writing Companion
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Get instant help with brainstorming, editing, and improving your content.
                  Gemini AI is always ready to assist you.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Generate ideas and outlines instantly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Improve grammar and writing style</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Summarize and expand your content</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-accent/50 to-background border border-border rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">AI Assistant</div>
                    <div className="text-xs text-muted-foreground">Always here to help</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    How can I improve this introduction?
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3 text-sm border border-primary/20">
                    I'd suggest starting with a compelling hook. Try leading with a question
                    or a surprising statistic to grab your reader's attention...
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask anything..."
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      disabled
                    />
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-black rounded-2xl">
          <div className="p-12 sm:p-16 text-primary-foreground backdrop-blur-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your Writing?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join writers who are already publishing their content across multiple platforms effortlessly.
              Start for free today.
            </p>
            <button className="px-8 py-4 bg-white text-primary rounded-xl hover:bg-gray-50 transition-all shadow-lg text-base font-medium inline-flex items-center gap-2">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold">AutoDocs</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                The simplest way to write, manage, and publish your notes and blogs across multiple platforms.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#platforms" className="hover:text-foreground transition-colors">Platforms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3">Connect</h4>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-lg bg-accent hover:bg-accent/70 transition-colors flex items-center justify-center">
                  {/* <Twitter className="w-4 h-4" /> */}
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-accent hover:bg-accent/70 transition-colors flex items-center justify-center">
                  {/* <Github className="w-4 h-4" /> */}
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 AutoDocs. Crafted for writers who value simplicity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description
}) {
  return (
    <div className="group p-6 bg-[#EFEDE7] border border-border rounded-xl hover:shadow-lg hover:shadow-primary/5 hover:scale-105 transition-all duration-300">
      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function PlatformCard({
  name,
  description,
  icon,
  gradient
}) {
  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl`} />
      <div className="relative p-6 bg-card border border-border rounded-xl hover:border-primary/30 transition-all">
        <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent rounded-lg flex items-center justify-center text-2xl font-bold text-primary mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default App