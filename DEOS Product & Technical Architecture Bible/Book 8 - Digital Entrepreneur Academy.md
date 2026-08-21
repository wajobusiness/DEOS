# DEOS — Digital Entrepreneurship Operating System
## Book 8: Digital Entrepreneur Academy

**Version:** 1.0
**Status:** Draft
**Governed by:** Book 0 (Constitution), Book 1 (Business Blueprint), Book 2 (User Platform — Chapter 14 summarized this module; this Book details it fully)

> This Book specifies the Academy — matches Image 12. It exists to fulfil Book 0 §4's "Compounding Education" value directly: every platform feature (website builder, CRM, marketplace, AI tools) is only as useful as the member's ability to actually use it well, and the Academy is where that ability is built.

---

## Table of Contents

1. Purpose & Scope
2. Learning Paths & Courses
3. Live Classes & Workshops
4. Certifications & Exams
5. Instructor Portal
6. Student Dashboard & Progress Tracking
7. Community (Discussions & Study Groups)
8. Content Types & Delivery
9. Business Rules & Plan Gating
10. Database Requirements
11. Acceptance Criteria

---

## 1. Purpose & Scope

The Academy teaches members how to actually run the business DEOS gives them — website positioning, running ads, using the CRM, understanding the binary/marketplace systems, and general digital entrepreneurship skill. Per Book 1 §11 (Growth Strategy), Academy content is also a top-of-funnel growth channel: free/low-cost content pulls new visitors toward membership.

---

## 2. Learning Paths & Courses

Matches Image 12's "My Courses" and "Continue Learning" sections.

**Functional Requirements:** structured Learning Paths (multi-course sequences, e.g., "Digital Entrepreneurship Fundamentals"), individual Courses (lessons, lesson-level video/text/quiz content), difficulty labels (Beginner/Intermediate/Advanced), ratings and enrollment counts (matches "Recommended for You" cards).

**Content areas explicitly required (per your original spec and Book 1 target market):** platform onboarding/how-to-use-DEOS, positioning yourself online, running ads, digital entrepreneurship fundamentals, e-commerce, social media marketing, financial management, email marketing — matching the course cards shown in Image 12.

---

## 3. Live Classes & Workshops

**Functional Requirements:** scheduled live sessions with instructor, date/time, registration (matches Image 12's "Upcoming Live Classes" panel); recordings archived into the relevant course/path afterward for members who couldn't attend live.

---

## 4. Certifications & Exams

**Functional Requirements:** end-of-path certification exams, pass/fail or scored results, downloadable/shareable certificate on completion (matches "My Certificates" in the sidebar). Certification status is visible on the member's Profile (Book 2 Chapter 6) if they choose to display it — useful as social proof for their own business/storefront credibility.

---

## 5. Instructor Portal

**Functional Requirements:** course authoring tools (lesson builder, quiz builder, video upload), enrollment and completion analytics per course, revenue dashboard for paid/premium courses (Book 1 §7.1 — instructors earn revenue, platform retains a service fee, exact split to be set alongside other fee schedules).

**Business Rule:** Instructor payouts follow the same append-only ledger principle as every other financial flow (Book 0 §14) — a distinct `academy_instructor_revenue` event type, separate from marketplace and binary ledger types (Book 4 §15, Book 5 §14).

---

## 6. Student Dashboard & Progress Tracking

Matches Image 12's main dashboard exactly.

**Functional Requirements:** Overall Progress ring (Completed / In Progress / Not Started course counts), current lesson and time-remaining indicator, "Resume Learning" quick action, recent achievements feed (lesson completions, course milestones, certificate progress).

**Acceptance Criteria:** Progress must persist accurately across devices/sessions (restated from Book 2 Chapter 14) — this Book adds the requirement that progress percentage shown here must reconcile exactly with what's shown on the member's main platform Dashboard (Book 2 Chapter 5's "Academy Progress" card).

---

## 7. Community (Discussions & Study Groups)

**Functional Requirements:** course-level and general discussion boards, study groups (member-created or curated), matches the "Community" nav section in Image 12's sidebar. Moderated per the same content-policy framework as Marketplace listings (Book 5 §3, full moderation logic in Book 13).

---

## 8. Content Types & Delivery

**Functional Requirements:** video (streamed, not downloadable by default — protects instructor content per Book 1 §7.1 revenue model), text/article lessons, downloadable resources (templates, worksheets — ties into Book 2 Chapter 19's Downloads section), quizzes with immediate feedback.

---

## 9. Business Rules & Plan Gating

- Core onboarding content (how to use DEOS itself) is available to all plan tiers at no additional gating — this is functionally support material, not premium content, and gating it would undermine the Business Launch Wizard's goal (Book 2 Chapter 4) of getting every member to a published website quickly.
- Premium courses, certifications, and live mastermind-style content are gated by plan tier per Book 1 §6 (Growth/Legacy unlock more) and/or sold individually as Academy Revenue (Book 1 §7.1).

---

## 10. Database Requirements

- `academy_courses`, `academy_lessons`, `academy_paths` — standard content hierarchy
- `academy_enrollments` — member_id, course_id, progress_percent, completed_at (nullable)
- `academy_certificates` — issued certificates, tied to exam/completion records, append-only per Book 0 §14
- `academy_instructor_revenue` — distinct ledger event type (§5), reconciled against Book 1 §7.1's academy revenue stream in platform-wide financial reporting (Book 3 §10)

---

## 11. Acceptance Criteria

- [ ] Academy Progress figure matches exactly between the Student Dashboard (§6) and the main platform Dashboard (Book 2 Chapter 5)
- [ ] Core onboarding/how-to-use-DEOS content is accessible to every plan tier with no paywall
- [ ] Instructor revenue is ledgered as its own distinct, auditable event type
- [ ] Certificates are verifiable (e.g., a public verification link or code) so a member can credibly display them as social proof on their own site/storefront
