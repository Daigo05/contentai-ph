import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function InputForm({ onGenerate, isLoading }) {
  const [topic, setTopic] = useState('');
  const [location, setLocation] = useState('');
  const [bestProduct, setBestProduct] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [videoType, setVideoType] = useState('Business Ad');
  const [language, setLanguage] = useState('Taglish');

  const platforms = ['TikTok', 'Facebook Reels', 'YouTube Shorts', 'Instagram Reels'];
  const videoTypes = ['Business Ad', 'Gaming Clip', 'Vlog', 'Product Review', 'Tutorial'];
  const languages = ['Taglish', 'English', 'Bisaya'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({ topic, location, bestProduct, platform, videoType, language });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brand-card p-6 md:p-8 rounded-2xl shadow-xl space-y-6 w-full max-w-2xl mx-auto border border-brand-purple/20">
      
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-300">
          What is your topic or business?
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Milk tea shop in Davao"
          className="w-full px-4 py-3 bg-brand-dark rounded-xl border border-brand-purple/30 focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-colors text-white placeholder-gray-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-300">
          Your location <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Davao City, Cebu, Manila..."
          className="w-full px-4 py-3 bg-brand-dark rounded-xl border border-brand-purple/30 focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-colors text-white placeholder-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-300">
          Your best selling product or service <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={bestProduct}
          onChange={(e) => setBestProduct(e.target.value)}
          placeholder="e.g. Brown sugar milk tea, gaming chair, custom hoodies..."
          className="w-full px-4 py-3 bg-brand-dark rounded-xl border border-brand-purple/30 focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-colors text-white placeholder-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-4 py-3 bg-brand-dark rounded-xl border border-brand-purple/30 focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-colors text-white"
          >
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">Video Type</label>
          <select
            value={videoType}
            onChange={(e) => setVideoType(e.target.value)}
            className="w-full px-4 py-3 bg-brand-dark rounded-xl border border-brand-purple/30 focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-colors text-white"
          >
            {videoTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 bg-brand-dark rounded-xl border border-brand-purple/30 focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-colors text-white"
          >
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className="w-full py-4 bg-gradient-to-r from-brand-purple to-brand-violet hover:from-brand-violet hover:to-brand-purple text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
      >
        <Sparkles className="w-5 h-5" />
        Generate Script ✨
      </button>

    </form>
  );
}
