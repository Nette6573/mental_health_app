'use client'

import { useEffect } from 'react'
import { X, Clock, Star } from 'lucide-react'

export default function ResourceViewerModal({ resource, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen || !resource) return null

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
            className="absolute right-4 top-4 rounded-full bg-black/20 p-2 hover:bg-black/30"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="pr-12">
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

        <div className="max-h-[calc(90vh-180px)] overflow-y-auto px-6 py-6 md:px-8 text-white">
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

          {resource.type === 'article' || resource.type === 'course' && resource.content ? (
            <div className="space-y-6">
              {resource.content.intro && (
                <p className="text-slate-300 text-lg leading-8">
                  {resource.content.intro}
                </p>
              )}

              {resource.content.sections?.map((section, index) => (
                <div key={index} className="rounded-2xl bg-slate-800/60 border border-slate-700 p-5">
                    <h3 className="text-xl font-semibold mb-3 text-white">
                    {section.heading}
                    </h3>

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
                    <ul className="list-disc pl-6 space-y-2 text-slate-300">
                      {section.bullets.map((bullet, bIndex) => (
                        <li key={bIndex}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : resource.type === 'audio' ? (
            <div className="space-y-6">
            {resource.content?.intro && (
                <p className="text-slate-300 text-lg">{resource.content.intro}</p>
            )}
            {resource.audioUrl ? (
                <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6">
                <audio controls className="w-full">
                    <source src={resource.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
                </div>
            ) : (
                <p className="text-slate-400">No audio available.</p>
            )}
            </div>
          ) : resource.type === 'video' ? (
             <div className="space-y-6">
                {resource.embedUrls?.length > 0 ? (
                    resource.embedUrls.map((url, index) => (
                    <div
                        key={index}
                        className="aspect-video overflow-hidden rounded-2xl border border-slate-700"
                    >
                        <iframe
                        src={url}
                        title={`${resource.title} ${index}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        />
                    </div>
                    ))
                ) : (
                    <p className="text-slate-400">No videos available.</p>
                )}
                </div>
          ) : (
            <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6">
              <p className="text-slate-300">This resource type is not set up yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}