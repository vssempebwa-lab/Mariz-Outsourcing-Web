import { SITE } from '@/lib/data';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Mariz Outsourcing Agency.',
};

export default function TermsPage() {
  return (
    <section className="py-20 lg:py-24">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-8">
          Terms of Service
        </h1>
        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="text-foreground leading-relaxed mb-4">
            These terms govern your use of the {SITE.legalName} website. By accessing
            and using this site, you accept these terms in full.
          </p>
          <h2 className="font-display font-bold text-xl text-foreground mt-8 mb-3">
            Use of the Website
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            You may use this website for lawful purposes only. You must not misuse
            this site by introducing viruses, attempting to gain unauthorized
            access, or interfering with its normal operation.
          </p>
          <h2 className="font-display font-bold text-xl text-foreground mt-8 mb-3">
            Intellectual Property
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            All content on this website — including text, graphics, logos, and
            design elements — is the property of {SITE.legalName} unless otherwise
            stated, and is protected by applicable intellectual property laws.
          </p>
          <h2 className="font-display font-bold text-xl text-foreground mt-8 mb-3">
            Service Inquiries
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Submitting a consultation request through this website does not
            constitute a binding agreement. Services are provided under separate
            contracts agreed upon between {SITE.legalName} and the client.
          </p>
          <h2 className="font-display font-bold text-xl text-foreground mt-8 mb-3">
            Contact
          </h2>
          <p className="text-foreground/80 leading-relaxed">
            For questions about these terms, contact us at {SITE.email}.
          </p>
        </div>
      </div>
    </section>
  );
}
