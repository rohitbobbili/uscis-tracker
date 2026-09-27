// USCIS 2025 Civics Test — 128 official questions and acceptable answers.
// Applies to N-400 applications filed on or after October 20, 2025. The
// officer asks up to 20 of these during the interview; 12 correct passes
// the civics portion. Source: the official USCIS 2025 Civics Test PDF,
// transcribed verbatim. This file is the single source of truth for
// question content; do not edit question text or answers without checking
// uscis.gov/citizenship/testupdates.
//
// Five questions (28, 29, 40, 46, 47) ask about a currently-serving
// official and carry `dynamic: true` instead of a hardcoded name — their
// `answers` array is filled in at load time from data/current-officials.js,
// which is the one file to edit when an office changes hands. See that
// file's header for how.
const QUESTION_SET_VERSION = '2025';
const QUESTION_SET_SOURCE = 'https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf';
const QUESTION_SET_FILED_ON_OR_AFTER = 'October 20, 2025';
const QUESTION_SET_UPDATED = '2026-09-27';

const CIVICS_QUESTIONS = [
  {
    "id": 1,
    "category": "Principles of Democracy",
    "exempt65_20": true,
    "question": "What is the supreme law of the land?",
    "answers": [
      "The (U.S.) Constitution"
    ],
    "needCount": 1,
    "answerType": "document"
  },
  {
    "id": 2,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "What does the Constitution do?",
    "answers": [
      "Sets up the government",
      "Defines the government",
      "Protects basic rights of Americans"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 3,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "The idea of self-government is in the first three words of the Constitution. What are these words?",
    "answers": [
      "We the People"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 4,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "The U.S. Constitution starts with the words \"We the People.\" What does \"We the People\" mean?",
    "answers": [
      "Self-government",
      "Popular sovereignty",
      "Consent of the governed",
      "People should govern themselves",
      "(Example of) social contract"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 5,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "What is an amendment?",
    "answers": [
      "A change (to the Constitution)",
      "An addition (to the Constitution)"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 6,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "What do we call the first ten amendments to the Constitution?",
    "answers": [
      "The Bill of Rights"
    ],
    "needCount": 1,
    "answerType": "document"
  },
  {
    "id": 7,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "What is one right or freedom from the First Amendment?",
    "answers": [
      "Speech",
      "Religion",
      "Assembly",
      "Press",
      "Petition the government"
    ],
    "needCount": 1,
    "answerType": "right"
  },
  {
    "id": 8,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "How many amendments does the Constitution have?",
    "answers": [
      "Twenty-seven (27)"
    ],
    "needCount": 1,
    "answerType": "number"
  },
  {
    "id": 9,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "What did the Declaration of Independence do?",
    "answers": [
      "Announced our independence (from Great Britain)",
      "Declared our independence (from Great Britain)",
      "Said that the United States is free (from Great Britain)"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 10,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "What are two rights in the Declaration of Independence?",
    "answers": [
      "Life",
      "Liberty",
      "Pursuit of happiness"
    ],
    "needCount": 2,
    "answerType": "right"
  },
  {
    "id": 11,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "What is freedom of religion?",
    "answers": [
      "You can practice any religion, or not practice a religion"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 12,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "What is the economic system in the United States?",
    "answers": [
      "Capitalist economy",
      "Market economy"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 13,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "What is the rule of law?",
    "answers": [
      "Everyone must follow the law",
      "Leaders must obey the law",
      "Government must obey the law",
      "No one is above the law"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 14,
    "category": "System of Government",
    "exempt65_20": true,
    "question": "Name one branch or part of the government.",
    "answers": [
      "Congress",
      "Legislative",
      "President",
      "Executive",
      "The courts",
      "Judicial"
    ],
    "needCount": 1,
    "answerType": "government_branch"
  },
  {
    "id": 15,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What stops one branch of government from becoming too powerful?",
    "answers": [
      "Checks and balances",
      "Separation of powers"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 16,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "Who is in charge of the executive branch?",
    "answers": [
      "The President"
    ],
    "needCount": 1,
    "answerType": "government_branch"
  },
  {
    "id": 17,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "Who makes federal laws?",
    "answers": [
      "Congress",
      "Senate and House (of Representatives)",
      "(U.S. or national) legislature"
    ],
    "needCount": 1,
    "answerType": "government_branch"
  },
  {
    "id": 18,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What are the two parts of the U.S. Congress?",
    "answers": [
      "The Senate and House (of Representatives)"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 19,
    "category": "System of Government",
    "exempt65_20": true,
    "question": "How many U.S. Senators are there?",
    "answers": [
      "One hundred (100)"
    ],
    "needCount": 1,
    "answerType": "number"
  },
  {
    "id": 20,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "We elect a U.S. Senator for how many years?",
    "answers": [
      "Six (6)"
    ],
    "needCount": 1,
    "answerType": "number"
  },
  {
    "id": 21,
    "category": "System of Government",
    "exempt65_20": true,
    "question": "Who does a U.S. Senator represent?",
    "answers": [
      "All people of the state",
      "People of their state"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 22,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "Who is one of your state's U.S. Senators now?",
    "answers": [
      "Answers will vary."
    ],
    "needCount": 1,
    "note": "District of Columbia residents and residents of U.S. territories should answer that D.C. (or the territory where the applicant lives) has no U.S. Senators.",
    "variesByState": true,
    "answerType": "person"
  },
  {
    "id": 23,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "How many voting members does the House of Representatives have?",
    "answers": [
      "Four hundred thirty-five (435)"
    ],
    "needCount": 1,
    "answerType": "number"
  },
  {
    "id": 24,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "We elect a U.S. Representative for how many years?",
    "answers": [
      "Two (2)"
    ],
    "needCount": 1,
    "answerType": "number"
  },
  {
    "id": 25,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "Why does each state have a different number of Representatives?",
    "answers": [
      "(Because of) the state's population",
      "(Because) they are elected by (the people of) the district they represent",
      "(Because) some states have more people"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 26,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "We elect a President for how many years?",
    "answers": [
      "Four (4)"
    ],
    "needCount": 1,
    "answerType": "number"
  },
  {
    "id": 27,
    "category": "System of Government",
    "exempt65_20": true,
    "question": "In what month do we vote for President?",
    "answers": [
      "November"
    ],
    "needCount": 1,
    "answerType": "date"
  },
  {
    "id": 28,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What is the name of the President of the United States now?",
    "answers": [],
    "needCount": 1,
    "note": "This office is currently held by someone whose name can change with an election, resignation, or appointment. This app keeps that name in one place and verifies it against an official U.S. government source; it is not hardcoded per question. Confirm who holds the office at the time of your interview at uscis.gov/citizenship/testupdates.",
    "timeSensitive": true,
    "dynamic": true,
    "officialKey": "president",
    "answerType": "person"
  },
  {
    "id": 29,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What is the name of the Vice President of the United States now?",
    "answers": [],
    "needCount": 1,
    "note": "This office is currently held by someone whose name can change with an election, resignation, or appointment. This app keeps that name in one place and verifies it against an official U.S. government source; it is not hardcoded per question. Confirm who holds the office at the time of your interview at uscis.gov/citizenship/testupdates.",
    "timeSensitive": true,
    "dynamic": true,
    "officialKey": "vicePresident",
    "answerType": "person"
  },
  {
    "id": 30,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "If the President can no longer serve, who becomes President?",
    "answers": [
      "The Vice President"
    ],
    "needCount": 1,
    "answerType": "process"
  },
  {
    "id": 31,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "If both the President and the Vice President can no longer serve, who becomes President?",
    "answers": [
      "The Speaker of the House"
    ],
    "needCount": 1,
    "answerType": "process"
  },
  {
    "id": 32,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "Who is the Commander in Chief of the military?",
    "answers": [
      "The President"
    ],
    "needCount": 1,
    "answerType": "government_branch"
  },
  {
    "id": 33,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "Who signs bills to become laws?",
    "answers": [
      "The President"
    ],
    "needCount": 1,
    "answerType": "government_branch"
  },
  {
    "id": 34,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "Who vetoes bills?",
    "answers": [
      "The President"
    ],
    "needCount": 1,
    "answerType": "government_branch"
  },
  {
    "id": 35,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What does the President's Cabinet do?",
    "answers": [
      "Advises the President"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 36,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What are two Cabinet-level positions?",
    "answers": [
      "Secretary of Agriculture",
      "Secretary of Commerce",
      "Secretary of Defense",
      "Secretary of Education",
      "Secretary of Energy",
      "Secretary of Health and Human Services",
      "Secretary of Homeland Security",
      "Secretary of Housing and Urban Development",
      "Secretary of the Interior",
      "Secretary of Labor",
      "Secretary of State",
      "Secretary of Transportation",
      "Secretary of the Treasury",
      "Secretary of Veterans Affairs",
      "Attorney General",
      "Vice President",
      "Ambassador to the United Nations",
      "Director of National Intelligence",
      "Director of the Office of Management and Budget",
      "United States Trade Representative",
      "Administrator of the Environmental Protection Agency",
      "Chair of the Council of Economic Advisers",
      "Director of the Office of Science and Technology Policy"
    ],
    "needCount": 2,
    "answerType": "institution"
  },
  {
    "id": 37,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What does the judicial branch do?",
    "answers": [
      "Reviews laws",
      "Explains laws",
      "Resolves disputes (disagreements)",
      "Decides if a law goes against the Constitution"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 38,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What is the highest court in the United States?",
    "answers": [
      "The Supreme Court"
    ],
    "needCount": 1,
    "answerType": "institution"
  },
  {
    "id": 39,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "How many justices are on the Supreme Court?",
    "answers": [
      "Nine (9)"
    ],
    "needCount": 1,
    "answerType": "number"
  },
  {
    "id": 40,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "Who is the Chief Justice of the United States now?",
    "answers": [],
    "needCount": 1,
    "dynamic": true,
    "timeSensitive": true,
    "note": "This office is currently held by someone whose name can change with an election, resignation, or appointment. This app keeps that name in one place and verifies it against an official U.S. government source; it is not hardcoded per question. Confirm who holds the office at the time of your interview at uscis.gov/citizenship/testupdates.",
    "officialKey": "chiefJustice",
    "answerType": "person"
  },
  {
    "id": 41,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "Under our Constitution, some powers belong to the federal government. What is one power of the federal government?",
    "answers": [
      "To print money",
      "To declare war",
      "To create an army",
      "To make treaties"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 42,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "Under our Constitution, some powers belong to the states. What is one power of the states?",
    "answers": [
      "Provide schooling and education",
      "Provide protection (police)",
      "Provide safety (fire departments)",
      "Give a driver's license",
      "Approve zoning and land use"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 43,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "Who is the Governor of your state now?",
    "answers": [
      "Answers will vary."
    ],
    "needCount": 1,
    "note": "District of Columbia residents should answer that D.C. does not have a Governor.",
    "variesByState": true,
    "answerType": "person"
  },
  {
    "id": 44,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What is the capital of your state?",
    "answers": [
      "Answers will vary."
    ],
    "needCount": 1,
    "note": "District of Columbia residents should answer that D.C. is not a state and does not have a capital. Residents of U.S. territories should name the capital of the territory.",
    "variesByState": true,
    "answerType": "location"
  },
  {
    "id": 45,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What are the two major political parties in the United States?",
    "answers": [
      "Democratic and Republican"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 46,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What is the political party of the President now?",
    "answers": [],
    "needCount": 1,
    "note": "This office is currently held by someone whose name can change with an election, resignation, or appointment. This app keeps that name in one place and verifies it against an official U.S. government source; it is not hardcoded per question. Confirm who holds the office at the time of your interview at uscis.gov/citizenship/testupdates.",
    "timeSensitive": true,
    "dynamic": true,
    "officialKey": "president",
    "dynamicField": "party",
    "answerType": "party"
  },
  {
    "id": 47,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What is the name of the Speaker of the House of Representatives now?",
    "answers": [],
    "needCount": 1,
    "note": "This office is currently held by someone whose name can change with an election, resignation, or appointment. This app keeps that name in one place and verifies it against an official U.S. government source; it is not hardcoded per question. Confirm who holds the office at the time of your interview at uscis.gov/citizenship/testupdates.",
    "timeSensitive": true,
    "dynamic": true,
    "officialKey": "speakerOfHouse",
    "answerType": "person"
  },
  {
    "id": 48,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What is one responsibility that is only for United States citizens?",
    "answers": [
      "Serve on a jury",
      "Vote in a federal election",
      "Run for federal office"
    ],
    "needCount": 1,
    "answerType": "responsibility"
  },
  {
    "id": 49,
    "category": "Rights & Responsibilities",
    "exempt65_20": true,
    "question": "There are four amendments to the Constitution about who can vote. Describe one of them.",
    "answers": [
      "Citizens eighteen (18) and older (can vote)",
      "You don't have to pay (a poll tax) to vote",
      "Any citizen can vote (women and men can vote)",
      "A male citizen of any race (can vote)"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 50,
    "category": "Rights & Responsibilities",
    "exempt65_20": false,
    "question": "What is one right only for United States citizens?",
    "answers": [
      "Vote in a federal election",
      "Run for federal office"
    ],
    "needCount": 1,
    "answerType": "right"
  },
  {
    "id": 51,
    "category": "Rights & Responsibilities",
    "exempt65_20": false,
    "question": "What are two rights of everyone living in the United States?",
    "answers": [
      "Freedom of expression",
      "Freedom of speech",
      "Freedom of assembly",
      "Freedom to petition the government",
      "Freedom of religion",
      "The right to bear arms"
    ],
    "needCount": 2,
    "answerType": "right"
  },
  {
    "id": 52,
    "category": "Rights & Responsibilities",
    "exempt65_20": false,
    "question": "What do we show loyalty to when we say the Pledge of Allegiance?",
    "answers": [
      "The United States",
      "The flag"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 53,
    "category": "Rights & Responsibilities",
    "exempt65_20": false,
    "question": "What is one promise you make when you become a United States citizen?",
    "answers": [
      "Give up loyalty to other countries",
      "Defend the Constitution and laws of the United States",
      "Obey the laws of the United States",
      "Serve in the U.S. military (if needed)",
      "Serve (do important work for) the nation (if needed)",
      "Be loyal to the United States"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 54,
    "category": "Rights & Responsibilities",
    "exempt65_20": true,
    "question": "How old do citizens have to be to vote for President?",
    "answers": [
      "Eighteen (18) and older"
    ],
    "needCount": 1,
    "answerType": "number"
  },
  {
    "id": 55,
    "category": "Rights & Responsibilities",
    "exempt65_20": false,
    "question": "What are two ways that Americans can participate in their democracy?",
    "answers": [
      "Vote",
      "Join a political party",
      "Help with a campaign",
      "Join a civic group",
      "Join a community group",
      "Give an elected official your opinion (on an issue)",
      "Call your Senators and Representatives",
      "Publicly support or oppose an issue or policy",
      "Run for office",
      "Write to a newspaper"
    ],
    "needCount": 2,
    "answerType": "process"
  },
  {
    "id": 56,
    "category": "Rights & Responsibilities",
    "exempt65_20": false,
    "question": "When is the last day you can send in federal income tax forms?",
    "answers": [
      "April 15"
    ],
    "needCount": 1,
    "answerType": "date"
  },
  {
    "id": 57,
    "category": "Rights & Responsibilities",
    "exempt65_20": false,
    "question": "When must all men register for the Selective Service?",
    "answers": [
      "At age eighteen (18)",
      "Between eighteen (18) and twenty-six (26)"
    ],
    "needCount": 1,
    "answerType": "number"
  },
  {
    "id": 58,
    "category": "Colonial Period & Independence",
    "exempt65_20": true,
    "question": "What is one reason colonists came to America?",
    "answers": [
      "Freedom",
      "Political liberty",
      "Religious freedom",
      "Economic opportunity",
      "Practice their religion",
      "Escape persecution"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 59,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "Who lived in America before the Europeans arrived?",
    "answers": [
      "American Indians",
      "Native Americans"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 60,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "What group of people was taken to America and sold as slaves?",
    "answers": [
      "Africans",
      "People from Africa"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 61,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "Why did the colonists fight the British?",
    "answers": [
      "Because of high taxes (taxation without representation)",
      "Because the British army stayed in their houses (boarding, quartering)",
      "Because they didn't have self-government"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 62,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "Who wrote the Declaration of Independence?",
    "answers": [
      "(Thomas) Jefferson"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 63,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "When was the Declaration of Independence adopted?",
    "answers": [
      "July 4"
    ],
    "needCount": 1,
    "answerType": "date"
  },
  {
    "id": 64,
    "category": "Colonial Period & Independence",
    "exempt65_20": true,
    "question": "There were 13 original states. Name three.",
    "answers": [
      "New Hampshire",
      "Massachusetts",
      "Rhode Island",
      "Connecticut",
      "New York",
      "New Jersey",
      "Pennsylvania",
      "Delaware",
      "Maryland",
      "Virginia",
      "North Carolina",
      "South Carolina",
      "Georgia"
    ],
    "needCount": 3,
    "answerType": "location"
  },
  {
    "id": 65,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "What happened at the Constitutional Convention?",
    "answers": [
      "The Constitution was written",
      "The Founding Fathers wrote the Constitution"
    ],
    "needCount": 1,
    "answerType": "event"
  },
  {
    "id": 66,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "When was the Constitution written?",
    "answers": [
      "1787"
    ],
    "needCount": 1,
    "answerType": "date"
  },
  {
    "id": 67,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "The Federalist Papers supported the passage of the U.S. Constitution. Name one of the writers.",
    "answers": [
      "(James) Madison",
      "(Alexander) Hamilton",
      "(John) Jay",
      "Publius"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 68,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "What is one thing Benjamin Franklin is famous for?",
    "answers": [
      "U.S. diplomat",
      "Oldest member of the Constitutional Convention",
      "First Postmaster General of the United States",
      "Writer of 'Poor Richard's Almanac'",
      "Started the first free libraries",
      "Discovered electricity"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 69,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "Who is the 'Father of Our Country'?",
    "answers": [
      "(George) Washington"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 70,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "Who was the first President?",
    "answers": [
      "(George) Washington"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 71,
    "category": "The 1800s",
    "exempt65_20": false,
    "question": "What territory did the United States buy from France in 1803?",
    "answers": [
      "The Louisiana Territory",
      "Louisiana"
    ],
    "needCount": 1,
    "answerType": "location"
  },
  {
    "id": 72,
    "category": "The 1800s",
    "exempt65_20": false,
    "question": "Name one war fought by the United States in the 1800s.",
    "answers": [
      "War of 1812",
      "Mexican-American War",
      "Civil War",
      "Spanish-American War"
    ],
    "needCount": 1,
    "answerType": "event"
  },
  {
    "id": 73,
    "category": "The 1800s",
    "exempt65_20": false,
    "question": "Give the name of one of the writers of the Federalist Papers.",
    "answers": [
      "(James) Madison",
      "(Alexander) Hamilton",
      "(John) Jay",
      "Publius"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 74,
    "category": "The 1800s",
    "exempt65_20": false,
    "question": "Name the U.S. war between the North and the South.",
    "answers": [
      "The Civil War",
      "The War between the States"
    ],
    "needCount": 1,
    "answerType": "event"
  },
  {
    "id": 75,
    "category": "The 1800s",
    "exempt65_20": false,
    "question": "Name one problem that led to the Civil War.",
    "answers": [
      "Slavery",
      "Economic reasons",
      "States' rights"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 76,
    "category": "The 1800s",
    "exempt65_20": false,
    "question": "What was one important thing that Abraham Lincoln did?",
    "answers": [
      "Freed the slaves (Emancipation Proclamation)",
      "Saved (or preserved) the Union",
      "Led the United States during the Civil War"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 77,
    "category": "The 1800s",
    "exempt65_20": false,
    "question": "What did the Emancipation Proclamation do?",
    "answers": [
      "Freed the slaves",
      "Freed slaves in the Confederacy",
      "Freed slaves in the Confederate states",
      "Freed slaves in most Southern states"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 78,
    "category": "The 1800s",
    "exempt65_20": false,
    "question": "What did Susan B. Anthony do?",
    "answers": [
      "Fought for women's rights",
      "Fought for civil rights"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 79,
    "category": "Recent History",
    "exempt65_20": true,
    "question": "Name one war fought by the United States in the 1900s.",
    "answers": [
      "World War I",
      "World War II",
      "Korean War",
      "Vietnam War",
      "(Persian) Gulf War"
    ],
    "needCount": 1,
    "answerType": "event"
  },
  {
    "id": 80,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "Who was President during World War I?",
    "answers": [
      "(Woodrow) Wilson"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 81,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "Who did the United States fight in World War II?",
    "answers": [
      "Japan",
      "Germany",
      "Italy"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 82,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "Before he was President, Eisenhower was a general. What war was he in?",
    "answers": [
      "World War II"
    ],
    "needCount": 1,
    "answerType": "event"
  },
  {
    "id": 83,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "During the Cold War, what was the main concern of the United States?",
    "answers": [
      "Communism"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 84,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "What movement tried to end racial discrimination?",
    "answers": [
      "Civil rights (movement)"
    ],
    "needCount": 1,
    "answerType": "event"
  },
  {
    "id": 85,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "What did Martin Luther King, Jr. do?",
    "answers": [
      "Fought for civil rights",
      "Worked for equality for all Americans"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 86,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "What major event happened on September 11, 2001, in the United States?",
    "answers": [
      "Terrorists attacked the United States"
    ],
    "needCount": 1,
    "answerType": "event"
  },
  {
    "id": 87,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "Name one U.S. territory.",
    "answers": [
      "Puerto Rico",
      "U.S. Virgin Islands",
      "American Samoa",
      "Northern Mariana Islands",
      "Guam"
    ],
    "needCount": 1,
    "answerType": "location"
  },
  {
    "id": 88,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "Name one state that borders Canada.",
    "answers": [
      "Maine",
      "New Hampshire",
      "Vermont",
      "New York",
      "Pennsylvania",
      "Ohio",
      "Michigan",
      "Minnesota",
      "North Dakota",
      "Montana",
      "Idaho",
      "Washington",
      "Alaska"
    ],
    "needCount": 1,
    "answerType": "location"
  },
  {
    "id": 89,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "Name one state that borders Mexico.",
    "answers": [
      "California",
      "Arizona",
      "New Mexico",
      "Texas"
    ],
    "needCount": 1,
    "answerType": "location"
  },
  {
    "id": 90,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "What is the capital of the United States?",
    "answers": [
      "Washington, D.C."
    ],
    "needCount": 1,
    "answerType": "location"
  },
  {
    "id": 91,
    "category": "Recent History",
    "exempt65_20": true,
    "question": "Where is the Statue of Liberty?",
    "answers": [
      "New York (Harbor)",
      "Liberty Island"
    ],
    "needCount": 1,
    "note": "Also acceptable: New Jersey; near New York City; on the Hudson (River)",
    "answerType": "location"
  },
  {
    "id": 92,
    "category": "Geography",
    "exempt65_20": false,
    "question": "Why does the flag have 13 stripes?",
    "answers": [
      "Because there were 13 original colonies",
      "Because the stripes represent the original colonies"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 93,
    "category": "Geography",
    "exempt65_20": false,
    "question": "Why does the flag have 50 stars?",
    "answers": [
      "Because there is one star for each state",
      "Because each star represents a state",
      "Because there are 50 states"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 94,
    "category": "Geography",
    "exempt65_20": false,
    "question": "What is the name of the national anthem?",
    "answers": [
      "The Star-Spangled Banner"
    ],
    "needCount": 1,
    "answerType": "document"
  },
  {
    "id": 95,
    "category": "Geography",
    "exempt65_20": true,
    "question": "What is the birthday of the United States?",
    "answers": [
      "July 4, 1776"
    ],
    "needCount": 1,
    "answerType": "date"
  },
  {
    "id": 96,
    "category": "Geography",
    "exempt65_20": false,
    "question": "Who did the United States gain independence from?",
    "answers": [
      "Great Britain"
    ],
    "needCount": 1,
    "answerType": "location"
  },
  {
    "id": 97,
    "category": "Symbols",
    "exempt65_20": false,
    "question": "Name two national U.S. holidays.",
    "answers": [
      "New Year's Day",
      "Martin Luther King, Jr. Day",
      "Presidents' Day",
      "Memorial Day",
      "Juneteenth",
      "Independence Day",
      "Labor Day",
      "Columbus Day",
      "Veterans Day",
      "Thanksgiving",
      "Christmas"
    ],
    "needCount": 2,
    "answerType": "event"
  },
  {
    "id": 98,
    "category": "Symbols",
    "exempt65_20": false,
    "question": "What is the name of the President of the United States now?",
    "answers": [],
    "needCount": 1,
    "note": "NOTE: Visit uscis.gov/citizenship/testupdates for current answer",
    "studyOnly": true,
    "answerType": "person"
  },
  {
    "id": 99,
    "category": "Holidays",
    "exempt65_20": false,
    "question": "What is the name of the Vice President of the United States now?",
    "answers": [],
    "needCount": 1,
    "note": "NOTE: Visit uscis.gov/citizenship/testupdates for current answer",
    "studyOnly": true,
    "answerType": "person"
  },
  {
    "id": 100,
    "category": "Holidays",
    "exempt65_20": false,
    "question": "Who was President during the Great Depression and World War II?",
    "answers": [
      "(Franklin) Roosevelt"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 101,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "What did the civil rights movement do?",
    "answers": [
      "Fought to end racial discrimination",
      "Fought for equal rights for all Americans",
      "Fought to ensure the civil rights of all Americans"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 102,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What are two Cabinet-level positions?",
    "answers": [
      "Secretary of Defense",
      "Secretary of State",
      "Secretary of the Treasury",
      "Attorney General",
      "Vice President"
    ],
    "needCount": 2,
    "note": "see full list in Q36",
    "answerType": "institution"
  },
  {
    "id": 103,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What does the Constitution prevent the government from doing?",
    "answers": [
      "(The Constitution prevents) the government from limiting basic rights",
      "(The Constitution prevents) the government from acting against the law"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 104,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "What is one thing the Declaration of Independence says?",
    "answers": [
      "All men are created equal",
      "All people are born with certain rights that the government cannot take away",
      "The people have a right to change or replace their government",
      "The government is established to protect the rights of the people"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 105,
    "category": "The 1800s",
    "exempt65_20": false,
    "question": "What are two of the amendments that expanded voting rights?",
    "answers": [
      "13th Amendment",
      "14th Amendment",
      "15th Amendment",
      "19th Amendment",
      "24th Amendment",
      "26th Amendment"
    ],
    "needCount": 2,
    "answerType": "document"
  },
  {
    "id": 106,
    "category": "Rights & Responsibilities",
    "exempt65_20": false,
    "question": "Name one right guaranteed by the First Amendment.",
    "answers": [
      "Freedom of speech",
      "Freedom of religion",
      "Freedom of assembly",
      "Freedom of the press",
      "Right to petition the government"
    ],
    "needCount": 1,
    "answerType": "right"
  },
  {
    "id": 107,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What is the purpose of the 10th Amendment?",
    "answers": [
      "Powers not given to the federal government belong to the states or the people"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 108,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "Who was one of the first important leaders of the civil rights movement?",
    "answers": [
      "(Rosa) Parks",
      "(Martin Luther King, Jr.)"
    ],
    "needCount": 1,
    "answerType": "historical_person"
  },
  {
    "id": 109,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "What are the first words of the Declaration of Independence?",
    "answers": [
      "We hold these truths to be self-evident"
    ],
    "needCount": 1,
    "answerType": "document"
  },
  {
    "id": 110,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "What founding document says all people are created equal and have rights that the government cannot take?",
    "answers": [
      "Declaration of Independence"
    ],
    "needCount": 1,
    "answerType": "document"
  },
  {
    "id": 111,
    "category": "Principles of Democracy",
    "exempt65_20": false,
    "question": "What does the Bill of Rights protect?",
    "answers": [
      "Basic rights of Americans",
      "Basic freedoms"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 112,
    "category": "The 1800s",
    "exempt65_20": false,
    "question": "What was the outcome of the Civil War?",
    "answers": [
      "The Union was preserved",
      "Slavery ended",
      "The Confederate States rejoined the United States"
    ],
    "needCount": 1,
    "answerType": "event"
  },
  {
    "id": 113,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "What did the 19th Amendment do?",
    "answers": [
      "Gave women the right to vote"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 114,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "What was the Korean War?",
    "answers": [
      "A conflict between North Korea (with support from China) and South Korea (with support from the United Nations, including the United States)"
    ],
    "needCount": 1,
    "answerType": "event"
  },
  {
    "id": 115,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "What are two things that happened on September 11 2001?",
    "answers": [
      "Terrorists attacked the World Trade Center",
      "Terrorists attacked the Pentagon",
      "Terrorists hijacked four airplanes",
      "Nearly 3000 people were killed",
      "Terrorists took over a plane aimed at Washington D.C. and crashed in a field in Pennsylvania"
    ],
    "needCount": 2,
    "answerType": "event"
  },
  {
    "id": 116,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "Name one U.S. military conflict after the September 11 2001 attacks.",
    "answers": [
      "The war in Afghanistan",
      "The war in Iraq"
    ],
    "needCount": 1,
    "answerType": "event"
  },
  {
    "id": 117,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "What is one thing that is true about the 65/20 exemption?",
    "answers": [
      "Citizens 65 and older who have been legal permanent residents for 20 or more years may study a shorter list of questions",
      "They may take the civics test in the language of their choice"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 118,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "Who represents you in the federal government?",
    "answers": [
      "U.S. Senators",
      "U.S. Representative (Congressman/Congresswoman)"
    ],
    "needCount": 1,
    "answerType": "government_branch"
  },
  {
    "id": 119,
    "category": "System of Government",
    "exempt65_20": false,
    "question": "Why do we have three branches of government?",
    "answers": [
      "So no branch is too powerful",
      "Checks and balances",
      "Separation of powers"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 120,
    "category": "Geography",
    "exempt65_20": false,
    "question": "Name the ocean on the East Coast of the United States.",
    "answers": [
      "Atlantic (Ocean)"
    ],
    "needCount": 1,
    "answerType": "location"
  },
  {
    "id": 121,
    "category": "Geography",
    "exempt65_20": false,
    "question": "Name the ocean on the West Coast of the United States.",
    "answers": [
      "Pacific (Ocean)"
    ],
    "needCount": 1,
    "answerType": "location"
  },
  {
    "id": 122,
    "category": "Geography",
    "exempt65_20": false,
    "question": "Name a river that is important to the United States.",
    "answers": [
      "Missouri (River)",
      "Mississippi (River)"
    ],
    "needCount": 1,
    "answerType": "location"
  },
  {
    "id": 123,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "What is one invention that was important to U.S. industrial growth?",
    "answers": [
      "Light bulb",
      "Automobile (cars / internal combustion engine)",
      "Skyscrapers",
      "Airplane",
      "Assembly line",
      "Landing on the moon",
      "Integrated circuit (IC)"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 124,
    "category": "Recent History",
    "exempt65_20": false,
    "question": "Name one Native American tribe in the United States.",
    "answers": [
      "Cherokee",
      "Navajo",
      "Sioux",
      "Chippewa",
      "Choctaw",
      "Pueblo",
      "Apache",
      "Iroquois",
      "Creek",
      "Blackfeet",
      "Seminole",
      "Cheyenne",
      "Arawak",
      "Shawnee",
      "Mohegan",
      "Huron",
      "Oneida",
      "Lakota",
      "Crow",
      "Teton",
      "Hopi",
      "Inupiat",
      "Mohawk",
      "Cayuga",
      "Onondaga",
      "Tuscarora",
      "Seneca"
    ],
    "needCount": 1,
    "note": "and more",
    "answerType": "historical_person"
  },
  {
    "id": 125,
    "category": "Rights & Responsibilities",
    "exempt65_20": false,
    "question": "Name two examples of civic participation in the United States.",
    "answers": [
      "Vote",
      "Run for office",
      "Join a political party",
      "Help with a campaign",
      "Join a civic group",
      "Join a community group",
      "Give an elected official your opinion on an issue",
      "Contact elected officials",
      "Support or oppose an issue or policy",
      "Write to a newspaper"
    ],
    "needCount": 2,
    "answerType": "process"
  },
  {
    "id": 126,
    "category": "Rights & Responsibilities",
    "exempt65_20": false,
    "question": "What is one reason it is important to pay federal taxes?",
    "answers": [
      "Required by law",
      "All people pay to fund the federal government",
      "Required by the U.S. Constitution (16th Amendment)",
      "Civic duty"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 127,
    "category": "Rights & Responsibilities",
    "exempt65_20": false,
    "question": "It is important for all men age 18 through 25 to register for the Selective Service. Name one reason why.",
    "answers": [
      "Required by law",
      "Civic duty",
      "Makes the draft fair if needed"
    ],
    "needCount": 1,
    "answerType": "concept"
  },
  {
    "id": 128,
    "category": "Colonial Period & Independence",
    "exempt65_20": false,
    "question": "The colonists came to America for many reasons. Name one reason.",
    "answers": [
      "Freedom",
      "Political liberty",
      "Religious freedom",
      "Economic opportunity",
      "Practice their religion",
      "Escape persecution"
    ],
    "needCount": 1,
    "answerType": "concept"
  }
];

const CIVICS_CATEGORIES = ["Colonial Period & Independence", "Geography", "Holidays", "Principles of Democracy", "Recent History", "Rights & Responsibilities", "Symbols", "System of Government", "The 1800s"];
