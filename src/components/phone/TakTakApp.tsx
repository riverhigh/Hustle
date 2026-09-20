import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency } from '../../utils/formatters';
import { HOUSING_TIERS, TRANSPORTATION_TIERS } from '../../constants/gameData';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Music, 
  Plus, 
  Zap, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  DollarSign, 
  User, 
  Send,
  Radio,
  Eye,
  Award
} from 'lucide-react';

interface TakTakVideo {
  id: string;
  creatorName: string;
  handle: string;
  avatarBg: string;
  caption: string;
  musicTrack: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  bgGradient: string;
  tag: string;
}

const INITIAL_FEED: TakTakVideo[] = [
  {
    id: 'vid-1',
    creatorName: 'Chad Grindset',
    handle: '@grindset_chad',
    avatarBg: 'bg-indigo-600',
    caption: 'Why sleeping 8 hours is keeping you broke 🛑 Woke up at 3:30 AM to trade pre-market and close 3 wholesale deals before noon. You gotta want it! 💯💼',
    musicTrack: 'Sigma Grind Anthem • Chad Beats',
    likes: 42100,
    comments: 1840,
    shares: 5300,
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    tag: '#HustleMindset'
  },
  {
    id: 'vid-2',
    creatorName: 'Luxury Livin NYC',
    handle: '@luxuryliving_empire',
    avatarBg: 'bg-amber-600',
    caption: 'Touring this $12,500,000 Penthouse in Downtown Financial District! Look at this wrap-around terrace view overlooking the skyline! 🏙️🥂 Who would live here?',
    musicTrack: 'Champagne Dreams • Lo-Fi Lounge',
    likes: 89400,
    comments: 3200,
    shares: 12400,
    bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
    tag: '#RealEstatePorn'
  },
  {
    id: 'vid-3',
    creatorName: 'Penny Stock Queen',
    handle: '@stocks_with_tiffany',
    avatarBg: 'bg-emerald-600',
    caption: 'BREAKING: BioTech catalyst alert for this week! 📈 Look at this volume breakout. Not financial advice, but my portfolio is up +340% this quarter! 🚀💸',
    musicTrack: 'Bulls On Parade • WallSt Trap',
    likes: 31200,
    comments: 940,
    shares: 4100,
    bgGradient: 'from-emerald-950 via-slate-900 to-slate-950',
    tag: '#StockMarket'
  },
  {
    id: 'vid-4',
    creatorName: 'Marcus HighLife',
    handle: '@marcus_supercars',
    avatarBg: 'bg-rose-600',
    caption: 'Cold start on the new V12 twin-turbo! Listen to that exhaust roar 🏎️💨 Remember when they laughed at your side hustle? Keep pushing!',
    musicTrack: 'Engine Symphony • Exhaust Note',
    likes: 112000,
    comments: 4800,
    shares: 21300,
    bgGradient: 'from-rose-950 via-slate-900 to-slate-950',
    tag: '#Supercars'
  }
];

