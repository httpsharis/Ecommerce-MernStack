import React from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Product/GenderCollectionSection'
import NewArivals from '../components/Product/NewArivals'
import ProductDetails from '../components/Product/ProductDetails'
import ProductGrid from '../components/Product/ProductGrid'
import FeatureCollection from '../components/Product/FeatureCollection'
import FeatureSection from '../components/Product/FeatureSection'

const placeholderProducts = [
  {
    _id: '1',
    name: 'Stylish Jacket',
    price: 120,
    imges: [
      {
        url: "https://picsum.photos/500/500?random=1",
        altText: 'Stylish Jactet',
      },
    ],
  },
  {
    _id: '2',
    name: 'Stylish Jacket',
    price: 120,
    imges: [
      {
        url: "https://picsum.photos/500/500?random=2",
        altText: 'Stylish Jactet',
      },
    ],
  },
  {
    _id: '3',
    name: 'Stylish Jacket',
    price: 120,
    imges: [
      {
        url: "https://picsum.photos/500/500?random=3",
        altText: 'Stylish Jactet',
      },
    ],
  },
  {
    _id: '4',
    name: 'Stylish Jacket',
    price: 120,
    imges: [
      {
        url: "https://picsum.photos/500/500?random=4",
        altText: 'Stylish Jactet',
      },
    ],
  },
  {
    _id: '5',
    name: 'Stylish Jacket',
    price: 120,
    imges: [
      {
        url: "https://picsum.photos/500/500?random=5",
        altText: 'Stylish Jactet',
      },
    ],
  },
  {
    _id: '6',
    name: 'Stylish Jacket',
    price: 120,
    imges: [
      {
        url: "https://picsum.photos/500/500?random=6",
        altText: 'Stylish Jactet',
      },
    ],
  },
  {
    _id: '7',
    name: 'Stylish Jacket',
    price: 120,
    imges: [
      {
        url: "https://picsum.photos/500/500?random=7",
        altText: 'Stylish Jactet',
      },
    ],
  },
  {
    _id: '8',
    name: 'Stylish Jacket',
    price: 120,
    imges: [
      {
        url: "https://picsum.photos/500/500?random=8",
        altText: 'Stylish Jactet',
      },
    ],
  },
]

function Home() {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArivals />

      {/* Best Seller */}
      <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
      <ProductDetails />

      <div className="container mx-auto px-12">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        <ProductGrid products={placeholderProducts} />
      </div>

      <FeatureCollection />
      <FeatureSection />
    </div>
  )
}

export default Home