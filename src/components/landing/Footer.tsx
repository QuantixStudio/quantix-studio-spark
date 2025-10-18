import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
export default function Footer() {
  return <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <a href="mailto:support@quantixstudio.com" className="text-muted-foreground hover:text-foreground transition-colors">
            support@quantixstudio.com
          </a>
          <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <a href="https://www.linkedin.com/company/quantix-studio/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>;
}