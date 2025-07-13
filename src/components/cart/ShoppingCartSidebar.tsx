import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/ui/shopping-cart";

const ShoppingCartSidebar: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isOpen,
    setIsOpen,
  } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-brand-primary">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-brand-primary mb-2">
              Your cart is empty
            </h3>
            <p className="text-muted-foreground mb-6">
              Add some items to get started
            </p>
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-brand-primary hover:bg-brand-secondary"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 pr-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex items-center space-x-4 border-b border-border pb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-brand-primary truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Size: {item.size} • {item.category}
                      </p>
                      <p className="text-sm font-semibold text-brand-primary">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(`${item.id}-${item.size}`, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(`${item.id}-${item.size}`, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFromCart(`${item.id}-${item.size}`)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border pt-4 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-brand-primary">
                  Subtotal:
                </span>
                <span className="text-xl font-bold text-brand-primary">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Clear Cart */}
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>

              {/* Checkout Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full bg-brand-primary hover:bg-brand-secondary text-white"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Shipping Info */}
              <div className="text-center text-xs text-muted-foreground">
                <p>Free shipping on orders over ₹2,000</p>
                <p>Easy returns within 30 days</p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCartSidebar;