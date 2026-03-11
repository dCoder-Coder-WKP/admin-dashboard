'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  Star, 
  Megaphone, 
  HelpCircle, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
// import ContentBlockForm from './forms/ContentBlockForm';
// import TestimonialForm from './forms/TestimonialForm';
// import GalleryForm from './forms/GalleryForm';
// import BannerForm from './forms/BannerForm';
// import FaqForm from './forms/FaqForm';
// import TeamMemberForm from './forms/TeamMemberForm';
import SiteConfigEditor from './SiteConfigEditor';

interface ContentManagementClientProps {
  siteConfig: SiteConfigItem[];
  contentBlocks: ContentBlock[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  banners: BannerItem[];
  faq: FAQItem[];
  teamMembers: TeamMember[];
}

interface SiteConfigItem {
  id: string;
  key: string;
  value: string;
  description?: string;
}

interface ContentBlock {
  id: string;
  title: string;
  content: string;
  type: string;
  slug: string;
  content_type: string;
  is_active: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  customer_name: string;
  content: string;
  testimonial_text: string;
  rating: number;
  customer_rating: number;
  is_active: boolean;
}

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description: string;
  is_active: boolean;
}

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  banner_type: string;
  link_url?: string;
  is_active: boolean;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  is_active: boolean;
}

type ContentType = 'site-config' | 'content-blocks' | 'testimonials' | 'gallery' | 'banners' | 'faq' | 'team';

type ContentEntity = ContentBlock | Testimonial | GalleryItem | BannerItem | FAQItem | TeamMember;

interface EditingState {
  type: ContentType;
  payload?: ContentEntity;
}

