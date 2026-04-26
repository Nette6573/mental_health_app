'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { GlobeAltIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Location {
  country: string
  count: number
  percentage?: number
  lat?: number
  lng?: number
  code?: string
}

interface GeographicMapProps {
  data?: Location[]
  title?: string
  height?: number
  showLegend?: boolean
  onCountryClick?: (country: string) => void
}

export default function GeographicMap({
  data = [],
  title = 'User Distribution by Location',
  height = 500,
  showLegend = true,
  onCountryClick,
}: GeographicMapProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [mapView, setMapView] = useState<'world' | 'heat' | 'markers'>('markers')
  const [searchTerm, setSearchTerm] = useState('')
  const mapRef = useRef<L.Map>(null)

  // Country coordinates (simplified - in production use a proper geocoding service)
  const countryCoordinates: Record<string, { lat: number; lng: number }> = {
    'USA': { lat: 37.0902, lng: -95.7129 },
    'Canada': { lat: 56.1304, lng: -106.3468 },
    'UK': { lat: 55.3781, lng: -3.4360 },
    'Jamaica': { lat: 18.1096, lng: -77.2975 },
    'Australia': { lat: -25.2744, lng: 133.7751 },
    'Germany': { lat: 51.1657, lng: 10.4515 },
    'France': { lat: 46.2276, lng: 2.2137 },
    'Spain': { lat: 40.4637, lng: -3.7492 },
    'Italy': { lat: 41.8719, lng: 12.5674 },
    'Japan': { lat: 36.2048, lng: 138.2529 },
    'China': { lat: 35.8617, lng: 104.1954 },
    'India': { lat: 20.5937, lng: 78.9629 },
    'Brazil': { lat: -14.2350, lng: -51.9253 },
    'South Africa': { lat: -30.5595, lng: 22.9375 },
    'Mexico': { lat: 23.6345, lng: -102.5528 },
  }

  useEffect(() => {
    if (data.length === 0) {
      // Mock data
      const mockLocations: Location[] = [
        { country: 'Jamaica', count: 5678, percentage: 36.8, lat: 18.1096, lng: -77.2975, code: 'JM' },
        { country: 'USA', count: 4321, percentage: 28.0, lat: 37.0902, lng: -95.7129, code: 'US' },
        { country: 'Canada', count: 2345, percentage: 15.2, lat: 56.1304, lng: -106.3468, code: 'CA' },
        { country: 'UK', count: 1234, percentage: 8.0, lat: 55.3781, lng: -3.4360, code: 'GB' },
        { country: 'Australia', count: 876, percentage: 5.7, lat: -25.2744, lng: 133.7751, code: 'AU' },
        { country: 'Germany', count: 456, percentage: 3.0, lat: 51.1657, lng: 10.4515, code: 'DE' },
        { country: 'France', count: 389, percentage: 2.5, lat: 46.2276, lng: 2.2137, code: 'FR' },
        { country: 'Spain', count: 234, percentage: 1.5, lat: 40.4637, lng: -3.7492, code: 'ES' },
        { country: 'Italy', count: 187, percentage: 1.2, lat: 41.8719, lng: 12.5674, code: 'IT' },
        { country: 'Japan', count: 156, percentage: 1.0, lat: 36.2048, lng: 138.2529, code: 'JP' },
      ]
      setLocations(mockLocations)
    } else {
      // Enhance data with coordinates if not provided
      const enhancedData = data.map(loc => ({
        ...loc,
        lat: loc.lat || countryCoordinates[loc.country]?.lat,
        lng: loc.lng || countryCoordinates[loc.country]?.lng,
      })).filter(loc => loc.lat && loc.lng)
      setLocations(enhancedData)
    }
  }, [data])

  const getMarkerSize = (count: number) => {
    const max = Math.max(...locations.map(l => l.count))
    const min = Math.min(...locations.map(l => l.count))
    const range = max - min
    // Size between 10 and 40 pixels
    return 10 + ((count - min) / range) * 30
  }

  const getMarkerColor = (count: number) => {
    const max = Math.max(...locations.map(l => l.count))
    const intensity = count / max
    if (intensity > 0.8) return '#ef4444' // red
    if (intensity > 0.6) return '#f97316' // orange
    if (intensity > 0.4) return '#f59e0b' // yellow
    if (intensity > 0.2) return '#10b981' // green
    return '#3b82f6' // blue
  }

  const getHeatIntensity = (count: number) => {
    const max = Math.max(...locations.map(l => l.count))
    return count / max
  }

  const filteredLocations = locations.filter(loc =>
    loc.country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalUsers = locations.reduce((sum, loc) => sum + loc.count, 0)

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country)
    if (onCountryClick) onCountryClick(country)
    
    // Center map on selected country
    const location = locations.find(l => l.country === country)
    if (location && mapRef.current) {
      mapRef.current.flyTo([location.lat!, location.lng!], 5)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <GlobeAltIcon className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* View Toggle */}
            <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setMapView('markers')}
                className={`px-3 py-2 text-sm ${
                  mapView === 'markers'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                Markers
              </button>
              <button
                onClick={() => setMapView('heat')}
                className={`px-3 py-2 text-sm ${
                  mapView === 'heat'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                Heat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="p-6">
        <div style={{ height: `${height}px` }} className="relative rounded-lg overflow-hidden">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {mapView === 'markers' && filteredLocations.map((location, index) => (
              <CircleMarker
                key={index}
                center={[location.lat!, location.lng!]}
                radius={getMarkerSize(location.count)}
                fillColor={getMarkerColor(location.count)}
                color="#ffffff"
                weight={2}
                opacity={1}
                fillOpacity={0.7}
                eventHandlers={{
                  click: () => handleCountryClick(location.country),
                  mouseover: (e) => {
                    e.target.openPopup()
                  },
                  mouseout: (e) => {
                    e.target.closePopup()
                  },
                }}
              >
                <Popup>
                  <div className="text-center min-w-[150px]">
                    <p className="font-semibold text-lg">{location.country}</p>
                    <p className="text-sm text-gray-600">
                      {location.count.toLocaleString()} users
                    </p>
                    <p className="text-xs text-gray-500">
                      {((location.count / totalUsers) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {mapView === 'heat' && filteredLocations.map((location, index) => (
              <CircleMarker
                key={index}
                center={[location.lat!, location.lng!]}
                radius={30}
                fillColor={getMarkerColor(location.count)}
                color="transparent"
                fillOpacity={getHeatIntensity(location.count) * 0.6}
              />
            ))}
          </MapContainer>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Low (0-20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Medium (20-40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">High (40-60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Very High (60-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Peak (80-100%)</span>
            </div>
          </div>
        )}

        {/* Country List */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredLocations
            .sort((a, b) => b.count - a.count)
            .map((location, index) => (
              <button
                key={index}
                onClick={() => handleCountryClick(location.country)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  selectedCountry === location.country
                    ? 'bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <p className="font-medium text-gray-900 dark:text-white">{location.country}</p>
                <p className="text-sm text-gray-500">{location.count.toLocaleString()} users</p>
                <p className="text-xs text-gray-400">
                  {((location.count / totalUsers) * 100).toFixed(1)}%
                </p>
              </button>
            ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No locations found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  )
}