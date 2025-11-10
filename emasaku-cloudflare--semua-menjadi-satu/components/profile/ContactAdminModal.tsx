import React, { useState, useRef, useEffect } from 'react';
// Fix: Add guard for heroicons
import { 
    XMarkIcon as XMarkIconSolid, 
    PaperAirplaneIcon as PaperAirplaneIconSolid, 
    PhotoIcon as PhotoIconSolid 
} from '@heroicons/react/24/solid';

// Fix: Add guard for heroicons
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const PaperAirplaneIcon = (PaperAirplaneIconSolid as any).default || PaperAirplaneIconSolid;
const PhotoIcon = (PhotoIconSolid as any).default || PhotoIconSolid;

interface ContactAdminModalProps {
  onClose: () => void;
  recipientName?: string;
  recipientAvatarUrl?: string;
}

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'admin';
    image?: string | null;
}

const ContactAdminModal: React.FC<ContactAdminModalProps> = ({ 
    onClose, 
    recipientName = 'Admin', 
    recipientAvatarUrl = 'https://picsum.photos/seed/admin1/50' 
}) => {
  const [messages, setMessages] = useState<Message[]>([
      { id: 1, text: "Halo! Ada yang bisa kami bantu?", sender: 'admin' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !newImage) return;

    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      image: newImage,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setNewImage(null);

    // Simulate admin response
    setTimeout(() => {
        const adminResponse: Message = {
            id: Date.now() + 1,
            text: "Terima kasih atas pesan Anda. Tim kami akan segera menindaklanjuti dan menghubungi Anda kembali jika diperlukan.",
            sender: 'admin'
        };
        setMessages(prev => [...prev, adminResponse]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-md relative flex flex-col h-[85vh] md:h-[70vh]">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
                <img src={recipientAvatarUrl} alt={recipientName} className="w-10 h-10 rounded-full" />
                <div>
                    <h2 className="font-bold text-text-primary dark:text-dark-text-primary">{recipientName}</h2>
                    <p className="text-xs text-green-500">Online</p>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition" aria-label="Tutup">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        
        {/* Chat Body */}
        <div className="flex-grow p-4 overflow-y-auto bg-slate-50 dark:bg-dark-background/50 space-y-4">
            {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-xl max-w-xs md:max-w-sm ${msg.sender === 'user' ? 'bg-amber-400 dark:bg-amber-500 text-slate-900' : 'bg-white dark:bg-dark-surface text-text-primary dark:text-dark-text-primary shadow-sm'}`}>
                        {msg.image && <img src={msg.image} alt="Lampiran" className="rounded-lg mb-2 max-h-40"/>}
                        {msg.text && <p className="text-sm break-words">{msg.text}</p>}
                    </div>
                </div>
            ))}
            <div ref={chatEndRef} />
        </div>

        {/* Input Footer */}
        <div className="flex-shrink-0 p-3 border-t border-slate-200 dark:border-slate-700">
            {newImage && (
                <div className="relative w-20 h-20 mb-2 p-1 border rounded-lg">
                    <img src={newImage} alt="Preview" className="w-full h-full object-cover rounded"/>
                    <button onClick={() => setNewImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5" aria-label="Hapus gambar">
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden"/>
                <button type="button" onClick={triggerFileSelect} className="p-2 rounded-full text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <PhotoIcon className="w-6 h-6" />
                </button>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik pesan..."
                    className="flex-grow p-2.5 border rounded-full focus:ring-2 focus:ring-gold-DEFAULT focus:outline-none bg-slate-100 dark:bg-slate-800 dark:border-slate-600 text-sm"
                />
                <button type="submit" className="p-3 bg-gradient-to-br from-gold-light to-gold-dark text-white rounded-full transition-opacity hover:opacity-90 disabled:from-slate-300 disabled:to-slate-400" disabled={!newMessage.trim() && !newImage}>
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ContactAdminModal;