export const STORAGE_BUCKETS = {
  avatars: "profiles_avatar",
  portfolio: "portfolio",
  projectImages: "Project_images",
  testimonialsAvatars: "testimonials_avatars",
  toolsLogos: "tools_logos",
} as const;

// NOTE: `tools_logos` is used by the app code, but it is not represented
// in the local Supabase migrations currently committed in this repository.
