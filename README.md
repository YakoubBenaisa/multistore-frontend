
# MultiStore Frontend

![Project Banner](./assets/banner.png)

MultiStore Frontend is a responsive and dynamic frontend application developed for managing and displaying products from multiple online stores. It is designed to provide an intuitive user experience on all screen sizes while serving as a scalable solution for multi-vendor e-commerce platforms.

---

## Table of Contents

- [Overview](#overview)
- [Pages Overview](#pages-overview)
  - [Home Page](#home-page)
  - [Product Listing Page](#product-listing-page)
  - [Product Details Page](#product-details-page)
  - [Store Details Page](#store-details-page)
  - [Cart & Checkout Page](#cart--checkout-page)
  - [User Account & Dashboard](#user-account--dashboard)
- [UI Components Overview](#ui-components-overview)
  - [Header / Navbar](#header--navbar)
  - [Footer](#footer)
  - [Product Card](#product-card)
  - [Filters & Search](#filters--search)
  - [Modals & Alerts](#modals--alerts)
- [Technologies](#technologies)
- [Demo](#demo)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

MultiStore Frontend provides a clean interface for both end-users and store managers.  
- **End-Users:** Easily browse, search, and filter products, view product details, add items to their cart, and complete purchases.
- **Store Managers:** Access a dashboard (if integrated) where they can update product listings, manage store details, and monitor sales.

The project is built using popular modern web technologies and is structured for modular development and scalability.

---

## Pages Overview

Each page in the application has been carefully designed with specific user flows and responsibilities:

### Home Page

- **Purpose:**  
  Serves as the landing page, providing an overview of featured products, trending stores, and promotional banners.  
- **Key Elements:**  
  - **Hero Section:** Large banner or carousel highlighting current deals or promotions.  
  - **Featured Products:** A grid or slider showcasing top-selling or recommended products.  
  - **Quick Navigation:** Shortcuts to product categories and popular stores.
- **Components Involved:**  
  - `Header` component for navigation.
  - `HeroBanner` for promotions.
  - `ProductSlider` or grid for featured items.
  - `Footer` for essential links and social media.

### Product Listing Page

- **Purpose:**  
  Displays products for a particular category or search query with options to filter and sort.  
- **Key Elements:**  
  - **Sidebar Filters:** Allowing users to narrow down choices by price, brand, ratings, etc.
  - **Sorting Options:** Sort products by price, popularity, or newest additions.
  - **Pagination/Infinite Scroll:** To browse through multiple pages or continuous scroll of product results.
- **Components Involved:**  
  - `ProductCard` for each product preview.
  - `FilterSidebar` component to manage filters.
  - `SortBar` for sorting options.
  - `Pagination` or `InfiniteScroll` component.

### Product Details Page

- **Purpose:**  
  To showcase detailed information about a selected product.
- **Key Elements:**  
  - **Product Images Gallery:** High-resolution images with zoom capability.  
  - **Product Information:** Descriptions, specifications, pricing, and available discounts.
  - **Customer Reviews:** Feedback and ratings from previous buyers.
  - **Add-to-Cart Button:** Action button to add the product to the user’s shopping cart.
- **Components Involved:**  
  - `ImageGallery` to display product images.
  - `ProductInfo` for detailed text information.
  - `ReviewSection` for reviews.
  - `AddToCartButton` to capture purchase intent.

### Store Details Page

- **Purpose:**  
  Displays information about a particular store, including branding, store description, and the list of products offered by that store.
- **Key Elements:**  
  - **Store Header:** Branding elements like the logo, name, and tagline.  
  - **Store Description:** Information about the store’s mission, history, and special offers.
  - **Product Catalogue:** A list or grid of products specific to that store.
- **Components Involved:**  
  - `StoreHeader` that displays the store’s logo and name.
  - `StoreDescription` for textual content.
  - Reuse of `ProductCard` components to display store-specific products.

### Cart & Checkout Page

- **Purpose:**  
  Allows users to review selected products, update quantities, remove items, and proceed with the order.
- **Key Elements:**  
  - **Cart Summary:** Itemized list of products added to the cart.
  - **Order Totals:** Display of subtotal, taxes, discounts, and final amount.
  - **Checkout Form:** User input for shipping address, payment details, and order confirmation.
- **Components Involved:**  
  - `CartItem` component for each product in the cart.
  - `CartSummary` to aggregate totals.
  - `CheckoutForm` to capture user details.
  - `PlaceOrderButton` to confirm purchase.

### User Account & Dashboard

- **Purpose:**  
  Provides logged-in users with access to order history, personal details, and preferences.  
- **Key Elements:**  
  - **Profile Information:** Editable user contact and shipping details.
  - **Order History:** List of past orders with statuses and details.
  - **Saved Items:** Wishlist or favorite products.
- **Components Involved:**  
  - `UserProfile` to display and edit user details.
  - `OrderHistory` to list past orders.
  - `FavoritesList` to show saved products.

---

## UI Components Overview

Beyond full pages, the application is built using reusable UI components, which form the building blocks of the interface:

### Header / Navbar

- **Description:**  
  Contains the site logo, navigation links, search bar, and user account menu.  
- **Responsibilities:**  
  - Provide quick access to pages (Home, Products, Stores, Cart, and Account).  
  - Adapt to mobile layouts (hamburger menu).  
- **Files:**  
  Likely located in `src/components/Header.js` or similar.

### Footer

- **Description:**  
  Displays additional navigation, contact information, social media icons, and legal links.  
- **Responsibilities:**  
  - Offer a persistent bottom-of-page navigation.  
  - Ensure copyright and policy notices are visible.
- **Files:**  
  Located in `src/components/Footer.js` or similar.

### Product Card

- **Description:**  
  A compact component to display product preview information.
- **Responsibilities:**  
  - Show product image, name, price, and a “quick view” or “details” button.
  - Provide a consistent look for items shown in lists or grids.
- **Files:**  
  Often defined in `src/components/ProductCard.js`.

### Filters & Search

- **Description:**  
  Components that let users search for products and filter by various criteria.
- **Responsibilities:**  
  - Render search fields and multiple filter controls.
  - Communicate with the state management layer (e.g., Redux) to update product listings.
- **Files:**  
  Typically found in `src/components/FilterSidebar.js` and `src/components/SearchBar.js`.

### Modals & Alerts

- **Description:**  
  Reusable components for dialogs, confirmations, or error messages.
- **Responsibilities:**  
  - Manage user attention for critical events (e.g., add-to-cart confirmations, login errors).
  - Support responsive behavior and accessibility.
- **Files:**  
  Defined in `src/components/Modal.js` or similar.

---

## Technologies

- **Frontend Framework:** [React](https://reactjs.org/)  
- **State Management:** [Redux](https://redux.js.org/) or Context API  
- **Styling:** CSS3,  and optionally [Tailwind CSS](https://tailwindcss.com/)  
- **Routing:** [React Router](https://reactrouter.com/)  
- **HTTP Client:** [Axios](https://github.com/axios/axios)  
- **Build Tool:** _ [Vite](https://vitejs.dev/)

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Steps

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/YakoubBenaisa/multistore-frontend.git
    cd multistore-frontend
    ```

2. **Install Dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using Yarn:
    ```bash
    yarn install
    ```

3. **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application should automatically open in your browser at [http://localhost:3000](http://localhost:3000).

