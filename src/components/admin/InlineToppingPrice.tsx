'use client';

import { useState, useRef } from 'react';
import { updateToppingPrice } from '@/app/dashboard/toppings/actions';
import toast from 'react-hot-toast';

export default function InlineToppingPrice({ toppingId, size, initialPrice }: { toppingId: string, size: 'small' | 'medium' | 'large', initialPrice: number }) {
  const [price, setPrice] = useState(initialPrice);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [originalPrice, setOriginalPrice] = useState(initialPrice);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = async () => {
    if (price === originalPrice) return;
    setStatus('saving');
    try {
      await updateToppingPrice(toppingId, size, price);
      setOriginalPrice(price);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1500);
    } catch {
      setPrice(originalPrice);
      setStatus('error');
      toast.error('Failed to update topping price');
      setTimeout(() => setStatus('idle'), 1500);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 w-full">
      {status === 'saved' && <span className="text-[#16A34A] text-[10px] font-medium absolute -ml-12">✓ Saved</span>}
      {status === 'error' && <span className="text-[#DC2626] text-[10px] font-medium absolute -ml-12">Failed</span>}
      {status === 'saving' && <span className="text-[#8C7E6A] text-[10px] italic absolute -ml-12">Saving...</span>}
      
      <div className="relative inline-block">
        <input
           ref={inputRef}
           type="number"
           min="0"
           value={price}
           onChange={(e) => setPrice(Number(e.target.value))}
           onBlur={handleBlur}
           className="w-[70px] pl-2 pr-2 py-1 text-sm border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none text-right"
           style={{ MozAppearance: 'textfield' }}
        />
        <style>{`
          input[type="number"]::-webkit-inner-spin-button, 
          input[type="number"]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
          }
        `}</style>
      </div>
    </div>
  );
}