export default function ContentManagementClient({
  siteConfig,
  contentBlocks,
  testimonials,
  gallery,
  banners,
  faq,
  teamMembers
}: ContentManagementClientProps) {
  const [activeTab, setActiveTab] = useState<ContentType>('site-config');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingState, setEditingState] = useState<EditingState | null>(null);

  const tabs = [
    { id: 'site-config', label: 'Site Configuration', icon: Settings, count: siteConfig.length },
    { id: 'content-blocks', label: 'Content Blocks', icon: FileText, count: contentBlocks.length },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, count: testimonials.length },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, count: gallery.length },
    { id: 'banners', label: 'Banners', icon: Megaphone, count: banners.length },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, count: faq.length },
    { id: 'team', label: 'Team Members', icon: Users, count: teamMembers.length }
  ];

  const handleEdit = (item: ContentEntity, type: ContentType) => {
    setEditingState({ type, payload: item });
    setIsFormOpen(true);
  };

  const handleAdd = (type: ContentType) => {
    setEditingState({ type });
    setIsFormOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'site-config':
        return <SiteConfigEditor config={siteConfig} />;
      
      case 'content-blocks':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Content Blocks</h3>
              <button
                onClick={() => handleAdd('content-blocks')}
                className="flex items-center gap-2 px-4 py-2 bg-[#E8540A] text-white rounded hover:bg-[#c94607] transition-colors"
              >
                <Plus size={16} />
                Add Block
              </button>
            </div>
            <div className="bg-white rounded border border-[#E5E5E0] overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-[#E5E5E0]">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-[#8C7E6A] uppercase">Title</th>
                    <th className="text-left p-4 text-xs font-medium text-[#8C7E6A] uppercase">Slug</th>
                    <th className="text-left p-4 text-xs font-medium text-[#8C7E6A] uppercase">Type</th>
                    <th className="text-left p-4 text-xs font-medium text-[#8C7E6A] uppercase">Status</th>
                    <th className="text-left p-4 text-xs font-medium text-[#8C7E6A] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E0]">
                  {contentBlocks.map((block) => (
                    <tr key={block.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium">{block.title}</td>
                      <td className="p-4 text-[#8C7E6A] font-mono text-sm">{block.slug}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {block.content_type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          block.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {block.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(block, 'content-blocks')}
                            className="p-1 text-[#8C7E6A] hover:text-[#E8540A] transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button className="p-1 text-[#8C7E6A] hover:text-red-600 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Customer Testimonials</h3>
              <button
                onClick={() => handleAdd('testimonials')}
                className="flex items-center gap-2 px-4 py-2 bg-[#E8540A] text-white rounded hover:bg-[#c94607] transition-colors"
              >
                <Plus size={16} />
                Add Testimonial
              </button>
            </div>
            <div className="grid gap-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded border border-[#E5E5E0]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">{testimonial.customer_name}</h4>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < testimonial.customer_rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(testimonial, 'testimonials')}
                        className="p-1 text-[#8C7E6A] hover:text-[#E8540A] transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-[#8C7E6A] hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[#8C7E6A]">{testimonial.testimonial_text}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Photo Gallery</h3>
              <button
                onClick={() => handleAdd('gallery')}
                className="flex items-center gap-2 px-4 py-2 bg-[#E8540A] text-white rounded hover:bg-[#c94607] transition-colors"
              >
                <Plus size={16} />
                Add Photo
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="bg-white rounded border border-[#E5E5E0] overflow-hidden">
                  {item.image_url && (
                    <div className="relative w-full h-48">
                      <NextImage
                        src={item.image_url}
                        alt={item.title || 'Gallery image'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-[#8C7E6A] mb-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {item.category}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item, 'gallery')}
                          className="p-1 text-[#8C7E6A] hover:text-[#E8540A] transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button className="p-1 text-[#8C7E6A] hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'banners':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Promotional Banners</h3>
              <button
                onClick={() => handleAdd('banners')}
                className="flex items-center gap-2 px-4 py-2 bg-[#E8540A] text-white rounded hover:bg-[#c94607] transition-colors"
              >
                <Plus size={16} />
                Add Banner
              </button>
            </div>
            <div className="space-y-4">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white p-6 rounded border border-[#E5E5E0]">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{banner.title}</h4>
                      <p className="text-[#8C7E6A] mt-1">{banner.subtitle}</p>
                      <div className="flex gap-4 mt-4 text-sm">
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          Type: {banner.banner_type}
                        </span>
                        {banner.link_url && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            Links to: {banner.link_url}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(banner, 'banners')}
                        className="p-1 text-[#8C7E6A] hover:text-[#E8540A] transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-[#8C7E6A] hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
              <button
                onClick={() => handleAdd('faq')}
                className="flex items-center gap-2 px-4 py-2 bg-[#E8540A] text-white rounded hover:bg-[#c94607] transition-colors"
              >
                <Plus size={16} />
                Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {faq.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded border border-[#E5E5E0]">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.question}</h4>
                      <p className="text-[#8C7E6A] mt-2">{item.answer}</p>
                      <span className="inline-block mt-3 px-2 py-1 bg-gray-100 rounded text-xs">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(item, 'faq')}
                        className="p-1 text-[#8C7E6A] hover:text-[#E8540A] transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-[#8C7E6A] hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <button
                onClick={() => handleAdd('team')}
                className="flex items-center gap-2 px-4 py-2 bg-[#E8540A] text-white rounded hover:bg-[#c94607] transition-colors"
              >
                <Plus size={16} />
                Add Member
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded border border-[#E5E5E0] overflow-hidden">
                  {member.image_url && (
                    <div className="relative w-full h-48">
                      <NextImage
                        src={member.image_url}
                        alt={member.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-[#E8540A] mb-2">{member.role}</p>
                    <p className="text-sm text-[#8C7E6A]">{member.bio}</p>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(member, 'team')}
                        className="p-1 text-[#8C7E6A] hover:text-[#E8540A] transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-[#8C7E6A] hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderForm = () => {
    if (!isFormOpen || !editingState) return null;

    switch (editingState.type) {
      case 'content-blocks':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold">Content Block Form</h3>
            <p className="text-gray-600">Form component not implemented yet</p>
          </div>
        );
      case 'testimonials':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold">Testimonial Form</h3>
            <p className="text-gray-600">Form component not implemented yet</p>
          </div>
        );
      case 'gallery':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold">Gallery Form</h3>
            <p className="text-gray-600">Form component not implemented yet</p>
          </div>
        );
      case 'banners':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold">Banner Form</h3>
            <p className="text-gray-600">Form component not implemented yet</p>
          </div>
        );
      case 'faq':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold">FAQ Form</h3>
            <p className="text-gray-600">Form component not implemented yet</p>
          </div>
        );
      case 'team':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold">Team Member Form</h3>
            <p className="text-gray-600">Form component not implemented yet</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-serif italic mb-6 text-[#E8540A]">Content Management</h1>
        
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ContentType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#E8540A] shadow-sm'
                    : 'text-[#8C7E6A] hover:text-[#1A1712]'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{tab.label}</span>
                {tab.count > 0 && (
                  <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Form Modal */}
      {isFormOpen && editingState && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            {renderForm()}
          </div>
        </div>
      )}
    </div>
  );
}
