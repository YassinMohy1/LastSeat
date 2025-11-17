'use client';

import { Calendar, User, ArrowLeft, Clock, Share2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import { getBlogPostBySlug } from '@/data/blogData';
import { useEffect } from 'react';

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getBlogPostBySlug(Array.isArray(slug) ? slug[0] : slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    if (typeof window !== "undefined") { window.location.href = "/blog"; } return null;
  }

  const readingTime = Math.ceil(
    (post.content.intro.split(' ').length +
      post.content.sections.reduce((acc, section) => acc + section.content.split(' ').length, 0) +
      post.content.conclusion.split(' ').length) / 200
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <main className="pt-24 pb-16">
          <article className="container mx-auto px-4 max-w-4xl">
            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-brand-red font-semibold hover:gap-3 transition-all mb-8 group"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Blog</span>
            </Link>

            {/* Hero Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-xl">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="inline-block bg-gradient-to-r from-brand-red to-brand-blue px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b-2 border-gray-200">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-brand-red" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-blue" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span>{readingTime} min read</span>
              </div>
              <button className="flex items-center gap-2 ml-auto text-brand-red hover:text-brand-blue transition">
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Share</span>
              </button>
            </div>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-xl leading-relaxed text-gray-700 first-letter:text-7xl first-letter:font-bold first-letter:text-brand-red first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                {post.content.intro}
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-12">
              {post.content.sections.map((section, index) => (
                <section
                  key={index}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-gradient-to-b from-brand-red to-brand-blue rounded-full" />
                    {section.title}
                  </h2>

                  {section.image && (
                    <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-6">{section.content}</p>

                    {section.tips && section.tips.length > 0 && (
                      <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border-l-4 border-brand-blue">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm">
                            ✓
                          </span>
                          Key Tips:
                        </h3>
                        <ul className="space-y-3">
                          {section.tips.map((tip, tipIndex) => (
                            <li
                              key={tipIndex}
                              className="flex items-start gap-3 text-gray-700"
                            >
                              <span className="w-2 h-2 bg-brand-red rounded-full mt-2 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>

            {/* Conclusion */}
            <div className="mt-12 bg-gradient-to-r from-brand-red/10 to-brand-blue/10 rounded-2xl p-8 border-2 border-brand-blue/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Thoughts</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{post.content.conclusion}</p>
            </div>

            {/* Call to Action */}
            <div className="mt-12 bg-gradient-to-r from-brand-red to-brand-blue rounded-2xl p-8 md:p-12 text-white text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Book Your Next Adventure?</h3>
              <p className="text-xl mb-6 opacity-90">
                Let our travel experts find you the best flight deals
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:888-602-6667"
                  className="inline-block bg-white text-brand-red font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
                >
                  Call: 888-602-6667
                </a>
                <Link
                  href="/"
                  className="inline-block bg-white/20 backdrop-blur text-white font-bold px-8 py-4 rounded-lg hover:bg-white/30 transition transform hover:scale-105"
                >
                  Search Flights
                </Link>
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Continue Reading</h3>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-brand-red font-semibold hover:gap-3 transition-all"
              >
                <span>View All Articles</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </div>
          </article>
        </main>
      </div>
      <AIAssistant isOpen={false} onClose={() => {}} onOpen={() => {}} />
      <Footer />
    </>
  );
}
