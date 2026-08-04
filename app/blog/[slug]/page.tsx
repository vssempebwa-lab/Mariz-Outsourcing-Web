import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BLOG_POSTS } from '@/lib/data';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const others = BLOG_POSTS.filter((p) => p.slug !== params.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 lg:pt-24 pb-12 lg:pb-16">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All Articles
          </Link>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-xs font-semibold text-accent mb-4">
            {post.category}
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-balance text-foreground">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl shadow-xl aspect-[16/9] mb-10">
            <img
              src="https://images.pexels.com/photos/577195/pexels-photo-577195.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <article className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {post.excerpt}
            </p>
            <p className="text-foreground leading-relaxed mb-4">
              At Mariz Outsourcing Agency, we have spent years refining the
              practices that make outsourcing engagements successful. The
              principles outlined in this article come directly from our work with
              clients across corporate enterprise, hospitality, construction,
              healthcare, retail, and manufacturing sectors.
            </p>
            <p className="text-foreground leading-relaxed mb-4">
              The key insight is that successful outsourcing is not simply about
              cost reduction — it is about building operational capability that
              scales. When done right, an outsourcing partner becomes a true
              extension of your team, bringing specialized expertise, technology,
              and process discipline that would be expensive to build internally.
            </p>
            <h2 className="font-display font-bold text-2xl text-foreground mt-8 mb-4">
              The Strategic Foundation
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              Every successful engagement begins with a thorough assessment of
              current operations. Before proposing solutions, we take the time to
              understand your workflows, pain points, and growth objectives. This
              diagnostic phase ensures that the solutions we design are tailored to
              your specific context rather than generic templates.
            </p>
            <h2 className="font-display font-bold text-2xl text-foreground mt-8 mb-4">
              Execution and Quality
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              Execution is where most outsourcing relationships succeed or fail. We
              invest heavily in training, quality assurance, and transparent
              reporting. Our 24/7 operations are backed by SLA tracking, call
              monitoring, and continuous improvement processes — so you always have
              visibility into performance.
            </p>
            <p className="text-foreground leading-relaxed mb-4">
              If you would like to discuss how these principles apply to your
              operations, we welcome a conversation. Request a consultation and our
              team will help you scope the right approach.
            </p>
          </article>

          <div className="mt-12 pt-8 border-t border-border">
            <Button asChild>
              <Link href="/contact">
                Request a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-muted/30 border-t border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl text-foreground mb-8">
            More articles
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {others.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}>
                <Card className="h-full border-border hover:border-primary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-5">
                    <span className="text-xs font-semibold text-accent">
                      {p.category}
                    </span>
                    <h3 className="mt-2 font-display font-semibold text-base text-foreground leading-tight">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {p.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
