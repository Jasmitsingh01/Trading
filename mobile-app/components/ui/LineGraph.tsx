'use client'

import React, { useMemo } from "react"
import dynamic from 'next/dynamic'
import type { ApexOptions } from "apexcharts"

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function LineGraph({ data }: { data: any }) {
  const options: ApexOptions = useMemo(() => ({
    chart: {
      id: "line-annotations",
      type: "line",
      toolbar: { show: false },
      foreColor: "#94a3b8",
      background: "transparent",
      fontFamily: 'Manrope, sans-serif'
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    grid: {
      borderColor: "#233c53",
      strokeDashArray: 5,
      padding: {
        left: 10,
        right: 10
      }
    },
    colors: ["#3b82f6"],
    xaxis: {
      categories: data.map((item: any) => item.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#a3a3a3", fontWeight: 500, fontSize: "13px" } }
    },
    yaxis: {
      min: 40000,
      max: 135000,
      labels: { style: { colors: "#94a3b8", fontWeight: 600, fontSize: "12px" }, formatter: val => `$${val.toLocaleString()}` },
      axisBorder: { show: false }
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "14px", fontFamily: "Manrope, sans-serif" }
    },
    markers: {
      size: 5,
      colors: ["#3b82f6"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 7 }
    },
    annotations: {
      yaxis: [
        {
          y: 100000,
          borderColor: "#10b981",
          label: {
            borderColor: "#10b981",
            style: {
              color: "#fff",
              background: "#10b981",
              fontWeight: "bold"
            },
            text: "Profit target: $100,000"
          }
        }
      ],
      xaxis: [
        {
          x: "Apr",
          borderColor: "#FF4560",
          label: {
            borderColor: "#FF4560",
            style: {
              color: "#fff",
              background: "#FF4560"
            },
            text: "Major dip"
          }
        }
      ],
      points: [
        {
          x: "Sep",
          y: 120000,
          marker: {
            size: 8,
            fillColor: "#775DD0",
            strokeColor: "#fff",
            radius: 2
          },
          label: {
            borderColor: "#775DD0",
            style: {
              color: "#fff",
              background: "#775DD0"
            },
            text: "Peak"
          }
        }
      ]
    }
  }), [data])

  const series = [
    {
      name: "Portfolio Value",
      data: data.map((item: any) => item.value)
    }
  ]

  return (
    <div className="dark:bg-[#101922] bg-white rounded-xl border border-gray-200 dark:border-[#283039] shadow-lg max-w-3xl mx-auto p-8 mb-8">
      <div className="mb-6">
        <h2 className="font-bold text-2xl text-gray-900 dark:text-white">Portfolio Value with Annotations</h2>
        <div className="w-16 h-1 my-2 bg-emerald-500 rounded-lg" />
      </div>
      <Chart
        options={options}
        series={series}
        type="line"
        height={360}
      />
    </div>
  )
}
