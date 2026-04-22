import React, { useState } from 'react';
import { Copy, CheckCircle2, RotateCcw } from 'lucide-react';

function Section({ title, text, emoji }) {
  return (
    <div className="bg-brand-dark p-4 rounded-xl border border-brand-purple/20">
      <h3 className="text-brand-violet font-bold mb-2 flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h3>
      <p className="text-gray-300 whitespace-pre-wrap">{text}</p>
    </div>
  );
}

export default function OutputCard({ content, onRegenerate }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const fullText = `
[HOOK]
${content.hook}

[SCRIPT BODY]
${content.script}

[CALL TO ACTION]
${content.cta}

[CAPTION]
${content.caption}

[HASHTAGS]
${content.hashtags}

[BEST TIME TO POST]
${content.bestTime}
    `.trim();

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
    } catch {
      // Fallback for HTTP or unsupported browsers
      const textarea = document.createElement('textarea');
      textarea.value = fullText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-brand-card p-6 md:p-8 rounded-2xl shadow-xl space-y-6 w-full max-w-2xl mx-auto border border-brand-purple/30 animate-fade-in mt-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-purple/20 pb-4">
        <h2 className="text-2xl font-extrabold text-white">Your Content Package</h2>
        <div className="flex gap-3">
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-4 py-2 bg-brand-dark hover:bg-brand-violet/15 text-brand-violet rounded-lg font-medium transition-colors border border-brand-violet/40 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Regenerate
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-brand-violet hover:bg-brand-accent-soft text-white rounded-lg font-medium transition-colors text-sm shadow-md shadow-brand-violet/30"
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy All'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <Section title="Hook (First 3s)" text={content.hook} emoji="🎣" />
        <Section title="Script Body" text={content.script} emoji="📝" />
        <Section title="Call to Action" text={content.cta} emoji="📢" />
        <Section title="Caption" text={content.caption} emoji="💬" />
        <Section title="Hashtags" text={content.hashtags} emoji="#️⃣" />
        <Section title="Best Time to Post" text={content.bestTime} emoji="🕐" />
      </div>

    </div>
  );
}
