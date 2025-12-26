'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "How do I get started with TradeVault?",
    answer: "Getting started is easy! Simply click 'Get Started', complete the registration form, verify your email, and complete KYC verification. You can start trading within minutes after funding your account."
  },
  {
    question: "What markets can I trade?",
    answer: "TradeVault offers access to 150+ global markets including stocks, forex, cryptocurrencies, commodities, and indices. You can trade major exchanges from the US, Europe, Asia, and more."
  },
  {
    question: "Are there any fees or commissions?",
    answer: "We offer competitive pricing with transparent fees. Stock trades start at $0 commission, forex spreads from 0.1 pips, and crypto trades at 0.25%. No hidden fees or monthly charges."
  },
  {
    question: "Is my money safe with TradeVault?",
    answer: "Absolutely. We use bank-level 256-bit SSL encryption, multi-factor authentication, and cold storage for digital assets. We're fully regulated by SEC and FINRA, with FDIC insurance on cash deposits."
  },
  {
    question: "What is the minimum deposit?",
    answer: "There is no minimum deposit requirement to open an account. However, we recommend starting with at least $100 to take advantage of various trading opportunities."
  },
  {
    question: "Can I trade on mobile?",
    answer: "Yes! Our full-featured mobile apps for iOS and Android provide the complete trading experience. Monitor markets, execute trades, and manage your portfolio seamlessly on any device."
  },
  {
    question: "How fast are withdrawals processed?",
    answer: "Withdrawals are typically processed within 1-3 business days for bank transfers. Crypto withdrawals are usually completed within 24 hours. No withdrawal fees for amounts over $100."
  },
  {
    question: "Do you offer customer support?",
    answer: "We provide 24/7 customer support via live chat, email, and phone. Our dedicated support team is always ready to assist with any questions or technical issues."
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about trading with TradeVault
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:border-emerald-300 transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-900 pr-8">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-emerald-600 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                    }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
