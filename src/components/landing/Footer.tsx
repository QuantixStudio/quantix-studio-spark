import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-xl font-bold inline-block mb-4">
              QUANTIX STUDIO
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Investor-ready products built with Bubble, WeWeb, and AI.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/quantixstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/quantixstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/quantixstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById("services");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:hello@quantixstudio.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@quantixstudio.com
                </a>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 Quantix Studio. All rights reserved.</p>
          <p className="mt-2">
            Built with ❤️ using{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Supabase
            </a>{" "}
            &{" "}
            <a
              href="https://lovable.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Lovable
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
