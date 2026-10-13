import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { ArrowIcon, Badge } from "@/app/projetos/components/ui";
import { MediaPreview } from "@/app/projetos/components/media";
export function ProjectCard({ project, ui, index }) {
    return /*#__PURE__*/ _jsxs("article", {
        className: "project-card glass",
        style: {
            "--card-delay": `${index * 45}ms`
        },
        children: [
            /*#__PURE__*/ _jsx(Link, {
                href: `/projetos/${project.slug}`,
                className: "card-cover",
                "aria-label": `${ui.detailsLabel}: ${project.title}`,
                tabIndex: -1,
                children: /*#__PURE__*/ _jsx(MediaPreview, {
                    asset: project.cover,
                    ui: ui
                })
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "card-content",
                children: [
                    /*#__PURE__*/ _jsx(Badge, {
                        children: project.tag
                    }),
                    /*#__PURE__*/ _jsx("h3", {
                        children: /*#__PURE__*/ _jsx(Link, {
                            href: `/projetos/${project.slug}`,
                            children: project.title
                        })
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        children: project.description
                    }),
                    /*#__PURE__*/ _jsxs(Link, {
                        href: `/projetos/${project.slug}`,
                        className: "text-link",
                        children: [
                            ui.detailsLabel,
                            /*#__PURE__*/ _jsx(ArrowIcon, {})
                        ]
                    })
                ]
            })
        ]
    });
}
