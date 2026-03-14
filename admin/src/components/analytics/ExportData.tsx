'use client'

import { Fragment, useState } from 'react'
import { Listbox, Transition, Popover } from '@headlessui/react'
import {
  DocumentArrowDownIcon,
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
  DocumentTextIcon,
  TableCellsIcon,
  PhotoIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline'

interface ExportDataProps {
  dateRange: {
    start: Date
    end: Date
    label: string
  }
  metrics: Array<{
    id: string
    title: string
    value: number | string
  }>
  onExport?: (config: ExportConfig) => void
}

interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf' | 'json'
  includeCharts: boolean
  includeRawData: boolean
  visualization: 'table' | 'chart' | 'both'
  selectedMetrics: string[]
  dateRange: string
}

export default function ExportData({ dateRange, metrics, onExport }: ExportDataProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'csv',
    includeCharts: true,
    includeRawData: true,
    visualization: 'both',
    selectedMetrics: metrics.slice(0, 5).map(m => m.id),
    dateRange: dateRange.label,
  })

  const formats = [
    { value: 'csv', label: 'CSV', icon: TableCellsIcon, description: 'Comma-separated values' },
    { value: 'excel', label: 'Excel', icon: TableCellsIcon, description: 'Microsoft Excel format' },
    { value: 'pdf', label: 'PDF', icon: DocumentIcon, description: 'PDF document with charts' },
    { value: 'json', label: 'JSON', icon: DocumentTextIcon, description: 'Raw JSON data' },
  ]

  const visualizations = [
    { value: 'table', label: 'Table Only' },
    { value: 'chart', label: 'Charts Only' },
    { value: 'both', label: 'Both Tables & Charts' },
  ]

  const handleExport = async () => {
    // Simulate export preparation
    const exportData = {
      ...exportConfig,
      exportedAt: new Date().toISOString(),
      dateRange: {
        start: dateRange.start,
        end: dateRange.end,
        label: dateRange.label,
      },
      metrics: metrics.filter(m => exportConfig.selectedMetrics.includes(m.id)),
    }

    // In production, this would call an API endpoint
    console.log('Exporting data:', exportData)

    // Simulate file download based on format
    let filename = `analytics-export-${new Date().toISOString().split('T')[0]}`
    let content = ''
    let mimeType = ''

    switch (exportConfig.format) {
      case 'csv':
        filename += '.csv'
        content = generateCSV(exportData)
        mimeType = 'text/csv'
        break
      case 'json':
        filename += '.json'
        content = JSON.stringify(exportData, null, 2)
        mimeType = 'application/json'
        break
      case 'excel':
        filename += '.xlsx'
        // In production, this would generate actual Excel file
        alert('Excel export would be generated here')
        return
      case 'pdf':
        filename += '.pdf'
        // In production, this would generate actual PDF
        alert('PDF export would be generated here')
        return
    }

    // Create download link
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    if (onExport) {
      onExport(exportConfig)
    }

    setIsOpen(false)
  }

  const generateCSV = (data: any) => {
    const rows = []
    
    // Header
    rows.push(['Metric', 'Value', 'Change', 'Timestamp'].join(','))
    
    // Data rows
    data.metrics.forEach((metric: any) => {
      rows.push([
        metric.title,
        metric.value,
        metric.change || 'N/A',
        new Date().toISOString(),
      ].join(','))
    })

    return rows.join('\n')
  }

  const toggleMetric = (metricId: string) => {
    setExportConfig(prev => ({
      ...prev,
      selectedMetrics: prev.selectedMetrics.includes(metricId)
        ? prev.selectedMetrics.filter(id => id !== metricId)
        : [...prev.selectedMetrics, metricId],
    }))
  }

  const selectAllMetrics = () => {
    setExportConfig(prev => ({
      ...prev,
      selectedMetrics: prev.selectedMetrics.length === metrics.length
        ? []
        : metrics.map(m => m.id),
    }))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      >
        <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
        Export
      </button>

      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Export Data</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {formats.map((format) => {
                  const Icon = format.icon
                  const isSelected = exportConfig.format === format.value
                  return (
                    <button
                      key={format.value}
                      onClick={() => setExportConfig({ ...exportConfig, format: format.value as any })}
                      className={`p-3 rounded-lg border-2 transition-colors text-left ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1 ${
                        isSelected ? 'text-primary-500' : 'text-gray-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        isSelected ? 'text-primary-500' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {format.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{format.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Metrics Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Metrics
                </label>
                <button
                  onClick={selectAllMetrics}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  {exportConfig.selectedMetrics.length === metrics.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                {metrics.map((metric) => (
                  <label key={metric.id} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.selectedMetrics.includes(metric.id)}
                      onChange={() => toggleMetric(metric.id)}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                      {metric.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Visualization Options */}
            {exportConfig.format !== 'json' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Include
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportConfig.includeCharts}
                      onChange={(e) => setExportConfig({ ...exportConfig, includeCharts: e.target.checked })}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include charts</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportConfig.includeRawData}
                      onChange={(e) => setExportConfig({ ...exportConfig, includeRawData: e.target.checked })}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-3"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include raw data</span>
                  </label>
                </div>
              </div>
            )}

            {/* Visualization Type */}
            {exportConfig.format === 'pdf' && exportConfig.includeCharts && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Visualization Layout
                </label>
                <select
                  value={exportConfig.visualization}
                  onChange={(e) => setExportConfig({ ...exportConfig, visualization: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {visualizations.map(v => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Range Summary */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Date Range</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
              </p>
            </div>

            {/* File Info */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">File Information</p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Format:</span>
                  <span className="font-medium text-gray-900 dark:text-white uppercase">
                    {exportConfig.format}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Metrics:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {exportConfig.selectedMetrics.length} selected
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Est. Size:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {exportConfig.selectedMetrics.length * 2} KB
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exportConfig.selectedMetrics.length === 0}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              Export Now
            </button>
          </div>
        </div>
      </Transition>
    </div>
  )
}