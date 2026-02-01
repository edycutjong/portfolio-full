import { Hero } from '@/components/Hero'
import { Projects } from '@/components/Projects'
import { Skills } from '@/components/Skills'
// import { Testimonials } from '@/components/Testimonials' // Hidden for now
import { Contact } from '@/components/Contact'
import { ChatBot } from '@/components/ChatBot'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="relative z-10 flex-1">
        <Hero />
        <Projects />
        <Skills />
        {/* <Testimonials /> */}
        <Contact />
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}
