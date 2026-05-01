'use client'

import { useEffect, useRef } from 'react'
import { X, Clock, Star, Share2, Download, ExternalLink, FileText, Headphones, Video, FileSpreadsheet } from 'lucide-react'

export default function ResourceViewerModal({ resource, isOpen, onClose }) {
  const contentRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  const handleShare = async () => {
    if (!resource) {
      return
    }
    
    const shareData = {
      title: resource.title,
      text: resource.description,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${resource.title}: ${window.location.href}`)
        alert('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const handleDownload = () => {
    if (resource?.filePath) {
      window.open(resource.filePath, '_blank')
    }
  }

  if (!isOpen || !resource) {
    return null
  }

  const getFileIcon = () => {
    switch (resource.type) {
      case 'pdf':
        return <FileText className="h-6 w-6" />
      case 'audio':
        return <Headphones className="h-6 w-6" />
      case 'video':
        return <Video className="h-6 w-6" />
      case 'worksheet':
        return <FileSpreadsheet className="h-6 w-6" />
      default:
        return <FileText className="h-6 w-6" />
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-5 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/20 p-2 hover:bg-black/30 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={handleShare}
            className="absolute right-16 top-4 rounded-full bg-black/20 p-2 hover:bg-black/30 transition-colors"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>

          <div className="pr-24">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium capitalize">
                {resource.type}
              </span>
              {resource.featured && (
                <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-slate-900">
                  Featured
                </span>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold">{resource.title}</h2>
            <p className="mt-2 text-white/90 max-w-3xl">{resource.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/90">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {resource.duration}
              </span>
              <span>{resource.level}</span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                {resource.rating} ({resource.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div 
          ref={contentRef}
          className="max-h-[calc(90vh-180px)] overflow-y-auto px-6 py-6 md:px-8 text-white"
        >
          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* PDF Type */}
          {resource.type === 'pdf' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/20 p-6 text-center">
                <div className="flex justify-center mb-4 text-blue-400">
                  {getFileIcon()}
                </div>
                <h3 className="text-xl font-semibold mb-2">PDF Resource</h3>
                <p className="text-slate-300 mb-6">
                  Click the button below to open or download this PDF resource.
                </p>
                <a
                  href={resource.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <Download className="h-5 w-5" />
                  Open PDF
                </a>
              </div>
            </div>
          )}

          {/* Worksheet Type */}
          {resource.type === 'worksheet' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-orange-500/20 p-6 text-center">
                <div className="flex justify-center mb-4 text-orange-400">
                  {getFileIcon()}
                </div>
                <h3 className="text-xl font-semibold mb-2">Printable Worksheet</h3>
                <p className="text-slate-300 mb-6">
                  Download this worksheet to track your progress and build healthy habits.
                </p>
                <a
                  href={resource.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <Download className="h-5 w-5" />
                  Download Worksheet
                </a>
              </div>
            </div>
          )}

          {/* Audio Type */}
          {resource.type === 'audio' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 p-6">
                <div className="flex justify-center mb-4 text-purple-400">
                  {getFileIcon()}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Audio Guide</h3>
                {resource.audioUrl || resource.filePath ? (
                  <audio controls className="w-full">
                    <source src={resource.audioUrl || resource.filePath} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <p className="text-slate-400 text-center">No audio available for this resource.</p>
                )}
              </div>
            </div>
          )}

          {/* Video Type */}
          {resource.type === 'video' && (
            <div className="space-y-6">
              {resource.embedUrls && resource.embedUrls.length > 0 ? (
                resource.embedUrls.map((url, index) => (
                  <div
                    key={index}
                    className="aspect-video overflow-hidden rounded-2xl border border-slate-700"
                  >
                    <iframe
                      src={url}
                      title={`${resource.title} - Video ${index + 1}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-800/40 p-6 text-center border border-slate-700">
                  <p className="text-slate-400">No videos available for this resource.</p>
                </div>
              )}
            </div>
          )}

          {/* Default/Article Type */}
          {(resource.type === 'article' || resource.type === 'course') && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-slate-800/40 p-6 border border-slate-700">
                <p className="text-slate-300 text-lg leading-8">
                  {resource.content?.intro || resource.description}
                </p>
                {resource.filePath && (
                  <div className="mt-6 text-center">
                    <a
                      href={resource.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Read Full Resource
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fallback for unknown type */}
          {!['pdf', 'audio', 'video', 'worksheet', 'article', 'course'].includes(resource.type) && (
            <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 p-8 text-center">
              <p className="text-slate-300">
                This resource type ({resource.type}) is not supported yet.
              </p>
              {resource.filePath && (
                <a
                  href={resource.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300"
                >
                  <Download className="h-4 w-4" />
                  Download File
                </a>
              )}
            </div>
          )}

          {/* Footer Disclaimer */}
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <p className="text-sm text-slate-400">
              This information is for educational purposes only. 
              If you're in crisis, please reach out to a mental health professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}