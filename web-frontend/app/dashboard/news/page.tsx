'use client'

import { useState } from "react"
import { NewsCard } from "@/components/dashboard/NewsCard"
import { TrendingStocks } from "@/components/dashboard/TrendingStocks"
import { EconomicCalendar } from "@/components/dashboard/EconomicCalendar"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { useNewsPaginated } from "@/hooks/useNews"

export default function MarketNews() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(["All Assets"])
    const [isPersonalizeModalOpen, setIsPersonalizeModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    
    // Fetch real news data from API
    const { news, pagination, isLoading, error, goToPage, search } = useNewsPaginated(1, 20)

    // Category filters
    const categories = ["All Assets", "Breaking", "Analysis", "Forecast"]
    const assetTypes = ["Bitcoin", "Forex", "Crypto"]

    // Trending Assets (Crypto & Forex)
    const trendingStocks = [
        { symbol: "BTC", name: "Bitcoin", price: "$89,875", change: "+3.5%" },
        { symbol: "ETH", name: "Ethereum", price: "$3,158", change: "+1.2%" },
        { symbol: "BNB", name: "Binance Coin", price: "$890", change: "+5.6%" },
        { symbol: "EUR/USD", name: "Euro/Dollar", price: "1.0821", change: "+0.2%" },
        { symbol: "GBP/USD", name: "Pound/Dollar", price: "1.3379", change: "+0.1%" }
    ]

    // Economic Calendar
    const economicEvents = [
        { time: "Today 8:30am", event: "Non-Farm Payrolls", impact: "high" },
        { time: "Today 10:00am", event: "Fed Speech", impact: "medium" },
        { time: "Tomorrow 9:30", event: "Inflation Rate", impact: "high" },
        { time: "Dec 2", event: "FOMC Minutes", impact: "high" }
    ]

    // Scroll Articles
    const scrollArticles = [
        { title: "How to trade around high-level decisions", time: "26m 52s ago" },
        { title: "Swing series for hedge covered-end products", time: "28m 08s ago" },
        { title: "Understanding Ethical ETF Share", time: "29m 21s ago" }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white">
            <div className="max-w-[1600px] mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-1 text-white">Market news</h1>
                    <p className="text-sm text-slate-400">Latest headlines, news events, and asset-specific insights</p>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Section - News Articles */}
                    <div className="col-span-8">
                        {/* Category Filters */}
                        <div className="flex items-center gap-2 mb-6">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${selectedCategories.includes(cat)
                                        ? 'bg-emerald-500 text-white hover:bg-emerald-500/90'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                    onClick={() => {
                                        if (selectedCategories.includes(cat)) {
                                            setSelectedCategories(selectedCategories.filter(c => c !== cat))
                                        } else {
                                            setSelectedCategories([...selectedCategories, cat])
                                        }
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search/Filter Info */}
                        <div className="mb-4">
                            <p className="text-xs text-slate-400">Search headlines, tickers, or locations</p>
                        </div>

                        {/* News Articles List */}
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                                    <p className="text-slate-400 mt-2">Loading news...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-8">
                                    <p className="text-red-400">Error loading news: {error.message}</p>
                                    <p className="text-slate-400 text-sm mt-2">Please make sure the backend server is running.</p>
                                </div>
                            ) : news.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-slate-400">No news articles found.</p>
                                </div>
                            ) : (
                                news.map((article, idx) => (
                                    <NewsCard key={idx} article={article} />
                                ))
                            )}
                        </div>

                        {/* Load More */}
                        {!isLoading && !error && pagination.page < pagination.totalPages && (
                            <div className="mt-6 text-center">
                                <button 
                                    onClick={() => goToPage(pagination.page + 1)}
                                    className="px-6 py-2 bg-white/5 text-slate-300 rounded-lg text-sm font-medium hover:bg-white/10 hover:text-white transition"
                                >
                                    Load more headlines (Page {pagination.page} of {pagination.totalPages})
                                </button>
                            </div>
                        )}

                        <p className="text-xs text-slate-500 text-center mt-4">
                            Headlines are delayed by up to 5-7 minutes depending on your data package
                        </p>
                    </div>

                    {/* Middle Column - Filters */}
                    <div className="col-span-2">
                        <div className="sticky top-6">
                            {/* Filter Header */}
                            <div className="mb-4 pb-3 border-b border-white/10">
                                <Button
                                    className="w-full bg-emerald-500 text-white hover:bg-emerald-500/90 text-xs font-medium"
                                    onClick={() => setIsPersonalizeModalOpen(true)}
                                >
                                    Personalize feeds
                                </Button>
                            </div>

                            {/* Filter by asset and region */}
                            <div className="mb-6">
                                <h3 className="text-sm font-bold mb-3 text-white">Filter by asset and region</h3>
                                <p className="text-xs text-slate-400 mb-3">Choose asset classes</p>

                                {/* Asset Type Checkboxes */}
                                <div className="space-y-2 mb-4">
                                    {assetTypes.map((asset) => (
                                        <label key={asset} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/50"
                                            />
                                            <span className="text-xs text-slate-300 group-hover:text-white transition">{asset}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Region Pills */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {["US", "Europe", "Asia", "Global"].map((region) => (
                                        <button
                                            key={region}
                                            className="px-3 py-1 bg-white/5 text-slate-300 rounded-full text-xs font-medium hover:bg-white/10 hover:text-white transition"
                                        >
                                            {region}
                                        </button>
                                    ))}
                                </div>

                                {/* More Filters */}
                                <div className="space-y-2">
                                    {["Crypto news", "Analysis", "Forex", "Economics"].map((filter) => (
                                        <button
                                            key={filter}
                                            className="w-full text-left px-3 py-2 bg-white/5 text-slate-300 rounded text-xs font-medium hover:bg-white/10 hover:text-white transition"
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Advanced filters link */}
                            <div className="text-xs text-slate-500 mb-4">
                                Apply advanced filters or save dashboard preferences.
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Trending & Calendar */}
                    <div className="col-span-2">
                        <div className="sticky top-6 space-y-6">
                            {/* Trending Assets */}
                            <TrendingStocks stocks={trendingStocks} onSeeAll={() => alert("View all trending assets")} />

                            {/* Economic Calendar */}
                            <EconomicCalendar events={economicEvents} />

                            {/* Scroll Articles */}
                            <div className="border border-white/10 rounded-lg p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm">
                                <h3 className="text-sm font-bold mb-3 text-white">Scroll articles</h3>
                                <p className="text-xs text-slate-400 mb-3">Related articles by our analysts</p>

                                <div className="space-y-3">
                                    {scrollArticles.map((article, idx) => (
                                        <div key={idx} className="pb-3 border-b border-white/5 last:border-0">
                                            <div className="text-sm text-slate-300 hover:text-emerald-400 cursor-pointer mb-1 transition">
                                                {article.title}
                                            </div>
                                            <div className="text-xs text-slate-500">{article.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personalize Modal */}
            <Modal
                isOpen={isPersonalizeModalOpen}
                onClose={() => setIsPersonalizeModalOpen(false)}
                title="Personalize Your Feed"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-400">Select topics and regions to customize your news feed.</p>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Topics</label>
                        <div className="flex flex-wrap gap-2">
                            {["Technology", "Finance", "Crypto", "Energy", "Healthcare"].map(topic => (
                                <button key={topic} className="px-3 py-1 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-full text-xs text-slate-300 transition">
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setIsPersonalizeModalOpen(false)}>Cancel</Button>
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => {
                            alert("Preferences saved!");
                            setIsPersonalizeModalOpen(false);
                        }}>Save Preferences</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
