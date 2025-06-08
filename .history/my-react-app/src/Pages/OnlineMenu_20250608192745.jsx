import React, { useState, useEffect } from "react";
import "../CSS/OnlineMenu.css";
import { useParams, useNavigate } from "react-router-dom";
import ChatModal from "../components/ChatModal"; // krijojmë këtë në hapin tjetër
import { FaComments } from "react-icons/fa";
import { IconButton, useDisclosure } from "@chakra-ui/react";

const OnlineMenu = () => {
  const { id } = useParams();
  console.log("OnlineMenu component rendered. id from useParams:", id);
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shuffledImageIndices, setShuffledImageIndices] = useState([]);

  useEffect(() => {
    if (!id) {
      const fetchRestaurants = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/Restaurant`);
          if (!response.ok) {
            throw new Error("Error fetching restaurants.");
          }
          const data = await response.json();
          setRestaurants(data);

          const indices = Array.from({ length: 8 }, (_, i) => i + 1);
          for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
          }
          setShuffledImageIndices(indices);
        } catch (err) {
          console.error("Restaurant fetch failed:", err);
          setError("Failed to load restaurants.");
        } finally {
          setLoading(false);
        }
      };

      fetchRestaurants();
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const fetchMenu = async () => {
      console.log("Menu useEffect triggered. id from useParams:", id);
      const restaurantIdToFetch = id ? parseInt(id, 10) : null;

      console.log("restaurantIdToFetch:", restaurantIdToFetch);

      if (!restaurantIdToFetch) {
        setMenuData([]);
        setSelectedRestaurant(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (
          !selectedRestaurant ||
          selectedRestaurant.ID !== restaurantIdToFetch
        ) {
          const restaurantRes = await fetch(
            `${import.meta.env.VITE_API_BASE}/api/Restaurant/${restaurantIdToFetch}`
          );
          if (!restaurantRes.ok) {
            throw new Error("Error fetching restaurant details.");
          }
          const restaurantData = await restaurantRes.json();
          setSelectedRestaurant(restaurantData);
        }

        const [itemsRes, categoriesRes, subcategoriesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE}/api/MenuItems`),
fetch(`${import.meta.env.VITE_API_BASE}/api/Category`),
fetch(`${import.meta.env.VITE_API_BASE}/api/Subcategory`),
 
        ]);

        if (!itemsRes.ok || !categoriesRes.ok || !subcategoriesRes.ok) {
          throw new Error(
            `Failed to fetch menu data: Statuses: Items ${itemsRes.status}, Categories ${categoriesRes.status}, Subcategories ${subcategoriesRes.status}`
          );
        }

        const itemsJson = await itemsRes.json();
        const categoriesJson = await categoriesRes.json();
        const subcategoriesJson = await subcategoriesRes.json();

        const filteredItems = itemsJson.filter(
          (item) => item.restaurantId === restaurantIdToFetch
        );

        const structuredData = categoriesJson
          .map((category) => {
            const subcats = subcategoriesJson
              .filter((sub) => sub.categoryID === category.id)
              .map((sub) => {
                const itemsForSubcategory = filteredItems.filter(
                  (item) => item.subCategoryId === sub.id
                );

                return {
                  title: sub.name,
                  items: itemsForSubcategory,
                };
              });

            return {
              category: category.name,
              subcategories: subcats.filter((sub) => sub.items.length > 0),
            };
          })
          .filter((c) => c.subcategories.length > 0);

        setMenuData(structuredData);
      } catch (err) {
        console.error("Menu fetch failed:", err);
        setError("Failed to load menu data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  const handleRestaurantSelect = (restaurant) => {
    console.log("Clicked restaurant:", restaurant);
    setSelectedRestaurant(restaurant);
    setMenuData([]);
    navigate(`/online-menu/${restaurant.id}`);
  };

  if (!id && loading)
    return <div className="online-menu-page">Loading restaurants...</div>;
  if (!id && error)
    return (
      <div className="online-menu-page">Error loading restaurants: {error}</div>
    );

  return (
    <div className="online-menu-page">
      {!id && !selectedRestaurant ? (
        <>
          {" "}
          <h1 className="intro-h1">Discover Amazing Restaurants</h1>
          <div className="intro-design-section">
            <div className="intro-text-content">
              <h1>Pick the best</h1>
              <p>
                Browse through our selection of restaurants and find your next
                delicious meal. Click on a restaurant to view their menu and
                start your online order!
              </p>
            </div>
            <div className="intro-image-container">
              <img
                src="/Images-lab2/online.jpg"
                alt="Restaurant selection image"
              />
            </div>
          </div>
          <div className="restaurant-list-container">
            <h1>Available Restaurants</h1>
            {!restaurants.length ? (
              <div>No restaurants available.</div>
            ) : (
              <div className="restaurant-list-grid">
                {restaurants.map((restaurant, index) => (
                  <div
                    key={restaurant.id}
                    className="restaurant-card"
                    onClick={() => handleRestaurantSelect(restaurant)}
                    style={{
                      backgroundImage: `url(/Images-lab2/r${
                        shuffledImageIndices[
                          index % shuffledImageIndices.length
                        ]
                      }.jpg)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="restaurant-card-content">
                      <h2>{restaurant.emri}</h2>
                      <p>Address: {restaurant.adresa}</p>
                      <p>Email: {restaurant.email}</p>
                      <p>Phone: {restaurant.numriTel}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="">
          {/* Show loading state for menu fetch */}
          {loading ? (
            <div>Loading menu...</div>
          ) : error ? (
            <div>Error loading menu: {error}</div>
          ) : (
            <>
              <h1 className="online-menu-title menu-title-display">
                {selectedRestaurant?.emri} Menu
              </h1>

              <div className="menu-content-area">
                <img
                  src="/Images-lab2/Online.jpg"
                  alt={`Menu image for ${selectedRestaurant?.emri}`}
                  className="main-menu-image"
                />

                <div className="menu-items-display">
                  {!menuData || menuData.length === 0 ? (
                    <div>No menu items available for this restaurant.</div>
                  ) : (
                    menuData.map((categoryData) => (
                      <div key={categoryData.category}>
                        <h2 className="category-title">
                          {categoryData.category}
                        </h2>

                        <div className="category-items-grid">
                          {categoryData.subcategories.flatMap((sub) =>
                            sub.items.map((item) => (
                              <div className="menu-item-card" key={item.id}>
                                <div className="menu-item-image-container">
                                  {item.image && (
                                    <img
                                      src={
                                        item.image.startsWith("/")
                                          ? item.image
                                          : "/" + item.image
                                      }
                                      alt={item.name}
                                    />
                                  )}
                                </div>
                                <div className="menu-item-text-content">
                                  <div className="menu-item-name">
                                    {item.name}
                                  </div>
                                  <div className="menu-item-description">
                                    {item.description}
                                  </div>
                                  {item.price !== undefined && (
                                    <div className="menu-item-price">
                                      Price: ${item.price?.toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OnlineMenu;
