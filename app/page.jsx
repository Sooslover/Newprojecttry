"use client";
import React, { useEffect, useMemo, useState } from "react";

function cx(...classes) { return classes.filter(Boolean).join(" "); }

const Icon = {
  Star: (p) => (<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...p}><path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17.8 6.6 19.8l1-6.1L3.2 9.4l6.1-.9L12 3z"/></svg>),
  Copy: (p) => (<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...p}><path d="M8 8h10v12H8z" opacity=".4"/><path d="M6 4h10v12H6z"/></svg>),
  Check: (p) => (<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...p}><path d="M9 16.5l-4-4L6.5 11 9 13.6 17.5 5l1.5 1.5z"/></svg>),
};

function Header({ onTryPrompts, onToggleTheme, dark }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 text-neutral-900 border-b border-neutral-200 dark:bg-neutral-950/70 dark:text-white dark:border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-400 to-emerald-400"><Icon.Star className="h-4 w-4"/></span>
            <div className="leading-tight">
              <div className="text-base font-semibold">GPT‑5 Thinking</div>
              <div className="text-[11px] opacity-75">Prompting hub for fast copy and paste</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleTheme} className="rounded-lg border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900" aria-pressed={dark}>
              {dark ? "Day mode" : "Night mode"}
            </button>
            <button onClick={onTryPrompts} className="rounded-lg bg-gradient-to-tr from-sky-500 to-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">Try prompts</button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Card({ title, children, className }) {
  return (
    <div className={cx("rounded-xl bg-white text-neutral-900 ring-1 ring-neutral-200 p-5 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-800", className)}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {children}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg ring-1 ring-neutral-200 bg-white px-2.5 py-1.5 text-sm shadow-sm dark:bg-neutral-900 dark:ring-neutral-800">
      <span className="font-medium">{children}</span>
    </span>
  );
}

function FeatureBadge({ title, subtitle }) {
  return (
    <div className="rounded-lg bg-white ring-1 ring-neutral-200 px-3 py-3 flex-1 dark:bg-neutral-900 dark:ring-neutral-800">
      <div className="text-base font-bold">{title}</div>
      <div className="text-xs opacity-75 mt-0.5">{subtitle}</div>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button aria-label="Copy prompt" onClick={async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1200);} catch(e){} }} className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-2.5 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
      {copied ? <Icon.Check className="h-3.5 w-3.5"/> : <Icon.Copy className="h-3.5 w-3.5"/>}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function PromptMini({ text }) {
  return (
    <div className="flex min-w-0 items-center justify-between rounded-lg bg-white ring-1 ring-neutral-200 px-3 py-2 dark:bg-neutral-900 dark:ring-neutral-800">
      <div className="text-[13px] truncate pr-3 break-words hyphens-auto">{text}</div>
      <CopyButton text={text} />
    </div>
  );
}

function PromptCard({ title, body }) {
  return (
    <div className="min-w-0 w-full rounded-xl bg-white ring-1 ring-neutral-200 p-0 overflow-hidden dark:bg-neutral-900 dark:ring-neutral-800 print:ring-0">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="text-[13px] font-medium min-w-0 truncate pr-2">{title}</div>
        <CopyButton text={body} />
      </div>
      <pre className="p-3 whitespace-pre-wrap text-[13px] leading-6 break-words hyphens-auto overflow-x-auto">{body}</pre>
    </div>
  );
}

