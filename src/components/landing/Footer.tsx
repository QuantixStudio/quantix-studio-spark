import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
export default function Footer() {
  return <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-sm">
          
          
          <a href="https://www.linkedin.com/company/quantix-studio/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>;
}