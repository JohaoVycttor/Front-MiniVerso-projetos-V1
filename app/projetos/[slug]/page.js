export const dynamic = 'force-dynamic';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/portfolio-content";
import { PageShell } from "@/app/projetos/components/page-shell";
import { Badge, ArrowIcon } from "@/app/projetos/components/ui";
import { MediaPreview, Gallery } from "@/app/projetos/components/media";
import { Contact, ProjectFacts } from "@/app/projetos/components/sections";
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const content = await getContent();
    const project = content.projects.find((project)=>project.visible && project.slug === slug);
    return project ? {
        title: project.title,
        description: project.description
    } : {};
}
export default async function ProjectDetail({ params }) {
    const { slug } = await params;
    const content = await getContent();
    const project = content.projects.find((project)=>project.visible && project.slug === slug);
    if (!project) notFound();
    const contact = content.sections.find((section)=>section.type === "contact" && section.visible);
    return /*#__PURE__*/ _jsxs(PageShell, {
        content: content,
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "container detail-page",
                children: [
                    /*#__PURE__*/ _jsxs(Link, {
                        href: "/projetos",
                        className: "back-link",
                        children: [
                            /*#__PURE__*/ _jsx("span", {
                                "aria-hidden": "true",
                                children: "←"
                            }),
                            content.ui.backToProjects
                        ]
                    }),
                    /*#__PURE__*/ _jsx(Badge, {
                        children: project.tag
                    }),
                    /*#__PURE__*/ _jsx("h1", {
                        className: "detail-title",
                        children: project.title
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        className: "detail-intro",
                        children: project.introduction
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "detail-presentation glass",
                        children: /*#__PURE__*/ _jsx(MediaPreview, {
                            asset: project.presentation,
                            ui: content.ui,
                            presentation: true
                        })
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "detail-information",
                        children: [
                            /*#__PURE__*/ _jsx(ProjectFacts, {
                                facts: project.facts
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "project-story",
                                children: project.story.map((block)=>/*#__PURE__*/ _jsxs("section", {
                                        children: [
                                            /*#__PURE__*/ _jsx("h2", {
                                                children: block.title
                                            }),
                                            /*#__PURE__*/ _jsx("p", {
                                                children: block.text
                                            })
                                        ]
                                    }, block.title))
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx(Gallery, {
                        assets: project.gallery,
                        ui: content.ui
                    }),
                    /*#__PURE__*/ _jsxs(Link, {
                        href: "/projetos",
                        className: "text-link",
                        children: [
                            content.ui.backToProjects,
                            /*#__PURE__*/ _jsx(ArrowIcon, {})
                        ]
                    })
                ]
            }),
            contact?.type === "contact" && /*#__PURE__*/ _jsx(Contact, {
                section: contact,
                email: content.contact.email
            })
        ]
    });
}
