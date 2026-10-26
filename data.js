// ============================================================
// ALL personal details live here. The website AND the chatbot read this file.
// Anything in [SQUARE BRACKETS] is a placeholder: replace it before deploying.
// ============================================================
const PORTFOLIO = {
  name: "Khushal Dhaka",
  role: "Aspiring Developer",
  tagline: "I build small, useful programs and learn something new with every project.",
  about:
    "I'm a [YEAR]-year B.Tech student in [YOUR BRANCH] at [YOUR UNIVERSITY], [CITY]. [ONE OR TWO SENTENCES ABOUT WHAT YOU ENJOY BUILDING AND LEARNING.]",
  location: "[CITY, STATE, COUNTRY]",
  education: {
    degree: "B.Tech in [YOUR BRANCH] ([YEAR] Year)",
    school: "[YOUR UNIVERSITY], [CITY]",
    years: "[START YEAR] - [END YEAR]"
  },
  skills: ["[SKILL 1]", "[SKILL 2]", "[SKILL 3]"],
  contact: {
    email: "khushaldhaka001@gmail.com",
    github: "https://github.com/[GITHUB-USERNAME]",
    githubLabel: "github.com/[GITHUB-USERNAME]"
  },
  projects: [
    {
      title: "[PROJECT 1 TITLE]",
      description: "[ONE OR TWO SENTENCES ABOUT WHAT THIS PROJECT DOES.]",
      tags: ["[TECH 1]", "[TECH 2]"],
      github: "https://github.com/[GITHUB-USERNAME]/[REPO-NAME]"
    },
    {
      title: "[PROJECT 2 TITLE]",
      description: "[ONE OR TWO SENTENCES ABOUT WHAT THIS PROJECT DOES.]",
      tags: ["[TECH 1]", "[TECH 3]"],
      github: "https://github.com/[GITHUB-USERNAME]/[REPO-NAME]"
    }
  ],
  // Extra notes only the chatbot sees (optional)
  projectNotes: ""
};

if (typeof module !== "undefined") module.exports = PORTFOLIO;
