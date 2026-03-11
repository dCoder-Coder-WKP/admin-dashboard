'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Save, X } from 'lucide-react';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';
import toast from 'react-hot-toast';

interface SiteConfigEditorProps {
  config: SiteConfigItem[];
}

type InputKind = 'text' | 'textarea' | 'image' | 'url' | 'time' | 'number' | 'boolean';

interface SiteConfigItem {
  id: string;
  key: string;
  value: string;
  description?: string;
}

interface ConfigGroup {
  title: string;
  description: string;
  keys: string[];
}

export default function SiteConfigEditor({ config }: SiteConfigEditorProps) {
  const [editingConfig, setEditingConfig] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    config.forEach(item => {
      initial[item.key] = item.value;
    });
    return initial;
  });

  const [hasChanges, setHasChanges] = useState(false);

  const configGroups: ConfigGroup[] = [
    {
      title: 'Hero Section',
      description: 'Main hero section content',
      keys: ['hero_title', 'hero_subtitle', 'hero_cta_text', 'hero_cta_link', 'hero_bg_url']
    },
    {
      title: 'About Information',
      description: 'About us and story content',
      keys: ['about_title', 'about_content', 'about_image_url']
    },
    {
      title: 'Contact Details',
      description: 'Contact information and location',
      keys: ['phone_number', 'whatsapp_number', 'email_address', 'address_line1', 'address_line2', 'google_maps_link']
    },
    {
      title: 'Operating Hours',
      description: 'Store opening and closing times',
      keys: [
        'monday_open', 'monday_close',
        'tuesday_open', 'tuesday_close',
        'wednesday_open', 'wednesday_close',
        'thursday_open', 'thursday_close',
        'friday_open', 'friday_close',
        'saturday_open', 'saturday_close',
        'sunday_open', 'sunday_close'
      ]
    },
    {
      title: 'Social Media',
      description: 'Social media profile links',
      keys: ['facebook_url', 'instagram_url', 'twitter_url', 'zomato_url', 'swiggy_url']
    },
    {
      title: 'SEO Settings',
      description: 'Search engine optimization',
      keys: ['meta_description', 'meta_keywords']
    },
    {
      title: 'Legal Information',
      description: 'Legal and compliance details',
      keys: ['fssai_license', 'privacy_policy', 'terms_of_service']
    },
    {
      title: 'Delivery Settings',
      description: 'Delivery related information',
      keys: ['delivery_info', 'delivery_radius', 'min_order_amount', 'is_open', 'announcement_bar']
    }
  ];

  const getConfigItem = (key: string) => {
    return config.find(item => item.key === key);
  };

  const handleValueChange = (key: string, value: string) => {
    setEditingConfig(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const supabase = createSupabaseBrowser();
    const promises = Object.entries(editingConfig).map(([key, value]) => {
      return supabase
        .from('site_config')
        .update({ value })
        .eq('key', key);
    });

    try {
      await Promise.all(promises);
      toast.success('Configuration saved successfully!');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save configuration');
      console.error(error);
    }
  };

  const handleReset = () => {
    const reset: Record<string, string> = {};
    config.forEach(item => {
      reset[item.key] = item.value;
    });
    setEditingConfig(reset);
    setHasChanges(false);
  };

  const getInputKind = (key: string): InputKind => {
    if (key.includes('image') || key.endsWith('_bg_url')) return 'image';
    if (key.includes('url')) return 'url';
    if (key.includes('open') || key.includes('close')) return 'time';
    if (key.startsWith('min_') || key.endsWith('_amount') || key.endsWith('_radius')) return 'number';
    if (key.startsWith('is_')) return 'boolean';
    if (key.includes('description') || key.includes('content')) return 'textarea';
    return 'text';
  };

  const renderInput = (key: string) => {
    const value = editingConfig[key] || '';
    const inputKind = getInputKind(key);
    
    switch (inputKind) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleValueChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-[#E5E5E0] rounded focus:outline-none focus:ring-2 focus:ring-[#E8540A] focus:border-transparent"
            rows={4}
          />
        );
      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={value}
              onChange={(e) => handleValueChange(key, e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-[#E5E5E0] rounded focus:outline-none focus:ring-2 focus:ring-[#E8540A] focus:border-transparent"
            />
            {value && (
              <div className="relative h-32 w-full">
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded border border-[#E5E5E0] object-cover"
                />
              </div>
            )}
          </div>
        );
      case 'time':
        return (
          <input
            type="time"
            value={value}
            onChange={(e) => handleValueChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-[#E5E5E0] rounded focus:outline-none focus:ring-2 focus:ring-[#E8540A] focus:border-transparent"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleValueChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-[#E5E5E0] rounded focus:outline-none focus:ring-2 focus:ring-[#E8540A] focus:border-transparent"
          />
        );
      case 'boolean':
        return (
          <select
            value={value}
            onChange={(e) => handleValueChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-[#E5E5E0] rounded focus:outline-none focus:ring-2 focus:ring-[#E8540A] focus:border-transparent"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleValueChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-[#E5E5E0] rounded focus:outline-none focus:ring-2 focus:ring-[#E8540A] focus:border-transparent"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with save/reset buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Site Configuration</h3>
          <p className="text-sm text-[#8C7E6A]">Manage all website settings and content</p>
        </div>
        {hasChanges && (
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-[#8C7E6A] border border-[#E5E5E0] rounded hover:bg-gray-50 transition-colors"
            >
              <X size={16} />
              Reset
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-[#E8540A] text-white rounded hover:bg-[#c94607] transition-colors"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Configuration Groups */}
      {configGroups.map((group) => (
        <div key={group.title} className="bg-white rounded border border-[#E5E5E0] p-6">
          <h4 className="font-semibold text-lg mb-2">{group.title}</h4>
          <p className="text-sm text-[#8C7E6A] mb-4">{group.description}</p>
          
          <div className="space-y-4">
            {group.keys.map((key) => {
              const item = getConfigItem(key);
              if (!item) return null;
              
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-[#1A1712] mb-1">
                    {item.key}
                  </label>
                  {renderInput(key)}
                  {item.description && (
                    <p className="text-xs text-[#8C7E6A] mt-1">{item.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
