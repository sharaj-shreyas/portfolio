/**
 * Every string rendered on the page lives here. Components only decide
 * *where* copy appears, never *what* it says — edit this file to edit the site.
 */

export type NavLink = {
  number: string;
  label: string;
  href: string;
};

export type Fact = {
  label: string;
  value: string;
};

export type EducationItem = {
  when: string;
  what: string;
  where: string;
  score?: string;
};

export type StampRow = {
  label: string;
  value: string;
};

export type PlateLine = {
  text: string;
  italic?: boolean;
  sub?: string;
  subStyle?: "italic" | "sup";
};

export type Plate = {
  lines: PlateLine[];
  title: string;
  caption: string;
};

export type Role = {
  title: string;
  dates: string;
};

export type PullQuote = {
  name: string;
  years: string;
  note: string;
};

export type ExperienceEntry = {
  id: string;
  org: string;
  dates?: string;
  badge?: string;
  roles: Role[];
  intro?: string;
  bullets?: string[];
  pull?: PullQuote;
  plate?: Plate;
  longform?: {
    paragraphs: string[];
    highlights: { title: string; text: string }[];
  };
  layout: "main" | "side" | "long";
};

export type ProjectCategory =
  | "robotics"
  | "electronics"
  | "flight"
  | "games"
  | "science";

export type FilterId = "all" | ProjectCategory;

export type ProjectFilter = {
  id: FilterId;
  label: string;
};

export type Project = {
  category: ProjectCategory;
  categoryLabel: string;
  title: string;
  year?: string;
  note?: string;
  /** Optional enrichment fields — fill these in later without touching components. */
  description?: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  link?: {
    href: string;
    label?: string;
  };
};

/* ------------------------------------------------------------------ */
/* Site                                                                */
/* ------------------------------------------------------------------ */

export const site = {
  name: "Sharaj Shreyas",
  title: "Sharaj Shreyas Portfolio",
  description:
    "Sharaj Shreyas, Civil Engineering student at IIT Gandhinagar. Robotics, hardware, CAD and prototyping: soccer bots, RC planes and more.",
  email: "sharajshreyas@iitgn.ac.in",
  phoneDisplay: "+91 94803 47138",
  phoneHref: "tel:+919480347138",
  location: "Gandhinagar, India",
} as const;

export const ui = {
  skipToContent: "Skip to content",
  copy: "Copy",
  copied: "Copied",
  selected: "Selected",
  copyEmail: "Copy email address",
  copyPhone: "Copy phone number",
  menuSections: "Sections",
  closeMenu: "Close",
} as const;

/* ------------------------------------------------------------------ */
/* Masthead + menu + section index                                     */
/* ------------------------------------------------------------------ */

export const masthead = {
  location: "Gandhinagar, IN",
  name: "Sharaj Shreyas",
  menu: "Menu",
} as const;

export const menu = {
  links: [
    { number: "01", label: "About", href: "#about" },
    { number: "02", label: "Experience", href: "#experience" },
    { number: "03", label: "Projects", href: "#projects" },
    { number: "04", label: "Skills", href: "#skills" },
    { number: "05", label: "Contact", href: "#contact" },
  ] satisfies NavLink[],
  email: site.email,
} as const;

