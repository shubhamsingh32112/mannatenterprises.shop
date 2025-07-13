import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Clock, Heart } from "lucide-react";
import qualityCraftsmanship from "@/assets/quality-craftsmanship.jpg";
import sustainability from "@/assets/sustainability.jpg";
import customerSatisfaction from "@/assets/customer-satisfaction.jpg";

const About: React.FC = () => {
  const values = [
    {
      icon: Award,
      title: "Quality Craftsmanship",
      description: "Every piece is meticulously crafted using traditional techniques passed down through generations, ensuring exceptional quality and attention to detail.",
      image: qualityCraftsmanship,
    },
    {
      icon: Heart,
      title: "Sustainable Fashion",
      description: "We're committed to sustainable practices, using eco-friendly materials and ethical manufacturing processes to protect our environment.",
      image: sustainability,
    },
    {
      icon: Users,
      title: "Customer Satisfaction",
      description: "Our customers are at the heart of everything we do. We strive to exceed expectations with personalized service and premium quality products.",
      image: customerSatisfaction,
    },
  ];

  const stats = [
    { number: "50+", label: "Years of Experience" },
    { number: "10,000+", label: "Happy Customers" },
    { number: "1,000+", label: "Unique Designs" },
    { number: "99%", label: "Customer Satisfaction" },
  ];

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Our Story Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-brand-primary mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  Founded in 1973, Heritage Threads began as a small family business with a simple vision: 
                  to create exceptional clothing that honors traditional craftsmanship while embracing modern style.
                </p>
                <p>
                  What started as a humble tailoring shop has grown into a trusted name in men's fashion, 
                  serving customers across the country with our commitment to quality, authenticity, and innovation.
                </p>
                <p>
                  Today, we continue to blend time-honored techniques with contemporary designs, 
                  ensuring that every garment tells a story of heritage, craftsmanship, and style.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-3xl p-8 text-center">
                <Clock className="h-16 w-16 text-brand-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-brand-primary mb-4">5 Decades of Excellence</h3>
                <p className="text-muted-foreground">
                  Three generations of master craftsmen have contributed to our legacy of creating 
                  timeless clothing that stands the test of time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values Section */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-primary mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide us in creating exceptional clothing and memorable experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card
                  key={index}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={value.image}
                        alt={value.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-brand-primary mb-3 group-hover:text-brand-secondary transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-3xl p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-brand-primary mb-6">
              Our Mission
            </h3>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              To preserve and celebrate the art of traditional clothing while innovating for the modern man. 
              We strive to create garments that not only look exceptional but also tell the story of our 
              rich cultural heritage, ensuring that every customer feels confident, comfortable, and connected 
              to timeless style.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;