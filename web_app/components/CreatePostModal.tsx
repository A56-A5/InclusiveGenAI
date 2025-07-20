
import React, { useState, useEffect } from 'react';
import { generateCaption, generateCaptionFromImage } from '../services/geminiService';

interface CreatePostModalProps {
  onClose: () => void;
  onAddPost: (caption: string, imageUrl: string, aiCaption?: string) => Promise<void>;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onAddPost }) => {
  const [imageUrl, setImageUrl] = useState(`https://picsum.photos/seed/${Date.now()}/600/600`);
  const [caption, setCaption] = useState('');
  const [imageTopic, setImageTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiCaption, setAiCaption] = useState<string>('');
  const [isGeneratingAiCaption, setIsGeneratingAiCaption] = useState(false);

  // Generate AI caption when image changes
  useEffect(() => {
    const generateAiCaption = async () => {
      setIsGeneratingAiCaption(true);
      setAiCaption('');
      
      try {
        const generated = await generateCaptionFromImage(imageUrl);
        setAiCaption(generated);
      } catch (error) {
        console.error('Failed to generate AI caption:', error);
        setAiCaption('Failed to generate AI caption');
      } finally {
        setIsGeneratingAiCaption(false);
      }
    };

    // Generate AI caption for the current image
    generateAiCaption();
  }, [imageUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption || !imageUrl) return;
    setIsSubmitting(true);
    
    // Use the generated AI caption
    await onAddPost(caption, imageUrl, aiCaption || undefined);
    setIsSubmitting(false);
    onClose();
  };

  const handleGenerateCaption = async () => {
    if (!imageTopic) return;
    setIsGenerating(true);
    const generated = await generateCaption(imageTopic);
    setCaption(generated);
    setIsGenerating(false);
  };
  
  const refreshImage = () => {
    setImageUrl(`https://picsum.photos/seed/${Date.now()}/600/600`);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-full overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Create New Post</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="mb-4">
              <img src={imageUrl} alt="New post preview" className="w-full rounded-lg object-cover" />
               <button type="button" onClick={refreshImage} className="text-sm text-primary hover:text-cyan-700 mt-2">
                Get new random image
              </button>
            </div>
            
            {/* AI Caption Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🧠 AI Image Analysis
              </label>
              <div className="bg-gray-50 rounded-md p-3 min-h-[60px]">
                {isGeneratingAiCaption ? (
                  <div className="flex items-center text-gray-600">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing image...
                  </div>
                ) : aiCaption ? (
                  <p className="text-sm text-gray-700">{aiCaption}</p>
                ) : (
                  <p className="text-sm text-gray-500">No AI analysis available</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="image-topic" className="block text-sm font-medium text-gray-700 mb-1">
                What is your photo about? (for AI)
              </label>
              <div className="flex space-x-2">
                <input
                  id="image-topic"
                  type="text"
                  value={imageTopic}
                  onChange={(e) => setImageTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="e.g., a sunset over the ocean"
                />
                <button
                  type="button"
                  onClick={handleGenerateCaption}
                  disabled={isGenerating || !imageTopic}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-cyan-700 disabled:bg-cyan-300 flex items-center"
                >
                  {isGenerating ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : '✨'}
                  <span className={isGenerating ? 'pr-2': ''}>{isGenerating ? 'Generating...' : 'AI Caption'}</span>
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
                Caption
              </label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Write a caption..."
              />
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !caption}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-cyan-700 disabled:bg-cyan-300"
            >
              {isSubmitting ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
