import React, { useContext } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Products from '../Products/Products'


export default function Cart() {
    const {state} = useLocation()
    
    const [cartValue,setCartValue]=useState(state?.id2||{})
    const [cartDetails,setCartDetails]=useState([])
    const id=1


    const AddItems=(products)=>{
      const existing = products.find(p=>p.id==id)

      if(existing){
      setCartDetails(cartValue.map(
        [...products,{quantity:quantity+1}]

      )
      )}
      else{
        setCartDetails([...products,{quantity:1}])
      }
    }

    function updateProducts(update) {
      setCartDetails(cartDetails)

    }

    if(!cartValue){setCartDetails(p=>[...p,state?.id2])}
    // const {price1}=cartValue.price
    const currency={
    minimumFractionDigits:2,
    maximumFractionDigits:4
  }
  
    const penny=cartDetails.price.toLocaleString(undefined,currency);console.log(cartDetails);

  return (
    <div className='w-screen h-full '>
        <div className='w-40 mx-auto'>
            <h3 className='text-center font-bold'>Cart </h3>
            <div>
              <img src={cartDetails.image} height={200} width={260} alt='Err'/>
              <p>${penny}</p>
            </div>
        </div>

    </div>
  )
}
