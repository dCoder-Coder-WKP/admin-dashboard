'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pizzaSchema, PizzaFormData } from '@/lib/validations';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function PizzaForm({ categories, toppings, onSubmitAction }: { categories: any[], toppings: any[], onSubmitAction: (data: PizzaFormData) => Promise<void> }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PizzaFormData>({
    resolver: zodResolver(pizzaSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: categories?.[0]?.id || '',
      price_small: 149,
      price_medium: 199,
      price_large: 249,
      is_bestseller: false,
      is_spicy: false,
      is_active: true,
      sort_order: 0,
      toppings: [],
      image_url: ''
    }
  });

  const nameValue = watch('name');
  const imageUrlValue = watch('image_url');
  const slug = nameValue.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const onSubmit = async (data: PizzaFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmitAction(data);
      toast.success('Pizza saved successfully');
      router.push('/dashboard/pizzas');
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save pizza');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group toppings by category for display
  const groupedToppings = toppings.reduce((acc, t) => {
    acc[t.category] = acc[t.category] || [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<string, any[]>);

  const selectedToppings = watch('toppings') || [];

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8 bg-white p-6 border border-[#E5E5E0] shadow-sm rounded max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input {...register('name')} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Auto-generated Slug</label>
          <input readOnly value={slug} className="w-full p-2 border border-[#E5E5E0] bg-gray-50 text-gray-500 rounded outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea {...register('description')} rows={3} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none" />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
           <div className="flex-1">
             <label className="block text-sm font-medium mb-1">Image URL</label>
             <input {...register('image_url')} placeholder="https://..." className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none" />
             <p className="text-xs text-[#8C7E6A] mt-1">Direct link to an image. Leave empty to use generic mesh fallback.</p>
           </div>
           {imageUrlValue && (
              <div className="w-32 h-32 shrink-0 rounded border border-[#E5E5E0] overflow-hidden bg-gray-50 flex items-center justify-center relative">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={imageUrlValue} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
           )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select {...register('category_id')} className="w-full p-2 border border-[#E5E5E0] bg-white rounded focus:border-[#E8540A] outline-none">
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>}
        </div>

        <div>
           <label className="block text-sm font-medium mb-1">Sort Order</label>
           <input type="number" {...register('sort_order', { valueAsNumber: true })} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Small Price (₹)</label>
          <input type="number" {...register('price_small', { valueAsNumber: true })} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Medium Price (₹)</label>
          <input type="number" {...register('price_medium', { valueAsNumber: true })} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Large Price (₹)</label>
          <input type="number" {...register('price_large', { valueAsNumber: true })} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none" />
        </div>
      </div>

      <div className="md:col-span-2 space-y-4">
        <label className="block text-sm font-medium mb-1 border-b pb-2">Toppings</label>
        {Object.entries(groupedToppings).map(([cat, tops]) => (
           <div key={cat} className="mb-4">
             <h4 className="font-semibold text-sm mb-2 text-[#8C7E6A]">{cat}</h4>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(tops as any[]).map((t: any) => (
                  <label key={t.id} className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      value={t.id}
                      checked={selectedToppings.includes(t.id)}
                      onChange={(e) => {
                         const current = new Set(selectedToppings);
                         if (e.target.checked) current.add(t.id);
                         else current.delete(t.id);
                         setValue('toppings', Array.from(current), { shouldValidate: true });
                      }}
                      className="accent-[#E8540A]" 
                    />
                    {t.name}
                  </label>
                ))}
             </div>
           </div>
        ))}
        {errors.toppings && <p className="text-red-500 text-xs mt-1">{errors.toppings.message}</p>}
      </div>

      <div className="flex gap-6 border-t pt-6">
         <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" {...register('is_active')} className="w-4 h-4 accent-[#E8540A]" />
            Active (visible on menu)
         </label>
         <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" {...register('is_bestseller')} className="w-4 h-4 accent-[#E8540A]" />
            Best Seller
         </label>
         <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" {...register('is_spicy')} className="w-4 h-4 accent-[#E8540A]" />
            Spicy
         </label>
      </div>

      <div className="flex justify-end gap-4 pt-4">
         <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-[#E5E5E0] text-[#8C7E6A] rounded hover:bg-gray-50 transition-colors">Cancel</button>
         <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#E8540A] text-white rounded hover:bg-[#c94607] transition-colors disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Pizza'}
         </button>
      </div>
    </form>
  );
}
