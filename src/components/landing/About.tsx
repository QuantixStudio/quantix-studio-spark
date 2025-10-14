import { Target, Zap, Shield } from "lucide-react";

export default function About() {
  return (
    <section className="section-container bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">About Quantix Studio</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mt-6">
            Quantix Studio is a next-generation digital agency specializing in fast and scalable{" "}
            <strong className="text-foreground">web and mobile development</strong>,{" "}
            <strong className="text-foreground">AI automation</strong>, and{" "}
            <strong className="text-foreground">no-code / low-code solutions</strong>.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mt-4">
            We help businesses launch digital products 3× faster by leveraging tools like{" "}
            <strong className="text-foreground">Supabase</strong>,{" "}
            <strong className="text-foreground">n8n</strong>,{" "}
            <strong className="text-foreground">GPT</strong>, and{" "}
            <strong className="text-foreground">Bubble</strong> — without compromising on design, scalability, or security.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-accent">
              <Zap className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Automation-first approach with serverless architecture ensures rapid deployment and instant scalability.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-accent">
              <Target className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">AI-Powered</h3>
            <p className="text-muted-foreground">
              Intelligent workflows, smart chatbots, and document analysis powered by state-of-the-art language models.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-accent">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Enterprise-Grade</h3>
            <p className="text-muted-foreground">
              Secure infrastructure with row-level security, encrypted storage, and compliance-ready architecture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
