import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { useCart } from "@/components/ui/shopping-cart";
import { useToast } from "@/hooks/use-toast";
import traditionalWear from "@/assets/traditional-wear.jpg";
import casualWear from "@/assets/casual-wear.jpg";
import formalWear from "@/assets/formal-wear.jpg";
import festivalWear from "@/assets/festival-wear.jpg";

const Products: React.FC = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = [
    {
      id: "1",
      name: "Premium Silk Kurta",
      price: 2500,
      originalPrice: 3200,
      image: traditionalWear,
      category: "traditional",
      rating: 4.8,
      reviews: 124,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Navy", "Maroon", "Gold"],
      description: "Elegant silk kurta perfect for festive occasions",
    },
    {
      id: "2",
      name: "Cotton Casual Shirt",
      price: 1200,
      originalPrice: 1600,
      image: casualWear,
      category: "casual",
      rating: 4.6,
      reviews: 89,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "White", "Gray"],
      description: "Comfortable cotton shirt for everyday wear",
    },
    {
      id: "3",
      name: "Business Formal Suit",
      price: 8500,
      originalPrice: 12000,
      image: formalWear,
      category: "formal",
      rating: 4.9,
      reviews: 156,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Black", "Navy", "Charcoal"],
      description: "Professional business suit with perfect fit",
    },
    {
      id: "4",
      name: "Festival Special Kurta",
      price: 3200,
      originalPrice: 4500,
      image: festivalWear,
      category: "festival",
      rating: 4.7,
      reviews: 203,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Red", "Orange", "Purple"],
      description: "Vibrant kurta designed for special celebrations",
    },
    {
      id: "5",
      name: "Linen Casual Pants",
      price: 1800,
      originalPrice: 2400,
      image: casualWear,
      category: "casual",
      rating: 4.5,
      reviews: 67,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Beige", "Olive", "Black"],
      description: "Breathable linen pants for comfort",
    },
    {
      id: "6",
      name: "Wedding Sherwani",
      price: 12000,
      originalPrice: 18000,
      image: traditionalWear,
      category: "traditional",
      rating: 4.9,
      reviews: 98,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Ivory", "Gold", "Maroon"],
      description: "Luxurious sherwani for wedding ceremonies",
    },
  ];

  const categories = [
    { id: "all", label: "All Products" },
    { id: "traditional", label: "Traditional" },
    { id: "casual", label: "Casual" },
    { id: "formal", label: "Formal" },
    { id: "festival", label: "Festival" },
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M", // Default size, in real app this would be selected
      category: product.category,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-primary mb-4">
            Our Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked collection of premium quality clothing for every occasion
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id 
                ? "bg-brand-primary hover:bg-brand-secondary" 
                : "border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Discount Badge */}
                  {product.originalPrice > product.price && (
                    <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                      {calculateDiscount(product.originalPrice, product.price)}% OFF
                    </Badge>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick Add to Cart */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      className="w-full bg-brand-primary hover:bg-brand-secondary"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Quick Add
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-primary mb-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 text-sm">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-brand-primary">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-lg text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Colors */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-muted-foreground">Colors:</span>
                    <div className="flex gap-1">
                      {product.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-border"
                          style={{
                            backgroundColor: color.toLowerCase() === "navy" ? "#1e3a8a" :
                                           color.toLowerCase() === "maroon" ? "#7f1d1d" :
                                           color.toLowerCase() === "gold" ? "#f59e0b" :
                                           color.toLowerCase() === "blue" ? "#3b82f6" :
                                           color.toLowerCase() === "white" ? "#ffffff" :
                                           color.toLowerCase() === "gray" ? "#6b7280" :
                                           color.toLowerCase() === "black" ? "#000000" :
                                           color.toLowerCase() === "charcoal" ? "#374151" :
                                           color.toLowerCase() === "red" ? "#ef4444" :
                                           color.toLowerCase() === "orange" ? "#f97316" :
                                           color.toLowerCase() === "purple" ? "#8b5cf6" :
                                           color.toLowerCase() === "beige" ? "#d4b08a" :
                                           color.toLowerCase() === "olive" ? "#84cc16" :
                                           color.toLowerCase() === "ivory" ? "#faf7f0" :
                                           "#000000"
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-brand-primary hover:bg-brand-secondary"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart - ₹{product.price.toLocaleString()}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
          >
            Load More Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;