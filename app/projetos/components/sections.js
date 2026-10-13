import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Link from "next/link";
import { ArrowIcon, Badge, Eyebrow, Heading } from "@/app/projetos/components/ui";
import { MediaPreview } from "@/app/projetos/components/media";
import { ProjectGrid } from "@/app/projetos/components/project-grid";
import { visibleProjects, visibleSections } from "@/lib/portfolio-content";
export function Hero({ section }) {
    return /*#__PURE__*/ _jsxs("section", {
        id: section.id,
        className: "hero-section container",
        children: [
            /*#__PURE__*/ _jsx(Eyebrow, {
                children: section.eyebrow
            }),
            /*#__PURE__*/ _jsx(Heading, {
                content: section.heading,
                as: "h1"
            }),
            /*#__PURE__*/ _jsx("p", {
                className: "hero-description",
                children: section.description
            })
        ]
    });
}
export function ProjectFacts({ facts }) {
    return /*#__PURE__*/ _jsx("dl", {
        className: "project-facts",
        children: facts.map((fact)=>/*#__PURE__*/ _jsxs("div", {
                children: [
                    /*#__PURE__*/ _jsx("dt", {
                        className: "micro-label",
                        children: fact.label
                    }),
                    /*#__PURE__*/ _jsx("dd", {
                        children: fact.value
                    })
                ]
            }, fact.label))
    });
}
export function FeaturedProject({ section, project, ui }) {
    return /*#__PURE__*/ _jsx("section", {
        id: section.id,
        className: "featured-section container",
        "aria-label": section.badge,
        children: /*#__PURE__*/ _jsxs("article", {
            className: "featured-project glass",
            children: [
                /*#__PURE__*/ _jsx("div", {
                    className: "featured-media",
                    children: /*#__PURE__*/ _jsx(MediaPreview, {
                        asset: project.presentation,
                        ui: ui,
                        presentation: true
                    })
                }),
                /*#__PURE__*/ _jsxs("div", {
                    className: "featured-content",
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            className: "badge-row",
                            children: [
                                /*#__PURE__*/ _jsx(Badge, {
                                    children: section.badge
                                }),
                                /*#__PURE__*/ _jsx(Badge, {
                                    children: project.tag
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsx("h2", {
                            children: project.title
                        }),
                        /*#__PURE__*/ _jsx("p", {
                            children: project.introduction
                        }),
                        /*#__PURE__*/ _jsx(ProjectFacts, {
                            facts: project.facts
                        }),
                        /*#__PURE__*/ _jsxs(Link, {
                            className: "button",
                            href: `/projetos/${project.slug}`,
                            children: [
                                section.actionLabel,
                                /*#__PURE__*/ _jsx(ArrowIcon, {})
                            ]
                        })
                    ]
                })
            ]
        })
    });
}
export function Contact({ section, email }) {
    return /*#__PURE__*/ _jsx("section", {
        id: section.id,
        className: "contact-section",
        children: /*#__PURE__*/ _jsxs("div", {
            className: "container contact-inner",
            children: [
                /*#__PURE__*/ _jsxs("div", {
                    children: [
                        /*#__PURE__*/ _jsx(Heading, {
                            content: section.heading
                        }),
                        /*#__PURE__*/ _jsx("p", {
                            children: section.description
                        })
                    ]
                }),
                /*#__PURE__*/ _jsxs(Link, {
                    className: "button contact-cta",
                    href: "/contato",
                    children: [
                        section.actionLabel,
                        /*#__PURE__*/ _jsx(ArrowIcon, {})
                    ]
                })
            ]
        })
    });
}
export function SectionRenderer({ content }) {
    const projects = visibleProjects(content.projects);
    return /*#__PURE__*/ _jsx(_Fragment, {
        children: visibleSections(content.sections).map((section)=>{
            switch(section.type){
                case "hero":
                    return /*#__PURE__*/ _jsx(Hero, {
                        section: section
                    }, section.id);
                case "featured":
                    {
                        const project = projects.find((project)=>project.id === section.projectId);
                        return project ? /*#__PURE__*/ _jsx(FeaturedProject, {
                            section: section,
                            project: project,
                            ui: content.ui
                        }, section.id) : null;
                    }
                case "projects":
                    return /*#__PURE__*/ _jsx(ProjectGrid, {
                        section: section,
                        projects: projects,
                        categories: content.categories,
                        ui: content.ui
                    }, section.id);
                case "contact":
                    return /*#__PURE__*/ _jsx(Contact, {
                        section: section,
                        email: content.contact.email
                    }, section.id);
            }
        })
    });
}
