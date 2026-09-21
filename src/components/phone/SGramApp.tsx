import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency } from '../../utils/formatters';
import { HOUSING_TIERS, TRANSPORTATION_TIERS } from '../../constants/gameData';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  PlusSquare, 
  Camera, 
  Sparkles, 
  CheckCircle, 
  Grid, 
  Briefcase, 
  Award, 
  Car, 
  Home, 
  Watch, 
  Share2,
  Check,
  X
} from 'lucide-react';

interface SGramPost {
  id: string;
  authorName: string;
  handle: string;
  location: string;
  avatarBg: string;
  imageVisual: {
    bgGradient: string;
    iconType: 'car' | 'home' | 'luxury' | 'business';
    headline: string;
  };
  likes: number;
  caption: string;
  timeAgo: string;
  isLiked?: boolean;
  commentsCount: number;
}

const INITIAL_SGRAM_POSTS: SGramPost[] = [
  {
    id: 'post-1',
    authorName: 'Elena Drake',
    handle: 'elena_drake',
    location: 'Billionaire Row • Downtown',
    avatarBg: 'bg-pink-600',
    imageVisual: {
      bgGradient: 'from-amber-700 via-purple-900 to-slate-900',
      iconType: 'home',
      headline: 'Sunset from the 72nd Floor Penthouse 🏙️🥂'
    },
    likes: 8420,
    caption: 'Another productive week in the bag. Grateful for the team, the vision, and the view. Remember: real estate waits for no one. 🔑 #EmpireBuilders #LuxuryLiving',
    timeAgo: '2h ago',
    commentsCount: 142
  },
  {
    id: 'post-2',
    authorName: 'Marcus Sterling',
    handle: 'marcus_sterling',
    location: 'Monaco Harbor & Yacht Club',
    avatarBg: 'bg-emerald-600',
    imageVisual: {
      bgGradient: 'from-cyan-800 via-blue-950 to-slate-900',
      iconType: 'car',
      headline: 'Fresh delivery off the transporter 🏎️⚡'
    },
    likes: 12600,
    caption: 'Hard work in silence, let the engine do the talking. Up +42% this quarter across all ventures. Cheers to everyone executing today. 🍾🏎️ #V12 #NoDaysOff',
    timeAgo: '5h ago',
    commentsCount: 318
  },
  {
    id: 'post-3',
    authorName: 'Sophia Lin',
    handle: 'sophia_invests',
    location: 'Wall Street Exchange Hub',
    avatarBg: 'bg-violet-600',
    imageVisual: {
      bgGradient: 'from-emerald-800 via-slate-900 to-black',
      iconType: 'business',
      headline: 'Series B Closed: $45,000,000 📈📊'
    },
    likes: 5310,
    caption: 'Proud to announce our latest milestone! From an idea scribbled on a napkin to an industry leader. The journey is just beginning. 🚀 #Fintech #VentureCapital',
    timeAgo: '8h ago',
    commentsCount: 95
  }
];

