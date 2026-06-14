import { useTestimonials } from "@/hooks/useTestimonials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getTestimonialAvatarUrl } from "@/lib/testimonialStorageUtils";

export default function Testimonials() {
  const { data: testimonials, isLoading, isError } = useTestimonials();

  return (
    <section className="section-container bg-muted/30">
      <FadeInUp>
        <div className="text-center mb-16">
          <h2 className="section-title">Client Testimonials</h2>
          <p className="section-subtitle">
            What our clients say about working with us
          </p>
        </div>
      </FadeInUp>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((item) => (
            <article key={item} className="showcase-surface h-full rounded-[28px] overflow-hidden">
              <div className="space-y-5 p-6 md:p-7">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Skeleton key={star} className="h-5 w-5 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-24 w-full" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : isError ? (
        <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card/60 p-8 text-center text-muted-foreground">
          Testimonials could not be loaded from Supabase.
        </div>
      ) : !testimonials?.length ? (
        <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card/60 p-8 text-center text-muted-foreground">
          No published rows found in the <code>testimonials</code> table yet.
        </div>
      ) : (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials?.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
                <div className="testimonial-showcase-card showcase-card media-hover-trigger group h-full">
                  <article className="showcase-surface flex h-full flex-col overflow-hidden rounded-[28px]">
                    <div className="flex h-full flex-col p-6 md:p-7">
                    {testimonial.rating && (
                      <div className="testimonial-showcase-stars mb-5 flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-current"
                          />
                        ))}
                      </div>
                    )}
                    <p className="testimonial-showcase-quote mb-8 flex-1 text-base leading-[1.75] md:text-[1.05rem]">
                      "{testimonial.feedback}"
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar className="testimonial-showcase-avatar h-16 w-16 border border-white/10">
                        {testimonial.avatar_url && (
                          <AvatarImage
                            className="media-hover-target object-cover"
                            src={getTestimonialAvatarUrl(testimonial.avatar_url) || testimonial.avatar_url}
                          />
                        )}
                        <AvatarFallback className="bg-white/[0.04] text-foreground">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="testimonial-showcase-name text-[1.5rem] font-semibold leading-[1.05] tracking-[-0.04em] md:text-[1.7rem]">
                          {testimonial.name}
                        </p>
                        {testimonial.position && testimonial.company && (
                          <p className="testimonial-showcase-role mt-2 text-[15px] leading-relaxed md:text-base">
                            {testimonial.position} at {testimonial.company}
                          </p>
                        )}
                      </div>
                    </div>
                    </div>
                  </article>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:inline-flex md:-left-6 lg:-left-16" />
          <CarouselNext className="hidden md:inline-flex md:-right-6 lg:-right-16" />
        </Carousel>
      )}
    </section>
  );
}
