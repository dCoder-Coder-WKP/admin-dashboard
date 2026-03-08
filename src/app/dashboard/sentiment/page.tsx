"use client";

import React, { useState } from "react";
import { MessageSquare, Smile, Frown, Meh, TrendingUp } from "lucide-react";

const mockFeedback = [
  { id: 1, user: "Aldona Villa 4", text: "The Chorizo pizza was incredible, but delivery was 5 mins late.", sentiment: "positive", score: 0.8 },
  { id: 2, user: "Local Resident", text: "Always fresh. Love the new silent bikes!", sentiment: "positive", score: 0.95 },
  { id: 3, user: "Villa Owner", text: "Menu needs more vegan options for the summer.", sentiment: "neutral", score: 0.5 },
  { id: 4, user: "Visitor", text: "A bit expensive compared to the city.", sentiment: "negative", score: 0.3 },
];

export default function SentimentPage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <TrendingUp className="text-blue-500 w-8 h-8" />
          AI Sentiment Engine
        </h1>
        <p className="text-gray-500 mt-2">
          Real-time analysis of customer feedback from WhatsApp and Google Reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm font-medium">Customer Satisfaction</span>
            <Smile className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">92%</div>
          <div className="text-green-500 text-xs mt-1">+4% from last week</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm font-medium">Neutral Feedback</span>
            <Meh className="text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">5%</div>
          <div className="text-yellow-500 text-xs mt-1">-1% from last week</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm font-medium">Conflict Zones</span>
            <Frown className="text-red-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">3%</div>
          <div className="text-red-500 text-xs mt-1">Requires attention</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold">Feedback Stream</h2>
          <div className="flex gap-2">
            {["all", "positive", "neutral", "negative"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase transition-colors ${
                  filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {mockFeedback.filter(f => filter === "all" || f.sentiment === filter).map((item) => (
            <div key={item.id} className="p-6 flex gap-4 hover:bg-gray-50 transition-colors">
              <div className={`p-3 rounded-full h-fit ${
                item.sentiment === 'positive' ? 'bg-green-100 text-green-600' :
                item.sentiment === 'negative' ? 'bg-red-100 text-red-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                <MessageSquare size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-900">{item.user}</h4>
                  <span className="text-xs text-gray-400">AI Score: {(item.score * 10).toFixed(1)}/10</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                <div className="mt-3 flex gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tagged: </span>
                  {item.text.includes("Chorizo") && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-medium">PRODUCT</span>}
                  {item.text.includes("delivery") && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-medium">LOGISTICS</span>}
                  {item.text.includes("vegan") && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-medium">REQUEST</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
