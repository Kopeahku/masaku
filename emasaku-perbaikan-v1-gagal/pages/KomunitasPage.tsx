import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    UserGroupIcon as UserGroupIconSolid,
    ChatBubbleOvalLeftIcon as ChatBubbleOvalLeftIconSolid,
    HeartIcon as HeartIconSolid,
    ShareIcon as ShareIconSolid,
    PhotoIcon as PhotoIconSolid,
    XCircleIcon as XCircleIconSolid,
    PaperAirplaneIcon as PaperAirplaneIconSolid,
    EllipsisHorizontalIcon as EllipsisHorizontalIconSolid
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import { User, CommunityPost, PostComment } from '../types.ts';
import { getCommunityPosts, addCommunityPost, togglePostLike, addPostComment } from '../services/mockData.ts';
import { timeAgo } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const UserGroupIcon = (UserGroupIconSolid as any).default || UserGroupIconSolid;
const ChatBubbleOvalLeftIcon = (ChatBubbleOvalLeftIconSolid as any).default || ChatBubbleOvalLeftIconSolid;
const HeartIcon = (HeartIconSolid as any).default || HeartIconSolid;
const ShareIcon = (ShareIconSolid as any).default || ShareIconSolid;
const PhotoIcon = (PhotoIconSolid as any).default || PhotoIconSolid;
const XCircleIcon = (XCircleIconSolid as any).default || XCircleIconSolid;
const PaperAirplaneIcon = (PaperAirplaneIconSolid as any).default || PaperAirplaneIconSolid;
const EllipsisHorizontalIcon = (EllipsisHorizontalIconSolid as any).default || EllipsisHorizontalIconSolid;


interface KomunitasPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  navigateToProfile: (userId: string) => void;
}

// --- Reusable & New Components ---

