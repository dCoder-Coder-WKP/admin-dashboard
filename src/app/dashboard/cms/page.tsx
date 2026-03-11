"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Save,
  Download,
  Power,
  RefreshCw,
  Settings,
  Pizza,
  Utensils,
  Tag,
  Layers,
  Database
} from "lucide-react";
import SiteConfigEditor from "../content/SiteConfigEditor";
import SectionTable from "@/components/ui/SectionTable";
import TagPill from "@/components/ui/TagPill";
import RowActions from "@/components/ui/RowActions";
import BackupButton from "@/components/ui/BackupButton";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

interface Topping {
  id: string;
  name: string;
  description?: string;
  price: number;
  dietary: "veg" | "non-veg";
  sort_order: number;
  is_active: boolean;
  image_url?: string;
}

interface Size {
  id: string;
  name: string;
  description?: string;
  diameter_cm: number;
  slices: number;
  sort_order: number;
  is_active: boolean;
}

interface Pizza {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  dietary: "veg" | "non-veg";
  is_sold_out: boolean;
  is_bestseller: boolean;
  is_spicy: boolean;
  highlight?: string;
  region?: string;
  sort_order: number;
  is_active: boolean;
  image_url?: string;
}

interface PizzaPrice {
  pizza_id: string;
  size_id: string;
  price: number;
}

interface PizzaTopping {
  pizza_id: string;
  topping_id: string;
}

interface Extra {
  id: string;
  name: string;
  description?: string;
  price: number;
  dietary: "veg" | "non-veg";
  category_id?: string;
  is_sold_out: boolean;
  is_bestseller: boolean;
  sort_order: number;
  is_active: boolean;
  image_url?: string;
}

interface SiteConfigItem {
  id: string;
  key: string;
  value: string;
  type: "text" | "textarea" | "image" | "url" | "time" | "number" | "boolean" | "json";
  description?: string;
  is_public: boolean;
}

type ModalType = "pizza" | "topping" | "size" | "extra" | "category";

