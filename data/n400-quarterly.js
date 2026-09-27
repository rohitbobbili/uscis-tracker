'use strict';
/* ═════════════════════════════════════════════════════════════
   N-400 QUARTERLY PROCESSING DATA — sourced from official USCIS
   quarterly reports (Historical National Average Processing Time
   / receipts-approvals-denials tables). Each row is one federal
   fiscal quarter. `fy*` fields are fiscal-year-to-date cumulative
   totals (USCIS's fiscal year runs October 1 – September 30, so
   the cumulative columns reset every Q1 = Oct–Dec quarter).
   `processingMonths` is null for a few 2021–2022 quarters where
   USCIS reported no median processing time.

   To refresh: re-download the report from N400_DATA_SOURCE_URL,
   append/update rows below (oldest first), and bump
   N400_DATA_UPDATED.
   ═════════════════════════════════════════════════════════════ */
const N400_DATA_SOURCE_URL = 'https://www.uscis.gov/tools/reports-and-studies/immigration-and-citizenship-data?topic_id%5B%5D=33692';
const N400_DATA_UPDATED = '2026-09-27';

const N400_QUARTERLY = [
  { quarter: 'January 1, 2021 - March 31, 2021', label: 'Jan 2021', received: 149725, approved: 197210, denied: 19484, completions: 216694, pending: 945313, processingMonths: 12.4, fyReceived: 388019, fyApproved: 333542, fyDenied: 34513, fyCompletions: 368055 },
  { quarter: 'April 1, 2021 - June 30, 2021', label: 'Apr 2021', received: 203591, approved: 229608, denied: 24831, completions: 254439, pending: 900953, processingMonths: 10.9, fyReceived: 591610, fyApproved: 563150, fyDenied: 59344, fyCompletions: 622494 },
  { quarter: 'July 1, 2021 - September 30, 2021', label: 'Jul 2021', received: 191005, approved: 237421, denied: 25342, completions: 262763, pending: 833738, processingMonths: 11.2, fyReceived: 782615, fyApproved: 800571, fyDenied: 84686, fyCompletions: 885257 },
  { quarter: 'October 1, 2021 - December 31, 2021', label: 'Oct 2021', received: 175857, approved: 195050, denied: 24681, completions: 219731, pending: 792416, processingMonths: null, fyReceived: 175857, fyApproved: 195050, fyDenied: 24681, fyCompletions: 219731 },
  { quarter: 'January 1, 2022 - March 31, 2022', label: 'Jan 2022', received: 202361, approved: 221013, denied: 28019, completions: 249032, pending: 745710, processingMonths: null, fyReceived: 378218, fyApproved: 416063, fyDenied: 52700, fyCompletions: 468763 },
  { quarter: 'April 1, 2022 - June 30, 2022', label: 'Apr 2022', received: 196952, approved: 245528, denied: 26371, completions: 271899, pending: 666473, processingMonths: null, fyReceived: 575170, fyApproved: 661591, fyDenied: 79071, fyCompletions: 740662 },
  { quarter: 'July 1, 2022 - September 30, 2022', label: 'Jul 2022', received: 194819, approved: 292098, denied: 31695, completions: 323793, pending: 543838, processingMonths: 9.0, fyReceived: 769989, fyApproved: 953689, fyDenied: 110766, fyCompletions: 1064455 },
  { quarter: 'October 1, 2022 - December 31, 2022', label: 'Oct 2022', received: 181235, approved: 232387, denied: 26940, completions: 259327, pending: 474725, processingMonths: 6.7, fyReceived: 181235, fyApproved: 232387, fyDenied: 26940, fyCompletions: 259327 },
  { quarter: 'January 1, 2023 - March 31, 2023', label: 'Jan 2023', received: 217159, approved: 214040, denied: 27065, completions: 241105, pending: 452018, processingMonths: 6.3, fyReceived: 398394, fyApproved: 446427, fyDenied: 54005, fyCompletions: 500432 },
  { quarter: 'April 1, 2023 - June 30, 2023', label: 'Apr 2023', received: 201615, approved: 188607, denied: 22562, completions: 211169, pending: 433486, processingMonths: 5.8, fyReceived: 600009, fyApproved: 635034, fyDenied: 76567, fyCompletions: 711601 },
  { quarter: 'July 1, 2023 - September 30, 2023', label: 'Jul 2023', received: 209475, approved: 228749, denied: 22294, completions: 251043, pending: 400908, processingMonths: 5.4, fyReceived: 809484, fyApproved: 863783, fyDenied: 98861, fyCompletions: 962644 },
  { quarter: 'October 1, 2023 - December 31, 2023', label: 'Oct 2023', received: 191731, approved: 175615, denied: 20966, completions: 196581, pending: 393563, processingMonths: 5.2, fyReceived: 191731, fyApproved: 175615, fyDenied: 20966, fyCompletions: 196581 },
  { quarter: 'January 1, 2024 - March 31, 2024', label: 'Jan 2024', received: 277909, approved: 209491, denied: 22145, completions: 231636, pending: 455661, processingMonths: 5.0, fyReceived: 469640, fyApproved: 385106, fyDenied: 43111, fyCompletions: 428217 },
  { quarter: 'April 1, 2024 - June 30, 2024', label: 'Apr 2024', received: 235372, approved: 215392, denied: 21479, completions: 236871, pending: 462784, processingMonths: 5.0, fyReceived: 705012, fyApproved: 600498, fyDenied: 64590, fyCompletions: 665088 },
  { quarter: 'July 1, 2024 - September 30, 2024', label: 'Jul 2024', received: 271180, approved: 200398, denied: 20105, completions: 220503, pending: 507412, processingMonths: 4.7, fyReceived: 976192, fyApproved: 800896, fyDenied: 84695, fyCompletions: 885591 },
  { quarter: 'October 1, 2024 - December 31, 2024', label: 'Oct 2024', received: 236744, approved: 201774, denied: 17117, completions: 218891, pending: 524675, processingMonths: 5.5, fyReceived: 236744, fyApproved: 201774, fyDenied: 17117, fyCompletions: 218891 },
  { quarter: 'January 1, 2025 - March 31, 2025', label: 'Jan 2025', received: 260621, approved: 231696, denied: 22610, completions: 254306, pending: 527837, processingMonths: 5.6, fyReceived: 497365, fyApproved: 433470, fyDenied: 39727, fyCompletions: 473197 },
  { quarter: 'April 1, 2025 - June 30, 2025', label: 'Apr 2025', received: 245879, approved: 236924, denied: 23099, completions: 260023, pending: 519918, processingMonths: 5.5, fyReceived: 743244, fyApproved: 670394, fyDenied: 62826, fyCompletions: 733220 },
  { quarter: 'July 1, 2025 - September 30, 2025', label: 'Jul 2025', received: 236898, approved: 211592, denied: 21936, completions: 233528, pending: 524972, processingMonths: 5.7, fyReceived: 980142, fyApproved: 881986, fyDenied: 84762, fyCompletions: 966748 },
  { quarter: 'October 1, 2025 - December 31, 2025', label: 'Oct 2025', received: 247840, approved: 143564, denied: 18054, completions: 161618, pending: 611463, processingMonths: 6.2, fyReceived: 247840, fyApproved: 143564, fyDenied: 18054, fyCompletions: 161618 },
  { quarter: 'January 1, 2026 - March 31, 2026', label: 'Jan 2026', received: 135586, approved: 81147, denied: 14837, completions: 95984, pending: 648583, processingMonths: 7.4, fyReceived: 383426, fyApproved: 224711, fyDenied: 32891, fyCompletions: 257602 },
  { quarter: 'April 1, 2026 - June 30, 2026', label: 'Apr 2026', received: 140179, approved: 54974, denied: 12591, completions: 67565, pending: 727371, processingMonths: 9.5, fyReceived: 523605, fyApproved: 279685, fyDenied: 45482, fyCompletions: 325167 },
];