const CreatePost: React.FC<{ currentUser: User, onAddPost: (content: string, topic: string, imageUrl: string | null) => void }> = ({ currentUser, onAddPost }) => {
    const [content, setContent] = useState('');
    const [topic, setTopic] = useState('Umum');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setImagePreview(reader.result as string); };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onAddPost(content, topic, imagePreview);
        setContent('');
        setTopic('Umum');
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-md mb-4">
            <div className="flex items-start gap-3">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Apa yang Anda pikirkan, ${currentUser.name.split(' ')[0]}?`}
                    className="w-full h-24 p-2 border rounded-md bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                    rows={3}
                />
            </div>
            {imagePreview && (
                <div className="mt-3 ml-12 relative w-32 h-32">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg"/>
                    <button onClick={() => setImagePreview(null)} className="absolute -top-2 -right-2 bg-slate-800/70 text-white rounded-full"><XCircleIcon className="w-6 h-6"/></button>
                </div>
            )}
            <div className="flex flex-wrap justify-between items-center gap-3 mt-3 ml-12">
                 <div className="flex items-center gap-2">
                     <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"><PhotoIcon className="w-6 h-6"/></button>
                     <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    <select value={topic} onChange={e => setTopic(e.target.value)} className="text-xs font-semibold bg-slate-100 dark:bg-slate-700 border-none rounded-full px-3 py-2 focus:ring-2 focus:ring-primary">
                        <option>Umum</option><option>Investasi</option><option>Tips Hemat</option><option>Jual Beli</option><option>Tanya Jawab</option>
                    </select>
                 </div>
                <button onClick={handleSubmit} disabled={!content.trim()} className="bg-primary text-white font-bold py-2 px-6 rounded-lg disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors">Post</button>
            </div>
        </div>
    );
};

const Comment: React.FC<{ comment: PostComment, onReply: (parentId: string) => void, onViewProfile: (userId: string) => void }> = ({ comment, onReply, onViewProfile }) => (
    <div className="flex items-start gap-2">
        <button onClick={() => onViewProfile(comment.authorId)}><img src={comment.authorAvatarUrl} alt={comment.authorName} className="w-8 h-8 rounded-full flex-shrink-0"/></button>
        <div>
            <div className="bg-slate-100 dark:bg-slate-700 p-2 px-3 rounded-xl">
                <button onClick={() => onViewProfile(comment.authorId)} className="font-bold text-xs hover:underline text-text-primary dark:text-dark-text-primary">{comment.authorName}</button>
                <p className="text-sm text-text-primary dark:text-dark-text-primary">{comment.content}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-dark-text-secondary mt-1 ml-2">
                <span>{timeAgo(comment.timestamp)}</span>
                <button onClick={() => onReply(comment.id)} className="font-bold hover:underline">Balas</button>
            </div>
        </div>
    </div>
);

const CommentThread: React.FC<{ 
    comments: PostComment[], 
    onReply: (parentId: string) => void, 
    onViewProfile: (userId: string) => void 
}> = ({ comments, onReply, onViewProfile }) => (
    <div className="space-y-3">
        {comments.map(comment => (
            <div key={comment.id}>
                <Comment comment={comment} onReply={onReply} onViewProfile={onViewProfile} />
                {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-6 mt-3 border-l-2 border-slate-200 dark:border-slate-600 ml-4">
                        <CommentThread comments={comment.replies} onReply={onReply} onViewProfile={onViewProfile} />
                    </div>
                )}
            </div>
        ))}
    </div>
);


const PostCard: React.FC<{ 
    post: CommunityPost, 
    currentUser: User,
    onLike: (postId: string) => void,
    onAddComment: (postId: string, content: string, parentId?: string) => void,
    onViewProfile: (userId: string) => void
}> = ({ post, currentUser, onLike, onAddComment, onViewProfile }) => {
    const [isCommentsVisible, setCommentsVisible] = useState(false);
    const [commentInput, setCommentInput] = useState<{ parentId?: string; text: string; } | null>(null);
    const commentInputRef = useRef<HTMLInputElement>(null);

    const isLiked = post.likes.includes(currentUser.id);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentInput || !commentInput.text.trim()) return;
        onAddComment(post.id, commentInput.text, commentInput.parentId);
        setCommentInput(null);
    };

    const handleReplyClick = (parentId: string) => {
        setCommentsVisible(true);
        setCommentInput({ parentId, text: '' });
        setTimeout(() => commentInputRef.current?.focus(), 100);
    };
    
    const HeartOutlineIconComponent = (HeartOutlineIcon as any).default || HeartOutlineIcon;

    return (
        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => onViewProfile(post.authorId)}><img src={post.authorAvatarUrl} alt={post.authorName} className="w-11 h-11 rounded-full"/></button>
                        <div>
                            <button onClick={() => onViewProfile(post.authorId)} className="font-bold text-text-primary dark:text-dark-text-primary hover:underline">{post.authorName}</button>
                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{timeAgo(post.timestamp)}</p>
                        </div>
                    </div>
                    <button className="p-2 text-text-secondary rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><EllipsisHorizontalIcon className="w-5 h-5"/></button>
                </div>
                <p className="my-3 text-text-primary dark:text-dark-text-primary whitespace-pre-wrap">{post.content}</p>
                 <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">{post.topic}</span>
            </div>
            
            {post.imageUrl && <img src={post.imageUrl} alt="Post attachment" className="w-full h-auto object-cover max-h-96"/>}

            <div className="p-4">
                {(post.likes.length > 0 || post.comments.length > 0) && (
                    <div className="flex justify-between text-xs text-text-secondary dark:text-dark-text-secondary pb-2">
                        <span>{post.likes.length} Suka</span>
                        <span>{post.comments.length} Komentar</span>
                    </div>
                )}

                <div className="flex justify-around items-center border-t border-slate-200 dark:border-slate-700 pt-1">
                    <button onClick={() => onLike(post.id)} className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold p-2 rounded-lg transition-colors ${isLiked ? 'text-red-500' : 'text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                        {isLiked ? <HeartIcon className="w-5 h-5"/> : <HeartOutlineIconComponent className="w-5 h-5"/>} Suka
                    </button>
                    <button onClick={() => { setCommentsVisible(!isCommentsVisible); setCommentInput({ text: ''}); }} className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <ChatBubbleOvalLeftIcon className="w-5 h-5"/> Komentar
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <ShareIcon className="w-5 h-5"/> Bagikan
                    </button>
                </div>
            </div>
            
            {isCommentsVisible && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
                    <CommentThread comments={post.comments} onReply={handleReplyClick} onViewProfile={onViewProfile}/>

                    <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                        <img src={currentUser.avatarUrl} alt="You" className="w-8 h-8 rounded-full flex-shrink-0"/>
                        <div className="relative w-full">
                            <input
                                ref={commentInputRef}
                                type="text"
                                value={commentInput?.text ?? ''}
                                onChange={(e) => setCommentInput(prev => prev ? {...prev, text: e.target.value} : { text: e.target.value })}
                                placeholder={commentInput?.parentId ? "Tulis balasan..." : "Tulis komentar..."}
                                className="w-full p-2 pr-10 border rounded-full bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                            />
                            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-primary dark:text-gold-light rounded-full hover:bg-primary/10 dark:hover:bg-gold-light/10">
                                <PaperAirplaneIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const PostSkeleton: React.FC = () => (
    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4">
        <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
            <div>
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded mt-1.5 animate-pulse"></div>
            </div>
        </div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mt-4 animate-pulse"></div>
        <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded mt-2 animate-pulse"></div>
        <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded mt-4 animate-pulse"></div>
    </div>
);


const KomunitasPage: React.FC<KomunitasPageProps> = ({ setActivePage, currentUser, navigateToProfile }) => {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const data = await getCommunityPosts();
            // Simulate network delay
            setTimeout(() => {
                setPosts(data);
                setLoading(false);
            }, 1000);
        };
        fetchPosts();
    }, []);

    const handleAddPost = async (content: string, topic: string, imageUrl: string | null) => {
        const newPost = await addCommunityPost({ content, topic, imageUrl: imageUrl || undefined }, currentUser);
        setPosts(prev => [newPost, ...prev]);
    };
    
    const handleLikePost = async (postId: string) => {
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const isLiked = p.likes.includes(currentUser.id);
                const newLikes = isLiked ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id];
                return { ...p, likes: newLikes };
            }
            return p;
        }));
        await togglePostLike(postId, currentUser.id); // Update backend in background
    };
    
    const handleAddComment = async (postId: string, content: string, parentId?: string) => {
        const updatedPost = await addPostComment(postId, { content }, currentUser, parentId);
        if (updatedPost) {
            setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-4">
            <div className="sticky top-0 bg-background/80 dark:bg-dark-background/80 backdrop-blur-sm z-10 pt-4 -mt-4">
                <div className="flex items-center mb-4 px-4">
                    <button onClick={() => setActivePage('Dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ArrowLeftIcon className="w-6 h-6" /></button>
                    <h1 className="text-xl font-bold text-text-primary dark:text-dark-text-primary ml-2">Komunitas</h1>
                </div>
            </div>

            <div className="px-4">
                <CreatePost currentUser={currentUser} onAddPost={handleAddPost} />
            </div>

            <div className="px-4 space-y-4">
                {loading ? (
                    <>
                        <PostSkeleton />
                        <PostSkeleton />
                    </>
                ) : (
                    posts.map(post => (
                        <PostCard 
                            key={post.id} 
                            post={post}
                            currentUser={currentUser}
                            onLike={handleLikePost}
                            onAddComment={handleAddComment}
                            onViewProfile={navigateToProfile}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default KomunitasPage;