// import React, { useContext } from 'react'
// import { useState } from 'react'
// import { useLocation } from 'react-router-dom'
// import Products from '../Products/Products'


// export default function Cart() {
//     const {state} = useLocation()
    
//     const [cartValue,setCartValue]=useState(state?.id2||{})
//     const [cartDetails,setCartDetails]=useState([])
//     const id=1

//     const AddItems=(products)=>{
//       const existing = products.find(p=>p.id==id)

//       if(existing){
//       setCartDetails(cartValue.map(
//         [...products,{quantity:quantity+1}]

//       )
//       )}
//       else{
//         setCartDetails([...products,{quantity:1}])
//       }
//     }

//     function updateProducts(update) {
//       setCartDetails(cartDetails)

//     }

//     if(!cartValue){setCartDetails(p=>[...p,state?.id2])}
//     // const {price1}=cartValue.price
//     const currency={
//     minimumFractionDigits:2,
//     maximumFractionDigits:4
//   }
  
//     const penny=cartDetails.price.toLocaleString(undefined,currency);console.log(cartDetails);

//   return (
//     <div className='w-screen h-full '>
//         <div className='w-40 mx-auto'>
//             <h3 className='text-center font-bold'>Cart </h3>
//             <div>
//               <img src={cartDetails.image} height={200} width={260} alt='Err'/>
//               <p>${penny}</p>
//             </div>
//         </div>

//     </div>
//   )
// }

import React from 'react';
import { Link } from 'react-router-dom';
// ✅ Import context hook from the same Products file — no new files needed
import { useCart } from '../Products/Products'; // adjust path if needed

export default function Cart() {
  const { cartItems, cartTotal,addToCart, removeFromCart, deleteFromCart } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">🛒 My Cart</h1>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            ← Back to Products
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-xl mb-6">Your cart is empty.</p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-blue-600 font-semibold mt-1">
                      {formatPrice(item.price)} × {item.quantity} ={' '}
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                    disabled={item.quantity===1}
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => (addToCart(item))}
                      className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 font-bold text-blue-700 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => deleteFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors ml-2"
                    title="Remove item"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-8 bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(cartTotal)}
              </span>
            </div>

            <button className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}