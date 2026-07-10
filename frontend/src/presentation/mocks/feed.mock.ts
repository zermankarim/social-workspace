export type MockFeedAuthor = {
  id: string;
  name: string;
  headline: string;
  avatarInitials: string;
};

export type MockFeedPost = {
  id: string;
  author: MockFeedAuthor;
  createdAtLabel: string;
  body: string;
  likes: number;
  comments: number;
  reposts: number;
};

export const MOCK_FEED_POSTS: MockFeedPost[] = [
  {
    id: "1",
    author: {
      id: "a1",
      name: "Elena Petrova",
      headline: "Product Designer · Building calm interfaces",
      avatarInitials: "EP",
    },
    createdAtLabel: "2h · ",
    body: "Shipping a cleaner onboarding flow this week. Small copy changes cut drop-off more than another animation ever did.\n\nWhat tiny UX fix made the biggest impact in your product?",
    likes: 128,
    comments: 34,
    reposts: 12,
  },
  {
    id: "2",
    author: {
      id: "a2",
      name: "Marcus Chen",
      headline: "Staff Engineer · Distributed systems",
      avatarInitials: "MC",
    },
    createdAtLabel: "5h · ",
    body: "Reminder: “people nearby” features need coordinates + a boring index before they need a fancy map UI.\n\nStore lat/lng first. Pretty pins later.",
    likes: 89,
    comments: 21,
    reposts: 9,
  },
  {
    id: "3",
    author: {
      id: "a3",
      name: "Sofia Alvarez",
      headline: "Founder · Community-led growth",
      avatarInitials: "SA",
    },
    createdAtLabel: "1d · ",
    body: "Mock feed for now — real posts are next on the backend. Until then, this is the shape of the home experience after sign-in.",
    likes: 56,
    comments: 8,
    reposts: 3,
  },
];

export const MOCK_NEWS_ITEMS = [
  {
    id: "n1",
    title: "Remote teams rethink office days",
    readers: "8,412 readers",
  },
  {
    id: "n2",
    title: "AI tooling moves into everyday workflows",
    readers: "12,901 readers",
  },
  {
    id: "n3",
    title: "Hiring slows, quality bar rises",
    readers: "5,220 readers",
  },
];

export const MOCK_SUGGESTIONS = [
  {
    id: "s1",
    name: "Jordan Lee",
    headline: "Frontend Engineer",
    initials: "JL",
  },
  {
    id: "s2",
    name: "Priya Nair",
    headline: "People Ops Lead",
    initials: "PN",
  },
];
