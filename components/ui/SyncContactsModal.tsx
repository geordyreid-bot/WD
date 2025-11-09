import React from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { Contact, ContactMethod } from '../../types';

interface SyncContactsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddContacts: (newContacts: Contact[]) => void;
    onSyncDeviceContacts: () => Promise<void>;
    isSyncingDevice: boolean;
}

const MOCK_SOCIAL_CONTACTS: Record<Exclude<ContactMethod, 'Phone' | 'WinkDrops'>, Omit<Contact, 'id'>[]> = {
    'Instagram': [
        { name: 'Insta Friend 1', method: 'Instagram', handle: '@insta_friend_1' },
        { name: 'Insta Friend 2', method: 'Instagram', handle: '@insta_friend_2' },
    ],
    'X': [
        { name: 'X Colleague', method: 'X', handle: '@x_colleague' },
    ],
    'Snapchat': [
        { name: 'Snap Pal', method: 'Snapchat', handle: 'snap_pal' },
        { name: 'Bestie Snap', method: 'Snapchat', handle: 'bestie_snap' },
    ],
    'TikTok': [
        { name: 'TikTok Creator', method: 'TikTok', handle: '@tiktok_creator' },
    ]
};


export const SyncContactsModal: React.FC<SyncContactsModalProps> = ({ isOpen, onClose, onAddContacts, onSyncDeviceContacts, isSyncingDevice }) => {
    
    const handleMockSync = (method: Exclude<ContactMethod, 'Phone' | 'WinkDrops'>) => {
        const newContacts: Contact[] = MOCK_SOCIAL_CONTACTS[method].map((contact, index) => ({
            ...contact,
            id: `mock-${method.toLowerCase()}-${Date.now()}-${index}`
        }));
        onAddContacts(newContacts);
        alert(`Simulated: Added ${newContacts.length} contact(s) from ${method}.`);
        onClose();
    };

    const syncOptions: {
        label: string;
        icon: React.ComponentProps<typeof Icon>['name'];
        method: ContactMethod | 'Device';
        action: () => void;
        disabled?: boolean;
    }[] = [
        { label: 'Sync from Device', icon: 'smartphone', method: 'Device', action: onSyncDeviceContacts, disabled: isSyncingDevice },
        { label: 'Sync from Instagram', icon: 'instagram', method: 'Instagram', action: () => handleMockSync('Instagram') },
        { label: 'Sync from X', icon: 'twitter', method: 'X', action: () => handleMockSync('X') },
        { label: 'Sync from Snapchat', icon: 'ghost', method: 'Snapchat', action: () => handleMockSync('Snapchat') },
        { label: 'Sync from TikTok', icon: 'tiktok', method: 'TikTok', action: () => handleMockSync('TikTok') },
    ];


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Sync Contacts">
            <div>
                <p className="text-brand-text-secondary mb-4">
                    Import your contacts to easily send Winks and Nudges. We encourage syncing to expand your support network.
                </p>
                <div className="space-y-3">
                    {syncOptions.map(opt => (
                        <button
                            key={opt.label}
                            onClick={opt.action}
                            disabled={opt.disabled}
                            className="w-full flex items-center gap-4 p-4 bg-brand-secondary-50 rounded-lg text-left hover:bg-brand-secondary-100 transition-colors disabled:opacity-50 interactive-scale"
                        >
                            <Icon name={opt.icon} className="w-6 h-6 text-brand-secondary-600"/>
                            <span className="font-semibold text-brand-text-primary">{opt.label}</span>
                            {opt.disabled && <Icon name="loader" className="w-5 h-5 animate-spin ml-auto text-brand-secondary-500"/>}
                        </button>
                    ))}
                </div>
            </div>
        </Modal>
    );
};