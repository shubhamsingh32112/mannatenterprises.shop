import React, { useState, useEffect } from "react";
import { CartProvider } from "@/components/ui/shopping-cart";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import Products from "@/components/sections/Products";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import ShoppingCartSidebar from "@/components/cart/ShoppingCartSidebar";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  // Smooth scroll to section
  useEffect(() => {
    if (activeSection !== "home") {
      const element = document.getElementById(activeSection);
      if (element) {
        element.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSection]);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        
        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <Hero setActiveSection={setActiveSection} />
          
          {/* Categories Section */}
          <Categories setActiveSection={setActiveSection} />
          
          {/* Products Section */}
          <Products />
          
          {/* About Section */}
          <About />
          
          {/* Contact Section */}
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Shopping Cart Sidebar */}
        <ShoppingCartSidebar />
      </div>
    </CartProvider>
  );
};

export default Index;
