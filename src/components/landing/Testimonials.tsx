import { useTestimonials } from "@/hooks/useTestimonials";
import { Card, CardContent } from "@/components/ui/card";
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
  const { data: testimonials, isLoading } = useTestimonials();

  // Don't render section if no testimonials
  if (!isLoading && (!testimonials || testimonials.length === 0)) {
    return null;
  }

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
            <Card key={item} className="admin-surface h-full">
              <CardContent className="space-y-5 p-6">
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
              </CardContent>
            </Card>
          ))}
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
                <Card className="admin-surface h-full">
                  <CardContent className="flex h-full flex-col p-6">
                    {testimonial.rating && (
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-primary text-primary"
                          />
                        ))}
                      </div>
                    )}
                    <p className="mb-6 flex-1 leading-relaxed text-muted-foreground">
                      "{testimonial.feedback}"
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        {testimonial.avatar_url && (
                          <AvatarImage src={getTestimonialAvatarUrl(testimonial.avatar_url) || testimonial.avatar_url} />
                        )}
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        {testimonial.position && testimonial.company && (
                          <p className="text-sm text-muted-foreground">
                            {testimonial.position} at {testimonial.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </section>
  );
}
