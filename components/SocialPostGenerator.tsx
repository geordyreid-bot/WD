
import React, { useState } from 'react';
import { AIGeneratedContent, SocialMediaPost } from '../types';
import { generateSocialPosts } from '../services/geminiService';
import { Icon } from './ui/Icon';

interface SocialPostGeneratorProps {
    aiContent: AIGeneratedContent;
    onClose?: () => void;
}

export const SocialPostGenerator: React.FC<SocialPostGeneratorProps> = ({ aiContent, onClose }) => {
    const [keywords, setKeywords] = useState('');
    const [posts, setPosts] = useState<SocialMediaPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedPost, setCopiedPost] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!keywords.trim()) return;
        setIsLoading(true);
        setError(null);
        setPosts([]);
        try {
            const generatedPosts = await generateSocialPosts(
                aiContent.possibleConditions,
                aiContent.resources,
                keywords
            );
            setPosts(generatedPosts);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        setCopiedPost(content);
        setTimeout(() => setCopiedPost(null), 2000);
    };

    return (
        <div className="bg-brand-secondary-50 p-4 rounded-lg border border-brand-secondary-200 relative animate-fade-in">
             {onClose && (
                <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-full hover:bg-brand-secondary-200 transition-colors interactive-scale" aria-label="Close generator">
                    <Icon name="x" className="w-4 h-4 text-brand-text-secondary" />
                </button>
            )}
            <h4 className="font-bold text-brand-text-primary">Share Your Journey</h4>
            <p className="text-sm text-brand-text-secondary mt-1 mb-4">
                Sharing your experience can help others feel less alone. Generate a sample post to share on social media.
            </p>
            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Enter keywords (e.g., 'my story', 'burnout')"
                    className="flex-grow p-3 bg-brand-secondary-100 border border-transparent placeholder-brand-secondary-400 rounded-lg focus:bg-white focus:border-brand-primary-300 focus:ring-1 focus:ring-brand-primary-300 transition-colors"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !keywords.trim()}
                    className="bg-brand-text-primary text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-brand-text-primary/90 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 interactive-scale"
                >
                    {isLoading ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : <Icon name="sparkles" className="w-5 h-5" />}
                    {isLoading ? 'Generating...' : 'Generate Posts'}
                </button>
            </form>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {posts.length > 0 && (
                <div className="space-y-3 animate-fade-in-up">
                    {posts.map((post, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-brand-secondary-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-brand-secondary-500 uppercase">{post.platform}</span>
                                <button onClick={() => handleCopy(post.content)} className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary-600 hover:text-brand-primary-800 interactive-scale">
                                    <Icon name={copiedPost === post.content ? 'check' : 'clipboardCheck'} className="w-4 h-4" />
                                    {copiedPost === post.content ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <p className="text-sm text-brand-text-secondary whitespace-pre-wrap">{post.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};