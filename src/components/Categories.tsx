import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import traditionalWear from "@/assets/traditional-wear.jpg";
import casualWear from "@/assets/casual-wear.jpg";
import formalWear from "@/assets/formal-wear.jpg";
import festivalWear from "@/assets/festival-wear.jpg";

interface CategoriesProps {
  setActiveSection: (section: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ setActiveSection }) => {
  const categories = [
    {
      id: "traditional",
      title: "Traditional Wear",
      description: "Elegant kurtas, dhotis, and ethnic ensembles",
      image: traditionalWear,
      items: "120+ Items",
    },
    {
      id: "casual",
      title: "Casual Wear",
      description: "Comfortable jeans, t-shirts, and casual shirts",
      image: casualWear,
      items: "200+ Items",
    },
    {
      id: "formal",
      title: "Formal Wear",
      description: "Professional suits, dress shirts, and formal attire",
      image: formalWear,
      items: "80+ Items",
    },
    {
      id: "festival",
      title: "Festival Wear",
      description: "Vibrant and celebratory clothing for special occasions",
      image: festivalWear,
      items: "60+ Items",
    },
  ];

  return (
    <section id="categories" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-primary mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collections designed for every occasion and style preference
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-b from-background to-muted/50"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {category.items}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-brand-primary mb-2 group-hover:text-brand-secondary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-between group-hover:bg-brand-primary group-hover:text-white transition-all duration-300"
                    onClick={() => setActiveSection("products")}
                  >
                    Explore Collection
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary text-white"
            onClick={() => setActiveSection("products")}
          >
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Categories;