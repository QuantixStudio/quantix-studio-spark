import { supabase } from "@/integrations/supabase/client";

/**
 * Get full public URL for tool logo
 */
export function getToolLogoUrl(logoPath: string | null): string | null {
  if (!logoPath) return null;
  
  const { data } = supabase.storage
    .from("tools_logos")
    .getPublicUrl(logoPath);
  
  return data.publicUrl;
}

/**
 * Component props for displaying tool logo with name
 */
export interface ToolDisplayProps {
  logoPath: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

/**
 * Component for displaying tool logo with name
 */
export function ToolDisplay({ 
  logoPath, 
  name, 
  size = 'md', 
  showName = true,
  className = '' 
}: ToolDisplayProps) {
  const url = getToolLogoUrl(logoPath);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  return (
    <div 
      className={`flex items-center gap-2 px-3 py-2 border rounded-lg bg-card hover:bg-accent/5 transition-colors ${className}`}
      title={name}
    >
      {url ? (
        <img 
          src={url}
          alt={name}
          className={`${sizeClasses[size]} object-contain`}
        />
      ) : (
        <div 
          className={`${sizeClasses[size]} rounded bg-muted flex items-center justify-center text-xs font-medium`}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      {showName && <span className="text-sm font-medium">{name}</span>}
    </div>
  );
}
