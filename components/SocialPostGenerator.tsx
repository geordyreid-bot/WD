

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
                <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded