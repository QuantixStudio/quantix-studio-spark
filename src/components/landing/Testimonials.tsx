import { useTestimonials } from "@/hooks/useTestimonials";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Testimonials() {
  const { data: testimonials, isLoading } = useTestimonials();

  // Don't render section if no testimonials
  if (!isLoading && (!testimonials || testimonials.length === 0)) {
    return null;
  }

  return (
    <section className="section-container bg-muted/30">
      <div className="text-center mb-16">
        <h2 className="section-title">Client Testimonials</h2>
        <p className="section-subtitle">
          What our clients say about working with us
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground">Loading testimonials...</div>
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
                <Card className="h-full border-border/50">
                  <CardContent className="pt-6">
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
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      "{testimonial.feedback}"
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        {testimonial.avatar_url && (
                          <AvatarImage src={testimonial.avatar_url} />
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
