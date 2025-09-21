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
{ title: "Universal: result first then how", body: `Produce the result first which solves the task. Then add a short “How I got here” section. If information is missing, state the assumption in [brackets] and continue. Use British English.
Job to be done:` },
{ title: "Universal: plan, result, checks", body: `Plan first. List three to five steps you will take. Produce the result. Then list two checks that show the result meets the request. Use British English.
Job to be done:` },
{ title: "Universal: three candidates and a pick", body: `Give three candidate solutions that take different approaches. For each, include a one-line idea, pros, cons, cost to try, and a next step. End with your pick and why. Use British English.
Job to be done:` },
{ title: "Universal: decision table + recommendation", body: `Create a decision table. Columns include option, benefits, risks, cost, confidence, verdict. End with a concise recommendation. Use British English.
Job to be done:` },
{ title: "Universal: extract structured table + synthesis", body: `Extract a structured table. Columns include entity, attribute, value, units, source, confidence. Then write one paragraph that synthesises the table into an insight. Use British English.
Job to be done:` },
{ title: "Universal: rewrite for clarity and brevity", body: `Rewrite for clarity and brevity while preserving meaning. Keep within the word limit given in the job. List three specific edits you made. Use British English.
Job to be done:` },
{ title: "Universal: three realistic examples", body: `Generate three realistic examples that show how to apply the idea. Vary by context and difficulty. Use British English.
Job to be done:` },
{ title: "Universal: teach and test flow", body: `Create a teach-and-test flow for a beginner. Explain briefly, ask one question, wait for my answer, then continue. Finish with a three-question quiz. Use British English.
Job to be done:` },
{ title: "Universal: risk review table", body: `Run a risk review. List security, privacy, and operational risks with severity and a practical mitigation for each. Return a concise table. Use British English.
Job to be done:` },
{ title: "Universal: edge cases and failure modes", body: `Find edge cases and failure modes. Return eight cases that include trigger, expected behaviour, and how to test. Use British English.
Job to be done:` },
{ title: "Universal: policy-aware rewrite", body: `Write a policy-aware rewrite that complies with the policy named in the job. Replace risky claims with factual statements and add a short disclaimer if needed. Use British English.
Job to be done:` },
{ title: "Universal: acceptance criteria (Gherkin)", body: `Create acceptance criteria that are testable. Use Given, When, Then. Include at least one negative case. Use British English.
Job to be done:` },
{ title: "Universal: one-page brief", body: `Write a one-page brief for the topic and audience described in the job. Include executive summary, five key facts, risks, open questions, and a recommendation. Use British English.
Job to be done:` },
{ title: "Universal: six-bullet synthesis", body: `Turn multiple notes into a single synthesis. Return six bullets and one must-know takeaway at the top in bold. Use British English.
Job to be done:` },
{ title: "Universal: 30-minute mini-curriculum", body: `Prepare a mini-curriculum for a 30-minute sprint. Provide three links or actions and a target outcome. Use British English.
Job to be done:` },
{ title: "Universal: action items table + summary", body: `Turn notes into action items. Return a table that includes item, owner, due date, and next step. Add a one-paragraph summary. Use British English.
Job to be done:` },
{ title: "Universal: follow-up email", body: `Write a polite follow-up that recaps decisions, confirms owners and dates, and offers two time options for a quick check-in. Keep it concise. Use British English.
Job to be done:` },
{ title: "Universal: 30-minute agenda", body: `Create a 30-minute meeting agenda. Include goals, three timed sections, and a closing action review. Use British English.
Job to be done:` },
{ title: "Universal: KPIs by AARRR", body: `Suggest sensible KPIs and group them into acquisition, activation, retention, referral, and revenue. Provide a one-line rationale and a simple way to measure each. Use British English.
Job to be done:` },
{ title: "Universal: 30-60-90 plan", body: `Draft a 30-60-90 plan. Each phase includes three outcomes, the main risks, and one metric. Use British English.
Job to be done:` },
{ title: "Universal: one-pager for a feature", body: `Write a one-pager for a feature. Include problem, goals, non-goals, user stories, success metrics, and open questions. Limit to 350 words. Use British English.
Job to be done:` },
{ title: "Universal: refactor with tests (diff)", body: `Refactor code for clarity and testability. Return only a unified diff. Then propose three unit tests that cover edge cases. Use British English.
Job to be done:` },
{ title: "Universal: explain and improve a snippet", body: `Explain what this query or script does in three bullets. Propose an equivalent version that is clearer. State any change in performance risk. Use British English.
Job to be done:` },
{ title: "Universal: safe one-liner or script", body: `Create a safe one-liner or small script that performs the task. Explain the flags. Provide a dry-run version if applicable. Use British English.
Job to be done:` },
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
            <PromptMini text="Rewrite and paraphrase the following : " />
            <PromptMini text="List the steps you will take. After the result, give two checks to verify it." />
            <PromptMini text="Return a markdown table with columns which include name, reason, and score." />
            <PromptMini text="For the following task, Ask three clarifying questions before you start and give me their answers as options so i can select from them. Job to be done :." />
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
              <PromptMini text="List five credible sources on the following topic and explain why each source is relevant. The topic :" />
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
              <PromptMini text="Act as a tutor for for the following topic. Ask a question, wait for my answer, then continue. The topic : " />
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
