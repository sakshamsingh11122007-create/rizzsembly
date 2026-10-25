// Initial Mock Profiles & Database for Rizzsembly
const MOCK_PROFILES = [
  // Female Profiles
  {
    id: "f_1",
    name: "Priya Sharma",
    age: 22,
    gender: "female",
    qualification: "Software Engineer @ TechCorp",
    hobby: "Photography & Road Trips",
    hobbies: ["Photography", "Road Trips", "Coding", "Indie Pop"],
    rizzNumber: "RIZZ-882194",
    bio: "Looking for someone who can debug my bad jokes and appreciate 2 AM chai drives. ☕✨",
    location: "Mumbai, India",
    verified: true,
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
    ],
    videoAvatar: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-with-her-phone-41123-large.mp4"
  },
  {
    id: "f_2",
    name: "Ananya Patel",
    age: 24,
    gender: "female",
    qualification: "UX/UI Designer",
    hobby: "Anime & Specialty Coffee",
    hobbies: ["Anime", "Design", "Specialty Coffee", "Pottery"],
    rizzNumber: "RIZZ-341902",
    bio: "Design nerd with 99+ tabs open. If you have Spotify playlists with immaculate vibes, say hi! 🎨🎧",
    location: "Bangalore, India",
    verified: true,
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"
    ],
    videoAvatar: "https://assets.mixkit.co/videos/preview/mixkit-girl-having-a-video-call-with-a-laptop-42999-large.mp4"
  },
  {
    id: "f_3",
    name: "Riya Sen",
    age: 21,
    gender: "female",
    qualification: "Medical Student (MBBS)",
    hobby: "Classical Dance & Literature",
    hobbies: ["Classical Dance", "Reading", "Medicine", "Baking"],
    rizzNumber: "RIZZ-559281",
    bio: "Studying human anatomy by day, listening to ghazals by night. Don't worry, my pulse is steady. 🩺💃",
    location: "Kolkata, India",
    verified: true,
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "f_4",
    name: "Tara Malhotra",
    age: 25,
    gender: "female",
    qualification: "Brand Strategist",
    hobby: "Gym & Scuba Diving",
    hobbies: ["Gym", "Scuba Diving", "Cocktail Crafting", "House Music"],
    rizzNumber: "RIZZ-771203",
    bio: "High energy, gym enthusiast, and professional weekend planner. Challenge me to a 5K! 🏃‍♀️🌊",
    location: "Delhi NCR, India",
    verified: true,
    photos: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "f_5",
    name: "Kiara Das",
    age: 23,
    gender: "female",
    qualification: "Architectural Designer",
    hobby: "Urban Sketching & Acoustic Guitar",
    hobbies: ["Urban Sketching", "Acoustic Guitar", "Museums", "Cats"],
    rizzNumber: "RIZZ-192847",
    bio: "I notice symmetry in architecture and asymmetry in human hearts. Tell me your favorite city. 🏛️🎸",
    location: "Pune, India",
    verified: true,
    photos: [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
    ]
  },

  // Male Profiles
  {
    id: "m_1",
    name: "Kabir Mehta",
    age: 23,
    gender: "male",
    qualification: "Product Designer & Sound Artist",
    hobby: "Cycling & Vinyl Records",
    hobbies: ["Cycling", "Vinyl Records", "Synthwave", "Late-night cooking"],
    rizzNumber: "RIZZ-491823",
    bio: "Collecting good vinyls and better conversations. Can teach you how to make the best aglio olio. 🍝🚲",
    location: "Bangalore, India",
    verified: true,
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
    ],
    videoAvatar: "https://assets.mixkit.co/videos/preview/mixkit-young-man-having-a-video-call-with-smartphone-42998-large.mp4"
  },
  {
    id: "m_2",
    name: "Aryan Verma",
    age: 25,
    gender: "male",
    qualification: "Founder @ FinTech Startup",
    hobby: "Calisthenics & Philosophy Podcasts",
    hobbies: ["Calisthenics", "Podcasts", "Chess", "Backpacking"],
    rizzNumber: "RIZZ-829104",
    bio: "Discipline meets spontaneous trips. Seeking someone with big ambitions and an even bigger laugh. ⚡🏔️",
    location: "Hyderabad, India",
    verified: true,
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "m_3",
    name: "Rohan Roy",
    age: 22,
    gender: "male",
    qualification: "AI Researcher & ML Engineer",
    hobby: "Sci-Fi Novels & Astro-photography",
    hobbies: ["Astro-photography", "Sci-Fi", "Neural Nets", "Trekking"],
    rizzNumber: "RIZZ-619284",
    bio: "Trained neural nets on everything, but human chemistry remains the ultimate unsolved mystery. 🌌🔭",
    location: "Mumbai, India",
    verified: true,
    photos: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "m_4",
    name: "Siddharth Rao",
    age: 26,
    gender: "male",
    qualification: "Commercial Airline Pilot",
    hobby: "Aviation & Skydiving",
    hobbies: ["Aviation", "Skydiving", "Formula 1", "Swimming"],
    rizzNumber: "RIZZ-391850",
    bio: "38,000 feet in the sky on weekdays, exploring street food on weekends. Where should we fly next? ✈️🗺️",
    location: "Delhi, India",
    verified: true,
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "m_5",
    name: "Dev Singhania",
    age: 24,
    gender: "male",
    qualification: "Cinematographer & Director",
    hobby: "Film Editing & Acoustic Guitar",
    hobbies: ["Cinematography", "Acoustic Guitar", "Surfing", "Coffee"],
    rizzNumber: "RIZZ-748291",
    bio: "Living in 24 frames per second. If our life was a movie, what would the soundtrack be? 🎥🎶",
    location: "Goa, India",
    verified: true,
    photos: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

// Random Strangers Worldwide for Omegle-style video calls
const RANDOM_STRANGERS = [
  {
    name: "Elena Rostova",
    country: "🇷🇺 Russia",
    city: "Saint Petersburg",
    rizzNumber: "RIZZ-904812",
    age: 22,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    greeting: "Hey there! Greetings from chilly Saint Petersburg! What time is it where you are?",
    responses: [
      "Haha totally! I'm studying linguistics here.",
      "You have such good vibes! Add me on Rizzsembly so we don't lose each other!",
      "I love random calls, you get to meet people from across the globe."
    ]
  },
  {
    name: "Mateo Silva",
    country: "🇧🇷 Brazil",
    city: "Rio de Janeiro",
    rizzNumber: "RIZZ-602914",
    age: 24,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    greeting: "Ola amigo! Rio vibes here! What are you listening to right now?",
    responses: [
      "Yes!! Bossa nova and sunset beaches are life.",
      "Bro you should visit Brazil sometime! Tap Add Friend so we stay connected!",
      "That's so cool! I'm chilling before going for a surf."
    ]
  },
  {
    name: "Aiko Tanaka",
    country: "🇯🇵 Japan",
    city: "Tokyo",
    rizzNumber: "RIZZ-449102",
    age: 23,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    greeting: "Konnichiwa! 🌸 Just finished evening tea in Shibuya. How's your day going?",
    responses: [
      "Aww that sounds really lovely! Anime or gaming?",
      "Let's definitely be friends on Rizzsembly! Click the Add Friend button! ✨",
      "I'm practicing English so this is super fun!"
    ]
  },
  {
    name: "Liam O'Connor",
    country: "🇮🇪 Ireland",
    city: "Dublin",
    rizzNumber: "RIZZ-718293",
    age: 25,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    greeting: "What's the craic! Liam here from Dublin. Lovely to meet you!",
    responses: [
      "Haha cheers mate! Rizzsembled across the world!",
      "Hit that Add Friend button, I don't want to lose this chat when we skip!",
      "Playing some guitar later tonight, you into music?"
    ]
  },
  {
    name: "Zoe Dupont",
    country: "🇫🇷 France",
    city: "Paris",
    rizzNumber: "RIZZ-839201",
    age: 21,
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    greeting: "Salut! Enchantée! How did you find Rizzsembly?",
    responses: [
      "That's wonderful! Paris is rainy today but warm with coffee.",
      "Add my Rizz Number so we can talk again soon!",
      "I like meeting genuine people like you here."
    ]
  }
];
