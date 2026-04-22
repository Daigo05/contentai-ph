import React, { useState } from 'react';
import InputForm from './components/InputForm';
import OutputCard from './components/OutputCard';
import LoadingSpinner from './components/LoadingSpinner';
import { generateContent } from './utils/geminiApi';
import { AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [lastRequest, setLastRequest] = useState(null);

  const handleGenerate = async (requestData) => {
    setIsLoading(true);
    setError(null);
    setContent(null);
    setLastRequest(requestData);

    try {
      const result = await generateContent(
        requestData.topic,
        requestData.platform,
        requestData.videoType,
        requestData.language,
        requestData.location,
        requestData.bestProduct,
        requestData.additionalInfo
      );
      setContent(result);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastRequest) {
      handleGenerate(lastRequest);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center py-12 px-4 sm:px-6">
      
      <div className="max-w-2xl w-full text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-brand-purple/20 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-brand-violet" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-brand-purple mb-4">
          ContentAI PH
        </h1>
        <p className="text-gray-400 text-lg">
          Your ultimate AI partner for creating high-converting social media content in seconds.
        </p>
      </div>

      <InputForm onGenerate={handleGenerate} isLoading={isLoading} />

      {error && (
        <div className="mt-8 p-4 bg-red-900/30 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 w-full max-w-2xl mx-auto animate-fade-in">
          <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mt-8 w-full max-w-2xl mx-auto">
          <LoadingSpinner />
        </div>
      )}

      {content && !isLoading && !error && (
        <OutputCard content={content} onRegenerate={handleRegenerate} />
      )}

    </div>
  );
}
