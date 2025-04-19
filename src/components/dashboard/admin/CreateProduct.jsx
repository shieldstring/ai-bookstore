// import { useState } from 'react';
// import {  X } from 'lucide-react';
// import { useCreateProductMutation, useUploadProductImageMutation } from '../../../redux/slices/productsApiSlice';

// const CreateProduct = ({ onClose }) => {
//   const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
//   const [uploadImage, { isLoading: isUploading }] = useUploadProductImageMutation();

//   const [formData, setFormData] = useState({
//     title: '',
//     author: '',
//     price: '',
//     stock: '',
//     category: '',
//     description: '',
//     images: []
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     try {
//       const uploadPromises = files.map(file => {
//         const formData = new FormData();
//         formData.append('image', file);
//         return uploadImage(formData).unwrap();
//       });
      
//       const results = await Promise.all(uploadPromises);
//       const newImages = results.map(res => ({
//         name: res.originalname,
//         url: res.url
//       }));
      
//       setFormData(prev => ({ 
//         ...prev, 
//         images: [...prev.images, ...newImages] 
//       }));
//     } catch (error) {
//       console.error('Image upload failed:', error);
//     }
//   };

//   const removeImage = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await createProduct(formData).unwrap();
//       onClose();
//     } catch (error) {
//       console.error('Failed to create product:', error);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
//         <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//           <X className="h-6 w-6" />
//         </button>
//       </div>

//       <form onSubmit={handleSubmit}>
//         {/* Form fields remain the same as previous example */}
//         {/* ... */}

//         <div className="mt-8 flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isCreating}
//             className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 ${isCreating ? 'opacity-70 cursor-not-allowed' : ''}`}
//           >
//             {isCreating ? 'Creating...' : 'Create Product'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateProduct;