# master blueprint for the project.

# Here is a complete report of a complete planning in Markdown format, detailing every stage of the planning process.

---

# **Project Blueprint: `pulse.utdnews.com` - A Comprehensive Report**

This document consolidates the complete planning discussion for the automated news website project, `pulse.utdnews.com`. It covers the initial concept, UI/UX design, color and font selection, a deep-dive into SEO architecture, and the technical implementation strategy.

## **1. Initial Project Foundation (Based on ChatGPT Report)**

The project began with a well-defined plan for a zero-cost, scalable news platform.

- **Project Goal:** An automated news content platform similar to Tuko.
- **Domain:** `pulse.utdnews.com` (subdomain of `utdnews.com` from FreeDNS).
- **Core Tech Stack:**
  - **Hosting:** GitHub Pages (Static)
  - **CDN & SSL:** Cloudflare
  - **Backend CMS:** Supabase (Postgres Database)
  - **Automation:** Cloudflare Worker
- **Automation Workflow:**
  1.  A Cloudflare Worker runs on a cron schedule (e.g., every 15 mins).
  2.  It fetches headlines from **NewsAPI**.
  3.  Content is passed to an **AI Engine** (e.g., OpenAI) for rewriting to ensure uniqueness and SEO.
  4.  The processed article is saved to the **Supabase** database.
  5.  The **Frontend** fetches and displays the news from Supabase.

---

## **2. UI/UX Design Strategy**

The goal was to create a user interface that is modern, engaging, trustworthy, and stands out in the target market.

### **2.1. UI Inspiration & Benchmarking**

We analyzed several successful websites to understand best practices and gather ideas.

- **Direct Models (Kenyan Market):**
  - **Tuko.co.ke:** For its high-density homepage, clear categories, "Trending" section, and mobile-first simplicity.
  - **Kenyans.co.ke:** For its cleaner, card-based design and modern typography.
- **International Content Platforms:**
  - **Mashable:** For its "infinite scroll" engagement hook and mixed-media grids.
  - **The Verge:** For its bold brand identity, unique color palette, and dynamic, magazine-style layouts.
- **Authoritative & Clean Models:**
  - **BBC News:** For its gold-standard information hierarchy, minimalist design, and focus on trust.
  - **Axios:** For its innovative "Smart Brevity" format (bulleted summaries) that respects the reader's time.

### **2.2. The 'Pulse' Hybrid UI Blueprint**

We decided on a hybrid approach, cherry-picking the single best feature from each source of inspiration to create a unique and powerful user experience.

1.  **From Tuko/Kenyans.co.ke:** The **Core Layout & Velocity**.
    - Implement a high-density, card-based homepage grid with a prominent **"Trending Now"** section for familiarity and a feeling of constant updates.
2.  **From The Verge:** The **Bold Brand Identity**.
    - Use a strong, unique **accent color** and distinctive **headline typography** to make the brand memorable and look professionally designed.
3.  **From Mashable:** The **Engagement Hook**.
    - Implement **infinite scroll** strategically on **category pages** (e.g., Politics, Entertainment) to encourage deep dives without cluttering the homepage.
4.  **From BBC News:** The **Anchor of Trust**.
    - Employ a clear **information hierarchy**, using a large "hero" section at the top of the homepage for the day's most important story, creating an illusion of editorial curation.
5.  **From Axios:** The **'Smart Brevity' Content Format**.
    - This is the project's **secret weapon**. The AI rewriter will be programmed to automatically generate a **"Why it matters"** sentence and a **3-bullet-point summary** at the top of every article. This provides immediate value and respects user time.

### **2.3. The Definitive Design System (User-Guided)**

After initial proposals, the final palette and typography were refined based on tried-and-true principles for news websites, combining classic trust signals with modern trends.

#### **Color Palette**

