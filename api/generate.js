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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic, platform, videoType, language, location, bestProduct, additionalInfo } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
  }

  // Build language-specific instructions
  let languageInstruction;
  if (language === 'English') {
    languageInstruction = 'Write ENTIRELY in English. Do NOT use any Tagalog, Filipino, or Bisaya words at all. Every single word must be in English.';
  } else if (language === 'Bisaya') {
    languageInstruction = 'Write ENTIRELY in Bisaya (Cebuano). Use natural Bisaya as spoken in everyday conversation. You may mix in minimal English words only where a Bisaya speaker naturally would (like brand names or tech terms), but the script must be dominantly Bisaya.';
  } else {
    languageInstruction = 'Write in natural Taglish (Tagalog-English mix) as Filipinos actually speak in everyday conversation.';
  }

  const systemPrompt = `You are a top-tier Filipino social media content expert. Your goal is to generate highly engaging, ready-to-post content tailored to the requested platform and video type.

CRITICAL LANGUAGE RULE: ${languageInstruction} This is non-negotiable — the user specifically chose "${language}" and the entire output MUST be in that language.

Write like a real friend texting, not like a marketing agency. Keep it short and imperfect. Avoid corporate words like premium, signature, and experience. Say things a real person would actually say out loud. If a location is given, mention it naturally somewhere in the script. If a best selling product is given, mention it specifically by name at least once. The call to action should mention the actual location if one was provided instead of saying Insert Location. If additional context is provided, use it to make the script more specific, personal, and accurate to what the business actually wants to communicate.

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
  const additionalInfoLine = additionalInfo?.trim() ? `\nAdditional context: ${additionalInfo.trim()}` : '';

  const userPrompt = `Topic/Business: ${topic}${locationLine}${productLine}${additionalInfoLine}\nPlatform: ${platform}\nVideo Type: ${videoType}\nLanguage: ${language}\n\nPlease generate the content package. Remember: write EVERYTHING in ${language}.`;

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
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Failed to generate content with Gemini API.' 
      });
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      return res.status(400).json({ error: 'The AI could not generate content for this input. Try rephrasing your topic.' });
    }

    const candidate = data.candidates[0];

    if (candidate.finishReason === 'SAFETY') {
      return res.status(400).json({ error: 'The AI flagged this content as potentially unsafe. Try adjusting your topic.' });
    }

    if (!candidate.content?.parts?.[0]?.text) {
      return res.status(400).json({ error: 'The AI returned an empty response. Please try again.' });
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

    if (!sections.hook && !sections.script) {
      return res.status(500).json({ error: 'The AI response was in an unexpected format. Please try regenerating.' });
    }

    return res.status(200).json({ sections });

  } catch (error) {
    console.error('Gemini Backend Error:', error);
    return res.status(500).json({ error: 'Internal server error while calling AI service.' });
  }
}
