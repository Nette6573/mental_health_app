export default function BlogPage() {
  const posts = [
    {
      title: "Caring for Your Mental Health in Everyday Life",
      excerpt:
        "Small daily habits can make a meaningful difference in how you feel, cope, and recover.",
      category: "Mental Wellness",
      readTime: "5 min read",
      href: "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health",
      source: "National Institute of Mental Health (NIMH)",
    },
    {
      title: "Finding Comfort Through Faith During Difficult Seasons",
      excerpt:
        "Faith can be a source of comfort, resilience, and hope while navigating emotional struggles.",
      category: "Faith & Support",
      readTime: "4 min read",
      href: "https://cherishedmoments.com/2025/12/29/finding-comfort-through-faith-during-difficult-seasons/",
      source: "Cherished Moments",
    },
    {
      title: "The Power of Asking for Help",
      excerpt:
        "Recognizing when you need support is a powerful step toward healing and connection.",
      category: "Guidance",
      readTime: "6 min read",
      href: "https://mindfulspark.org/2024/10/30/the-power-of-asking-for-help-a-practical-guide-to-support-and-connection/",
      source: "Mindful Spark",
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
            <a href="/">
                <img
                src="https://huggingface.co/spaces/brennanlondon/deepsite-project-q0z6c/resolve/main/images/hopepath.png"
                alt="HopePath Logo"
                className="w-30 h-20 rounded-xl object-cover shadow-lg"
                />
            </a>
        </div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium mb-6">
              HopePath Blog
            </span>

            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Trusted Mental Health & Faith-Based Resources
            </h1>

            <p className="text-lg md:text-xl opacity-90">
              Curated articles from reliable sources to support your mental
              well-being and spiritual growth.
            </p>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Featured Resources
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              These external articles are selected to guide, support, and inform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.title}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:-translate-y-1 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-semibold mb-3">
                  {post.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>

                <p className="text-xs text-gray-400 mb-4">
                  Source: {post.source}
                </p>

                <a
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  Read article →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories / support */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Explore by Topic
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
              Browse content focused on the areas people need most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
              <h3 className="font-heading text-xl font-semibold mb-2">
                Mental Wellness
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Daily habits, emotional care, coping tools, and self-awareness.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
              <h3 className="font-heading text-xl font-semibold mb-2">
                Faith & Encouragement
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Scripture-informed reflection, hope, resilience, and healing.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
              <h3 className="font-heading text-xl font-semibold mb-2">
                Getting Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Guidance on reaching out, finding help, and taking next steps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}