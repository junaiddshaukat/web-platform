export type ResourceItem = {
  title: string;
  href?: string;
  description?: string;
  internalSlug?: string;
};

export type ResourceCategory = {
  id: string;
  title: string;
  items: ResourceItem[];
};

// Interview Prep and Career resources aggregated from the shared sheet export
export const resourceCategories: ResourceCategory[] = [
  {
    id: "open-source-programs",
    title: "Open Source Programs",
    items: [
      {
        title: "Google Summer of Code (GSoC)",
        href: "https://summerofcode.withgoogle.com/",
        description: "Flexible 10–22 week program with 700+ orgs."
      },
      {
        title: "Linux Foundation Mentorship (LFX)",
        href: "https://mentorship.lfx.linuxfoundation.org/",
        description: "3 terms yearly; paid mentorships across LF projects."
      },
      {
        title: "MLH Fellowship",
        href: "https://fellowship.mlh.io/",
        description: "Multiple tracks including open source."
      },
      {
        title: "Outreachy",
        href: "https://www.outreachy.org/",
        description: "Paid remote internships to support underrepresented groups."
      },
      {
        title: "Google Season of Docs",
        href: "https://developers.google.com/season-of-docs",
        description: "Paid, for technical writers/documentation contributors."
      },
      {
        title: "CNCF Mentoring Initiatives",
        href: "https://github.com/cncf/mentoring",
        description: "Cloud Native mentorship programs and resources."
      },
      {
        title: "FOSSASIA Codeheat",
        href: "https://codeheat.org/",
        description: "Beginner‑friendly coding contest for FOSSASIA projects."
      },
    ],
  },
  {
    id: "cp-resources",
    title: "CP / DSA Resources",
    items: [
      {
        title: "TLE Eliminators – YouTube Playlists",
        href: "https://www.youtube.com/@TLE_Eliminators/playlists",
      },
      {
        title: "TLE Eliminators – CP 31 Sheet",
        href: "https://www.tle-eliminators.com/cp-sheet",
      },
      {
        title: "Algorithms with Shayan (IGM / ICPC)",
        href: "https://www.youtube.com/@AlgorithmswithShayan",
      },
      {
        title: "Colin Galen – Playlists",
        href: "https://www.youtube.com/@ColinGalen/playlists",
        description: "Number theory and psychology of CP."
      },
      {
        title: "Sai Avinash – Maths for CP Playlist",
        href: "https://www.youtube.com/playlist?list=PLN4aKSfpk8TQUiURV1k70At4Tj5oKb92i",
      },
    ],
  },
  {
    id: "job-prep-branding",
    title: "Job Prep & Branding",
    items: [
      {
        title: "How to Land Job Interviews – Full Playlist",
        href: "https://www.youtube.com/playlist?list=PLo-kPya_Ww2x1PzbqzmPPC5v7fCYhrK4z",
      },
      {
        title: "Documented Notes for the Playlist",
        href: "https://mu-saqlain.notion.site/How-to-Land-Job-Interviews-d71c0033d56b4e0e846d4dd3ebe13d3b?pvs=4",
      },
      {
        title: "Software Engineer’s Guide to a Great LinkedIn Profile",
        href: "https://medium.com/@wangjoshuah/the-software-engineers-guide-to-writing-a-linkedin-profile-that-stands-out-bf91d0b80ae8",
      },
      {
        title: "Levels.fyi – Highest Paying SWE Jobs",
        href: "https://www.levels.fyi/leaderboard/Software-Engineer/All-Levels/country/United-States/",
      },
      {
        title: "LinkedIn Recruiter Search (example)",
        href: "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22102454443%22%2C%22103644278%22%2C%22101165590%22%2C%22101355337%22%5D&keywords=technical%20recruiter%20amazon&origin=FACETED_SEARCH",
      },
      {
        title: "X Jobs",
        href: "http://x.com/jobs",
      },
      {
        title: "Jeff Su – ChatGPT for Job Seekers",
        href: "https://www.jeffsu.org/chatgpt-for-job-seekers-best-and-worst-use-cases/",
      },
      {
        title: "Simplify Jobs",
        href: "https://simplify.jobs/jobs?experience=Mid%20Level%3BSenior",
      },
      {
        title: "LeetCode – Interview Strategy",
        href: "https://leetcode.com/explore/interview/card/coding-interview-strategy/206/chapter-1-the-interview-process/",
      },
    ],
  },
  {
    id: "helpful-tools",
    title: "Helpful Tools",
    items: [
      { title: "PFP Maker – LinkedIn Profile Photo", href: "https://app.pfpmaker.com/results/" },
      { title: "Canva – Banners & Visuals", href: "https://canva.com/" },
      { title: "v0 – Generate React/Next Components", href: "https://v0.dev/" },
      { title: "Dev Code Design (AI)", href: "https://dev.codedesign.ai/" },
      { title: "unDraw Illustrations", href: "https://undraw.co/illustrations" },
      { title: "Free For Students – Perks", href: "https://freeforstudents.org/row" },
      { title: "10up Engineering Best Practices", href: "https://10up.github.io/Engineering-Best-Practices/" },
    ],
  },
  {
    id: "engineering-channels",
    title: "Engineering Channels (Recommendations)",
    items: [
      { title: "Hussein Nasser – YouTube" },
      { title: "Designing Data‑Intensive Applications (book)" },
      { title: "Acing the System Design Interview" },
      { title: "Educative.io – Courses" },
      { title: "Jordan has no life – YouTube" },
    ],
  },
  {
    id: "good-books",
    title: "Good Books",
    items: [
      { title: "Atomic Habits" },
      { title: "The One Thing" },
      { title: "Master Your Emotions" },
      { title: "The 5 AM Club" },
      { title: "Hyperfocus" },
      { title: "Emotional Intelligence (Daniel Goleman)" },
    ],
  },
  {
    id: "analytical",
    title: "Analytical Puzzles",
    items: [
      { title: "Cut cake into 8 pieces in 3 cuts" },
      { title: "3 Bulbs problem" },
      { title: "Gold bar weighing (8 g)" },
      { title: "6 balls (odd one)" },
      { title: "7L & 3L jugs – measure 4 & 5" },
      { title: "Sandglass 7 min & 4 min – measure 5 min" },
      { title: "Hat colors deduction" },
      { title: "Pirates problem" },
    ],
  },
  {
    id: "interview-experiences",
    title: "Interview Experiences",
    items: [
      { title: "Arham Soft – Interview Experience", internalSlug: "arham-soft-interview-experience" },
    ],
  },
];


