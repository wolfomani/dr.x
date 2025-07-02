"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import {
  ExternalLink,
  Github,
  Mail,
  ArrowDown,
  Brain,
  Rocket,
  MessageSquare,
  Users,
  Star,
  Code,
  Database,
  Cpu,
  Globe,
  BookOpen,
  TrendingUp,
  Zap,
  Shield,
} from "lucide-react"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
      {/* Skip to content for accessibility */}
      <a href="#main-content" className="skip-to-content">
        انتقل إلى المحتوى الرئيسي
      </a>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/50 to-purple-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrollY > 50 ? "bg-slate-900/95 backdrop-blur-md py-2 border-b border-blue-500/20" : "py-4"
        }`}
      >
        <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl relative">
          <nav className="flex items-center justify-between gap-4">
            <Link href="/" aria-label="عبد العزيز الحمداني - الصفحة الرئيسية" className="z-50 flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo.png"
                  alt="Display Information Logo"
                  width={40}
                  height={40}
                  className="object-contain animate-glow"
                />
              </div>
              <div className="text-2xl font-bold gradient-text hover:scale-105 transition-transform">
                عبد العزيز الحمداني
              </div>
            </Link>

            <ul className="ml-3 hidden flex-grow gap-6 lg:flex">
              <li>
                <Link
                  className="text-blue-400 font-medium px-3 py-2 text-sm hover:text-blue-300 hover:bg-white/5 rounded-lg transition-all duration-200"
                  href="#skills"
                >
                  المهارات
                </Link>
              </li>
              <li>
                <Link
                  className="text-white/70 font-medium px-3 py-2 text-sm hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                  href="#projects"
                >
                  المشاريع
                </Link>
              </li>
              <li>
                <Link
                  className="text-white/70 font-medium px-3 py-2 text-sm hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                  href="#about"
                >
                  من أنا
                </Link>
              </li>
              <li>
                <Link
                  className="text-white/70 font-medium px-3 py-2 text-sm hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                  href="#contact"
                >
                  تواصل معي
                </Link>
              </li>
            </ul>

            <div className="flex gap-3">
              <Link href="/chat">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-full px-6 py-2 font-medium shadow-lg hover:shadow-blue-500/25 brand-shadow">
                  ابدأ المحادثة
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section - محسن مع الشعار */}
      <section id="main-content" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <div className="absolute -inset-x-0 bottom-28 lg:bottom-12 flex justify-center">
            <div className="max-w-7xl w-full flex justify-center items-center">
              <div className="opacity-5 lg:opacity-10 select-none text-[15rem] lg:text-[20rem] font-bold tracking-wider text-blue-500/20 animate-pulse">
                عبد العزيز
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl flex h-full flex-col relative z-10">
          <div className="flex items-center justify-center h-full mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl w-full">
              {/* النص والمحتوى */}
              <div className="text-center lg:text-right space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-3 glass-effect rounded-full px-6 py-3 text-sm text-white/90 border border-blue-500/30 mb-6">
                  <div className="relative w-6 h-6">
                    <Image src="/images/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
                  </div>
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>مهندس برمجيات من سلطنة عُمان</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  <span className="gradient-text animate-float">عبد العزيز الحمداني</span>
                  <br />
                  <span className="text-white text-2xl md:text-3xl lg:text-4xl">خبير الذكاء الاصطناعي</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-slide-in-right">
                  مهندس برمجيات متخصص في Python والذكاء الاصطناعي، أطور حلول RAG المتقدمة وأعمل مع Groq API لإنشاء
                  تطبيقات ذكية عالية الأداء
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-in-left pt-4">
                  <Link href="/chat">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-full px-8 py-4 text-lg font-medium shadow-xl hover:shadow-blue-500/30 hover:scale-105 group brand-shadow">
                      <MessageSquare className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                      تحدث معي
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-blue-400/30 text-white hover:bg-blue-500/10 hover:border-blue-400/50 rounded-full px-8 py-4 text-lg font-medium bg-transparent backdrop-blur-sm group"
                    asChild
                  >
                    <Link href="#projects">
                      <Code className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                      شاهد أعمالي
                    </Link>
                  </Button>
                </div>

                {/* روابط التواصل */}
                <div className="flex gap-4 justify-center lg:justify-start pt-6">
                  <Link
                    href="https://github.com/wolfomani"
                    className="glass-effect rounded-full p-3 hover:bg-blue-500/20 transition-all duration-300 group border-blue-500/30"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Link>
                  <Link
                    href="https://t.me/wolfaiOM"
                    className="glass-effect rounded-full p-3 hover:bg-blue-500/20 transition-all duration-300 group border-blue-500/30"
                    aria-label="Telegram"
                  >
                    <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Link>
                  <Link
                    href="mailto:openaziz00@gmail.com"
                    className="glass-effect rounded-full p-3 hover:bg-blue-500/20 transition-all duration-300 group border-blue-500/30"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* الصورة الشخصية */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative">
                    <Image
                      src="/images/profile-photo.jpg"
                      alt="عبد العزيز الحمداني - مهندس برمجيات متخصص في الذكاء الاصطناعي"
                      width={400}
                      height={400}
                      className="w-80 h-80 md:w-96 md:h-96 rounded-full object-cover border-4 border-blue-500/20 shadow-2xl group-hover:scale-105 transition-all duration-300 profile-image"
                      loading="eager"
                      priority
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>

                    {/* شارة الحالة */}
                    <div className="absolute bottom-8 right-8 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-lg animate-pulse"></div>

                    {/* معلومات إضافية */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 glass-effect rounded-lg px-4 py-2 border-blue-500/30">
                      <div className="text-center">
                        <div className="text-sm font-medium text-white">متاح للعمل</div>
                        <div className="text-xs text-gray-300">سلطنة عُمان</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-blue-400/60" />
        </div>
      </section>

      {/* Skills Section - محسن بالألوان الجديدة */}
      <section id="skills" className="py-20 relative z-10">
        <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-effect rounded-full px-4 py-2 text-sm text-gray-300 mb-6 border-blue-500/20">
              <Code className="w-4 h-4 text-blue-400" />
              <span>المهارات التقنية</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 gradient-text">
              خبراتي التقنية
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              متخصص في تطوير حلول الذكاء الاصطناعي المتقدمة باستخدام أحدث التقنيات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="professional-card hover-lift group">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform brand-shadow">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Python</h3>
                <p className="text-gray-400 text-sm mb-4">تطوير التطبيقات والذكاء الاصطناعي</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full w-[95%] animate-glow"></div>
                </div>
                <span className="text-xs text-gray-400 mt-2 block">95%</span>
              </CardContent>
            </Card>

            <Card className="professional-card hover-lift group">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform brand-shadow">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">RAG Systems</h3>
                <p className="text-gray-400 text-sm mb-4">أنظمة الاسترجاع المعززة</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full w-[90%] animate-glow"></div>
                </div>
                <span className="text-xs text-gray-400 mt-2 block">90%</span>
              </CardContent>
            </Card>

            <Card className="professional-card hover-lift group">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform brand-shadow">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Groq API</h3>
                <p className="text-gray-400 text-sm mb-4">تكامل وتحسين APIs</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full w-[85%] animate-glow"></div>
                </div>
                <span className="text-xs text-gray-400 mt-2 block">85%</span>
              </CardContent>
            </Card>

            <Card className="professional-card hover-lift group">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform brand-shadow">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Vector DBs</h3>
                <p className="text-gray-400 text-sm mb-4">قواعد البيانات المتجهة</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full w-[88%] animate-glow"></div>
                </div>
                <span className="text-xs text-gray-400 mt-2 block">88%</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section - محسن */}
      <section id="projects" className="py-20 relative z-10">
        <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-effect rounded-full px-4 py-2 text-sm text-gray-300 mb-6 border-blue-500/20">
              <Rocket className="w-4 h-4 text-blue-400" />
              <span>المشاريع</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 gradient-text">
              مشاريعي المبتكرة
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              مجموعة من المشاريع التي تجمع بين الذكاء الاصطناعي والحلول العملية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="professional-card hover-lift group">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform brand-shadow">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">منصة تعليمية تفاعلية</h3>
                <p className="text-gray-400 mb-4">
                  منصة تستخدم الذكاء الاصطناعي لتخصيص تجربة التعلم حسب احتياجات الطالب مع خوارزميات متقدمة لتتبع التقدم
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs border border-blue-500/30">
                    Python
                  </span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs border border-purple-500/30">
                    RAG
                  </span>
                  <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-xs border border-cyan-500/30">
                    ML
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-400/30 text-white hover:bg-blue-500/10 bg-transparent"
                  >
                    <Github className="w-4 h-4 ml-1" />
                    الكود
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-400/30 text-white hover:bg-blue-500/10 bg-transparent"
                  >
                    <ExternalLink className="w-4 h-4 ml-1" />
                    عرض
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="professional-card hover-lift group">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform brand-shadow">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">نظام قاعدة البيانات المتجهة</h3>
                <p className="text-gray-400 mb-4">
                  نظام متقدم لإدارة البيانات المتجهة مع تحسينات للبحث الدلالي والاسترجاع السريع، مُحسَّن للتطبيقات العربية
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs border border-purple-500/30">
                    Vector DB
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs border border-blue-500/30">
                    Embeddings
                  </span>
                  <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-xs border border-cyan-500/30">
                    Arabic NLP
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-400/30 text-white hover:bg-blue-500/10 bg-transparent"
                  >
                    <Github className="w-4 h-4 ml-1" />
                    الكود
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-400/30 text-white hover:bg-blue-500/10 bg-transparent"
                  >
                    <ExternalLink className="w-4 h-4 ml-1" />
                    عرض
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="professional-card hover-lift group">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform brand-shadow">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">مساعد ذكي متعدد اللغات</h3>
                <p className="text-gray-400 mb-4">
                  مساعد ذكي يدعم العربية والإنجليزية مع قدرات متقدمة في فهم السياق والرد بطريقة طبيعية
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-xs border border-cyan-500/30">
                    Groq API
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs border border-blue-500/30">
                    NLP
                  </span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs border border-purple-500/30">
                    Multilingual
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-400/30 text-white hover:bg-blue-500/10 bg-transparent"
                  >
                    <Github className="w-4 h-4 ml-1" />
                    الكود
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-400/30 text-white hover:bg-blue-500/10 bg-transparent"
                  >
                    <ExternalLink className="w-4 h-4 ml-1" />
                    تجربة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* GitHub Stats */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-blue-500/30 max-w-2xl mx-auto brand-shadow">
              <CardContent className="p-8">
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2 flex items-center justify-center gap-2">
                      <TrendingUp className="w-6 h-6" />
                      15+
                    </div>
                    <div className="text-sm text-gray-400">مشروع نشط</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-2">
                      <Star className="w-6 h-6" />
                      1.2K+
                    </div>
                    <div className="text-sm text-gray-400">نجمة GitHub</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2 flex items-center justify-center gap-2">
                      <Zap className="w-6 h-6" />
                      500+
                    </div>
                    <div className="text-sm text-gray-400">مساهمة</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section - محسن */}
      <section id="about" className="py-20 relative z-10">
        <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 glass-effect rounded-full px-4 py-2 text-sm text-gray-300 border-blue-500/20">
                <Users className="w-4 h-4 text-blue-400" />
                <span>من أنا</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                عبد العزيز الحمداني
                <br />
                <span className="text-2xl md:text-3xl gradient-text">مهندس برمجيات من عُمان</span>
              </h2>

              <div className="space-y-6">
                <p className="text-lg text-gray-300 leading-relaxed">
                  أنا عبد العزيز الحمداني من سلطنة عُمان، مهندس برمجيات متخصص في تطوير حلول الذكاء الاصطناعي المتقدمة.
                  أركز على تطوير أنظمة RAG والتكامل مع Groq API لإنشاء تطبيقات ذكية عالية الأداء.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="professional-card">
                    <div className="flex items-center gap-3 mb-2">
                      <Code className="w-5 h-5 text-blue-400" />
                      <span className="font-semibold text-white">التخصص الرئيسي</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      تطوير التطبيقات بـ Python مع التركيز على مكتبات الذكاء الاصطناعي
                    </p>
                  </div>

                  <div className="professional-card">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <span className="font-semibold text-white">أنظمة RAG</span>
                    </div>
                    <p className="text-gray-400 text-sm">تطوير حلول Retrieval-Augmented Generation للتطبيقات الذكية</p>
                  </div>

                  <div className="professional-card">
                    <div className="flex items-center gap-3 mb-2">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                      <span className="font-semibold text-white">تكامل APIs</span>
                    </div>
                    <p className="text-gray-400 text-sm">خبرة في استخدام وتحسين Groq API وواجهات الذكاء الاصطناعي</p>
                  </div>

                  <div className="professional-card">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="w-5 h-5 text-green-400" />
                      <span className="font-semibold text-white">الحلول المبتكرة</span>
                    </div>
                    <p className="text-gray-400 text-sm">تطوير حلول تجمع بين التقنيات الحديثة والاحتياجات العملية</p>
                  </div>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed">
                  هدفي هو إنشاء منتجات تساعد الناس وتجعل حياتهم أسهل وأكثر إنتاجية. أؤمن بأن الذكاء الاصطناعي يجب أن
                  يكون في متناول الجميع، وأعمل على تطوير حلول تدعم اللغة العربية وتخدم المجتمع العربي.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-full px-6 py-3 font-medium brand-shadow"
                  asChild
                >
                  <Link href="#contact">
                    <Mail className="size-4 ml-2" />
                    تواصل معي
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-400/30 text-white hover:bg-blue-500/10 hover:border-blue-400/50 rounded-full px-6 py-3 transition-all duration-300 bg-transparent backdrop-blur-sm"
                  asChild
                >
                  <Link href="https://github.com/wolfomani">
                    <Github className="size-4 ml-2" />
                    GitHub Profile
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative group">
                <Image
                  alt="عبد العزيز الحمداني في بيئة العمل"
                  width={500}
                  height={500}
                  className="w-full rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-300 border border-blue-500/20"
                  src="/images/anime1.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-effect rounded-lg p-4 border-blue-500/30">
                    <div className="text-white font-semibold flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      مطور من سلطنة عُمان
                    </div>
                    <div className="text-gray-300 text-sm">متخصص في الذكاء الاصطناعي والبرمجة</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - محسن */}
      <section id="contact" className="py-20 relative z-10">
        <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-effect rounded-full px-4 py-2 text-sm text-gray-300 mb-6 border-blue-500/20">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>تواصل معي</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 gradient-text">
              دعنا نتعاون
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              هل لديك مشروع مثير أو فكرة تريد تطويرها؟ أنا متاح للتعاون في مشاريع الذكاء الاصطناعي المبتكرة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <Card className="professional-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center brand-shadow">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">البريد الإلكتروني</h3>
                        <p className="text-gray-400">openaziz00@gmail.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="professional-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center brand-shadow">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">Telegram</h3>
                        <p className="text-gray-400">@wolfaiOM</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="professional-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-12 h-12 rounded-lg flex items-center justify-center brand-shadow">
                        <Github className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">GitHub</h3>
                        <p className="text-gray-400">wolfomani</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-full px-6 py-3 font-medium flex-1 brand-shadow"
                  asChild
                >
                  <Link href="mailto:openaziz00@gmail.com">
                    <Mail className="size-4 ml-2" />
                    راسلني الآن
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-400/30 text-white hover:bg-blue-500/10 hover:border-blue-400/50 rounded-full px-6 py-3 transition-all duration-300 bg-transparent backdrop-blur-sm flex-1"
                  asChild
                >
                  <Link href="https://t.me/wolfaiOM">
                    <MessageSquare className="size-4 ml-2" />
                    Telegram
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative group">
                <Image
                  alt="تواصل مع عبد العزيز الحمداني"
                  width={400}
                  height={400}
                  className="w-full rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-300 border border-blue-500/20"
                  src="/images/anime2.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-effect rounded-lg p-4 border-blue-500/30">
                    <div className="text-white font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      متاح للتعاون
                    </div>
                    <div className="text-gray-300 text-sm">مشاريع الذكاء الاصطناعي والتطوير</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - محسن */}
      <footer className="relative w-full overflow-hidden border-t border-blue-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="py-16">
          <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8">
                    <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
                  </div>
                  <div className="text-2xl font-bold gradient-text">عبد العزيز الحمداني</div>
                </div>
                <p className="text-gray-400 text-sm">
                  مهندس برمجيات متخصص في الذكاء الاصطناعي من سلطنة عُمان. أطور حلول RAG المتقدمة وأعمل مع Groq API
                </p>
                <div className="flex gap-3">
                  <Link
                    href="https://github.com/wolfomani"
                    className="glass-effect rounded-full p-2 hover:bg-blue-500/20 transition-all duration-300 border-blue-500/30"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </Link>
                  <Link
                    href="https://t.me/wolfaiOM"
                    className="glass-effect rounded-full p-2 hover:bg-blue-500/20 transition-all duration-300 border-blue-500/30"
                    aria-label="Telegram"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                  <Link
                    href="mailto:openaziz00@gmail.com"
                    className="glass-effect rounded-full p-2 hover:bg-blue-500/20 transition-all duration-300 border-blue-500/30"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-white">المهارات</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="#skills" className="hover:text-blue-400 transition-colors">
                      Python Development
                    </Link>
                  </li>
                  <li>
                    <Link href="#skills" className="hover:text-blue-400 transition-colors">
                      RAG Systems
                    </Link>
                  </li>
                  <li>
                    <Link href="#skills" className="hover:text-blue-400 transition-colors">
                      Groq API
                    </Link>
                  </li>
                  <li>
                    <Link href="#skills" className="hover:text-blue-400 transition-colors">
                      Vector Databases
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-white">المشاريع</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="#projects" className="hover:text-blue-400 transition-colors">
                      منصة تعليمية تفاعلية
                    </Link>
                  </li>
                  <li>
                    <Link href="#projects" className="hover:text-blue-400 transition-colors">
                      نظام قاعدة البيانات المتجهة
                    </Link>
                  </li>
                  <li>
                    <Link href="#projects" className="hover:text-blue-400 transition-colors">
                      مساعد ذكي متعدد اللغات
                    </Link>
                  </li>
                  <li>
                    <Link href="/chat" className="hover:text-blue-400 transition-colors">
                      تجربة المحادثة
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-white">التواصل</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="mailto:openaziz00@gmail.com" className="hover:text-blue-400 transition-colors">
                      openaziz00@gmail.com
                    </Link>
                  </li>
                  <li>
                    <Link href="https://t.me/wolfaiOM" className="hover:text-blue-400 transition-colors">
                      @wolfaiOM
                    </Link>
                  </li>
                  <li>
                    <Link href="https://github.com/wolfomani" className="hover:text-blue-400 transition-colors">
                      GitHub Profile
                    </Link>
                  </li>
                  <li>
                    <span className="text-gray-500">سلطنة عُمان</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-blue-500/20 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 text-sm">© 2024 عبد العزيز الحمداني. جميع الحقوق محفوظة.</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>صُنع بـ ❤️ في سلطنة عُمان</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>متاح للعمل</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
