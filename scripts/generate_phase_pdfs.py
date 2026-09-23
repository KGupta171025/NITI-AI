import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle

def build_pdf(title, subtitle, content_sections, output_filename):
    os.makedirs(os.path.dirname(output_filename), exist_ok=True)
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        rightMargin=40, leftMargin=40,
        topMargin=40, bottomMargin=40
    )
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#64748B'),
        spaceAfter=14
    )
    
    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#D9531E'),
        spaceBefore=12,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=6
    )
    
    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        leftIndent=15,
        spaceAfter=4
    )

    story = []
    story.append(Paragraph(title, title_style))
    story.append(Paragraph(subtitle, subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#D9531E'), spaceBefore=2, spaceAfter=12))

    for heading, text_or_bullets in content_sections:
        story.append(Paragraph(heading, h2_style))
        if isinstance(text_or_bullets, list):
            for item in text_or_bullets:
                story.append(Paragraph(f"• {item}", bullet_style))
        else:
            story.append(Paragraph(text_or_bullets, body_style))
        story.append(Spacer(1, 4))
        
    doc.build(story)
    print(f"Generated: {output_filename}")

if __name__ == "__main__":
    # Generate Phase 0 PDF
    p0_sections = [
        ("1. Objective & Scope", "Establish production monorepo architecture, Cloudflare Workers deployment topology, database schemas, local self-hosted AI integration models, and GitHub CI/CD workflows."),
        ("2. Architecture Stack", [
            "Next.js App Router (TypeScript, Tailwind CSS, Motion, Liquid Glass UI)",
            "Cloudflare Workers & Pages serverless runtime",
            "Cloudflare D1 (SQL) for transactional storage + R2 for documents",
            "Local/Self-hosted AI (Ollama / vLLM / SentenceTransformers, FAISS/Qdrant)",
            "Firebase Authentication (Google, Apple, Email/Password)"
        ]),
        ("3. Directory Structure", [
            "apps/web - Next.js full-stack user application",
            "apps/worker - Cloudflare Worker edge API gateway",
            "packages/ui - Shared design tokens and liquid glass components",
            "packages/types - Unified TypeScript models and schemas",
            "services/ai - Local AI/RAG services and vector indexes",
            "services/ingestion - Government scheme scraper and versioning pipeline"
        ]),
        ("4. Verification & Gate Criteria", "Strict TypeScript, zero compiler warnings, conventional commits, and automated Cloudflare build.")
    ]
    build_pdf(
        "NITI AI - Phase 0 Architecture Blueprint",
        "SIH #92: AI-Driven Scheme Matching Platform | Production Engineering Specification",
        p0_sections,
        r"D:\Code_Files\Projects\NITI-AI\Implementation_Phases\Phase0_Architecture.pdf"
    )

    # Generate Phase 1 PDF
    p1_sections = [
        ("1. Phase 1 Goals", "Build high-performance Frontend Foundation with Next.js App Router, Tailwind CSS, custom design tokens, Liquid Glass system, DialKit patterns, and responsive shell."),
        ("2. Visual Design System", [
            "Brand Palette: Deep Indian Saffron (#F07000) to Emerald Teal (#14B8A6)",
            "Surface: Frosted Glass morphism with backdrop blur & crisp contrast",
            "Typography: Inter, Cal Sans, Geist Mono, Noto Sans Devanagari",
            "Micro-Interactions: Motion springs, border glows, smooth state transitions"
        ]),
        ("3. Core Components Implemented", [
            "apps/web: Next.js 14 App Router layout, root shell, metadata & SEO",
            "Button: Variants (primary, secondary, ghost, danger, outline, glass)",
            "Input: Floating labels, left/right icons, error/hint states, accessibility",
            "Card: Glass cards, headers, content, and footer layout primitives",
            "Responsive Navigation: Glass navbar with mobile drawer & brand badge",
            "Hero Section: High-converting headline, stats ticker, and multilingual preview"
        ]),
        ("4. Quality & Build Validation", [
            "Linting & Type-checking passed without warnings",
            "Accessible WCAG-compliant contrast & focus indicators",
            "Fluid 60 FPS animations respecting prefers-reduced-motion"
        ])
    ]
    build_pdf(
        "NITI AI - Phase 1 Frontend Foundation Specification",
        "Modern Liquid Glass Design System, Responsive Shell & UI Primitives",
        p1_sections,
        r"D:\Code_Files\Projects\NITI-AI\Implementation_Phases\Phase1_Frontend.pdf"
    )
