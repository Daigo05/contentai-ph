export const generateContent = async (topic, platform, videoType, language, location, bestProduct, additionalInfo) => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        platform,
        videoType,
        language,
        location,
        bestProduct,
        additionalInfo
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate content. Please try again.');
    }

    const data = await response.json();
    
    // The backend now handles the parsing, so we just return the sections
    return data.sections;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
