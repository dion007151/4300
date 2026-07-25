import { describe, it, expect } from "vitest";
import { scoreResume, getKeywordHeatmap } from "../app/resume/utils/atsScorer";

describe("ATS Resume Scorer", () => {
  const sampleResume = `
    Alex Johnson
    alex@example.com | (555) 019-2831 | San Francisco, CA

    Professional Summary
    Results-driven Senior Software Engineer with 6+ years of experience building high-performance web applications using React, Next.js, TypeScript, and Python FastAPI.

    Work Experience
    Lead Frontend Engineer - TechCorp (2021 - Present)
    - Architected Next.js dashboard increasing performance by 40%.
    - Built reusable TypeScript UI component library used across 12 product teams.

    Skills
    React, Next.js, TypeScript, JavaScript, Python, FastAPI, Docker, PostgreSQL, Tailwind CSS

    Education
    Bachelor of Science in Computer Science - UC Berkeley
  `;

  const sampleJobDesc = `
    We are looking for a Senior Software Engineer with strong experience in React, Next.js, TypeScript, Python, and PostgreSQL.
    Responsibilities include building modern web applications, optimizing performance, and collaborating with cross-functional teams.
  `;

  it("calculates high ATS score for matching resume and job description", () => {
    const result = scoreResume(sampleResume, sampleJobDesc);
    expect(result.score).toBeGreaterThan(70);
    expect(result.keywords.found).toContain("React");
    expect(result.keywords.found).toContain("Typescript");
  });

  it("identifies missing keywords when resume does not match job requirements", () => {
    const unmatchedJobDesc = "Seeking Kubernetes Golang Cloud Architect for AWS infrastructure and Terraform deployment.";
    const result = scoreResume(sampleResume, unmatchedJobDesc);
    expect(result.keywords.missing).toContain("Kubernetes");
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it("correctly evaluates essential resume sections", () => {
    const result = scoreResume(sampleResume, sampleJobDesc);
    const contactSection = result.sections.find((s) => s.name === "Contact Info");
    const expSection = result.sections.find((s) => s.name === "Work Experience");
    expect(contactSection?.status).toBe("pass");
    expect(expSection?.status).toBe("pass");
  });

  it("generates keyword heatmap tokens with matching status", () => {
    const heatmap = getKeywordHeatmap("Built Next.js web application", "Need Next.js developer");
    const matchedToken = heatmap.find((item) => item.word.toLowerCase().includes("next.js"));
    expect(matchedToken).toBeDefined();
    expect(matchedToken?.matched).toBe(true);
  });
});