// Library items – practical prompts
const PROMPTS = [
  { title: "Cold email to a prospect", body: `Write a short, polite cold email to <name> at <company> about <product>. Include one benefit, a 20 minute call ask, and two time options. Use British English.` },
  { title: "Follow up after a meeting", body: `Draft a follow up email that recaps decisions and actions with owners and due dates. Close with a thanks and a simple next step.` },
  { title: "LinkedIn post from an article", body: `Turn this article into a LinkedIn post with a hook, three bullets, and a call to comment. Keep it under 120 words.\n\n<URL or text>` },
  { title: "Meeting agenda builder", body: `Create a 30 minute agenda for a meeting about <topic>. Include goals, three sections with timings, and a closing action review.` },
  { title: "Customer support reply", body: `Write a friendly support response that acknowledges the issue, gives one fix, and offers a workaround. Ask for confirmation.` },
  { title: "Jira ticket from notes", body: `Turn these notes into a Jira ticket which includes summary, acceptance criteria in Given/When/Then form, and a clear definition of done.\n\n<notes>` },
  { title: "SQL from description", body: `Write a SQL query for Postgres: <plain description>. Return the query and a one sentence explanation.` },
  { title: "Explain a SQL query", body: `Explain what this SQL does in three bullets, then propose a clearer version.\n\n<sql>` },
  { title: "Regex generator", body: `Create a regex that matches <pattern>. Provide two matching and two non‑matching examples. Explain the parts briefly.` },
  { title: "Excel formula helper", body: `Write an Excel formula for: <description>. Provide a short explanation and an example row.` },
  { title: "Google Sheets ArrayFormula", body: `Write a Google Sheets ArrayFormula for: <description>. Include a short explanation.` },
  { title: "Pandas transformation", body: `Provide pandas code that loads a CSV at /path/file.csv and produces a table with columns which include <cols>. Include one data quality check.` },
  { title: "Bash one‑liner", body: `Write a safe bash one liner to <task>. Explain flags. Provide a dry run option if applicable.` },
  { title: "Git commit message", body: `Given this diff, write a conventional commit message which includes a short subject and a 2 line body.\n\n<diff>` },
  { title: "Dockerfile from Python app", body: `Write a minimal Dockerfile for a Python 3.11 app with requirements.txt and a uvicorn server at app:app on port 8000.` },
  { title: "API request cURL", body: `Create a cURL example for a POST to <url> with JSON {<body>}. Show headers and a sample response.` },
  { title: "JSON Schema", body: `Draft a JSON Schema for this object: <description>. Mark required fields and types.` },
  { title: "Risk review checklist", body: `Review this plan for risks. List security, privacy, and operational risks with a severity and a mitigation for each.\n\n<plan>` },
  { title: "A/B test plan", body: `Write a simple A/B test plan for <feature>. Include hypothesis, metric, sample size assumption, and run length estimate.` },
  { title: "KPI brainstorm", body: `Suggest KPIs for <product>. Group them into acquisition, activation, retention, referral, and revenue. Give a one line rationale per KPI.` },
  { title: "Data extraction to table", body: `Extract entities into a six column table which includes entity, attribute, value, units, source, and confidence. Then add a one paragraph synthesis.\n\n<Text>` },
  { title: "Rewrite a prompt more safely", body: `Improve this prompt for clarity and safety. Keep it under 80 words and add two guardrail questions.\n\n<prompt>` },
  { title: "Interview guide", body: `Create a user interview guide for <persona> about <topic>. Include intro, five core questions, two probes per question, and a wrap up.` },
  { title: "Presentation outline", body: `Create a 6 slide outline for a talk on <topic>. Include title options and speaker notes bullets for each slide.` },
  { title: "FAQ from documentation", body: `Read this text and output a FAQ with ten Q&A pairs which include short answers.\n\n<Text>` },
  { title: "Summarise a YouTube video", body: `Summarise this YouTube video in six bullets and one takeaway. Include timestamps if possible.\n\n<url>` },
  { title: "Translate and localise", body: `Translate to British English and keep technical terms precise. Maintain meaning, shorten where possible, and keep names unchanged.` },
  { title: "Policy‑aware rewrite", body: `Rewrite this copy to be compliant with <policy>. Replace risky claims with factual statements and add a disclaimer if needed.` },
  { title: "Roadmap table", body: `Turn these items into a three month roadmap table which includes item, owner, week, risk, and success metric.\n\n<items>` },
];

