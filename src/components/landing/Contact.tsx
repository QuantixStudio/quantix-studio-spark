import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Mail, Send, Linkedin } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
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
      const response = await fetch("https://pivovarius.space/webhook/fd5bb622-d19d-4052-97df-0b65fc2c1273", {
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
          <h2 className="section-title">Let's Build Something Amazing</h2>
          <p className="section-subtitle">
            Ready to transform your business with AI and automation? Get in touch today.
          </p>
        </div>
      </FadeInUp>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <FadeInUp delay={0.1}>
          <Card className="border">
            <CardContent className="pt-6 pb-6 flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Schedule a free consultation call to discuss your project, or send us
                  a message using the form.
                  <br />
                  <br />
                  <br />
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-5 w-5 flex-shrink-0" />
                    <span>support@quantixstudio.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <a 
                      href="https://www.linkedin.com/company/quantix-studio" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      linkedin.com/company/quantix-studio
                    </a>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full mt-auto" size="lg">
                <a href="https://calendly.com/quantixstudio/30min" target="_blank" rel="noopener noreferrer">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule a Call
                </a>
              </Button>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Contact Form Card */}
        <FadeInUp delay={0.2}>
          <Card className="border">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input placeholder="Your Name" value={formData.name} onChange={e => setFormData({
                  ...formData,
                  name: e.target.value
                })} required />
                </div>

                <div>
                  <Input type="email" placeholder="Your Email" value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} required />
                </div>

                <div>
                  <Textarea placeholder="Tell us about your project..." value={formData.message} onChange={e => setFormData({
                  ...formData,
                  message: e.target.value
                })} rows={6} required />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                  {isSubmitting ? "Sending..." : <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>
    </section>;
}
