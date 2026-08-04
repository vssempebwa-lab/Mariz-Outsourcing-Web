import { SITE } from '@/lib/data';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Mariz Outsourcing Agency.',
};

export default function PrivacyPage() {
  return (
    <section className="py-20 lg:py-24">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="text-foreground leading-relaxed mb-4">
            {SITE.legalName} (&ldquo;MOA&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
            respects your privacy and is committed to protecting your personal data.
            This policy explains how we collect, use, and safeguard information you
            provide through our website.
          </p>
          <h2 className="font-display font-bold text-xl text-foreground mt-8 mb-3">
            Information We Collect
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            When you submit a form on our website — such as the consultation request
            form — we collect your name, email address, phone number, company name,
            the service you are interested in, and any message you provide. This
            information is used solely to respond to your inquiry and provide our
            services.
          </p>
          <h2 className="font-display font-bold text-xl text-foreground mt-8 mb-3">
            How We Use Your Information
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            We use the information you provide to contact you regarding your
            inquiry, to provide the services you request, and to communicate with
            you about our offerings. We do not sell or share your personal data with
            third parties for marketing purposes.
          </p>
          <h2 className="font-display font-bold text-xl text-foreground mt-8 mb-3">
            Data Security
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            We implement appropriate technical and organizational measures to
            protect your personal data against unauthorized access, alteration, or
            disclosure.
          </p>
          <h2 className="font-display font-bold text-xl text-foreground mt-8 mb-3">
            Contact
          </h2>
          <p className="text-foreground/80 leading-relaxed">
            For any questions regarding this policy, contact us at {SITE.email} or
            {SITE.phone}.
          </p>
        </div>
      </div>
    </section>
  );
}
