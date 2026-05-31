Make the two Contact section cards (Get in Touch & form) equal height, with their buttons pinned to the bottom. When the textarea grows, both cards grow together.

## Changes in `src/components/landing/Contact.tsx`

1. Ensure the grid stretches children: add `items-stretch` to the grid (default already stretches, confirm).
2. Make each `FadeInUp` wrapper fill height: add `className="h-full"` so the motion.div takes full row height.
3. Make each `Card` `h-full flex flex-col`, and `CardContent` `flex-1 flex flex-col`.
4. Remove the `<br/>` spacer hack in the Get in Touch text.
5. Keep `Schedule a Call` button pinned with `mt-auto` (already present, will work once parent is flex column with full height).
6. Pin `Send Message` button to bottom: wrap form so the textarea div uses `flex-1` and the button sits at the bottom via `mt-auto`. Form becomes `flex flex-col flex-1` and textarea gets `h-full min-h-[120px]` so it expands to fill available space — when user types and it auto-grows (or we allow manual resize), both cards grow together since they share the grid row height.

## Technical detail

The grid row's height equals the tallest child. Making the form's textarea `flex-1` with `h-full` causes the form card to define its own intrinsic height based on textarea content; the left card matches via `items-stretch` + `h-full`. Buttons stay bottom via `mt-auto` in a flex-column container.
