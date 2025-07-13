import React, { useState, useEffect } from "react";
import { CartProvider } from "@/components/ui/shopping-cart";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ShoppingCartSidebar from "@/components/ShoppingCartSidebar";

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
