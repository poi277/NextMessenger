// hooks/useCreateProduct.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { CreateProductAPI } from '@/lib/ProductAPI';

export default function useCreateProduct() {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const router = useRouter();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // 이미지 미리보기
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('price', price);
        images.forEach(image => {
            formData.append('images', image);
        });
        const res = await CreateProductAPI(formData);
        if(res.success)
        {
            alert('상품이 등록되었습니다!');
            router.push('/store');
        }
        else{
            alert('상품 등록에 실패했습니다.');
        }
    };

    const handleCancel = () => {
        setProductName('');
        setPrice('');
        setImages([]);
        setImagePreviews([]);
    };

    return {
        productName,
        setProductName,
        price,
        setPrice,
        images,
        imagePreviews,
        handleImageChange,
        removeImage,
        handleSubmit,
        handleCancel,
    };
}