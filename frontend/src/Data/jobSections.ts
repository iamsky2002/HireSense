// A job description is stored as a single string, but employers fill it as three
// sections. We join them with simple "## Heading" markers and split them back out.
// No markdown library needed — our own tiny format.

export interface JobSections {
  about: string;
  responsibilities: string;
  qualifications: string;
}

const ABOUT = "About The Job";
const RESPONSIBILITIES = "Responsibilities";
const QUALIFICATIONS = "Qualifications & Skill Sets";

// three sections -> one description string (empty sections are skipped)
export function combineSections(s: JobSections): string {
  const parts: string[] = [];
  if (s.about.trim()) parts.push(`## ${ABOUT}\n${s.about.trim()}`);
  if (s.responsibilities.trim()) parts.push(`## ${RESPONSIBILITIES}\n${s.responsibilities.trim()}`);
  if (s.qualifications.trim()) parts.push(`## ${QUALIFICATIONS}\n${s.qualifications.trim()}`);
  return parts.join("\n\n");
}

// description -> [{title, body}]; null when it's a plain (non-sectioned) old job
export function parseSections(description: string): { title: string; body: string }[] | null {
  if (!description.includes("## ")) return null;
  const sections = description
    .split(/\n?##\s+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const nl = chunk.indexOf("\n");
      return nl === -1
        ? { title: chunk, body: "" }
        : { title: chunk.slice(0, nl).trim(), body: chunk.slice(nl + 1).trim() };
    });
  return sections.length ? sections : null;
}

// a clean, marker-free snippet for cards/previews (About body, else all bodies joined)
export function descriptionPreview(description: string): string {
  const parsed = parseSections(description);
  if (!parsed) return description;
  const about = parsed.find((s) => s.title === ABOUT)?.body;
  return about || parsed.map((s) => s.body).filter(Boolean).join(" ") || description;
}

// description -> the three form fields (old plain descriptions go into "about")
export function descriptionToSections(description: string): JobSections {
  const parsed = parseSections(description);
  if (!parsed) return { about: description, responsibilities: "", qualifications: "" };
  const body = (title: string) => parsed.find((s) => s.title === title)?.body || "";
  return {
    about: body(ABOUT),
    responsibilities: body(RESPONSIBILITIES),
    qualifications: body(QUALIFICATIONS),
  };
}
