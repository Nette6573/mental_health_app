'use client'

import { Fragment, useState } from 'react'
import { Listbox, Transition, Popover } from '@headlessui/react'
import {
  CalendarIcon,
  ChevronUpDownIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface DateRange {
  start: Date
  end: Date
  label: string
}

interface DateRangePickerProps {
  selected: DateRange
  ranges: DateRange[]
  onChange: (range: DateRange) => void
  customRange?: boolean
}

export default function DateRangePicker({
  selected,
  ranges,
  onChange,
  customRange = true,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [customStart, setCustomStart] = useState<Date>(new Date())
  const [customEnd, setCustomEnd] = useState<Date>(new Date())

  const formatDateRange = (range: DateRange) => {
    return `${range.start.toLocaleDateString()} - ${range.end.toLocaleDateString()}`
  }

  const handleCustomApply = () => {
    const customRange: DateRange = {
      start: customStart,
      end: customEnd,
      label: 'Custom Range',
    }
    onChange(customRange)
    setShowCustom(false)
    setIsOpen(false)
  }

  const handlePresetSelect = (range: DateRange) => {
    onChange(range)
    setIsOpen(false)
  }

  const getRelativeDay = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date
  }

  const quickRanges = [
    { label: 'Today', start: new Date(), end: new Date() },
    { label: 'Yesterday', start: getRelativeDay(-1), end: getRelativeDay(-1) },
    { label: 'Last 7 Days', start: getRelativeDay(-7), end: new Date() },
    { label: 'Last 30 Days', start: getRelativeDay(-30), end: new Date() },
    { label: 'This Month', start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), end: new Date() },
    { label: 'Last Month', start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), end: new Date(new Date().getFullYear(), new Date().getMonth(), 0) },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
      >
        <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
        <span className="text-sm">{selected.label || formatDateRange(selected)}</span>
        <ChevronUpDownIcon className="w-4 h-4 ml-2 text-gray-400" />
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
              <h3 className="font-semibold text-gray-900 dark:text-white">Select Date Range</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4">
            {/* Quick Ranges */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                Quick Select
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {quickRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      onChange({
                        start: range.start,
                        end: range.end,
                        label: range.label,
                      })
                      setIsOpen(false)
                    }}
                    className="px-3 py-2 text-sm text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preset Ranges */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                Preset Ranges
              </h4>
              <div className="space-y-1">
                {ranges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => handlePresetSelect(range)}
                    className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${
                      selected.label === range.label
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{range.label}</span>
                    <span className="text-xs text-gray-500">
                      {range.start.toLocaleDateString()} - {range.end.toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Range */}
            {customRange && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Custom Range
                </h4>
                {!showCustom ? (
                  <button
                    onClick={() => setShowCustom(true)}
                    className="w-full px-4 py-2 text-sm text-primary-600 dark:text-primary-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    + Select Custom Dates
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={customStart.toISOString().split('T')[0]}
                        onChange={(e) => setCustomStart(new Date(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={customEnd.toISOString().split('T')[0]}
                        onChange={(e) => setCustomEnd(new Date(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setShowCustom(false)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCustomApply}
                        className="flex-1 px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Range Display */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Selected Range:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {selected.start.toLocaleDateString()} - {selected.end.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
}