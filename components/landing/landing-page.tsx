"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  Building2,
  Check,
  ChevronRight,
  CircleUserRound,
  Heart,
  Menu,
  MessageCircle,
  MessagesSquare,
  Mic2,
  Play,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  Users,
  Vote,
} from "lucide-react";

import AuthToggleForm, {
  type AuthMode,
} from "@/components/form/authForm";
import Reveal from "@/components/landing/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "Live discussions", href: "#live" },
  { label: "For business", href: "#business" },
  { label: "How it works", href: "#how-it-works" },
];

const features = [
  {
    icon: Users,
    title: "Create communities",
    description:
      "Build focused spaces for interests, local groups, creators, teams, and professional networks.",
  },
  {
    icon: Send,
    title: "Publish rich posts",
    description:
      "Share updates, images, questions, announcements, and useful resources with your audience.",
  },
  {
    icon: MessageCircle,
    title: "Private messaging",
    description:
      "Keep conversations moving with direct messages and meaningful friend connections.",
  },
  {
    icon: Radio,
    title: "Live discussions",
    description:
      "Host real-time conversations, invite speakers, and let members participate instantly.",
  },
  {
    icon: Vote,
    title: "Community polls",
    description:
      "Collect quick opinions, make group decisions, and turn feedback into visible results.",
  },
  {
    icon: MessagesSquare,
    title: "Discussion forums",
    description:
      "Organise long-form topics into searchable threads instead of losing ideas in a busy feed.",
  },
  {
    icon: BarChart3,
    title: "Post analytics",
    description:
      "Understand reach and engagement so creators and community owners can improve what they share.",
  },
  {
    icon: BadgeCheck,
    title: "Verified business identity",
    description:
      "Give approved businesses and business communities a clear badge that helps members trust them.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Create your space",
    description:
      "Start a personal profile, community, or business community and define what it is about.",
  },
  {
    number: "02",
    title: "Invite and engage",
    description:
      "Bring people together through posts, messages, polls, forums, and live discussions.",
  },
  {
    number: "03",
    title: "Learn and grow",
    description:
      "Use engagement signals and post analytics to understand what your community values.",
  },
];

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const shouldReduceMotion = useReducedMotion();

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header onOpenAuth={openAuth} />

      <main>
        <section className="relative isolate overflow-hidden border-b border-border/70 pb-20 pt-14 sm:pb-28 sm:pt-20 lg:pb-32 lg:pt-24">
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_16%_18%,color-mix(in_srgb,var(--ring)_15%,transparent),transparent_30%),radial-gradient(circle_at_86%_22%,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_28%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px] bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_95%)]" />

          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-8">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left"
            >
              <Badge
                variant="outline"
                className="mb-6 rounded-full border-primary/20 bg-primary/5 px-3.5 py-1.5 text-primary"
              >
                <Sparkles className="mr-1.5 size-3.5" />
                Communities built for real conversation
              </Badge>

              <h1 className="text-balance text-4xl font-bold tracking-[-0.045em] sm:text-5xl lg:text-6xl xl:text-[4.6rem] xl:leading-[1.02]">
                More than a feed.
                <span className="block text-primary">A place to belong.</span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg lg:mx-0">
                Kamkuro brings communities, posts, private messages, live
                discussions, polls, forums, analytics, and verified business
                profiles into one trusted social platform.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => openAuth("signup")}
                  className="h-12 rounded-xl px-6 text-sm font-semibold shadow-[0_14px_35px_rgba(5,91,101,0.18)]"
                >
                  Create your account
                  <ArrowRight className="ml-2 size-4" />
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-border bg-card/70 px-6 text-sm font-semibold backdrop-blur"
                >
                  <Link href="#features">
                    Explore features
                    <ChevronRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-muted-foreground lg:justify-start">
                {["Free to join", "Real-time conversations", "Built for trust"].map(
                  (item) => (
                    <span key={item} className="inline-flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Check className="size-3" />
                      </span>
                      {item}
                    </span>
                  ),
                )}
              </div>
            </motion.div>

            <HeroVisual reduceMotion={Boolean(shouldReduceMotion)} />
          </div>
        </section>

        <section className="border-b border-border/70 bg-card/45 py-7">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
            {["Communities", "Live rooms", "Polls & forums", "Business verification"].map(
              (item, index) => (
                <Reveal key={item} delay={index * 0.06}>
                  <div className="flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-center text-sm font-semibold text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-ring" />
                    {item}
                  </div>
                </Reveal>
              ),
            )}
          </div>
        </section>

        <section id="features" className="scroll-mt-24 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Everything in one place"
              title="Designed for communities that want to do more"
              description="Kamkuro combines the speed of social media with the structure of forums and the energy of live conversation."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <Reveal key={feature.title} delay={(index % 4) * 0.06}>
                    <Card className="group h-full rounded-2xl border-border/80 bg-card/90 shadow-none transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_55px_rgba(5,91,101,0.08)]">
                      <CardContent className="p-6">
                        <div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="size-5" />
                        </div>
                        <h3 className="text-base font-bold tracking-tight">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="live" className="scroll-mt-24 border-y border-border/70 bg-secondary/55 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <Reveal>
                <div>
                  <Badge className="rounded-full bg-accent text-accent-foreground hover:bg-accent">
                    <Radio className="mr-1.5 size-3.5" />
                    Live and structured
                  </Badge>
                  <h2 className="mt-5 text-balance text-3xl font-bold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                    Conversations that do not disappear in the scroll
                  </h2>
                  <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
                    Start live discussions for immediate participation, then
                    continue the topic in a forum thread, collect opinions with
                    a poll, and share the outcome as a post.
                  </p>

                  <div className="mt-8 space-y-4">
                    {[
                      "Invite hosts, speakers, and community members",
                      "Keep important topics organised in forum threads",
                      "Turn audience feedback into visible poll results",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3.5" />
                        </span>
                        <span className="text-sm font-medium leading-6">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <ProductTabs />
              </Reveal>
            </div>
          </div>
        </section>

        <section id="business" className="scroll-mt-24 py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <Reveal>
              <div className="relative min-h-[470px] overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-[0_30px_80px_rgba(5,91,101,0.11)] sm:p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--ring)_15%,transparent),transparent_36%)]" />

                <div className="relative overflow-hidden rounded-2xl border border-border bg-background">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src="/home.jpeg"
                      alt="Kamkuro business community preview"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">Local Business Network</p>
                          <BadgeCheck className="size-4 fill-white text-primary" />
                        </div>
                        <p className="mt-1 text-xs text-white/75">
                          Verified business community
                        </p>
                      </div>
                      <Button size="sm" className="rounded-lg bg-white text-primary hover:bg-white/90">
                        Join
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="relative mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Post performance</span>
                      <BarChart3 className="size-4 text-primary" />
                    </div>
                    <div className="mt-6 flex h-24 items-end gap-2">
                      {[32, 48, 42, 68, 58, 88, 74].map((height, index) => (
                        <motion.div
                          key={`${height}-${index}`}
                          initial={{ height: 8 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.65, delay: index * 0.05 }}
                          className="flex-1 rounded-t-md bg-primary/100"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-primary p-5 text-primary-foreground">
                    <ShieldCheck className="size-6" />
                    <p className="mt-5 text-lg font-bold">Trusted identity</p>
                    <p className="mt-2 text-sm leading-6 text-primary-foreground/75">
                      Verification gives legitimate businesses a visible trust signal.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div>
                <Badge variant="outline" className="rounded-full border-primary/20 text-primary">
                  <Building2 className="mr-1.5 size-3.5" />
                  Built for business communities
                </Badge>
                <h2 className="mt-5 text-balance text-3xl font-bold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                  Build trust before asking people to engage
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
                  Verified profiles help members distinguish genuine businesses.
                  Community owners can then use post analytics to understand what
                  content earns attention and participation.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      icon: BadgeCheck,
                      title: "Verification badge",
                      text: "A clear visual signal for approved business profiles and communities.",
                    },
                    {
                      icon: BarChart3,
                      title: "Useful analytics",
                      text: "See the engagement signals needed to improve future posts.",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
                        <Icon className="size-5 text-primary" />
                        <h3 className="mt-4 font-bold">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {item.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 border-y border-border/70 bg-secondary/55 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Simple from day one"
              title="Create, connect, and grow together"
              description="The product journey is designed to move naturally from identity to participation and then to insight."
            />

            <div className="relative mt-12 grid gap-5 lg:grid-cols-3">
              <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-9 hidden h-px bg-border lg:block" />
              {workflow.map((step, index) => (
                <Reveal key={step.number} delay={index * 0.08}>
                  <div className="relative h-full rounded-2xl border border-border bg-card p-6">
                    <div className="relative z-10 flex size-12 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15">
                      {step.number}
                    </div>
                    <h3 className="mt-6 text-xl font-bold tracking-tight">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center text-primary-foreground shadow-[0_30px_80px_rgba(5,91,101,0.22)] sm:px-12 sm:py-16">
                <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-28 -right-16 size-72 rounded-full bg-ring/20 blur-3xl" />
                <div className="relative mx-auto max-w-3xl">
                  <Image
                    src="/kamkuro.png"
                    alt="Kamkuro"
                    width={64}
                    height={64}
                    className="mx-auto mb-6 size-14 rounded-2xl object-contain"
                  />
                  <h2 className="text-balance text-3xl font-bold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                    Your next great community can start here
                  </h2>
                  <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-primary-foreground/75">
                    Create a profile, start a community, invite people, and turn
                    shared interests into valuable conversations.
                  </p>
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button
                      size="lg"
                      onClick={() => openAuth("signup")}
                      className="h-12 rounded-xl bg-white px-6 font-semibold text-primary hover:bg-white/90"
                    >
                      Get started free
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => openAuth("login")}
                      className="h-12 rounded-xl border-white/25 bg-transparent px-6 font-semibold text-white hover:bg-white/10 hover:text-white"
                    >
                      Sign in
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer onOpenAuth={openAuth} />

      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto border-border bg-background p-0 sm:max-w-[520px]">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {authMode === "login" ? "Sign in to Kamkuro" : "Create a Kamkuro account"}
            </DialogTitle>
            <DialogDescription>
              Use the form to access your Kamkuro account.
            </DialogDescription>
          </DialogHeader>
          <AuthToggleForm
            initialMode={authMode}
            onModeChange={setAuthMode}
            onSuccess={() => setAuthOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface HeaderProps {
  onOpenAuth: (mode: AuthMode) => void;
}

function Header({ onOpenAuth }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#" className="flex items-center gap-2.5" aria-label="Kamkuro home">
          <Image
            src="/kamkuro.png"
            alt="Kamkuro logo"
            width={42}
            height={42}
            priority
            className="size-10 rounded-xl object-contain"
          />
          <span className="text-lg font-bold tracking-[-0.03em]">Kamkuro</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="ghost" className="rounded-xl" onClick={() => onOpenAuth("login")}>
            Sign in
          </Button>
          <Button className="rounded-xl" onClick={() => onOpenAuth("signup")}>
            Join Kamkuro
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>

        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="rounded-xl" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm p-6">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2.5">
                  <Image
                    src="/kamkuro.png"
                    alt="Kamkuro logo"
                    width={38}
                    height={38}
                    className="size-9 rounded-lg object-contain"
                  />
                  Kamkuro
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-8 flex flex-col" aria-label="Mobile navigation">
                {navigation.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="border-b border-border py-4 text-base font-semibold"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-8 grid gap-3">
                <SheetClose asChild>
                  <Button variant="outline" className="h-11 rounded-xl" onClick={() => onOpenAuth("login")}>
                    Sign in
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button className="h-11 rounded-xl" onClick={() => onOpenAuth("signup")}>
                    Create account
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function HeroVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 24 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[680px]"
    >
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-primary/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-3 shadow-[0_32px_100px_rgba(5,91,101,0.15)] sm:p-4">
        <div className="flex items-center justify-between border-b border-border px-2 pb-3">
          <div className="flex items-center gap-2">
            <Image
              src="/kamkuro.png"
              alt="Kamkuro"
              width={34}
              height={34}
              className="size-8 rounded-lg object-contain"
            />
            <div>
              <p className="text-xs font-bold">Kamkuro</p>
              <p className="text-[10px] text-muted-foreground">Community home</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-ring" />
          </div>
        </div>

        <div className="grid gap-3 pt-3 md:grid-cols-[0.72fr_1.28fr]">
          <div className="hidden space-y-3 md:block">
            <div className="rounded-2xl border border-border bg-secondary/70 p-4">
              <p className="text-xs font-bold">Your spaces</p>
              <div className="mt-4 space-y-3">
                {["Design Nepal", "Startup Builders", "Local Business"].map((item, index) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {index === 2 ? <Building2 className="size-4" /> : <Users className="size-4" />}
                    </div>
                    <span className="text-xs font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-primary p-4 text-primary-foreground">
              <div className="flex items-center justify-between">
                <Mic2 className="size-5" />
                <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold">LIVE</span>
              </div>
              <p className="mt-6 text-sm font-bold">How communities grow</p>
              <p className="mt-1 text-[11px] text-primary-foreground/70">12 people listening</p>
              <div className="mt-4 flex -space-x-2">
                {[0, 1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex size-7 items-center justify-center rounded-full border-2 border-primary bg-primary-foreground text-primary"
                  >
                    <CircleUserRound className="size-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="overflow-hidden rounded-2xl border border-border bg-background">
              <div className="flex items-center gap-3 p-4">
                <div className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <CircleUserRound className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs font-bold">Community Builder</p>
                    <BadgeCheck className="size-3.5 fill-primary text-white" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">2 minutes ago</p>
                </div>
              </div>

              <div className="relative aspect-[16/10]">
                <Image
                  src="/explore.jpeg"
                  alt="People connecting through a Kamkuro community"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 430px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="rounded-full bg-white/90 text-primary hover:bg-white">Featured community</Badge>
                  <p className="mt-2 max-w-sm text-sm font-bold leading-5 text-white sm:text-base">
                    Share ideas, meet people, and build something meaningful.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 text-muted-foreground">
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5"><Heart className="size-4" /> 248</span>
                  <span className="flex items-center gap-1.5"><MessageCircle className="size-4" /> 36</span>
                </div>
                <Send className="size-4" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold">Quick poll</p>
                  <Vote className="size-4 text-primary" />
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Which topic should we discuss next?
                </p>
                <div className="mt-3 space-y-2">
                  <div className="rounded-lg bg-primary px-3 py-2 text-[10px] font-semibold text-primary-foreground">Community growth · 64%</div>
                  <div className="rounded-lg bg-secondary px-3 py-2 text-[10px] font-semibold">Creator tools · 36%</div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold">New message</p>
                  <MessageCircle className="size-4 text-primary" />
                </div>
                <div className="mt-4 flex items-start gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <CircleUserRound className="size-4" />
                  </div>
                  <div className="rounded-xl rounded-tl-sm bg-secondary px-3 py-2 text-[10px] leading-4">
                    The live discussion was excellent. Let us continue in the forum.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!reduceMotion && (
        <>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 top-20 hidden rounded-2xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur sm:block lg:-right-8"
          >
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <Radio className="size-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold">Live now</p>
                <p className="text-[9px] text-muted-foreground">Join the discussion</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur sm:block lg:-left-8"
          >
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <ThumbsUp className="size-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold">Engagement rising</p>
                <p className="text-[9px] text-muted-foreground">Your post is connecting</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

function ProductTabs() {
  return (
    <Tabs
      defaultValue="live"
      className="w-full min-w-0 rounded-3xl border border-border bg-card p-3 shadow-[0_24px_70px_rgba(5,91,101,0.10)] sm:p-6"
    >
      <TabsList className="grid h-11 w-full grid-cols-3 rounded-xl bg-muted p-1">
        <TabsTrigger value="live" className="min-w-0 gap-1.5">
          <Mic2 className="size-4 shrink-0" />
          <span className="truncate">Live</span>
        </TabsTrigger>

        <TabsTrigger value="forum" className="min-w-0 gap-1.5">
          <MessagesSquare className="size-4 shrink-0" />
          <span className="truncate">Forum</span>
        </TabsTrigger>

        <TabsTrigger value="poll" className="min-w-0 gap-1.5">
          <Vote className="size-4 shrink-0" />
          <span className="truncate">Poll</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-3 min-h-[390px]">
        {/* LIVE TAB */}
        <TabsContent value="live" className="m-0">
          <div className="relative min-h-[390px] overflow-hidden rounded-2xl bg-primary text-primary-foreground">

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

            {/* Top status */}
            <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
              <Badge className="rounded-full bg-red-500 text-white hover:bg-red-500">
                <span className="mr-1.5 size-1.5 animate-pulse rounded-full bg-white" />
                LIVE
              </Badge>

              <span className="rounded-full bg-black/30 px-3 py-1 text-xs text-white backdrop-blur">
                24 listening
              </span>
            </div>

            {/* Bottom content */}
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <div className="flex size-14 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur">
                <Mic2 className="size-6" />
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Building a healthy online community
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/75">
                A live discussion with community owners, creators, and active
                members.
              </p>

              <Button className="mt-5 rounded-full bg-white text-primary hover:bg-white/90">
                <Play className="mr-2 size-4 fill-current" />
                Join room
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* FORUM TAB */}
        <TabsContent value="forum" className="m-0">
          <div className="min-h-[390px] rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">Community growth forum</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Organised topics and lasting answers
                </p>
              </div>

              <MessagesSquare className="size-5 text-primary" />
            </div>

            <div className="mt-6 space-y-3">
              {[
                ["How should we welcome new members?", "18 replies"],
                ["Ideas for next month's live sessions", "12 replies"],
                ["Community rules and moderation", "31 replies"],
                ["Share your latest project", "27 replies"],
              ].map(([title, replies]) => (
                <div
                  key={title}
                  className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {replies}
                    </p>
                  </div>

                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* POLL TAB */}
        <TabsContent value="poll" className="m-0">
          <div className="min-h-[390px] rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="rounded-full">
                Community poll
              </Badge>

              <Vote className="size-5 text-primary" />
            </div>

            <h3 className="mt-6 text-xl font-bold">
              What should our next live discussion cover?
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              326 members have voted
            </p>

            <div className="mt-7 space-y-4">
              {[
                ["Growing an engaged community", 64],
                ["Content planning for creators", 21],
                ["Building trust online", 15],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <div className="mb-2 flex justify-between gap-4 text-xs font-semibold">
                    <span>{label}</span>
                    <span>{value}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button className="mt-8 w-full rounded-xl">
              Submit your vote
            </Button>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}
interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h2 className="mt-4 text-balance text-3xl font-bold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
          {description}
        </p>
      </div>
    </Reveal>
  );
}

function Footer({ onOpenAuth }: HeaderProps) {
  return (
    <footer className="border-t border-border bg-card/60">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <Link href="#" className="inline-flex items-center gap-2.5">
            <Image
              src="/kamkuro.png"
              alt="Kamkuro logo"
              width={42}
              height={42}
              className="size-10 rounded-xl object-contain"
            />
            <span className="text-lg font-bold">Kamkuro</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
            A community-first social platform for posts, messaging, live
            discussions, polls, forums, analytics, and trusted business profiles.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold">Product</p>
          <div className="mt-4 flex flex-col gap-3">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold">Account</p>
          <div className="mt-4 flex flex-col items-start gap-3">
            <button onClick={() => onOpenAuth("login")} className="text-sm text-muted-foreground hover:text-foreground">
              Sign in
            </button>
            <button onClick={() => onOpenAuth("signup")} className="text-sm text-muted-foreground hover:text-foreground">
              Create account
            </button>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Kamkuro. All rights reserved.</p>
          <p>Built for meaningful communities.</p>
        </div>
      </div>
    </footer>
  );
}