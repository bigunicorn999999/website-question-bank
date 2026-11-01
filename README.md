# Practice review library

## CHEM 107 · Exam 2 MCQ update (October 31)

Open [the new Exam 2 review](https://bigunicorn999999.github.io/website-question-bank/?review=chem-6-8&set=chem-exam2).

- **120 MCQs total:** 72 new questions, 24 retained and converted lecture-coverage questions, and all 24 questions from the supplied professor review.
- **24 concept/format families, three variants each**, mapped to the 24 questions in the supplied Exam 2 Review-3.pdf.
- **32 select-all questions**, clearly labeled; **22 illustrated questions** using 14 original SVG diagrams and five professor-review figure extracts.
- The previous bank had 142 chemistry questions. Of those, 24 were retained and converted; 118 elementary, redundant, prerequisite, or overly integrated questions were removed from the active chemistry bank. Git history retains the old source.
- The Concept / pattern filter trains one family; the practice filter selects the new review, professor review, retained lecture coverage, select-all items, or diagram questions. Chapter filters, shuffle, individual answer reveals, and the full key still work.
- The key gives final choices and one short reason. All chemistry questions now use choices. Revealing a chosen MCQ marks it reviewed; an incorrect exact-set answer also saves it automatically. Correct options turn green and selected incorrect options red. Existing retained question IDs, bookmarks and reviewed status remain valid; obsolete choice indices are discarded when the MCQ version changes.
- Cr/Cu and ion-removal exceptions, ionization/affinity exceptions, octet exceptions, charged VSEPR centers, nonpolar lone-pair geometries, hydrogen-bond donor/acceptor distinctions, and water's phase-diagram exception are explicitly tested.

Rebuild chemistry with `python scripts/build-chem-exam2.py` and `python scripts/draw-chem-exam2.py`. Validate with `node scripts/validate-exam2.cjs` and `node scripts/test-exam2-ui.cjs` (the older validation entrypoints forward to these). The October 27 generator is retired. See [the coverage map](docs/chemistry-exam2-coverage.md). Other subjects and their content are preserved.

The full source PDFs and student information are not published. The 72 new questions and 14 SVG diagrams are original practice. The supplied professor questions have source labels that can be hidden for mixed practice. A compact, collapsible right-side periodic table provides a static 118-element reference with name/symbol/number search and scrollbars; weights use CIAAW abridged standard values. The sidebar also has its own collapse button.


## Historical: CHEM 107 · October 27 course alignment

Chemistry now includes **142 questions**: the original 52 with brief explanations and 90 new problems (26 each in Chapters 6, 7, and 8, plus 12 clearly labeled solution/stoichiometry prerequisites). Open `?review=chem-6-8`.

Use the practice filter for **Guided connections** (26 scaffolded steps with optional hints), **Class-style practice** (52 shorter problems), **Integrated practice** (the original longer set), or **Prerequisite refreshers** (12). `?review=chem-6-8&set=chem-learn` opens the guided set. Every chemistry key gives the answer and a short reason. Written reasoning, choices, bookmarks, and review progress remain browser-local and exportable.

Calibration uses the supplied Chapter 6–8 slides, eight WebAssign homework PDFs, and Quizzes 2–3. New questions are original; no student records or source PDFs are published. No past test paper was supplied for this update, so the guide does not claim exact exam calibration. The guide corrects an inherited radio-wavelength conversion note and flags the actual source inconsistencies. Existing chemistry IDs and all other subjects are preserved.

Validation: `node scripts/validate-chemistry.cjs` checks counts, explanations, numerical answers, electron bookkeeping, and formula rendering. `node scripts/test-chemistry-ui.cjs` checks study filters, topic combinations, deep links, hidden answers, drafts/import, choice sanitization, and cross-subject navigation using the actual application script in a simulated DOM. `node scripts/align-chemistry.cjs` rebuilds the chemistry content deterministically.

## Current site

GitHub Pages: https://bigunicorn999999.github.io/website-question-bank/

The deployable static site lives at the repository root. Open `?review=chapter15` for nine detailed Chapter 15 guides and 57 original practice problems across 15.1–15.9, including 12 illustrated additions with worked solutions and eight harder triple-integral applications. A further 18 harder challenges add three questions per unit in 15.3–15.8, each with worked solutions; their 138 math expressions and 23 numerical checks were validated. Search for “Harder challenge” on the Questions tab to find them. Subject folders provide unit navigation for Calculus, Chemistry, Engineering, and Daily Integrals. `?review=chapter15&unit=15.8` opens a particular unit. Chemistry and Engineering cards include a Copy button that preserves question text, code, choices, and figure links without copying answers or personal drafts.

The October 22 update carries forward all 301 questions from the newer study library and adds 27 Chapter 15 questions. Existing question IDs remain stable. Progress, bookmarks, choices, and Engineering drafts are browser-local and remain exportable/importable. To transfer progress from the previous Sites domain, export there and import on this GitHub Pages domain.

Chapter 15 explanations follow the supplied lecture slides and Stewart, Clegg & Watson, *Calculus: Early Transcendentals*, 9th edition. The published site includes original review material, not the uploaded textbook, student submissions, or lecture files. Formula syntax and 32 symbolic answer checks were verified for the new material. Test navigation, guide filtering, answer reveals, and clipboard behavior after UI changes.

The older notes below describe the library's development history. Their counts and former `dist/` paths do not describe the current GitHub Pages layout.

This is the user's ongoing test review site. Add future user-provided reviews to this existing Sites project; preserve its project ID, private audience, questions, guides, and stable question identifiers. Collections: MATH 251 Chapter 14 (86 questions, 8 guides), Easy Daily Integrals (39 problems), and Medium Daily Integrals (35 problems). The remaining PDF pages were blank placeholders.

Chapter 14 images preserve its original typesetting and diagrams. The integral sets use locally bundled KaTeX with transcribed LaTeX, collapsible hints, and calculated answers with steps. Searchable text and topic metadata live in dist/data.json. Progress and bookmarks use browser local storage with export/import for transfer. Keep existing progress IDs stable. Hints added where the PDF supplies none are labeled as additional study hints.

Medium 6 and 25 have poles: ordinary integrals are divergent/undefined, with separately stated principal values. Medium 35 includes the intended recursive fixed-point value and explains the literal radical domain problem. Medium 29 is an infinite power tower. Answers were checked numerically or analytically; do not silently remove these qualifications.

The October 12 quiz challenge adds 30 original questions based on Quiz 4B and Quiz 5B: ten each in 14.7 and 14.8, and two each in 14.1, 14.3, 14.4, 14.5, and 14.6. New IDs continue each section from .9. The New quiz challenges progress filter and ?review=chapter14&set=quiz-challenge-oct12 link isolate the new set. Their answer reveals contain final answers only. Preserve existing IDs and browser progress. Quiz scans and student records are not deployed.




### MCQ review behavior

Reveal answer grades any selected MCQ response, including an exact-set comparison for select-all. It marks the item reviewed; an incorrect answer also bookmarks it. Correct options are green and selected incorrect options red, with text feedback as well. A reveal with no selection does not change reviewed/bookmark status. Changing a selection clears the current reveal feedback for another attempt. Existing saved bookmarks are not automatically removed by a later correct answer. Show source labels is a browser-local preference; turning it off hides provenance badges and uses neutral question numbering.

The periodic reference is a compact fixed right-side collapsible panel, available at any question. It includes 118 static element cells, element search, scrollbars, and CIAAW abridged weights. Cells have no click actions or property panels. The removed chemistry intro remains absent.
