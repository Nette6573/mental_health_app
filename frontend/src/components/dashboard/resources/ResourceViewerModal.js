'use client'

import { useEffect, useRef } from 'react'
import { X, Clock, Star, Share2, Download, ExternalLink } from 'lucide-react'

export default function ResourceViewerModal({ resource, isOpen, onClose }) {
  const contentRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
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
    if (!resource) return
    
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
    if (resource?.pdfUrl) {
      window.open(resource.pdfUrl, '_blank')
    }
  }

  if (!isOpen || !resource) return null

  const isArticle = resource.type === 'article'
  const isCourse = resource.type === 'course'
  const hasContent = resource.content && (resource.content.intro || resource.content.sections?.length > 0)
  const showContent = (isArticle || isCourse) && hasContent

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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

        <div 
          ref={contentRef}
          className="max-h-[calc(90vh-180px)] overflow-y-auto px-6 py-6 md:px-8 text-white"
        >
          {resource.tags?.length > 0 && (
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

          {resource.type === 'worksheet' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-orange-500/20 p-6 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">Printable Worksheet</h3>
                <p className="text-slate-300 mb-6">
                  Download this worksheet to track your progress and build healthy habits.
                </p>
                {resource.pdfUrl ? (
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    Download PDF
                  </button>
                ) : (
                  <p className="text-slate-400">Worksheet file not available.</p>
                )}
              </div>
            </div>
          )}

          {showContent && (
            <div className="space-y-6">
              {resource.content.intro && (
                <div className="rounded-2xl bg-slate-800/40 p-6 border border-slate-700">
                  <p className="text-slate-300 text-lg leading-8">
                    {resource.content.intro}
                  </p>
                </div>
              )}

              {resource.content.sections?.map((section, index) => (
                <div key={index} className="rounded-2xl bg-slate-800/60 border border-slate-700 p-5">
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {section.heading}
                  </h3>

                  {section.link && (
                    <a
                      href={section.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mb-4 text-blue-400 hover:underline"
                    >
                      Open Resource <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  {section.embedUrl && (
                    <div className="mb-4 aspect-video overflow-hidden rounded-2xl border border-slate-700">
                      <iframe
                        src={section.embedUrl}
                        className="w-full h-full"
                        allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={section.heading}
                      />
                    </div>
                  )}
                  
                  {section.image && (
                    <div className="mb-4 overflow-hidden rounded-2xl border border-slate-700">
                      <img
                        src={section.image}
                        alt={section.imageAlt || section.heading}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}

                  {section.paragraphs?.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-slate-300 leading-8 mb-3 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets?.length > 0 && (
                    <ul className="list-disc pl-6 space-y-2 text-slate-300 mt-3">
                      {section.bullets.map((bullet, bIndex) => (
                        <li key={bIndex}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {resource.type === 'audio' && (
            <div className="space-y-6">
              {resource.content?.intro && (
                <div className="rounded-2xl bg-slate-800/40 p-6 border border-slate-700">
                  <p className="text-slate-300 text-lg leading-8">
                    {resource.content.intro}
                  </p>
                </div>
              )}
              {resource.audioUrl ? (
                <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 p-6">
                  <audio controls className="w-full">
                    <source src={resource.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-800/40 p-6 text-center border border-slate-700">
                  <p className="text-slate-400">No audio available for this resource.</p>
                </div>
              )}
            </div>
          )}

          {resource.type === 'video' && (
            <div className="space-y-6">
              {resource.content?.intro && (
                <div className="rounded-2xl bg-slate-800/40 p-6 border border-slate-700">
                  <p className="text-slate-300 text-lg leading-8">
                    {resource.content.intro}
                  </p>
                </div>
              )}
              {resource.embedUrls?.length > 0 ? (
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

          {!['article', 'course', 'audio', 'video', 'worksheet'].includes(resource.type) && (
            <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 p-8 text-center">
              <p className="text-slate-300">
                This resource type ({resource.type}) is not supported yet.
              </p>
            </div>
          )}

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