import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Mail, Send, Linkedin } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import {
  trackCalendlyClick,
  trackContactFormSubmit,
  trackOutboundLink,
} from "@/lib/analytics";
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("https://n8n.ibs-logistics.store/webhook/fd5bb622-d19d-4052-97df-0b65fc2c1273", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          source: "quantix_studio_website"
        })
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      toast({
        title: "Your message has been sent successfully!",
        description: "We'll get back to you soon."
      });
      trackContactFormSubmit();
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Something went wrong. Please try again.",
        description: "Failed to send message.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section id="contact" className="section-container">
      <FadeInUp>
        <div className="text-center mb-16">
          <h2 className="section-title mx-auto max-w-5xl">
            <span className="block">Have a Bubble app, SaaS idea,</span>
            <span className="block">or internal workflow that needs</span>
            <span className="block">serious architecture?</span>
          </h2>
          <p className="section-subtitle mx-auto max-w-4xl">
            <span className="block">Tell us what you’re building. We’ll help you clarify the best path:</span>
            <span className="block">Bubble, custom backend, APIs, AI workflows, or automation.</span>
          </p>
        </div>
      </FadeInUp>

      <div className="mx-auto grid max-w-5xl items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Contact Info Card */}
        <FadeInUp delay={0.1} className="h-full">
          <div className="contact-showcase-card showcase-card h-full">
            <article className="showcase-surface flex h-full flex-col overflow-hidden rounded-[28px]">
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <div className="flex-1">
                  <h3 className="contact-showcase-title mb-4 text-xl font-semibold md:text-2xl">Get in Touch</h3>
                  <p className="contact-showcase-copy mb-6 leading-relaxed">
                    Schedule a free consultation call to discuss your project, or send us
                    a message using the form.
                  </p>

                  <div className="contact-showcase-note mb-6 rounded-[22px] p-4 text-sm">
                    We usually reply within 1 business day with the next best step: a call,
                    a quick scoping note, or follow-up questions.
                  </div>

                  <div className="mb-6 space-y-3">
                    <div className="contact-showcase-meta flex items-center gap-3">
                      <Mail className="contact-showcase-icon h-5 w-5 flex-shrink-0" />
                      <span>support@quantixstudio.com</span>
                    </div>
                    <div className="contact-showcase-meta flex items-center gap-3">
                      <Linkedin className="contact-showcase-icon h-5 w-5 flex-shrink-0" />
                      <a
                        href="https://www.linkedin.com/company/quantix-studio"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackOutboundLink(
                            "linkedin_click",
                            "https://www.linkedin.com/company/quantix-studio",
                            "contact_section",
                          )
                        }
                        className="transition-colors hover:text-foreground"
                      >
                        linkedin.com/company/quantix-studio
                      </a>
                    </div>
                  </div>
                </div>

                <Button variant="marketing" asChild className="mt-auto w-full" size="lg">
                  <a
                    href="https://calendly.com/quantixstudio/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCalendlyClick("contact_section")}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule a Call
                  </a>
                </Button>
              </div>
            </article>
          </div>
        </FadeInUp>

        {/* Contact Form Card */}
        <FadeInUp delay={0.2} className="h-full">
          <div className="contact-showcase-card showcase-card h-full">
            <article className="showcase-surface flex h-full flex-col overflow-hidden rounded-[28px]">
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <form onSubmit={handleSubmit} className="flex h-full flex-col space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="contact-showcase-label text-sm font-medium">
                      Your name
                    </label>
                    <Input id="contact-name" placeholder="Jane founder" value={formData.name} onChange={e => setFormData({
                    ...formData,
                    name: e.target.value
                  })} required />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="contact-showcase-label text-sm font-medium">
                      Work email
                    </label>
                    <Input id="contact-email" type="email" placeholder="you@company.com" value={formData.email} onChange={e => setFormData({
                    ...formData,
                    email: e.target.value
                  })} required />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="contact-message" className="contact-showcase-label text-sm font-medium">
                      Project overview
                    </label>
                    <Textarea
                      id="contact-message"
                      placeholder="Tell us about your app, users, workflows, integrations, timeline, and budget range..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      required
                      className="min-h-[180px]"
                    />
                    <p className="contact-showcase-hint text-xs">
                      Share your timeline, budget range, or the workflow you want to automate.
                    </p>
                  </div>

                  <Button variant="marketing" type="submit" disabled={isSubmitting} className="mt-auto w-full" size="lg" aria-busy={isSubmitting}>
                    {isSubmitting ? "Sending..." : <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>}
                  </Button>
                </form>
              </div>
            </article>
          </div>
        </FadeInUp>
      </div>
    </section>;
}
