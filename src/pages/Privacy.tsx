import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
export default function Privacy() {
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 my-[30px]">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly to us, such as when you fill out our contact form,
              request information about our services, or communicate with us. This may include your name,
              email address, company name, and any other information you choose to provide.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Respond to your inquiries and provide customer service</li>
              <li>Send you information about our services</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookie Usage</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to track activity on our website and
              hold certain information. You can instruct your browser to refuse all cookies or to
              indicate when a cookie is being sent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground">
              We may employ third-party companies and individuals to facilitate our service,
              provide the service on our behalf, or assist us in analyzing how our service is used.
              These third parties have access to your personal information only to perform these tasks
              on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground">
              The security of your data is important to us. We use commercially acceptable means to
              protect your personal information, but no method of transmission over the Internet or
              electronic storage is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:hello@quantixstudio.com" className="text-accent hover:underline">support@quantixstudio.com</a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>;
}