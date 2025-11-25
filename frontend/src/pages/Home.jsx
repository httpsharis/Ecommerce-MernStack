import React, { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Product/GenderCollectionSection'
import NewArivals from '../components/Product/NewArivals'
import ProductDetails from '../components/Product/ProductDetails'
import ProductGrid from '../components/Product/ProductGrid'
import FeatureCollection from '../components/Product/FeatureCollection'
import FeatureSection from '../components/Product/FeatureSection'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

function Home() {

  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProducts, setBestSellerProducts] = useState(null)

  useEffect(() => {
    // fetch products for specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8
      })
    );
    // Fetch best Seller
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProducts(response.data)
      } catch (error) {
        console.error(error);
      }
    }
    fetchBestSeller()
  }, [dispatch])

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArivals />

      {/* Best Seller */}
      <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
      {bestSellerProducts ? (
        <ProductDetails productId={bestSellerProducts._id} />
      ) : (
        <p className='text-center'>Loading best seller product ...</p>
      )}

      <div className="container mx-auto px-12">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeatureCollection />
      <FeatureSection />
    </div>
  )
}

export default Home