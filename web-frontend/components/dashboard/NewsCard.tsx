"use client"

import { Badge } from "@/components/ui/badge"
import { formatNewsDate } from "@/lib/news"

interface NewsArticle {
    source: { id?: string; name: string }
    author?: string
    title: string
    description: string
    url: string
    urlToImage?: string
    publishedAt: string
    content?: string
}

interface NewsCardProps {
    article: NewsArticle
}

export function NewsCard({ article }: NewsCardProps) {
    return (
        <div className="border-b border-white/10 pb-4">
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-white bg-white/10 px-2 py-0.5 rounded">
                            {article.source.name}
                        </span>
                        {article.author && (
                            <span className="text-xs text-slate-400">{article.author}</span>
                        )}
                        <span className="text-xs text-slate-400">• {formatNewsDate(article.publishedAt)}</span>
                    </div>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <h3 className="text-base font-bold mb-2 text-white hover:text-emerald-400 cursor-pointer transition">
                            {article.title}
                        </h3>
                    </a>
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">
                        {article.description}
                    </p>
                    {article.urlToImage && (
                        <div className="mb-3">
                            <img 
                                src={article.urlToImage} 
                                alt={article.title}
                                className="w-full h-48 object-cover rounded-lg"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