| Role                | Description        | Color          | Hex Code  |
| :------------------ | :----------------- | :------------- | :-------- |
| **Background**      | Warm Neutral White | Alabaster      | `#F8F5F2` |
| **Primary/Trust**   | Corporate Blue     | Deep Blue      | `#0D47A1` |
| **Accent/Emphasis** | Rich Red-Orange    | Vibrant Orange | `#E65100` |
| **Primary Text**    | Off-Black/Charcoal | Dark Grey      | `#1A1A1A` |
| **Secondary Text**  | Muted Neutral      | Soft Grey      | `#AAB1B7` |

#### **Typography (from Google Fonts)**

- **Headlines:** **Poppins** (Bold, 700)
  - _Reasoning:_ A modern, clean, geometric sans-serif that feels professional and sharp.
- **Body Text & UI:** **Inter** (Regular, 400)
  - _Reasoning:_ The gold standard for screen readability, ensuring clarity and accessibility for all content.

---

## **3. SEO Architecture: The 'Pillar & Pulse' Strategy**

A comprehensive SEO strategy was designed to be at the core of the project, ensuring every automated action contributes to search engine visibility.

### **3.1. The 'Pillar' (Technical SEO Foundation)**

- **URL Structure:** Clean and keyword-rich: `https://pulse.utdnews.com/{category}/{post-slug}`
- **Framework Choice:** **Next.js** is required for its Server-Side Rendering (SSR) and Static Site Generation (SSG) capabilities, which produce fast, fully-formed HTML pages that search engines love.
- **Core Technical Files:** Auto-generation of `sitemap.xml` (for rapid indexing) and a standard `robots.txt`.
- **Structured Data (Schema):** Programmatically add **`NewsArticle` schema markup** to every article page. This is critical for eligibility in Google's "Top Stories" carousel and other rich results.

### **3.2. The 'Pulse' (Automated Content SEO)**

- **On-Page AI Rules:** The AI rewriter must follow strict rules for every article:
  - **HTML Title (`<title>`):** 55-60 characters, keyword-first.
  - **Meta Description:** ~155 characters, engaging and keyword-rich.
  - **Header Tags:** A logical structure (`<h1>` for title, `<h2>` for major sections like "Why It Matters", `<h3>` for sub-points).
  - **Image SEO:** Auto-generate descriptive `alt` tags for all images based on the article headline.
- **Automated Internal Linking:** A script will identify keywords in new articles and automatically link them to relevant older articles in the database, building site authority and structure.
- **E-E-A-T (Trust Signals):**
  - Clearly link to the original source on every article.
  - Create static "About Us" and "Editorial Policy" pages explaining the site's automated, AI-driven nature and its commitment to citing sources.

---

## **4. Technical Implementation & Deployment**

We addressed the critical technical challenge of hosting a Next.js application on a static host like GitHub Pages.

### **4.1. The Challenge: Dynamic Next.js vs. Static GitHub Pages**

A standard Next.js app requires a running Node.js server, which GitHub Pages does not provide. This can lead to broken pages, missing CSS, and routing errors if not handled correctly.

### **4.2. The Solution: `next export`**

The official solution is to use the **Static HTML Export** feature of Next.js.

1.  **Configuration (`next.config.js`):** The configuration file is set up to enable static export and ensure the Next.js `<Image>` component works correctly without a server.
    ```javascript
    /** @type {import('next').NextConfig} */
    const nextConfig = {
      output: 'export',
      images: {
        unoptimized: true,
      },
    };
    module.exports = nextConfig;
    ```
2.  **Build Process:** The command `npm run build` will now generate a fully static, self-contained version of the site in an `out` folder.
3.  **Deployment:** A **GitHub Action** will be set up to automate the process: on every push to the main branch, it will build the site and deploy the contents of the `out` folder to the `gh-pages` branch for hosting.

### **4.3. Acknowledged Limitations**

By choosing this static path, we accept that features requiring a live server will not work. This is perfectly acceptable for this project's architecture.

- **No API Routes:** All backend logic is handled by **Cloudflare Workers**, not Next.js API routes.
- **No `getServerSideProps`:** Content will be fetched at build time using **`getStaticProps`**. Freshness will be maintained by triggering a new build/deployment via GitHub Actions every time the automation adds new articles to Supabase.