export default function Page() {
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    try { return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; } catch { return true; }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark"); else root.classList.remove("dark");
  }, [dark]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PROMPTS;
    return PROMPTS.filter(p => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q));
  }, [query]);

  function scrollToPrompts() {
    const el = document.getElementById("prompts");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <Header onTryPrompts={scrollToPrompts} onToggleTheme={() => setDark(v => !v)} dark={dark} />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="rounded-xl bg-white ring-1 ring-neutral-200 p-5 dark:bg-neutral-900 dark:ring-neutral-800">
          <div className="flex items-start justify-between gap-3">
            <Badge><Icon.Star className="h-4 w-4"/> Prompts Hub</Badge>
            <div className="hidden sm:flex gap-2">
              <button onClick={scrollToPrompts} className="rounded-lg bg-gradient-to-tr from-sky-500 to-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">Try prompts</button>
            </div>
          </div>
          <p className="mt-2 text-[13px] opacity-80">Copy any prompt and paste it into ChatGPT. Sections are compact and practical, which helps you move quickly.</p>
        </div>

        <Card title="Core prompt patterns">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <FeatureBadge title="Clarity" subtitle="Task and audience" />
            <FeatureBadge title="Constraints" subtitle="Tone, length, format" />
            <FeatureBadge title="Steps" subtitle="Ask for process" />
            <FeatureBadge title="Checks" subtitle="Validation or tests" />
          </div>
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            <PromptMini text="Rewrite for <audience>. Keep it under 120 words in a neutral tone." />
            <PromptMini text="List the steps you will take. After the result, give two checks to verify it." />
            <PromptMini text="Return a markdown table with columns which include name, reason, and score." />
            <PromptMini text="Ask three clarifying questions before you start." />
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-4">
          <Card title="General prompts">
            <div className="grid gap-2">
              <PromptMini text="Summarise this in six bullets with one key takeaway at the top." />
              <PromptMini text="Turn these notes into action items which include owner, due date, and next step." />
              <PromptMini text="Create a two week study plan with daily tasks and a short quiz at the end of each week." />
              <PromptMini text="Translate to British English with a polite, concise style." />
              <PromptMini text="Draft a three section outline with two bullets per section." />
            </div>
          </Card>

          <Card title="Writing and editing prompts">
            <div className="grid gap-2">
              <PromptMini text="Rewrite this paragraph so that it is clearer and more concise. Keep the facts." />
              <PromptMini text="Change the tone to friendly but professional. Keep all factual details." />
              <PromptMini text="Shorten to 100 words without losing meaning. List any information that was removed." />
              <PromptMini text="Expand into a blog outline which includes a title, H2s, and notes for each section." />
              <PromptMini text="Give three alternative headlines which include a curiosity gap." />
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Card title="Research prompts">
            <div className="grid gap-2">
              <PromptMini text="List five credible sources on <topic> and explain why each source is relevant." />
              <PromptMini text="Create a comparison table for these approaches which includes strengths, risks, cost, and time to try." />
              <PromptMini text="Write interview questions for <persona> about <topic> which include probes." />
              <PromptMini text="Extract entities into a table which includes entity, attribute, value, units, source, and confidence." />
              <PromptMini text="Draft a six week research plan with aims, methods, and risks." />
            </div>
          </Card>

          <Card title="Coding prompts">
            <div className="grid gap-2">
              <PromptMini text="Refactor this function for clarity and test coverage. Return only the unified diff." />
              <PromptMini text="Explain what this code does in three bullets then suggest a clearer version." />
              <PromptMini text="Write unit tests for this function. Cover edge cases and errors." />
              <PromptMini text="Suggest a safer SQL version and explain the changes which reduce risk." />
              <PromptMini text="Turn this bug report into the smallest reproducible example." />
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Card title="Personalisation prompts">
            <div className="grid gap-2">
              <PromptMini text="You are my writing assistant. When I paste text, you will suggest edits which improve clarity and British English spelling." />
              <PromptMini text="Adapt this message for <stakeholder>. Include one benefit and one clear ask." />
              <PromptMini text="Act as a tutor for <topic>. Ask a question, wait for my answer, then continue." />
              <PromptMini text="Create a polite follow up email which references our last message and proposes two options." />
            </div>
          </Card>

          <Card title="Review and critique prompts">
            <div className="grid gap-2">
              <PromptMini text="Critique this design using clarity, contrast, spacing, affordance, consistency, error states, empty states, and a11y. Provide three fixes." />
              <PromptMini text="Review this document. List three strengths and three risks with suggestions that are specific and testable." />
              <PromptMini text="Score these ideas from zero to five on impact and effort. Return a matrix and a pick." />
            </div>
          </Card>
        </div>

       <section id="prompts" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold">Prompts library</h2>
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <div className="flex-1">
              <input type="text" placeholder="Search prompts, such as ‘email’, ‘SQL’, or ‘design’" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-lg bg-white ring-1 ring-neutral-200 px-3 py-2 text-sm dark:bg-neutral-900 dark:ring-neutral-800" />
            </div>
            <span className="text-xs opacity-70">{filtered.length} shown</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {filtered.map((p) => (<PromptCard key={p.title} title={p.title} body={p.body} />))}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-4">
          <Card title="Prompting tips">
            <ul className="space-y-1.5 list-disc list-inside text-[13px] opacity-90">
              <li>State the audience and the goal which sets the context.</li>
              <li>Add constraints which include tone, length, format, and time.</li>
              <li>Ask for structure which includes tables or bullet points.</li>
              <li>Request checks which include tests or a short validation step.</li>
            </ul>
          </Card>
          <div className="rounded-xl bg-white ring-1 ring-neutral-200 p-5 flex items-center justify-between dark:bg-neutral-900 dark:ring-neutral-800">
            <div className="text-xs opacity-80">Made by GPT‑5 Thinking. No tracking. No cookies. Pure HTML and CSS.</div>
            <a href="#top" onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="text-xs underline">Back to top</a>
          </div>
        </div>
      </main>
    </div>
  );
}
