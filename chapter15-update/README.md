# Practice review library

## Current site

GitHub Pages: https://bigunicorn999999.github.io/website-question-bank/

The deployable static site lives at the repository root. Open `?review=chapter15` for nine detailed Chapter 15 guides and 39 original practice problems across 15.1–15.9, including 12 illustrated additions with worked solutions and eight harder triple-integral applications. Subject folders provide unit navigation for Calculus, Chemistry, Engineering, and Daily Integrals. `?review=chapter15&unit=15.8` opens a particular unit. Chemistry and Engineering cards include a Copy button that preserves question text, code, choices, and figure links without copying answers or personal drafts.

The October 22 update carries forward all 301 questions from the newer study library and adds 27 Chapter 15 questions. Existing question IDs remain stable. Progress, bookmarks, choices, and Engineering drafts are browser-local and remain exportable/importable. To transfer progress from the previous Sites domain, export there and import on this GitHub Pages domain.

Chapter 15 explanations follow the supplied lecture slides and Stewart, Clegg & Watson, *Calculus: Early Transcendentals*, 9th edition. The published site includes original review material, not the uploaded textbook, student submissions, or lecture files. Formula syntax and 32 symbolic answer checks were verified for the new material. Test navigation, guide filtering, answer reveals, and clipboard behavior after UI changes.

The older notes below describe the library's development history. Their counts and former `dist/` paths do not describe the current GitHub Pages layout.

This is the user's ongoing test review site. Add future user-provided reviews to this existing Sites project; preserve its project ID, private audience, questions, guides, and stable question identifiers. Collections: MATH 251 Chapter 14 (86 questions, 8 guides), Easy Daily Integrals (39 problems), and Medium Daily Integrals (35 problems). The remaining PDF pages were blank placeholders.

Chapter 14 images preserve its original typesetting and diagrams. The integral sets use locally bundled KaTeX with transcribed LaTeX, collapsible hints, and calculated answers with steps. Searchable text and topic metadata live in dist/data.json. Progress and bookmarks use browser local storage with export/import for transfer. Keep existing progress IDs stable. Hints added where the PDF supplies none are labeled as additional study hints.

Medium 6 and 25 have poles: ordinary integrals are divergent/undefined, with separately stated principal values. Medium 35 includes the intended recursive fixed-point value and explains the literal radical domain problem. Medium 29 is an infinite power tower. Answers were checked numerically or analytically; do not silently remove these qualifications.

The October 12 quiz challenge adds 30 original questions based on Quiz 4B and Quiz 5B: ten each in 14.7 and 14.8, and two each in 14.1, 14.3, 14.4, 14.5, and 14.6. New IDs continue each section from .9. The New quiz challenges progress filter and ?review=chapter14&set=quiz-challenge-oct12 link isolate the new set. Their answer reveals contain final answers only. Preserve existing IDs and browser progress. Quiz scans and student records are not deployed.

