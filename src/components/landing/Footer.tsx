import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
export default function Footer() {
  return <footer className="bg-muted/30 border-t border-border">
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
              <a href="https://www.linkedin.com/company/quantix-studio/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@quantixstudio.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  support@quantixstudio.com
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

        
      </div>
    </footer>;
}