export const SGramApp: React.FC = () => {
  const { 
    player, 
    socialProfile, 
    addSocialFollowers, 
    spendEnergy, 
    earnCash, 
    ownedBusinesses
  } = useGame();

  const currentHousing = HOUSING_TIERS.find((h) => h.tier === player.housingTier) || HOUSING_TIERS[0];
  const currentTransport = TRANSPORTATION_TIERS.find((t) => t.tier === player.transportationTier) || TRANSPORTATION_TIERS[0];

  const [activeTab, setActiveTab] = useState<'feed' | 'post' | 'sponsors' | 'profile'>('feed');
  const [posts, setPosts] = useState<SGramPost[]>(INITIAL_SGRAM_POSTS);
  const [storyModal, setStoryModal] = useState<{ name: string; handle: string; text: string; bg: string } | null>(null);
  const [claimedSponsors, setClaimedSponsors] = useState<string[]>([]);

  // Stories data
  const stories = [
    { name: 'Your Story', handle: 'you', isUser: true, bg: 'bg-slate-800' },
    { name: 'Elena', handle: 'elena_drake', text: 'Signing paperwork on 3 new commercial plazas! ✍️🏢', bg: 'from-pink-500 to-amber-500' },
    { name: 'Marcus', handle: 'marcus_sterling', text: 'Track day testing the suspension tuning. Absolute rocket! 🚀', bg: 'from-indigo-500 to-cyan-500' },
    { name: 'Sophia', handle: 'sophia_invests', text: 'Pre-market trading looks fiery today! Watch the REITs. 📊', bg: 'from-emerald-500 to-teal-500' },
  ];

  // Like toggler
  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const liked = !p.isLiked;
          return {
            ...p,
            isLiked: liked,
            likes: liked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  // Create new post
  const handlePublishPost = (type: 'housing' | 'wheels' | 'business' | 'watch') => {
    if (player.energy < 20) {
      alert("Not enough energy! You need at least 20⚡ to curate and post photo content.");
      return;
    }

    spendEnergy(20);
    let captionText = '';
    let iconType: 'home' | 'car' | 'business' | 'luxury' = 'luxury';
    let headlineText = '';
    let gradient = 'from-purple-900 via-slate-900 to-black';

    if (type === 'housing') {
      iconType = 'home';
      gradient = 'from-amber-800 via-stone-900 to-slate-950';
      const homeName = currentHousing?.name || "My Space";
      headlineText = `Living high: ${homeName} 🏙️✨`;
      captionText = `Blessed to call this place home. Focus on long-term assets and compound growth! 🔑 #CribTour #HustleRewards`;
    } else if (type === 'wheels') {
      iconType = 'car';
      gradient = 'from-red-900 via-slate-900 to-black';
      const whip = currentTransport?.name || 'My Ride';
      headlineText = `New machine: ${whip} 🏎️💨`;
      captionText = `Nothing beats clean wheels and open roads. From riding the bus to owning the road! 🏁 #WhipGame #Speed`;
    } else if (type === 'business') {
      iconType = 'business';
      gradient = 'from-cyan-900 via-slate-900 to-black';
      const biz = ownedBusinesses[0]?.name || 'Hustle Operations';
      headlineText = `Boardroom execution at ${biz} 💼📈`;
      captionText = `Another milestone reached! The grind you put in behind closed doors is what creates the victory. 🚀 #CeoLife #Empire`;
    } else {
      iconType = 'luxury';
      gradient = 'from-yellow-900 via-slate-900 to-black';
      headlineText = `Swiss Precision: Time is Money ⌚✨`;
      captionText = `Invest in time, because it is the only currency you can never get back. 💎 #Horology #BillionaireMindset`;
    }

    // Algorithmic luck roll (does NOT guarantee followers - authentic slow climb):
    // 50% chance: Algorithm flop (0 followers, 1-5 likes)
    // 32% chance: Small trickle (+1 to +3 followers)
    // 14% chance: Decent traction (+4 to +8 followers)
    // 4% chance: Curated explore feature (+10 to +20 followers)
    const roll = Math.random();
    let gainedFollowers = 0;
    let gainedLikes = 0;
    let feedbackMsg = '';

    if (roll < 0.50) {
      gainedFollowers = 0;
      gainedLikes = Math.floor(Math.random() * 5) + 1;
      feedbackMsg = "Post reached few accounts: 0 new followers, but a few likes from mutuals. Keep posting consistently!";
    } else if (roll < 0.82) {
      gainedFollowers = Math.floor(Math.random() * 3) + 1;
      gainedLikes = gainedFollowers * (Math.floor(Math.random() * 3) + 2) + 4;
      feedbackMsg = `Your aesthetic caught attention! Gained +${gainedFollowers} follower${gainedFollowers > 1 ? 's' : ''} and ${gainedLikes} likes.`;
    } else if (roll < 0.96) {
      gainedFollowers = Math.floor(Math.random() * 5) + 4;
      gainedLikes = gainedFollowers * (Math.floor(Math.random() * 3) + 3) + 10;
      feedbackMsg = `Explore tab pickup! Gained +${gainedFollowers} followers and ${gainedLikes} likes.`;
    } else {
      gainedFollowers = Math.floor(Math.random() * 11) + 10;
      gainedLikes = gainedFollowers * 4 + 25;
      feedbackMsg = `✨ Curated repost! Gained +${gainedFollowers} followers and ${gainedLikes} likes!`;
    }

    if (gainedFollowers > 0 || gainedLikes > 0) {
      addSocialFollowers('sgram', gainedFollowers, gainedLikes);
    }

    const userPost: SGramPost = {
      id: `my-post-${Date.now()}`,
      authorName: player.name,
      handle: player.name.toLowerCase().replace(/\s+/g, '_'),
      location: 'Metropolitan District',
      avatarBg: 'bg-gradient-to-tr from-pink-500 to-amber-500',
      imageVisual: {
        bgGradient: gradient,
        iconType,
        headline: headlineText
      },
      likes: gainedLikes,
      caption: captionText,
      timeAgo: 'Just now',
      commentsCount: Math.floor(gainedLikes * 0.05)
    };

    setPosts((prev) => [userPost, ...prev]);
    setActiveTab('feed');
    alert(feedbackMsg);
  };

  // Brand Deal sponsorship claims (progressive milestones for slow climb)
  const SPONSOR_TIERS = [
    { id: 'sp-0', brand: 'Local Bean Roasters', reqFollowers: 50, payout: 150, desc: 'Feature iced coffee can in your daily story.' },
    { id: 'sp-1', brand: 'Metro Gym Apparel', reqFollowers: 200, payout: 400, desc: 'Tag @MetroFit in your workout or lifestyle post.' },
    { id: 'sp-2', brand: 'Apex Electrolyte Water', reqFollowers: 600, payout: 950, desc: 'Single sponsored post tagging @ApexHydro.' },
    { id: 'sp-3', brand: 'Chronos Luxury Watches', reqFollowers: 2500, payout: 3500, desc: 'Wear and tag their latest timepiece in your feed.' },
    { id: 'sp-4', brand: 'Titan Private Wealth Advisory', reqFollowers: 10000, payout: 12000, desc: 'Promote high-net-worth portfolio management.' }
  ];

  const handleClaimSponsor = (s: typeof SPONSOR_TIERS[0]) => {
    if (socialProfile.sgramFollowers < s.reqFollowers) {
      alert(`You need at least ${s.reqFollowers.toLocaleString()} SGram followers for this sponsorship!`);
      return;
    }
    if (claimedSponsors.includes(s.id)) {
      alert("You already completed this brand sponsorship!");
      return;
    }

    earnCash(s.payout);
    setClaimedSponsors((prev) => [...prev, s.id]);
    alert(`🎉 Deal signed! ${s.brand} paid you ${formatCurrency(s.payout)} for a sponsored post campaign!`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-white relative select-none">
      {/* Top App Header */}
      <div className="h-11 px-4 flex items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-md shrink-0 z-30">
        <div className="flex items-center gap-1.5">
          <span className="font-serif italic font-black text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 bg-clip-text text-transparent">
            SGram
          </span>
          {socialProfile.isVerified && (
            <CheckCircle className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('post')}
            className="text-slate-300 hover:text-white cursor-pointer"
            title="Create Post"
          >
            <PlusSquare className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('sponsors')}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold border border-amber-500/30 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Deals</span>
          </button>
        </div>
      </div>

      {/* Stories Bar (Shown when in Feed tab) */}
      {activeTab === 'feed' && (
        <div className="flex items-center gap-3 px-3 py-2.5 overflow-x-auto border-b border-white/10 bg-slate-950/60 shrink-0 scrollbar-none">
          {stories.map((s, idx) => (
            <div 
              key={idx}
              onClick={() => {
                if (s.isUser) {
                  setActiveTab('post');
                } else if (s.text) {
                  setStoryModal({ name: s.name, handle: s.handle, text: s.text, bg: s.bg });
                }
              }}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
            >
              <div className={`p-0.5 rounded-full ${s.isUser ? 'bg-slate-700' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'} group-hover:scale-105 transition`}>
                <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-slate-200">
                  {s.isUser ? <Camera className="w-4 h-4 text-pink-400" /> : s.name.slice(0, 1)}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 truncate max-w-[56px] text-center">{s.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* SUB-VIEW 1: FEED */}
      {activeTab === 'feed' && (
        <div className="flex-1 overflow-y-auto divide-y divide-white/10 pb-16">
          {posts.map((post) => (
            <div key={post.id} className="py-3 space-y-2.5">
              {/* Post Header */}
              <div className="px-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full ${post.avatarBg} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                    {post.authorName.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs font-bold text-white">
                      <span>{post.handle}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{post.location}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{post.timeAgo}</span>
              </div>

              {/* Visual Photo Canvas */}
              <div 
                onDoubleClick={() => toggleLike(post.id)}
                className={`w-full aspect-square bg-gradient-to-br ${post.imageVisual.bgGradient} relative flex flex-col items-center justify-center p-6 text-center shadow-inner cursor-pointer group`}
              >
                <div className="w-16 h-16 rounded-3xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl mb-3 group-hover:scale-110 transition">
                  {post.imageVisual.iconType === 'car' && <Car className="w-8 h-8 text-rose-400" />}
                  {post.imageVisual.iconType === 'home' && <Home className="w-8 h-8 text-amber-400" />}
                  {post.imageVisual.iconType === 'business' && <Briefcase className="w-8 h-8 text-cyan-400" />}
                  {post.imageVisual.iconType === 'luxury' && <Watch className="w-8 h-8 text-yellow-400" />}
                </div>
                <h4 className="text-sm font-black text-white px-4 leading-snug drop-shadow-md">
                  {post.imageVisual.headline}
                </h4>
              </div>

              {/* Action Icons Bar */}
              <div className="px-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleLike(post.id)} 
                      className="cursor-pointer active:scale-125 transition"
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'text-pink-500 fill-pink-500' : 'text-white'}`} />
                    </button>
                    <button 
                      onClick={() => alert(`Showing ${post.commentsCount} comments!`)}
                      className="cursor-pointer hover:text-slate-300 transition"
                    >
                      <MessageCircle className="w-5 h-5 text-white" />
                    </button>
                    <button 
                      onClick={() => alert("Post shared to your story!")}
                      className="cursor-pointer hover:text-slate-300 transition"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <Bookmark className="w-5 h-5 text-white cursor-pointer hover:text-amber-400" />
                </div>

                <div className="text-xs font-black text-white">
                  {post.likes.toLocaleString()} likes
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-black text-white mr-1.5">{post.handle}</span>
                  <span>{post.caption}</span>
                </div>

                <button 
                  onClick={() => alert("Comments opened")}
                  className="text-[11px] text-slate-500 hover:text-slate-400 cursor-pointer block pt-0.5"
                >
                  View all {post.commentsCount} comments
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-VIEW 2: CREATE POST */}
      {activeTab === 'post' && (
        <div className="flex-1 p-4 pb-16 overflow-y-auto space-y-4">
          <div className="text-center space-y-1 pt-2">
            <h3 className="text-base font-black text-white">Share to SGram Feed</h3>
            <p className="text-xs text-slate-400">Flex your assets to expand your high-society followers and unlock luxury sponsorships.</p>
          </div>

          <div className="space-y-2.5 pt-2">
            {/* Post Current Housing */}
            <button
              onClick={() => handlePublishPost('housing')}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/40 hover:border-amber-400 text-left transition flex items-center justify-between group cursor-pointer active:scale-98"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Post Your Residence</span>
                </div>
                <p className="text-[11px] text-slate-400">{currentHousing?.name || "Mom's Couch"} tour & interior aesthetic</p>
                <div className="text-[10px] text-amber-300 font-semibold">+800 to +2,500 Followers • 15⚡ Energy</div>
              </div>
              <Camera className="w-4 h-4 text-amber-400" />
            </button>

            {/* Post Wheels */}
            <button
              onClick={() => handlePublishPost('wheels')}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-500/40 hover:border-rose-400 text-left transition flex items-center justify-between group cursor-pointer active:scale-98"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-white">Post Your Whip / Vehicle</span>
                </div>
                <p className="text-[11px] text-slate-400">{currentTransport?.name || "Urban Scooter"} photoshoot</p>
                <div className="text-[10px] text-rose-300 font-semibold">+1,000 to +3,000 Followers • 15⚡ Energy</div>
              </div>
              <Camera className="w-4 h-4 text-rose-400" />
            </button>

            {/* Post Business Milestone */}
            <button
              onClick={() => handlePublishPost('business')}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-left transition flex items-center justify-between group cursor-pointer active:scale-98"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Business Milestone</span>
                </div>
                <p className="text-[11px] text-slate-400">Boardroom presentation and company growth flex</p>
                <div className="text-[10px] text-cyan-300 font-semibold">+1,200 to +3,500 Followers • 15⚡ Energy</div>
              </div>
              <Camera className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Post Luxury Accessories */}
            <button
              onClick={() => handlePublishPost('watch')}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/40 hover:border-purple-400 text-left transition flex items-center justify-between group cursor-pointer active:scale-98"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Watch className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">Timepiece & Luxury Flex</span>
                </div>
                <p className="text-[11px] text-slate-400">Close-up wrist shot with gold and diamonds</p>
                <div className="text-[10px] text-purple-300 font-semibold">+900 to +2,000 Followers • 15⚡ Energy</div>
              </div>
              <Camera className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: BRAND DEALS & SPONSORSHIPS */}
      {activeTab === 'sponsors' && (
        <div className="flex-1 p-4 pb-16 overflow-y-auto space-y-4">
          <div className="text-center space-y-1 pt-2">
            <h3 className="text-base font-black text-white">Influencer Sponsorship Deals</h3>
            <p className="text-xs text-slate-400">Brands reach out to sponsor creators with large reach. Claim cash deals as your follower base expands!</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Your SGram Reach:</span>
            <span className="text-sm font-black text-pink-400">{socialProfile.sgramFollowers.toLocaleString()} Followers</span>
          </div>

          <div className="space-y-2.5">
            {SPONSOR_TIERS.map((s) => {
              const eligible = socialProfile.sgramFollowers >= s.reqFollowers;
              const claimed = claimedSponsors.includes(s.id);

              return (
                <div 
                  key={s.id}
                  className={`p-3.5 rounded-2xl border transition ${claimed ? 'bg-slate-900/40 border-slate-800 opacity-60' : eligible ? 'bg-gradient-to-r from-emerald-950/50 to-slate-900 border-emerald-500/40' : 'bg-slate-900/60 border-slate-800'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-white">{s.brand}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{s.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400">{formatCurrency(s.payout)}</span>
                      <div className="text-[10px] text-slate-500 font-semibold">{s.reqFollowers.toLocaleString()} req.</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      disabled={!eligible || claimed}
                      onClick={() => handleClaimSponsor(s)}
                      className="w-full py-1.5 rounded-xl text-xs font-black transition cursor-pointer disabled:opacity-40 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md"
                    >
                      {claimed ? 'Completed ✓' : eligible ? `Accept Sponsorship (${formatCurrency(s.payout)})` : `Requires ${s.reqFollowers.toLocaleString()} Followers`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: PROFILE */}
      {activeTab === 'profile' && (
        <div className="flex-1 p-4 pb-16 overflow-y-auto space-y-4">
          <div className="flex items-center gap-4 pt-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 p-0.5">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xl font-black text-white">
                {player.name.slice(0, 1)}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-xs font-black text-white">{posts.length}</span>
                <span className="block text-[10px] text-slate-400">Posts</span>
              </div>
              <div>
                <span className="text-xs font-black text-white">{socialProfile.sgramFollowers.toLocaleString()}</span>
                <span className="block text-[10px] text-slate-400">Followers</span>
              </div>
              <div>
                <span className="text-xs font-black text-white">340</span>
                <span className="block text-[10px] text-slate-400">Following</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">{player.name}</span>
              {socialProfile.isVerified && (
                <CheckCircle className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-300">
              Empire Builder & Investor 🏙️💼 Building generational wealth in the city.
            </p>
          </div>

          {/* Grid View */}
          <div className="border-t border-white/10 pt-3">
            <div className="flex items-center gap-2 pb-2 text-xs font-bold text-slate-300">
              <Grid className="w-4 h-4 text-pink-400" />
              <span>Posts Grid</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {posts.map((p) => (
                <div key={p.id} className={`aspect-square bg-gradient-to-br ${p.imageVisual.bgGradient} rounded flex items-center justify-center p-2 text-center`}>
                  <span className="text-[9px] font-bold text-white line-clamp-2">{p.imageVisual.headline}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Story View Modal */}
      {storyModal && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col justify-between p-4">
          <div className="flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                {storyModal.name.slice(0, 1)}
              </div>
              <span className="text-xs font-bold text-white">@{storyModal.handle}</span>
            </div>
            <button onClick={() => setStoryModal(null)} className="text-white hover:text-slate-300 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <p className="text-base font-black text-white leading-relaxed">
              "{storyModal.text}"
            </p>
          </div>

          <button 
            onClick={() => setStoryModal(null)}
            className="w-full py-2.5 rounded-xl bg-white/20 backdrop-blur-md text-xs font-bold text-white cursor-pointer"
          >
            Tap to close
          </button>
        </div>
      )}

      {/* Bottom App Navigation */}
      <div className="h-12 px-6 bg-black/95 border-t border-white/10 flex items-center justify-between shrink-0 z-30 text-xs">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'feed' ? 'text-white font-bold' : 'text-slate-500'}`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('post')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'post' ? 'text-pink-400 font-bold' : 'text-slate-500'}`}
        >
          <PlusSquare className="w-4 h-4" />
          <span className="text-[10px]">Post</span>
        </button>

        <button
          onClick={() => setActiveTab('sponsors')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'sponsors' ? 'text-amber-400 font-bold' : 'text-slate-500'}`}
        >
          <Award className="w-4 h-4" />
          <span className="text-[10px]">Deals</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'profile' ? 'text-white font-bold' : 'text-slate-500'}`}
        >
          <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-bold">
            {player.name.slice(0, 1)}
          </div>
          <span className="text-[10px]">Profile</span>
        </button>
      </div>
    </div>
  );
};
