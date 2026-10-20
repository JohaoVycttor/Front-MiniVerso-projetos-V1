"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Heading, Eyebrow } from "@/app/projetos/components/ui";
import { ProjectCard } from "@/app/projetos/components/project-card";
export function ProjectGrid({ section, projects, categories, ui }) {
    const [active, setActive] = useState("");
    const filtered = projects.filter((project)=>!active || project.categoryIds.includes(active));
    const count = `${String(filtered.length).padStart(2, "0")} ${filtered.length === 1 ? ui.projectSingular : ui.projectPlural}`;
    return /*#__PURE__*/ _jsxs("section", {
        id: section.id,
        className: "projects-section container",
        "aria-labelledby": `${section.id}-heading`,
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "section-topline",
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        children: [
                            /*#__PURE__*/ _jsx(Eyebrow, {
                                children: section.eyebrow
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                id: `${section.id}-heading`,
                                children: /*#__PURE__*/ _jsx(Heading, {
                                    content: section.heading
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("span", {
                        className: "project-count micro-label",
                        role: "status",
                        "aria-live": "polite",
                        children: count
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "category-filters",
                role: "group",
                "aria-label": section.heading.text + " " + section.heading.accent,
                children: [
                    {
                        id: "",
                        label: ui.allCategories
                    },
                    ...categories
                ].map((category)=>/*#__PURE__*/ _jsx("button", {
                        className: `filter-pill ${active === category.id ? "is-active" : ""}`,
                        "aria-pressed": active === category.id,
                        onClick: ()=>setActive(category.id),
                        children: category.label
                    }, category.id))
            }),
            /*#__PURE__*/ _jsx("div", {
                className: `project-grid columns-${section.columns}`,
                children: filtered.map((project, index)=>/*#__PURE__*/ _jsx(ProjectCard, {
                        project: project,
                        ui: ui,
                        index: index
                    }, project.id))
            }, active),
            !filtered.length && /*#__PURE__*/ _jsxs("div", {
                className: "empty-state glass",
                children: [
                    /*#__PURE__*/ _jsx("h3", {
                        children: ui.emptyTitle
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        children: ui.emptyDescription
                    }),
                    /*#__PURE__*/ _jsx("button", {
                        className: "button",
                        onClick: ()=>setActive(""),
                        children: ui.resetFilters
                    })
                ]
            })
        ]
    });
}