export const TakTakApp: React.FC = () => {
  const { 
    player, 
    socialProfile, 
    addSocialFollowers, 
    claimCreatorEarnings, 
    spendEnergy, 
    ownedBusinesses
  } = useGame();

  const currentHousing = HOUSING_TIERS.find((h) => h.tier === player.housingTier) || HOUSING_TIERS[0];
  const currentTransport = TRANSPORTATION_TIERS.find((t) => t.tier === player.transportationTier) || TRANSPORTATION_TIERS[0];

  const [activeTab, setActiveTab] = useState<'feed' | 'create' | 'monetize' | 'profile'>('feed');
  const [feed, setFeed] = useState<TakTakVideo[]>(INITIAL_FEED);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [videoComments, setVideoComments] = useState<string[]>([
    "Bro this is actually so motivational!",
    "Drop the full course link asap 🔥",
    "Real hustle beats fake talk every single time.",
    "Which broker are you using?"
  ]);

  // Live Stream state
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [liveViewers, setLiveViewers] = useState(0);
  const [liveDonations, setLiveDonations] = useState(0);
  const [liveChatMessages, setLiveChatMessages] = useState<{ user: string; text: string; isDonation?: boolean }[]>([]);

  const currentVid = feed[currentVideoIndex] || feed[0];

  const handleLike = (vidId: string) => {
    setFeed((prev) =>
      prev.map((v) => {
        if (v.id === vidId) {
          const liked = !v.isLiked;
          return {
            ...v,
            isLiked: liked,
            likes: liked ? v.likes + 1 : v.likes - 1
          };
        }
        return v;
      })
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setVideoComments((prev) => [commentInput.trim(), ...prev]);
    setCommentInput('');
  };

  // Post Creator Video
  const handleCreateVideo = (type: 'motivation' | 'flex' | 'business') => {
    if (player.energy < 15) {
      alert("Not enough energy! You need at least 15⚡ to record and edit a video.");
      return;
    }

    spendEnergy(15);
    let gainedFollowers = 0;
    let gainedLikes = 0;
    let captionText = '';

    if (type === 'motivation') {
      gainedFollowers = Math.floor(Math.random() * 800) + 400;
      gainedLikes = gainedFollowers * (Math.floor(Math.random() * 4) + 2);
      captionText = `Stop making excuses! Worked a 14-hour grind shift today. Keep grinding 💪✨`;
    } else if (type === 'flex') {
      const vehicleName = currentTransport?.name || 'Standard Ride';
      const housingName = currentHousing?.name || 'My Apartment';
      gainedFollowers = Math.floor(Math.random() * 2500) + 1200;
      gainedLikes = gainedFollowers * (Math.floor(Math.random() * 5) + 3);
      captionText = `Showing off the ${vehicleName} outside my ${housingName}! Hard work pays off 🔑🍾`;
    } else {
      const bizName = ownedBusinesses[0]?.name || 'My Venture LLC';
      gainedFollowers = Math.floor(Math.random() * 1500) + 700;
      gainedLikes = gainedFollowers * 3;
      captionText = `Behind the scenes operating ${bizName}! Building an empire one customer at a time 📈🏭`;
    }

    addSocialFollowers('taktak', gainedFollowers, gainedLikes);

    const newVideo: TakTakVideo = {
      id: `my-vid-${Date.now()}`,
      creatorName: player.name,
      handle: `@${player.name.toLowerCase().replace(/\s+/g, '_')}`,
      avatarBg: 'bg-gradient-to-r from-pink-500 to-indigo-600',
      caption: captionText,
      musicTrack: 'Original Viral Sound • ' + player.name,
      likes: gainedLikes,
      comments: Math.floor(gainedLikes * 0.08),
      shares: Math.floor(gainedLikes * 0.15),
      bgGradient: 'from-purple-950 via-slate-900 to-indigo-950',
      tag: '#MyEmpire'
    };

    setFeed((prev) => [newVideo, ...prev]);
    setCurrentVideoIndex(0);
    setActiveTab('feed');
  };

  // Start simulated LIVE stream
  const handleStartLive = () => {
    if (player.energy < 20) {
      alert("You need at least 20⚡ energy to host a live stream!");
      return;
    }
    spendEnergy(20);
    setIsLiveStreaming(true);
    setLiveViewers(Math.max(45, Math.floor(socialProfile.taktakFollowers * 0.15) + 35));
    setLiveDonations(0);
    setLiveChatMessages([
      { user: 'HustleFan_22', text: 'LETS GOOO! You are live!' },
      { user: 'Sarah_NYC', text: 'Love the stream bro!' }
    ]);
  };

  // Simulated live chat & tips
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const randomChatters = [
        'Venture_Dan', 'CryptoKing', 'ApexSam', 'CityGirl99', 'InvestorKai', 'AlphaBro'
      ];
      const randomComments = [
        'What is your best investment advice?',
        'How much did you make today?',
        'Drop the real estate secrets!',
        'You inspired me to start my business!',
        'W stream W creator 🔥',
      ];
      const isDonation = Math.random() < 0.35;
      const donationAmt = isDonation ? Math.floor(Math.random() * 60) + 15 : 0;
      const user = randomChatters[Math.floor(Math.random() * randomChatters.length)];

      if (isDonation) {
        setLiveDonations((prev) => prev + donationAmt);
        setLiveChatMessages((prev) => [
          { user, text: `Sent a SuperChat of ${formatCurrency(donationAmt)}! "Keep crushing it!"`, isDonation: true },
          ...prev.slice(0, 15)
        ]);
      } else {
        const text = randomComments[Math.floor(Math.random() * randomComments.length)];
        setLiveChatMessages((prev) => [
          { user, text },
          ...prev.slice(0, 15)
        ]);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const handleEndLive = () => {
    setIsLiveStreaming(false);
    if (liveDonations > 0) {
      // Award donations to player
      addSocialFollowers('taktak', Math.floor(liveViewers * 1.5), Math.floor(liveViewers * 4));
      alert(`Livestream ended! You earned ${formatCurrency(liveDonations)} in SuperChat donations and gained +${Math.floor(liveViewers * 1.5)} followers!`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-black text-white relative select-none">
      {/* Top Header bar */}
      <div className="h-10 px-4 flex items-center justify-between z-30 shrink-0 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-1">
          <span className="font-black tracking-tighter text-base bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
            TakTak
          </span>
          <span className="text-[10px] px-1 py-0.5 rounded bg-pink-500/20 text-pink-400 font-bold">PRO</span>
        </div>

        {/* Following | For You Tabs */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`transition cursor-pointer ${activeTab === 'feed' ? 'text-white border-b-2 border-white pb-0.5' : 'text-slate-400'}`}
          >
            For You
          </button>
          <button 
            onClick={() => setActiveTab('monetize')}
            className={`transition cursor-pointer ${activeTab === 'monetize' ? 'text-yellow-400 border-b-2 border-yellow-400 pb-0.5' : 'text-slate-400'}`}
          >
            Creator Fund
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-300">
            {socialProfile.taktakFollowers > 1000 
              ? `${(socialProfile.taktakFollowers / 1000).toFixed(1)}K` 
              : socialProfile.taktakFollowers}
          </span>
          <User className="w-3.5 h-3.5 text-pink-400" />
        </div>
      </div>

      {/* SUB-VIEW 1: FEED */}
      {activeTab === 'feed' && !isLiveStreaming && (
        <div className="flex-1 relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black">
          {/* Simulated Video Canvas Card */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentVid.bgGradient} opacity-90 flex items-center justify-center p-6 text-center`}>
            {/* Animated Soundwave Visualizer in Background */}
            <div className="flex items-center gap-1.5 opacity-20">
              <div className="w-2 h-16 bg-white rounded-full animate-pulse" />
              <div className="w-2 h-28 bg-white rounded-full animate-bounce" />
              <div className="w-2 h-44 bg-white rounded-full animate-pulse" />
              <div className="w-2 h-20 bg-white rounded-full animate-bounce" />
            </div>

            <div className="absolute top-16 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold tracking-wider text-pink-300 border border-pink-500/30">
                {currentVid.tag}
              </span>
              <span className="text-[10px] text-slate-400">Video {currentVideoIndex + 1} of {feed.length}</span>
            </div>
          </div>

          {/* Right Floating Actions Column */}
          <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4">
            {/* Creator Avatar */}
            <div className="relative">
              <div className={`w-10 h-10 rounded-full ${currentVid.avatarBg} border-2 border-white flex items-center justify-center text-xs font-bold shadow-lg`}>
                {currentVid.creatorName.slice(0, 1)}
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white">
                <Plus className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Like button */}
            <button 
              onClick={() => handleLike(currentVid.id)}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className={`p-2 rounded-full backdrop-blur-md transition ${currentVid.isLiked ? 'bg-pink-600/80 text-pink-200 scale-110' : 'bg-black/50 text-white group-hover:scale-105'}`}>
                <Heart className={`w-6 h-6 ${currentVid.isLiked ? 'fill-pink-400' : ''}`} />
              </div>
              <span className="text-[10px] font-bold text-slate-200">
                {currentVid.likes > 1000 ? `${(currentVid.likes / 1000).toFixed(1)}k` : currentVid.likes}
              </span>
            </button>

            {/* Comment button */}
            <button 
              onClick={() => setCommentsOpen(true)}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white group-hover:scale-105 transition">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-200">
                {currentVid.comments}
              </span>
            </button>

            {/* Share button */}
            <button 
              onClick={() => alert("Video link copied to clipboard!")}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white group-hover:scale-105 transition">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-200">
                {currentVid.shares}
              </span>
            </button>

            {/* Spinning Music Disc */}
            <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-slate-700 p-1 animate-spin shadow-lg mt-1">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center">
                <Music className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>

          {/* Bottom Info Section */}
          <div className="z-10 p-4 pb-20 pr-16 bg-gradient-to-t from-black via-black/80 to-transparent space-y-1.5 mt-auto">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">{currentVid.creatorName}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span className="text-xs text-slate-400">{currentVid.handle}</span>
            </div>

            <p className="text-xs text-slate-200 leading-snug line-clamp-3">
              {currentVid.caption}
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-300">
              <Music className="w-3.5 h-3.5 animate-pulse text-pink-400" />
              <span className="truncate max-w-[200px]">{currentVid.musicTrack}</span>
            </div>

            {/* Next / Previous video navigation buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                disabled={currentVideoIndex === 0}
                onClick={() => setCurrentVideoIndex((i) => Math.max(0, i - 1))}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-bold disabled:opacity-30 cursor-pointer"
              >
                ▲ Prev
              </button>
              <button
                disabled={currentVideoIndex >= feed.length - 1}
                onClick={() => setCurrentVideoIndex((i) => Math.min(feed.length - 1, i + 1))}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-bold disabled:opacity-30 cursor-pointer"
              >
                ▼ Next Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: LIVE STREAMING MODE */}
      {isLiveStreaming && (
        <div className="flex-1 relative flex flex-col justify-between bg-gradient-to-b from-purple-950 via-slate-900 to-black p-4 pb-20">
          {/* Top Live Bar */}
          <div className="flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-red-600 rounded-full text-xs font-black text-white shadow-lg animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                <span>LIVE</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-[11px] text-slate-200">
                <Eye className="w-3 h-3 text-cyan-400" />
                <span>{liveViewers} viewers</span>
              </div>
            </div>

            <button
              onClick={handleEndLive}
              className="px-3 py-1 rounded-full bg-red-600/80 hover:bg-red-500 text-xs font-bold text-white cursor-pointer"
            >
              End Stream
            </button>
          </div>

          {/* Center Stage Floating Hearts */}
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-1 animate-pulse shadow-2xl shadow-pink-500/50">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-2xl font-black">
                {player.name.slice(0, 1)}
              </div>
            </div>
            <h3 className="text-sm font-black text-white">{player.name} is LIVE!</h3>
            <span className="text-xs text-yellow-400 font-bold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>SuperChats: {formatCurrency(liveDonations)}</span>
            </span>
          </div>

          {/* Live Chat stream */}
          <div className="h-44 overflow-y-auto space-y-1.5 p-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-xs">
            {liveChatMessages.map((msg, i) => (
              <div key={i} className={`p-1.5 rounded-lg ${msg.isDonation ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200 font-bold' : 'text-slate-300'}`}>
                <span className="font-bold text-cyan-300 mr-1.5">@{msg.user}:</span>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: CREATE VIDEO */}
      {activeTab === 'create' && !isLiveStreaming && (
        <div className="flex-1 p-4 pb-20 overflow-y-auto space-y-4 bg-slate-950">
          <div className="text-center space-y-1 pt-2">
            <h2 className="text-base font-black text-white">Create Viral TakTak Content</h2>
            <p className="text-xs text-slate-400">Post short videos to build followers, expand clout, and boost your daily creator earnings.</p>
          </div>

          <div className="space-y-2.5 pt-2">
            {/* Option 1: Hustle Motivation */}
            <button
              onClick={() => handleCreateVideo('motivation')}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/40 hover:border-indigo-400 text-left transition flex items-center justify-between group cursor-pointer active:scale-98"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-white">Grind & Hustle Motivation</span>
                </div>
                <p className="text-[11px] text-slate-400">Share your daily work routine and mindset secrets.</p>
                <div className="text-[10px] text-emerald-400 font-semibold">+400 to +1,200 Followers • 15⚡ Energy</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition">
                <Plus className="w-4 h-4" />
              </div>
            </button>

            {/* Option 2: Flex Luxury Assets */}
            <button
              onClick={() => handleCreateVideo('flex')}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/80 to-slate-900 border border-amber-500/40 hover:border-amber-400 text-left transition flex items-center justify-between group cursor-pointer active:scale-98"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Flex Crib & Wheels</span>
                </div>
                <p className="text-[11px] text-slate-400">Tour your current housing and whip to show the luxury lifestyle.</p>
                <div className="text-[10px] text-amber-300 font-semibold">+1,200 to +3,500 Followers • 15⚡ Energy</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-600/30 flex items-center justify-center text-amber-300 group-hover:bg-amber-600 group-hover:text-white transition">
                <Plus className="w-4 h-4" />
              </div>
            </button>

            {/* Option 3: Business BTS */}
            <button
              onClick={() => handleCreateVideo('business')}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-left transition flex items-center justify-between group cursor-pointer active:scale-98"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Behind-the-Scenes Business</span>
                </div>
                <p className="text-[11px] text-slate-400">Show how your ventures make revenue and manage staff.</p>
                <div className="text-[10px] text-cyan-300 font-semibold">+700 to +2,000 Followers • 15⚡ Energy</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-cyan-600/30 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-600 group-hover:text-white transition">
                <Plus className="w-4 h-4" />
              </div>
            </button>

            {/* Option 4: Go LIVE */}
            <button
              onClick={handleStartLive}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/80 via-red-950/80 to-slate-900 border border-pink-500/50 hover:border-pink-400 text-left transition flex items-center justify-between group cursor-pointer active:scale-98"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-pink-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">Go LIVE Broadcast</span>
                </div>
                <p className="text-[11px] text-slate-400">Stream live Q&A with chat and receive SuperChat donations.</p>
                <div className="text-[10px] text-pink-300 font-semibold">Earn Cash Tips + Follower Surge • 20⚡ Energy</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-600/30 flex items-center justify-center text-red-300 group-hover:bg-red-600 group-hover:text-white transition">
                <Radio className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: CREATOR FUND & MONETIZATION */}
      {activeTab === 'monetize' && (
        <div className="flex-1 p-4 pb-20 overflow-y-auto space-y-4 bg-slate-950">
          <div className="bg-gradient-to-br from-yellow-950/80 via-slate-900 to-black border border-yellow-500/40 rounded-3xl p-4 shadow-xl text-center space-y-2">
            <Award className="w-8 h-8 text-yellow-400 mx-auto" />
            <h3 className="text-sm font-black text-white">TakTak Creator Rewards</h3>
            <p className="text-xs text-slate-300">
              Get paid daily based on your follower base and engagement metrics.
            </p>

            <div className="pt-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Unclaimed Earnings</span>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">
                {formatCurrency(socialProfile.unclaimedCreatorEarnings)}
              </div>
            </div>

            <button
              disabled={socialProfile.unclaimedCreatorEarnings <= 0}
              onClick={claimCreatorEarnings}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg disabled:opacity-40 transition active:scale-95 cursor-pointer"
            >
              Cash Out Creator Revenue
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Followers</span>
              <div className="text-base font-black text-white mt-1">
                {socialProfile.taktakFollowers.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Likes</span>
              <div className="text-base font-black text-pink-400 mt-1">
                {socialProfile.taktakLikes.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comment Drawer Overlay */}
      {commentsOpen && (
        <div className="absolute inset-x-0 bottom-0 z-40 bg-slate-900 border-t border-slate-800 rounded-t-3xl p-4 h-72 flex flex-col justify-between shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white">Comments ({videoComments.length})</span>
            <button onClick={() => setCommentsOpen(false)} className="text-xs text-slate-400 hover:text-white cursor-pointer">
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 py-2 text-xs">
            {videoComments.map((c, idx) => (
              <div key={idx} className="p-2 bg-slate-950/80 rounded-xl text-slate-300">
                <span className="font-bold text-pink-400 mr-2">@fan_{idx + 1}:</span>
                <span>{c}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 bg-slate-950 rounded-xl text-xs text-white placeholder-slate-500 border border-slate-800 outline-none"
            />
            <button type="submit" className="p-2 bg-pink-600 rounded-xl text-white cursor-pointer">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Bottom App Navigation Bar */}
      <div className="h-12 px-6 bg-black/95 border-t border-white/10 flex items-center justify-between z-30 shrink-0 text-xs">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'feed' ? 'text-white font-bold' : 'text-slate-500'}`}
        >
          <Flame className="w-4 h-4" />
          <span className="text-[10px]">Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className="w-10 h-7 rounded-xl bg-gradient-to-r from-cyan-400 via-pink-500 to-white flex items-center justify-center text-slate-950 font-black shadow-md cursor-pointer hover:scale-105 transition"
          title="Create Video"
        >
          <Plus className="w-4 h-4 text-black stroke-[3]" />
        </button>

        <button
          onClick={() => setActiveTab('monetize')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'monetize' ? 'text-yellow-400 font-bold' : 'text-slate-500'}`}
        >
          <DollarSign className="w-4 h-4" />
          <span className="text-[10px]">Earnings</span>
        </button>
      </div>
    </div>
  );
};