export const indexNav = {
  kicker: "Fresher at IIT Gandhinagar",
  edition: "Portfolio, 2026",
  links: [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Banners                                                             */
/* ------------------------------------------------------------------ */

export const openingBanner = {
  hiddenTitle: "Sharaj Shreyas",
  word: "Sharaj",
  right: "Builder by trade, maker at heart",
  left: "Robotics, weightlifting, design and building things",
} as const;

export const closingBanner = {
  word: "Shreyas",
} as const;

/* ------------------------------------------------------------------ */
/* 01 About                                                            */
/* ------------------------------------------------------------------ */

export const about = {
  number: "01",
  label: "About",
  title: "Robotics, design & building things!",
  lede: "I’m Sharaj Shreyas, a Civil Engineering student at IIT Gandhinagar, passionate about robotics, technology, design, and building things. I enjoy building projects while constantly learning, experimenting, and creating.",
  portrait: {
    src: "/assets/sharaj-shreyas.jpg",
    width: 359,
    height: 478,
    alt: "Me in a dark blazer and white shirt, standing outdoors beside a brick wall",
    caption: "Porträt meiner selbst, 2026",
  },
  facts: [
    { label: "Now", value: "Member, Mean Mechanics" },
    { label: "Led", value: "Makerspace CFAL, as President" },
    { label: "Studying", value: "Civil Engineering, IIT Gandhinagar" },
  ] satisfies Fact[],
  links: [
    { label: "See the projects", href: "#projects" },
    { label: "Get in touch", href: "#contact" },
  ],
  stamp: {
    initial: "S",
    name: "Sharaj Shreyas",
    rows: [
      { label: "Name", value: "Sharaj Shreyas" },
      { label: "Branch", value: "Civil Engineering" },
    ] satisfies StampRow[],
  },
  educationTitle: "Education",
  education: [
    {
      when: "2026 – Present",
      what: "Civil Engineering",
      where: "IIT Gandhinagar",
    },
    {
      when: "2024 – 2026",
      what: "Pre-University College",
      where: "The Learning Center PUC",
      score: "Score 96.67",
    },
    {
      when: "2017 – 2024",
      what: "Schooling, Class 10",
      where: "Vidyadayinee English Medium School",
      score: "Score 96.4",
    },
    {
      when: "2012 – 2017",
      what: "Schooling",
      where: "Shree Mahalingeshwara English Medium School",
    },
  ] satisfies EducationItem[],
};

/* ------------------------------------------------------------------ */
/* 02 Experience                                                       */
/* ------------------------------------------------------------------ */

export const experience = {
  number: "02",
  label: "Experience",
  title: "Labs, teams & techfests",
  note: "From ATL Lab in 2018 to an underwater submersible today.",
  entries: [
    {
      id: "exp-cfal",
      org: "Makerspace",
      dates: "Jun 2024 – Jul 2026",
      layout: "main",
      roles: [
        { title: "President", dates: "Apr 2025 – Jul 2026" },
        { title: "Vice President", dates: "Jun 2024 – Apr 2025" },
      ],
      bullets: [
        "Led the makerspace team, managing hardware, software and design teams across projects and competitions.",
        "Designed, developed and supervised robotics projects, including soccer bots and line followers, for events and demonstrations.",
        "Organized workshops and the annual techfest, MakersFete, coordinating the team, resources, management, marketing and execution.",
        "Designed and built headphone amps, and monetized the project through direct sales.",
      ],
      pull: {
        name: "MakersFete",
        years: "2024 & 2025",
        note: "The makerspace’s annual techfest; volunteered and helped organize in both years.",
      },
    },
    {
      id: "exp-mm",
      org: "Mean Mechanics",
      badge: "New",
      layout: "side",
      roles: [{ title: "Core Member", dates: "Aug 2026 – Present" }],
      intro:
        "A new team member, currently working on the Underwater Submersible project.",
      plate: {
        lines: [{ text: "Under" }, { text: "water", italic: true }],
        title: "Underwater Submersible",
        caption: "Current project, with Mean Mechanics",
      },
    },
    {
      id: "exp-atl",
      org: "ATL Lab",
      dates: "2018 – 2024",
      layout: "long",
      roles: [],
      longform: {
        paragraphs: [
          "ATL lab days meant active engagement in innovation, entrepreneurship and hands-on projects. Selection for the One Lab One Week initiative at NAL and ISRO gave strong exposure to aerospace research, lab facilities and scientific experiments. Alongside this, the startup incubation program at InUnity meant working with a team to take ideas from scratch to prototypes and business pitches. Interschool science and science model competitions won me prizes for presenting solutions, and visits to research labs, startups and incubators taught me how ideas are developed and scaled.",
        ],
        highlights: [
          {
            title: "One Lab One Week",
            text: "Selected for the initiative at NAL and ISRO",
          },
          {
            title: "InUnity",
            text: "Startup incubation, from idea to prototype and pitch",
          },
          {
            title: "Science competitions",
            text: "Prizes at interschool science and model contests",
          },
        ],
      },
    },
  ] satisfies ExperienceEntry[],
};

/* ------------------------------------------------------------------ */
/* 03 Projects                                                         */
/* ------------------------------------------------------------------ */

export const projectsSection = {
  number: "03",
  label: "Projects",
  title: "Top builds!",
  note: "Some of my top projects here",
  stage: {
    ariaLabel:
      "3D scene: Scout, Sharaj’s RC plane, flying above Chadermod, his 3 lb battlebot, with an RC car circling behind. Drag, or use the arrow keys, to turn the view.",
    hud: ["Fig. 1", "Drag to turn"],
    labels: [
      { anchor: "scout", title: "Scout", caption: "RC plane" },
      { anchor: "chadermod", title: "Chadermod", caption: "3 lb battlebot" },
    ],
    title: "Scout and Chadermod",
    caption:
      "RC Scout plane, 3 lb battlebot Chadermod",
    loading: "Loading the 3D models",
    fallback: "This 3D view needs a browser with WebGL 2",
  },
} as const;

export const projects: Project[] = [
  {
    category: "robotics",
    categoryLabel: "Robotics",
    title: "Underwater Submersible",
    note: "An underwater submersible robot for inspection of dams and reservoirs.",
  },
  {
    category: "robotics",
    categoryLabel: "Robotics",
    title: "Chadermod",
    note: "A 3 lb battlebot for robowars. Design complete.. build coming soon!!",
  },
  {
    category: "robotics",
    categoryLabel: "Robotics",
    title: "Soccer bots",
    note: "Built in two weight classes, 3 kg and 5kg. Soccer bots were among the robotics projects run at Makerspace CFAL for events and demonstrations.",
  },
  {
    category: "robotics",
    categoryLabel: "Robotics",
    title: "Line follower bot",
    note: "Built in two weight classes, 3 kg and 5kg. Soccer bots were among the robotics projects run at Makerspace CFAL for events and demonstrations.",
  },
  {
    category: "games",
    categoryLabel: "Games",
    title: "DuelMaze",
    note: "A fun two-player physical maze game.",
  },
  {
    category: "flight",
    categoryLabel: "Flight & RC",
    title: "Flight simulator yoke setup",
  },
  {
    category: "electronics",
    categoryLabel: "Electronics",
    title: "Headphone amps",
    note: "Designed and built by us, we sold over 25 units directly to customers.",
  },
  {
    category: "electronics",
    categoryLabel: "Electronics",
    title: "10×10×10 LED cube",
    note: "1,000 LEDs, ten to a side displaying patterns ",
  },
  {
    category: "flight",
    categoryLabel: "Flight & RC",
    title: "RC model Planes",
    note: "Including Scout and many others from scratch.",
  },
  {
    category: "science",
    categoryLabel: "Science",
    title: "CarBrix",
    note: "A project on a new construction material made from organic compounds.",
  },
];

/* ------------------------------------------------------------------ */
/* 04 Skills                                                           */
/* ------------------------------------------------------------------ */

export const skills = {
  number: "04",
  label: "Skills",
  items: [
  "Hardware",
  "CAD",
  "Prototyping",
  "Leadership",
  "R&D",
  "Testing",
],
  note: "Put to work on robots, RC aircraft, electronics builds, and on running a makerspace of hardware, software, and design teams.",
};

/* ------------------------------------------------------------------ */
/* 05 Contact + footer                                                 */
/* ------------------------------------------------------------------ */

export const contact = {
  number: "05",
  label: "Contact",
  title: "Get in touch.",
  lede: "Email or call about robotics, design, something you want to build, or maybe just for fun!.",
  labels: {
    email: "Email",
    phone: "Phone",
    based: "Based at",
  },
  basedValue: "Mangaluru, India",
} as const;

export const footer = {
  copyright: "© 2026 Sharaj Shreyas",
  colophon: "Set in Bodoni Moda, Source Serif 4 and Pirata One",
  backToTop: "Back to top",
} as const;
