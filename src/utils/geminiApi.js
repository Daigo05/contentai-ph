export const generateContent = async (topic, platform, videoType, language, location, bestProduct, apiKey) => {
  if (!apiKey) {
    throw new Error('API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  const systemPrompt = `You are a top-tier Filipino social media content expert. Your goal is to generate highly engaging, ready-to-post content tailored to the requested platform, video type, and language.

Write like a real Filipino friend texting, not like a marketing agency. Use natural Taglish. Keep it short and imperfect. Avoid corporate words like premium, signature, and experience. Say things a real tita or college student would actually say out loud. If a location is given, mention it naturally somewhere in the script. If a best selling product is given, mention it specifically by name at least once. The call to action should mention the actual location if one was provided instead of saying Insert Location.

Please format your response strictly using the following EXACT headers so we can parse them. Do not add extra text outside these sections:

[HOOK]
(Write the hook here - first 3 seconds)

[SCRIPT]
(Write the main script body here)

[CTA]
(Write the Call to Action here)

[CAPTION]
(Write the caption here)

[HASHTAGS]
(Write exactly 10 relevant hashtags here)

[BEST_TIME]
(Provide the best time to post here)`;

  const locationLine = location?.trim() ? `\nLocation: ${location.trim()}` : '';
  const productLine = bestProduct?.trim() ? `\nBest selling product: ${bestProduct.trim()}` : '';

  const userPrompt = `Topic/Business: ${topic}${locationLine}${productLine}\nPlatform: ${platform}\nVideo Type: ${videoType}\nLanguage: ${language}\n\nPlease generate the content package.`;

  const combinedPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: combinedPrompt }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate content with Gemini API. Please check your API key and try again.');
    }

    const data = await response.json();

    // Defensive checks for unexpected API responses
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('The AI could not generate content for this input. Try rephrasing your topic.');
    }

    const candidate = data.candidates[0];

    if (candidate.finishReason === 'SAFETY') {
      throw new Error('The AI flagged this content as potentially unsafe. Try adjusting your topic.');
    }

    if (!candidate.content?.parts?.[0]?.text) {
      throw new Error('The AI returned an empty response. Please try again.');
    }

    const textContent = candidate.content.parts[0].text;

    // Parse the response
    const sections = {
      hook: extractSection(textContent, '[HOOK]', '[SCRIPT]'),
      script: extractSection(textContent, '[SCRIPT]', '[CTA]'),
      cta: extractSection(textContent, '[CTA]', '[CAPTION]'),
      caption: extractSection(textContent, '[CAPTION]', '[HASHTAGS]'),
      hashtags: extractSection(textContent, '[HASHTAGS]', '[BEST_TIME]'),
      bestTime: extractSection(textContent, '[BEST_TIME]', null),
    };

    // Verify that at least the hook was parsed (basic sanity check)
    if (!sections.hook && !sections.script) {
      throw new Error('The AI response was in an unexpected format. Please try regenerating.');
    }

    return sections;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

function extractSection(text, startTag, endTag) {
  const startIndex = text.indexOf(startTag);
  if (startIndex === -1) return '';
  
  const contentStart = startIndex + startTag.length;
  let endIndex;
  
  if (endTag) {
    endIndex = text.indexOf(endTag, contentStart);
    if (endIndex === -1) endIndex = text.length;
  } else {
    endIndex = text.length;
  }
  
  return text.substring(contentStart, endIndex).trim();
}
