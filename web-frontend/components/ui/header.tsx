import Link from "next/link"
import { NavdropDown } from "./navdropDown"
import { Button } from "./button"

const Header = () => {
    const companyMenuItems = [
        {
            label: 'About Us',
            description: 'The story behind the xbtbroker success',
            href: '/about',
            icon: 'info',
            iconColor: 'blue'
        },
        {
            label: 'Why choose us',
            description: 'Traders and investors choose xbtbroker',
            href: '/why-us',
            icon: 'trendingup',
            iconColor: 'blue'
        },
        {
            label: 'Security of funds',
            description: 'Your Funds Security is our Top Priority',
            href: '/security',
            icon: 'shield',
            iconColor: 'blue'
        },
        {
            label: 'Registration',
            description: 'Our Registration',
            href: '/register',
            icon: 'filetext',
            iconColor: 'blue'
        },
        {
            label: 'Contact us',
            description: "Let's get in touch",
            href: '/contact',
            icon: 'phone',
            iconColor: 'blue'
        },
    ]

    const tradingMenuItems = [
        {
            label: 'Trading Platform',
            description: 'Advanced tools for professional traders',
            href: '/platform',
            icon: 'barchart',
            iconColor: 'blue'
        },
        {
            label: 'Markets',
            description: 'Explore global markets',
            href: '/markets',
            icon: 'globe',
            iconColor: 'blue'
        },
    ]

    const toolsMenuItems = [
        {
            label: 'Trading Tools',
            description: 'Professional trading utilities',
            href: '/tools',
            icon: 'settings',
            iconColor: 'blue'
        },
    ]

    return (
        <header className="bg-[#0a0e27] border-b border-gray-800">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">X</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold text-white whitespace-nowrap">
                                Trading Platform
                            </h1>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-2">
                        <NavdropDown items={companyMenuItems} trigger="Company" />
                        <NavdropDown items={tradingMenuItems} trigger="Trading" />
                        <NavdropDown items={toolsMenuItems} trigger="Tools" />

                        <Link
                            href="/promotion"
                            className="px-4 py-2 rounded text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors text-sm font-medium"
                        >
                            Promotion
                        </Link>

                        <Link
                            href="/partnership"
                            className="px-4 py-2 rounded text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors text-sm font-medium"
                        >
                            Partnership
                        </Link>

                        <Link
                            href="/funding"
                            className="px-4 py-2 rounded text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors text-sm font-medium"
                        >
                            Funding
                        </Link>

                        {/* CTA Button */}
                        <Button
                            asChild
                            className="ml-4 px-6 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-lg transition-colors text-sm"
                        >
                            <Link href="/auth/register">
                                START TRADING →
                            </Link>
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header