export const STORAGE_BUCKETS = {
  avatars: "profiles_avatar",
  portfolio: "portfolio",
  projectFiles: "project_files",
  projectImages: "Project_images",
  testimonialsAvatars: "testimonials_avatars",
  toolsLogos: "tools_logos",
} as const;

// NOTE: `tools_logos` now backs technology logos directly, even though the
// bucket name still reflects the earlier tools-based stack model.
