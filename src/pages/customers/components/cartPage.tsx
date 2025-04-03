// CartPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import { Navbar } from './Navbar';
import Footer from './Footer';
import Button from '../../../shared/ui/button/Button';
interface CartItem {
  id: string;
  quantity: number;
  name: string;
  price: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  store_id: string;
}

interface OrderDetails {
  payment_method: string;
  address: {
    street: string;
    city: string;
    state: string;
  };
}

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState(0);

  // Form state for checkout
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    store_id: ''
  });
  const [order, setOrder] = useState<OrderDetails>({
    payment_method: 'cash_on_delivery',
    address: { street: '', city: '', state: '' }
  });

  // Load cart items from local storage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Handler for moving to next step
  const handleNext = () => {
    // In production, you’d add validation here before proceeding.
    setCheckoutStep((prev) => prev + 1);
  };

  // Handler for moving to previous step
  const handlePrevious = () => {
    setCheckoutStep((prev) => prev - 1);
  };

  // Submit order to the API
  const handleOrderSubmit = async () => {
    const payload = {
      customer: { ...customer },
      order: {
        status: 'pending',
        store_id: customer.store_id,
        payment_method: order.payment_method,
        address: order.address
      },
      items: cartItems.map((item) => ({ id: item.id, quantity: item.quantity }))
    };

    try {
      await api.post('orders/', payload);
      // Clear local storage after successful order
      localStorage.removeItem('cart');
      // Navigate to order confirmation page (create this route/page as needed)
      navigate('/order-success');
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar storeName="Your Store" />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <ul className="mb-6">
                {cartItems.map((item) => (
                  <li key={item.id} className="border-b py-2 flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              {/* Multi-step Checkout Form */}
              <div className="border p-6 rounded-md shadow-md">
                {checkoutStep === 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Customer Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Name"
                        className="border p-2"
                        value={customer.name}
                        onChange={(e) =>
                          setCustomer({ ...customer, name: e.target.value })
                        }
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="border p-2"
                        value={customer.email}
                        onChange={(e) =>
                          setCustomer({ ...customer, email: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        className="border p-2"
                        value={customer.phone}
                        onChange={(e) =>
                          setCustomer({ ...customer, phone: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Store ID"
                        className="border p-2"
                        value={customer.store_id}
                        onChange={(e) =>
                          setCustomer({ ...customer, store_id: e.target.value })
                        }
                      />
                    </div>
                    <Button onClick={handleNext} className="mt-4">
                      Next
                    </Button>
                  </div>
                )}
                {checkoutStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <select
                        className="border p-2"
                        value={order.payment_method}
                        onChange={(e) =>
                          setOrder({ ...order, payment_method: e.target.value })
                        }
                      >
                        <option value="cash_on_delivery">Cash on Delivery</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Street"
                        className="border p-2"
                        value={order.address.street}
                        onChange={(e) =>
                          setOrder({
                            ...order,
                            address: { ...order.address, street: e.target.value }
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="City"
                        className="border p-2"
                        value={order.address.city}
                        onChange={(e) =>
                          setOrder({
                            ...order,
                            address: { ...order.address, city: e.target.value }
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="State"
                        className="border p-2"
                        value={order.address.state}
                        onChange={(e) =>
                          setOrder({
                            ...order,
                            address: { ...order.address, state: e.target.value }
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button variant="ghost" onClick={handlePrevious}>
                        Back
                      </Button>
                      <Button onClick={handleNext}>Next</Button>
                    </div>
                  </div>
                )}
                {checkoutStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Review & Confirm</h2>
                    <div className="border p-4 rounded-md mb-4">
                      <h3 className="font-bold">Customer Information</h3>
                      <p>Name: {customer.name}</p>
                      <p>Email: {customer.email}</p>
                      <p>Phone: {customer.phone}</p>
                      <p>Store ID: {customer.store_id}</p>
                      <h3 className="font-bold mt-4">Order Details</h3>
                      <p>Payment Method: {order.payment_method}</p>
                      <p>
                        Address: {order.address.street}, {order.address.city},{' '}
                        {order.address.state}
                      </p>
                      <h3 className="font-bold mt-4">Items</h3>
                      <ul>
                        {cartItems.map((item) => (
                          <li key={item.id}>
                            {item.name} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="ghost" onClick={handlePrevious}>
                        Back
                      </Button>
                      <Button onClick={handleOrderSubmit}>Place Order</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
