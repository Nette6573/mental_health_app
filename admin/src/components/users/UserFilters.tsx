'use client'

import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { USER_STATUS, USER_ROLES } from '@/constants/user'

interface UserFiltersProps {
  filters: {
    status: string
    role: string
    verified: string
    dateRange: string
  }
  setFilters: (filters: any) => void
}

const VERIFICATION_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'verified', label: 'Verified', icon: '✅' },
  { value: 'unverified', label: 'Unverified', icon: '❌' },
]

const DATE_RANGE_OPTIONS = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
]

export default function UserFilters({ filters, setFilters }: UserFiltersProps) {
  const clearFilters = () => {
    setFilters({
      status: '',
      role: '',
      verified: '',
      dateRange: '',
    })
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  const getStatusLabel = (value: string) => {
    const status = USER_STATUS.find(s => s.value === value)
    return status ? status.label : 'All Status'
  }

  const getRoleLabel = (value: string) => {
    const role = USER_ROLES.find(r => r.value === value)
    return role ? role.label : 'All Roles'
  }

  const getVerificationLabel = (value: string) => {
    const option = VERIFICATION_OPTIONS.find(o => o.value === value)
    return option ? option.label : 'All'
  }

  const getDateRangeLabel = (value: string) => {
    const option = DATE_RANGE_OPTIONS.find(o => o.value === value)
    return option ? option.label : 'All Time'
  }

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg 
            className="w-5 h-5 text-gray-500 dark:text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
            />
          </svg>
          <span className="font-medium text-gray-700 dark:text-gray-300">Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium px-2 py-0.5 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Account Status
          </label>
          <Listbox
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2.5 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                <span className="block truncate">
                  {filters.status ? (
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        filters.status === 'active' ? 'bg-green-500' :
                        filters.status === 'inactive' ? 'bg-gray-400' :
                        filters.status === 'suspended' ? 'bg-red-500' :
                        filters.status === 'pending' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                      {getStatusLabel(filters.status)}
                    </span>
                  ) : (
                    'All Status'
                  )}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-700">
                  <Listbox.Option
                    value=""
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          All Status
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                  {USER_STATUS.map((status) => (
                    <Listbox.Option
                      key={status.value}
                      value={status.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`flex items-center gap-2 truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            <span className={`w-2 h-2 rounded-full ${
                              status.value === 'active' ? 'bg-green-500' :
                              status.value === 'inactive' ? 'bg-gray-400' :
                              status.value === 'suspended' ? 'bg-red-500' :
                              'bg-yellow-500'
                            }`} />
                            {status.label}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            User Role
          </label>
          <Listbox
            value={filters.role}
            onChange={(value) => setFilters({ ...filters, role: value })}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2.5 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                <span className="block truncate">
                  {filters.role ? (
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        filters.role === 'admin' ? 'bg-purple-500' :
                        filters.role === 'premium' ? 'bg-blue-500' :
                        filters.role === 'counselor' ? 'bg-green-500' :
                        'bg-gray-500'
                      }`} />
                      {getRoleLabel(filters.role)}
                    </span>
                  ) : (
                    'All Roles'
                  )}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-700">
                  <Listbox.Option
                    value=""
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          All Roles
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                  {USER_ROLES.map((role) => (
                    <Listbox.Option
                      key={role.value}
                      value={role.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`flex items-center gap-2 truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            <span className={`w-2 h-2 rounded-full ${
                              role.value === 'admin' ? 'bg-purple-500' :
                              role.value === 'premium' ? 'bg-blue-500' :
                              role.value === 'counselor' ? 'bg-green-500' :
                              'bg-gray-500'
                            }`} />
                            {role.label}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Email Verification Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Email Verification
          </label>
          <Listbox
            value={filters.verified}
            onChange={(value) => setFilters({ ...filters, verified: value })}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2.5 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                <span className="block truncate">
                  {getVerificationLabel(filters.verified)}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-700">
                  {VERIFICATION_OPTIONS.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`flex items-center gap-2 truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {option.icon && <span>{option.icon}</span>}
                            {option.label}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Join Date Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Joined
          </label>
          <Listbox
            value={filters.dateRange}
            onChange={(value) => setFilters({ ...filters, dateRange: value })}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2.5 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                <span className="block truncate">
                  {getDateRangeLabel(filters.dateRange)}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-700">
                  {DATE_RANGE_OPTIONS.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {option.label}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                <span>Status:</span>
                <span className="font-medium">{getStatusLabel(filters.status)}</span>
                <button
                  onClick={() => setFilters({ ...filters, status: '' })}
                  className="ml-1 hover:text-primary-900 dark:hover:text-primary-100"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.role && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                <span>Role:</span>
                <span className="font-medium">{getRoleLabel(filters.role)}</span>
                <button
                  onClick={() => setFilters({ ...filters, role: '' })}
                  className="ml-1 hover:text-primary-900 dark:hover:text-primary-100"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                <span>Verification:</span>
                <span className="font-medium">{getVerificationLabel(filters.verified)}</span>
                <button
                  onClick={() => setFilters({ ...filters, verified: '' })}
                  className="ml-1 hover:text-primary-900 dark:hover:text-primary-100"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.dateRange && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                <span>Joined:</span>
                <span className="font-medium">{getDateRangeLabel(filters.dateRange)}</span>
                <button
                  onClick={() => setFilters({ ...filters, dateRange: '' })}
                  className="ml-1 hover:text-primary-900 dark:hover:text-primary-100"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick Filter Presets */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick presets:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilters({
              status: 'active',
              role: '',
              verified: '',
              dateRange: '',
            })}
            className="px-3 py-1 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            Active Users
          </button>
          <button
            onClick={() => setFilters({
              status: 'pending',
              role: '',
              verified: 'unverified',
              dateRange: '',
            })}
            className="px-3 py-1 text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
          >
            Pending Verification
          </button>
          <button
            onClick={() => setFilters({
              status: 'suspended',
              role: '',
              verified: '',
              dateRange: '',
            })}
            className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            Suspended Accounts
          </button>
          <button
            onClick={() => setFilters({
              status: '',
              role: 'premium',
              verified: '',
              dateRange: '',
            })}
            className="px-3 py-1 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            Premium Users
          </button>
          <button
            onClick={() => setFilters({
              status: '',
              role: '',
              verified: '',
              dateRange: 'today',
            })}
            className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            Joined Today
          </button>
          <button
            onClick={() => setFilters({
              status: '',
              role: '',
              verified: '',
              dateRange: 'week',
            })}
            className="px-3 py-1 text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
          >
            This Week
          </button>
        </div>
      </div>

      {/* Filter Stats */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
        <span>Showing filtered results</span>
        <button
          onClick={clearFilters}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          Reset all filters
        </button>
      </div>
    </div>
  )
}