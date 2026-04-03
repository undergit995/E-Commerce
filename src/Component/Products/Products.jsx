
import { Link } from 'react-router-dom';


import React, { useState, useEffect, createContext, useContext } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const deleteFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, deleteFromCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

export default function Products() {
  const { addToCart, cartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const fil = 6;

  const productNav = [
    { title: 'All',       category: '' },
    { title: 'Pro',       category: 'Electronics' },
    { title: 'Clothing',  category: 'Clothing' },
    { title: 'Furniture', category: 'Furniture' },
    { title: 'Grocery',   category: 'Grocery' },
    { title: 'Shoes',     category: 'Shoes' },
  ];

  useEffect(() => {
    fetch('db.json')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setFilteredData(data.products);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  
  useEffect(() => {
    let filtered = products;
    if (category)
      filtered = filtered.filter((p) => p.category === category);
    if (searchTerm)
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredData(filtered);
    setPage(1);
  }, [category, searchTerm, products]);

  const off = (page - 1) * fil;
  const pageData = filteredData.slice(off, off + fil);
  const totalPages = Math.ceil(filteredData.length / fil);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 1,
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="relative mb-12">
          <div className="absolute top-0 right-0">
            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md"
            >
              🛒 My Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Products</h1>
        </div>

        <div className="mb-12 flex flex-wrap gap-4 items-center">
          <div className="flex flex-wrap gap-3">
            {productNav.map((item, index) => (
              <button
                key={index}
                onClick={() => setCategory(item.category)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm border-2 ${
                  category === item.category
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products, brands, or categories..."
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pageData.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ‹ Prev
          </button>
          <span className="text-white font-medium">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-white text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next ›
          </button>
        </div>

        {/* Empty state */}
        {filteredData.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
            <p className="text-gray-400 mb-8">Try adjusting your search or category filter</p>
            <button
              onClick={() => { setSearchTerm(''); setCategory(''); }}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
// const defaultForm = {
//     id: "shoe-004",
//     category: "Shoes",
//     name: "Suede Platform Sneakers",
//     brand: "New Balance",
//     price: 6299,
//     rating: 4.5,
//     stock: 29,
//     description: "Premium suede upper, 4cm retro platform sole, padded collar.",
//     image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80&auto=format&fit=crop"
// };

// function AddProductModal({ onClose, onAdd }) {
//     const [form, setForm] = useState(defaultForm);
//     const [errors, setErrors] = useState({});

//     const validate = () => {
//         const e = {};
//         if (!String(form.id).trim()) e.id = "ID is required";
//         if (!form.name.trim()) e.name = "Name is required";
//         if (!form.brand.trim()) e.brand = "Brand is required";
//         if (!form.category.trim()) e.category = "Category is required";
//         if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Valid price required";
//         if (!form.rating || isNaN(form.rating) || form.rating < 0 || form.rating > 5) e.rating = "Rating must be 0–5";
//         if (form.stock === '' || isNaN(form.stock) || Number(form.stock) < 0) e.stock = "Valid stock required";
//         if (!form.description.trim()) e.description = "Description is required";
//         return e;
//     };

//     const handleChange = (field, value) => {
//         setForm(prev => ({ ...prev, [field]: value }));
//         if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
//     };

//     const handleSubmit = () => {
//         const e = validate();
//         if (Object.keys(e).length > 0) { setErrors(e); return; }
//         onAdd({ ...form, price: Number(form.price), rating: Number(form.rating), stock: Number(form.stock) });
//         onClose();
//     };

//     const fields = [
//         { key: 'id',       label: 'Product ID',   type: 'text',   placeholder: 'e.g. shoe-004' },
//         { key: 'name',     label: 'Product Name', type: 'text',   placeholder: 'e.g. Suede Platform Sneakers' },
//         { key: 'brand',    label: 'Brand',         type: 'text',   placeholder: 'e.g. New Balance' },
//         { key: 'category', label: 'Category',      type: 'text',   placeholder: 'e.g. Shoes' },
//         { key: 'price',    label: 'Price (INR)',   type: 'number', placeholder: 'e.g. 6299' },
//         { key: 'rating',   label: 'Rating (0–5)',  type: 'number', placeholder: 'e.g. 4.5' },
//         { key: 'stock',    label: 'Stock',         type: 'number', placeholder: 'e.g. 29' },
//         { key: 'image',    label: 'Image URL',     type: 'text',   placeholder: 'https://...' },
//     ];

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
            
//             <div
//                 className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//                 onClick={onClose}
//             />

//             <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">

//                 <div className="flex items-center justify-between px-6 py-5 border-b">
//                     <div>
//                         <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
//                         <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to add a product</p>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
//                     >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                     </button>
//                 </div>

//                 <div className="overflow-y-auto px-6 py-5 flex-1">
                    
//                     {form.image && (
//                         <div className="mb-5 rounded-xl overflow-hidden h-40 bg-gray-100">
//                             <img
//                                 src={form.image}
//                                 alt="Preview"
//                                 className="w-full h-full object-cover"
//                                 onError={e => e.target.style.display = 'none'}
//                             />
//                         </div>
//                     )}

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         {fields.map(({ key, label, type, placeholder }) => (
//                             <div key={key} className={key === 'image' ? 'sm:col-span-2' : ''}>
//                                 <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
//                                 <input
//                                     type={type}
//                                     value={form[key]}
//                                     onChange={e => handleChange(key, e.target.value)}
//                                     placeholder={placeholder}
//                                     className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
//                                         errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-300'
//                                     }`}
//                                 />
//                                 {errors[key] && (
//                                     <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
//                                 )}
//                             </div>
//                         ))}

//                         <div className="sm:col-span-2">
//                             <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
//                             <textarea
//                                 rows={3}
//                                 value={form.description}
//                                 onChange={e => handleChange('description', e.target.value)}
//                                 placeholder="Brief product description..."
//                                 className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
//                                     errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300'
//                                 }`}
//                             />
//                             {errors.description && (
//                                 <p className="text-xs text-red-500 mt-1">{errors.description}</p>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
//                     <button
//                         onClick={onClose}
//                         className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleSubmit}
//                         className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-md"
//                     >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                         </svg>
//                         Add Product
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export const UserContext=createContext()

// export default function Products() {
//     const [products, setProducts] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [category, setCategory] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [page, setpage] = useState(1);
//     const [fil, setFie] = useState(6);

//     const productNav = [
//         { title: "All",       category: "" },
//         { title: "Pro",       category: "Electronics" },
//         { title: "Clothing",  category: "Clothing" },
//         { title: "Furniture", category: "Furniture" },
//         { title: "Grocery",   category: "Grocery" },
//         { title: "Shoes",     category: "Shoes" }
//     ];
//       const off=(page-1)*fil
                                 
//     useEffect(() => {
//         fetch('db.json')
//             .then(res => res.json())
//             .then(data => {
//                 setProducts(data.products);
//                 setFilteredData(data.products);
//             })
//             .catch(error => console.error('Error fetching data:', error));
//     }, []);
//     useEffect(() => {
//       setFilteredData(p=>p.slice(off,(off+fil)))
      
//     }, [off,fil,page])

//     useEffect(() => {
//         let filtered = products;

//         if (category) {
//             filtered = filtered.filter(product => product.category === category);
//         }

//         if (searchTerm) {
//             filtered = filtered.filter(product =>
//                 product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 product.category.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }
//         setFilteredData(filtered);
//     }, [category, searchTerm, products]);

//     const formatPrice = (price) => {
        
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             minimumFractionDigits: 1
//         }).format(price);
//     };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    

//     const handleAddProduct = (newProduct) => {
//         setProducts(prev => [...prev, newProduct]);
//     };

//     return (
//         <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">

//             {/* {showModal && (
//                 <AddProductModal
//                     onClose={() => setShowModal(false)}
//                     onAdd={handleAddProduct}

//                 />
//             )} */}

//             <div className="max-w-7xl mx-auto">

//                 <div className="relative mb-12">
//                     <div className="absolute top-0 right-0">
//                         {/* <button
//                             onClick={() => setShowModal(true)}
//                             className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-600 transition-colors shadow-md"
//                         >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                             </svg>
//                             Add More Products
//                         </button> */}

//                         <Link state={{id2:page}} to='/cart'>My Cart</Link>
//                     </div>
//                     <h1 className="text-4xl font-bold text-gray-90 mb-4">Products</h1>
//                     </div>


//                 <div className="mb-12 flex">
//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-4 max-w-4xl">
//                         {productNav.map((item, index) => (
//                             <button
//                                 key={index}
//                                 onClick={() => setCategory(item.category)}
//                                 className={`p-4 rounded-xl font-medium transition-all duration-200 shadow-sm border-2 ${
//                                     category === item.category
//                                         ? 'bg-blue-500 text-white border-blue-500 shadow-blue-200'
//                                         : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
//                                 }`}
//                             >
//                                 {item.title}
//                             </button>
//                         ))}
//                     </div>
//                     <span className="relative max-w-xxl">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                             </svg>
//                         </div>
//                         <input
//                             type="text"
//                             placeholder="Search products, brands, or categories..."
//                             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </span>
//                 </div>

//                 {/* <UserContext.Provider></UserContext.Provider> */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {products.map((product) => (
//                         <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
//                             <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
//                                 <img
//                                     src={product.image}
//                                     alt={product.name}
//                                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                                 />
//                             </div>

//                             <div className="p-6">
//                                 <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
//                                     {product.category}
//                                 </span>
//                                 <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
//                                     {product.name}
//                                 </h3>
//                                 <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
//                                 <div className="flex items-center justify-between mb-4">
//                                     <span className="text-2xl font-bold text-gray-900">
//                                         {formatPrice(product.price)}
//                                     </span>
//                                 </div>
//                                 <div className='float-rigth mr-14 '><button className='bg-blue-800 rounded' onClick={setpage(product)}>Add to Cart</button></div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//                 <div>
//                     <button onClick={setpage(p=>p-1)}>{`<`}</button>
//                     <p className=''>{page}</p>
//                     <button onClick={setpage(p=>p+1)}>{`>`}</button>
//                 </div>

//                 {filteredData.length === 0 && (
//                     <div className="text-center py-24">
//                         <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
//                             <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                             </svg>
//                         </div>
//                         <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
//                         <p className="text-gray-600 mb-8">Try adjusting your search or category filter</p>
//                         <button
//                             onClick={() => {
//                                 setSearchTerm('');
//                                 setCategory('');
//                             }}
//                             className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
//                         >
//                             Clear Filters
//                         </button>
//                     </div>
//                 )}

//             </div>
//         </div>
//     );
// }