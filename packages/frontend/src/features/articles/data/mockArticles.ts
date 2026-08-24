import { Article } from '../types';

export const MOCK_ARTICLES: Article[] = [
  {
    id: '10-unconventional-gaming-worlds',
    title: '10 Unconventional Gaming Worlds You Must Explore',
    excerpt: 'What makes gamers fall in love with exploring the unknown? Superior world-building, of course.',
    content: `
      <p class="text-2xl font-medium leading-relaxed mb-8 text-[#f7ebc6]">
        What makes gamers fall in love with exploring the unknown? Superior world-building, of course, courtesy of developers who produce powerful, crystal-clear atmosphere. Trust us, these virtual worlds feel way better than reality.
      </p>
      <p class="mb-6 leading-relaxed">
        Most premium RPGs are massive, and that can be overwhelming if you only have a few hours to play. However, stepping off the beaten path can reveal secrets that most players miss. You don't have to follow the main quest marker forever.
      </p>
      <h2 class="text-3xl font-black mt-12 mb-6 text-[#f7ebc6] flex items-center gap-4">
        <span class="w-8 h-1 bg-[#B05B27] inline-block"></span>
        The Unexpected Power of the Wilderness
      </h2>
      <p class="mb-6 leading-relaxed">
        Traveling through the glowing forests of Eldoria shows exactly why exploration matters. The developers spent years crafting an ecosystem where predators and prey interact naturally.
      </p>
      <blockquote class="my-10 pl-6 border-l-4 border-[#B05B27] bg-[#1a241b]/50 py-4 pr-4 italic text-xl font-medium text-[#f7ebc6] shadow-sm">
        "The most important narrative in any game is not the one written by the developers, but the one created by the player getting lost in the woods."
      </blockquote>
      <p class="mb-6 leading-relaxed">
        If you look closely at the rendering engine, the lighting uses advanced ray-tracing to simulate the exact bounce of moonlight off the wet grass. 
      </p>
      <div class="w-full aspect-video my-10 relative bg-[#1a241b] border border-[#d4c38d] p-2">
        <div class="w-full h-full overflow-hidden">
          <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200" alt="Inner image" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
      </div>
      <p class="mb-6 leading-relaxed">
        And so, as we wait for the next big DLC expansion, taking time to revisit these old zones brings a new sense of appreciation. Don't rush to the endgame. Enjoy the journey.
      </p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=2500',
    category: 'REVIEWS',
    tags: ['RPG', 'OPEN WORLD', 'EXPLORATION', 'REVIEWS'],
    author: {
      name: 'Kelly',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
    },
    publishedAt: 'June 5, 2024',
    readTime: '5 min read',
    commentsCount: 12
  },
  {
    id: 'esports-competitive-scene-heating-up',
    title: 'The Competitive Scene is Heating Up This Season',
    excerpt: 'Top teams are battling it out for a massive prize pool in the upcoming international tournament.',
    content: '<p class="text-xl">Esports is reaching new heights this year. More content to come...</p>',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
    category: 'ESPORTS',
    tags: ['ESPORTS', 'TOURNAMENT', 'COMPETITIVE'],
    author: {
      name: 'Marcus',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
    },
    publishedAt: 'July 12, 2024',
    readTime: '3 min read',
    commentsCount: 45
  },
  {
    id: 'next-gen-hardware-revealed',
    title: 'Next-Gen Hardware Revealed: What to Expect',
    excerpt: 'The latest graphics cards are promising a 50% performance leap. Is it worth the upgrade?',
    content: '<p class="text-xl">Hardware enthusiasts have a lot to look forward to. More content to come...</p>',
    coverImage: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=1200',
    category: 'HARDWARE',
    tags: ['HARDWARE', 'PC GAMING', 'TECH'],
    author: {
      name: 'Sarah',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
    },
    publishedAt: 'August 1, 2024',
    readTime: '8 min read',
    commentsCount: 89
  },
  {
    id: 'indie-games-to-watch',
    title: 'Top 5 Indie Games to Watch Out For in 2025',
    excerpt: 'Small teams, huge ideas. These indie titles are pushing the boundaries of creativity.',
    content: '<p class="text-xl">Indie games continue to innovate where AAA plays it safe. More content to come...</p>',
    coverImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1200',
    category: 'INDIE',
    tags: ['INDIE', 'PREVIEW', 'UPCOMING'],
    author: {
      name: 'Alex',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100'
    },
    publishedAt: 'August 10, 2024',
    readTime: '4 min read',
    commentsCount: 22
  },
  {
    id: 'retro-gaming-comeback',
    title: 'Why Retro Gaming is Making a Massive Comeback',
    excerpt: 'Players are flocking back to 8-bit and 16-bit classics. We explore the nostalgia factor.',
    content: '<p class="text-xl">Nostalgia is a powerful force in gaming...</p>',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
    category: 'RETRO',
    tags: ['RETRO', 'NOSTALGIA', 'CLASSIC'],
    author: {
      name: 'Emma',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
    },
    publishedAt: 'August 15, 2024',
    readTime: '6 min read',
    commentsCount: 34
  },
  {
    id: 'cyberpunk-revival',
    title: 'Cyberpunk Revival: The Comeback Story of the Decade',
    excerpt: 'After a disastrous launch, continuous updates have turned this sci-fi RPG into a masterpiece.',
    content: '<p>The redemption arc is complete...</p>',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
    category: 'REVIEWS',
    tags: ['RPG', 'CYBERPUNK', 'UPDATE'],
    author: { name: 'Kevin', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100' },
    publishedAt: 'August 18, 2024',
    readTime: '7 min read',
    commentsCount: 112
  },
  {
    id: 'best-coop-games-2024',
    title: 'Top 10 Co-Op Games to Ruin Your Friendships',
    excerpt: 'Looking for a game to test your relationship? These cooperative titles are pure chaos.',
    content: '<p>Communication is key, but yelling is funnier...</p>',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=1200',
    category: 'FEATURES',
    tags: ['CO-OP', 'MULTIPLAYER', 'LIST'],
    author: { name: 'Lily', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
    publishedAt: 'August 20, 2024',
    readTime: '5 min read',
    commentsCount: 56
  },
  {
    id: 'console-war-ends',
    title: 'Is the Traditional Console War Finally Over?',
    excerpt: 'With cross-platform play and cloud gaming on the rise, hardware exclusivity is dying.',
    content: '<p>The era of buying a box just for one game is fading...</p>',
    coverImage: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=1200',
    category: 'OPINION',
    tags: ['CONSOLE', 'INDUSTRY', 'FUTURE'],
    author: { name: 'Marcus', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' },
    publishedAt: 'August 22, 2024',
    readTime: '6 min read',
    commentsCount: 201
  }
];

export const getArticleById = (id: string): Article | undefined => {
  return MOCK_ARTICLES.find(article => article.id === id);
};

export const getRecentArticles = (limit: number = 4, skip: number = 0): Article[] => {
  return MOCK_ARTICLES.slice(skip, skip + limit);
};
