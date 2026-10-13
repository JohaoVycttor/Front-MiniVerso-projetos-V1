import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ArrowIcon({ className = "" }) {
    return /*#__PURE__*/ _jsx("svg", {
        className: className,
        width: "17",
        height: "17",
        viewBox: "0 0 24 24",
        fill: "none",
        "aria-hidden": "true",
        children: /*#__PURE__*/ _jsx("path", {
            d: "M6 18 18 6M7 6h11v11",
            stroke: "currentColor",
            strokeWidth: "1.6",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        })
    });
}
export function ImageIcon() {
    return /*#__PURE__*/ _jsxs("svg", {
        width: "31",
        height: "31",
        viewBox: "0 0 32 32",
        fill: "none",
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ _jsx("rect", {
                x: "3",
                y: "5",
                width: "26",
                height: "22",
                rx: "4",
                stroke: "currentColor",
                strokeWidth: "1.7"
            }),
            /*#__PURE__*/ _jsx("circle", {
                cx: "11",
                cy: "12",
                r: "2.5",
                stroke: "currentColor",
                strokeWidth: "1.7"
            }),
            /*#__PURE__*/ _jsx("path", {
                d: "m5 24 8-8 5 5 4-4 6 6",
                stroke: "currentColor",
                strokeWidth: "1.7",
                strokeLinejoin: "round"
            })
        ]
    });
}
export function PlayIcon() {
    return /*#__PURE__*/ _jsx("svg", {
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        "aria-hidden": "true",
        children: /*#__PURE__*/ _jsx("path", {
            d: "m9 6 9 6-9 6V6Z",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinejoin: "round"
        })
    });
}
export function Brand({ brand, large = false }) {
    return /*#__PURE__*/ _jsxs("span", {
        className: `brand ${large ? "brand-large" : ""}`,
        children: [
            /*#__PURE__*/ _jsx("img", {
                src: brand.logo,
                alt: "",
                width: 176,
                height: 104
            }),
            /*#__PURE__*/ _jsx("span", {
                children: brand.name
            })
        ]
    });
}
export function Heading({ content, as = "h2", className = "" }) {
    const Tag = as;
    return /*#__PURE__*/ _jsxs(Tag, {
        className: `display-heading ${className}`,
        children: [
            content.text,
            " ",
            /*#__PURE__*/ _jsx("em", {
                children: content.accent
            })
        ]
    });
}
export function Badge({ children }) {
    return /*#__PURE__*/ _jsxs("span", {
        className: "badge",
        children: [
            /*#__PURE__*/ _jsx("span", {
                className: "badge-dot"
            }),
            children
        ]
    });
}
export function Eyebrow({ children }) {
    return /*#__PURE__*/ _jsxs("p", {
        className: "eyebrow",
        children: [
            "[ ",
            children,
            " ]"
        ]
    });
}
