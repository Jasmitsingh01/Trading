// components/landing/faq-section.tsx
'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'Is there a minimum deposit required?',
    answer: 'No, there is no minimum deposit required to open an account. However, to start trading, we recommend depositing at least $10. You can start with fractional shares, which means you can invest in expensive stocks with as little as $1.'
  },
  {
    question: 'What fees do you charge?',
    answer: 'We believe in transparent pricing. Stock and ETF trading is commission-free. For cryptocurrency trading, we charge a competitive spread. There are no account maintenance fees, inactivity fees, or hidden charges. Premium features are available in our Pro plan.'
  },
  {
    question: 'How secure is my money?',
    answer: 'Your security is our top priority. We use bank-level 256-bit encryption, two-factor authentication, and store the majority of crypto assets in cold storage. Your funds are held in segregated accounts with top-tier banks and custodians. We are fully regulated and compliant with all financial regulations.'
  },
  {
    question: 'Can I withdraw my funds anytime?',
    answer: 'Yes! You can withdraw your funds at any time. For bank transfers, withdrawals typically take 1-3 business days. Crypto withdrawals are processed within 24 hours. There are no withdrawal fees for standard bank transfers.'
  },
  {
    question: 'What markets can I trade?',
    answer: 'You can trade U.S. stocks, ETFs, cryptocurrencies (Bitcoin, Ethereum, and 50+ others), forex pairs, and commodities. We provide access to major global exchanges and markets 24/7 for crypto and forex.'
  },
  {
    question: 'Do you offer a demo account?',
    answer: 'Yes! We offer a paper trading feature with virtual funds so you can practice trading strategies without risking real money. This is perfect for beginners who want to learn how the platform works before committing real capital.'
  },
  {
    question: 'How do I get started?',
    answer: 'Getting started is easy! Simply sign up with your email, complete the quick verification process, fund your account using your preferred payment method, and start trading. The entire process takes less than 10 minutes.'
  },
  {
    question: 'What customer support do you provide?',
    answer: 'We offer 24/7 customer support via live chat, email, and phone. Our Pro plan members get priority support with dedicated account managers. We also have an extensive help center with tutorials, guides, and video resources.'
  }
]

export function FAQSection() {
  const [mounted, setMounted] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-6">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">
              Got Questions?
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Frequently Asked
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mt-2">
              Questions
            </span>
          </h2>
          <p className="text-xl text-slate-400">
            Everything you need to know about our platform and services
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors flex-1">
                    {faq.question}
                  </h3>
                  <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}>
                    <ChevronDown className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Answer */}
                <div
                  className={`grid transition-all duration-300 ${
                    openIndex === index ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-10 border border-slate-800 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-slate-400 mb-8 text-lg">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                Contact Support
              </a>
              <a
                href="/help"
                className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300"
              >
                Visit Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