interface PizzaFormState extends Pizza {
  prices: Record<string, string>;
  toppingIds: string[];
}

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<
    "pizzas" | "toppings" | "sizes" | "extras" | "categories" | "config" | "controls" | "backup"
  >("pizzas");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [pizzaPrices, setPizzaPrices] = useState<PizzaPrice[]>([]);
  const [pizzaToppings, setPizzaToppings] = useState<any[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfigItem[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [
        categoriesRes,
        toppingsRes,
        sizesRes,
        pizzasRes,
        pizzaPricesRes,
        pizzaToppingsRes,
        extrasRes,
        siteConfigRes
      ] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("toppings").select("*").order("sort_order"),
        supabase.from("sizes").select("*").order("sort_order"),
        supabase.from("pizzas").select("*").order("sort_order"),
        supabase.from("pizza_prices").select("*"),
        supabase.from("pizza_toppings").select("*"),
        supabase.from("extras").select("*").order("sort_order"),
        supabase.from("site_config").select("*").order("key")
      ]);

      setCategories(categoriesRes.data || []);
      setToppings(toppingsRes.data || []);
      setSizes(sizesRes.data || []);
      setPizzas(pizzasRes.data || []);
      setPizzaPrices(pizzaPricesRes.data || []);
      setPizzaToppings(pizzaToppingsRes.data || []);
      setExtras(extrasRes.data || []);
      setSiteConfig(siteConfigRes.data || []);
    } catch (error) {
      console.error(error);
      setMessage("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: string, payload?: any) => {
    setEditingItem(payload || {});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const deleteRow = async (table: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      setMessage("Item deleted");
      await fetchAll();
    } catch (err) {
      console.error(err);
      setMessage("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // Site controls
  const fetchData = async () => {
    await fetchAll();
  };

  const handleSave = async (tab: string, item: any) => {
    setLoading(true);
    try {
      let table = '';
      let data: any = {};
      
      switch (tab) {
        case 'pizza':
          table = 'pizzas';
          data = {
            name: item.name,
            description: item.description,
            category_id: item.category_id,
            sort_order: item.sort_order || 0,
            is_active: item.is_active,
            image_url: item.image_url
          };
          break;
        case 'topping':
          table = 'toppings';
          data = {
            name: item.name,
            description: item.description,
            price: item.price,
            dietary: item.dietary,
            sort_order: item.sort_order || 0,
            is_active: item.is_active,
            image_url: item.image_url
          };
          break;
        case 'size':
          table = 'sizes';
          data = {
            name: item.name,
            diameter_cm: item.diameter_cm,
            slices: item.slices,
            sort_order: item.sort_order || 0,
            is_active: item.is_active
          };
          break;
        case 'extra':
          table = 'extras';
          data = {
            name: item.name,
            description: item.description,
            category: item.category,
            price: item.price,
            sort_order: item.sort_order || 0,
            is_active: item.is_active,
            is_sold_out: item.is_sold_out || false,
            image_url: item.image_url
          };
          break;
        case 'category':
          table = 'categories';
          data = {
            name: item.name,
            description: item.description,
            icon: item.icon,
            sort_order: item.sort_order || 0,
            is_active: item.is_active
          };
          break;
        default:
          return;
      }
      
      if (item.id) {
        const { error } = await supabase.from(table).update(data).eq('id', item.id);
        if (error) throw error;
        setMessage('Item updated successfully');
      } else {
        const { error } = await supabase.from(table).insert(data);
        if (error) throw error;
        setMessage('Item created successfully');
      }
      
      await fetchAll();
      setModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error(error);
      setMessage('Error saving item');
    } finally {
      setLoading(false);
    }
  };

  const toggleSiteStatus = async () => {
    const isOpen = siteConfig.find(c => c.key === 'is_open')?.value === 'true';
    await supabase.from('site_config').update({ value: (!isOpen).toString() }).eq('key', 'is_open');
    await fetchData();
    setMessage(`Site ${!isOpen ? 'opened' : 'closed'} for orders`);
  };

  const toggleMaintenanceMode = async () => {
    const isMaintenance = siteConfig.find(c => c.key === 'site_maintenance_mode')?.value === 'true';
    await supabase.from('site_config').update({ value: (!isMaintenance).toString() }).eq('key', 'site_maintenance_mode');
    await fetchData();
    setMessage(`Maintenance mode ${!isMaintenance ? 'enabled' : 'disabled'}`);
  };

  // Backup/restore
  const createBackup = async (type: 'full' | 'content' | 'menu') => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${type}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        setMessage('Backup downloaded successfully');
      }
    } catch (error) {
      setMessage('Error creating backup');
    } finally {
      setLoading(false);
    }
  };

  const resetDatabase = async () => {
    if (!confirm('⚠️ This will delete all data and reset to defaults. Are you absolutely sure?')) return;
    if (!confirm('This action cannot be undone. Type "RESET" to confirm:')) return;
    
    setLoading(true);
    try {
      await fetch('/api/admin/reset', { method: 'POST' });
      await fetchData();
      setMessage('Database reset to defaults');
    } catch (err) {
      console.error(err);
      setMessage('Error resetting database');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "pizzas", label: "Pizzas", icon: Pizza },
    { id: "toppings", label: "Toppings", icon: Utensils },
    { id: "sizes", label: "Sizes", icon: Layers },
    { id: "extras", label: "Extras", icon: Package },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "config", label: "Site Config", icon: Settings },
    { id: "controls", label: "Site Controls", icon: Power },
    { id: "backup", label: "Backup / Restore", icon: Database }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CMS Management</h1>
        <p className="text-gray-600">Manage your entire website content from here</p>
      </div>

      {message && (
        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Pizzas Tab */}
        {activeTab === "pizzas" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Pizzas</h2>
              <button
                onClick={() => openModal("pizza")}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                <Plus size={16} />
                New Pizza
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Dietary</th>
                    <th className="text-left py-3 px-4">Price Range</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pizzas.map((pizza) => {
                    const priceEntries = pizzaPrices.filter((p) => p.pizza_id === pizza.id);
                    const priceLabel = priceEntries.length
                      ? `₹${Math.min(...priceEntries.map((p) => p.price))} - ₹${Math.max(
                          ...priceEntries.map((p) => p.price)
                        )}`
                      : "No pricing";

                    return (
                      <tr key={pizza.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{pizza.name}</div>
                            {pizza.is_bestseller && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Bestseller</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">{categories.find(c => c.id === pizza.category_id)?.name}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded ${
                            pizza.dietary === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {pizza.dietary}
                          </span>
                        </td>
                        <td className="py-3 px-4">{priceLabel}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {pizza.is_active && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                            )}
                            {pizza.is_sold_out && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Sold Out</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal("pizza", pizza)}
                              className="rounded p-1 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteRow('pizzas', pizza.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "toppings" && (
          <SectionTable
            title="Toppings"
            description="Manage reusable toppings that pizzas can inherit."
            columns={["Name", "Dietary", "Price", "Status", "Actions"]}
            ctaLabel="New Topping"
            onCreate={() =>
              openModal("topping", {
                id: "",
                name: "",
                description: "",
                price: 0,
                dietary: "veg",
                sort_order: toppings.length + 1,
                is_active: true,
                image_url: ""
              })
            }
          >
            {toppings.map((topping) => (
              <tr key={topping.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{topping.name}</div>
                  <p className="text-sm text-gray-500">{topping.description}</p>
                </td>
                <td className="py-3 px-4">
                  <TagPill
                    tone={topping.dietary === "veg" ? "green" : "red"}
                    label={topping.dietary === "veg" ? "Vegetarian" : "Non-veg"}
                  />
                </td>
                <td className="py-3 px-4">₹{topping.price.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <TagPill tone={topping.is_active ? "green" : "gray"} label={topping.is_active ? "Active" : "Hidden"} />
                </td>
                <td className="py-3 px-4">
                  <RowActions
                    onEdit={() => openModal('topping', topping)}
                    onDelete={() => deleteRow('toppings', topping.id)}
                  />
                </td>
              </tr>
            ))}
          </SectionTable>
        )}

        {activeTab === "sizes" && (
          <SectionTable
            title="Sizes"
            description="Diameter, slices, and status for each pizza size."
            columns={["Name", "Diameter", "Slices", "Status", "Actions"]}
            ctaLabel="New Size"
            onCreate={() =>
              openModal("size", {
                id: "",
                name: "",
                description: "",
                diameter_cm: 0,
                slices: 0,
                sort_order: sizes.length + 1,
                is_active: true
              })
            }
          >
            {sizes.map((size) => (
              <tr key={size.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{size.name}</td>
                <td className="py-3 px-4">{size.diameter_cm} cm</td>
                <td className="py-3 px-4">{size.slices}</td>
                <td className="py-3 px-4">
                  <TagPill tone={size.is_active ? "green" : "gray"} label={size.is_active ? "Active" : "Hidden"} />
                </td>
                <td className="py-3 px-4">
                  <RowActions
                    onEdit={() => openModal('size', size)}
                    onDelete={() => deleteRow('sizes', size.id)}
                  />
                </td>
              </tr>
            ))}
          </SectionTable>
        )}

        {activeTab === "extras" && (
          <SectionTable
            title="Extras & Add-ons"
            description="Garlic bread, beverages, desserts, and more."
            columns={["Name", "Category", "Price", "Status", "Actions"]}
            ctaLabel="New Extra"
            onCreate={() =>
              openModal("extra", {
                id: "",
                name: "",
                description: "",
                price: 0,
                dietary: "veg",
                category_id: categories.find((c) => c.name === "Sides")?.id ?? "",
                sort_order: extras.length + 1,
                is_sold_out: false,
                is_bestseller: false,
                is_active: true,
                image_url: ""
              })
            }
          >
            {extras.map((extra) => (
              <tr key={extra.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{extra.name}</div>
                  <p className="text-sm text-gray-500">{extra.description}</p>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {categories.find((c) => c.id === extra.category_id)?.name || "—"}
                </td>
                <td className="py-3 px-4">₹{extra.price.toFixed(2)}</td>
                <td className="py-3 px-4 flex gap-2">
                  <TagPill tone={extra.is_active ? "green" : "gray"} label={extra.is_active ? "Active" : "Hidden"} />
                  {extra.is_sold_out && <TagPill tone="red" label="Sold out" />}
                </td>
                <td className="py-3 px-4">
                  <RowActions
                    onEdit={() => openModal('extra', extra)}
                    onDelete={() => deleteRow('extras', extra.id)}
                  />
                </td>
              </tr>
            ))}
          </SectionTable>
        )}

        {activeTab === "categories" && (
          <SectionTable
            title="Categories"
            description="Organize pizzas & extras for structured menu sections."
            columns={["Name", "Description", "Icon", "Status", "Actions"]}
            ctaLabel="New Category"
            onCreate={() =>
              openModal("category", {
                id: "",
                name: "",
                description: "",
                icon: "",
                sort_order: categories.length + 1,
                is_active: true
              })
            }
          >
            {categories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{category.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{category.description}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{category.icon || "—"}</td>
                <td className="py-3 px-4">
                  <TagPill tone={category.is_active ? "green" : "gray"} label={category.is_active ? "Active" : "Hidden"} />
                </td>
                <td className="py-3 px-4">
                  <RowActions
                    onEdit={() => openModal('category', category)}
                    onDelete={() => deleteRow('categories', category.id)}
                  />
                </td>
              </tr>
            ))}
          </SectionTable>
        )}

        {activeTab === "config" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Site Configuration</h2>
            <SiteConfigEditor config={siteConfig} />
          </div>
        )}

        {/* Site Controls Tab */}
        {activeTab === "controls" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Site Controls</h2>
            
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-4">Order Status</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Accepting Orders</p>
                    <p className="text-sm text-gray-600">
                      {siteConfig.find((c) => c.key === 'is_open')?.value === 'true'
                        ? 'Site is open for orders'
                        : 'Site is closed for orders'}
                    </p>
                  </div>
                  <button
                    onClick={toggleSiteStatus}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      siteConfig.find((c) => c.key === 'is_open')?.value === 'true'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <Power size={16} />
                    {siteConfig.find((c) => c.key === 'is_open')?.value === 'true' ? 'Open' : 'Closed'}
                  </button>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-4">Maintenance Mode</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Site Maintenance</p>
                    <p className="text-sm text-gray-600">
                      {siteConfig.find((c) => c.key === 'site_maintenance_mode')?.value === 'true'
                        ? 'Site is under maintenance'
                        : 'Site is live'}
                    </p>
                  </div>
                  <button
                    onClick={toggleMaintenanceMode}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      siteConfig.find((c) => c.key === 'site_maintenance_mode')?.value === 'true'
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <Settings size={16} />
                    {siteConfig.find((c) => c.key === 'site_maintenance_mode')?.value === 'true'
                      ? 'Maintenance ON'
                      : 'Maintenance OFF'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backup/Restore Tab */}
        {activeTab === "backup" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Backup & Restore</h2>
            
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-4">Create Backup</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <BackupButton label="Full Backup" description="All data and settings" onClick={() => createBackup('full')} loading={loading} />
                  
                  <BackupButton label="Content Backup" description="Pages, media, and content" onClick={() => createBackup('content')} loading={loading} />
                  
                  <button
                    onClick={() => createBackup('menu')}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50"
                  >
                    <Download size={20} />
                    <div className="text-left">
                      <div className="font-medium">Menu Backup</div>
                      <div className="text-sm text-gray-600">Pizzas, prices, and items</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="border rounded-lg p-6 border-red-200 bg-red-50">
                <h3 className="font-medium mb-4 text-red-800">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-800">Reset Database</p>
                      <p className="text-sm text-red-600">Delete all data and restore to defaults</p>
                    </div>
                    <button
                      onClick={resetDatabase}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      <RefreshCw size={16} />
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem?.id ? `Edit ${activeTab}` : `Create ${activeTab}`}
            </h3>
            
            {/* Form fields would go here - simplified for now */}
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Name"
                value={editingItem?.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              {activeTab === 'toppings' && (
                <>
                  <input
                    type="number"
                    placeholder="Price"
                    value={editingItem?.price || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                  <select
                    value={editingItem?.dietary || 'veg'}
                    onChange={(e) => setEditingItem({ ...editingItem, dietary: e.target.value as 'veg' | 'non-veg' })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-vegetarian</option>
                  </select>
                </>
              )}
              {activeTab === 'sizes' && (
                <>
                  <input
                    type="number"
                    placeholder="Diameter (cm)"
                    value={editingItem?.diameter_cm || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, diameter_cm: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Slices"
                    value={editingItem?.slices || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, slices: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </>
              )}
              {activeTab === 'extras' && (
                <input
                  type="number"
                  placeholder="Price"
                  value={editingItem?.price || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(activeTab, editingItem)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
