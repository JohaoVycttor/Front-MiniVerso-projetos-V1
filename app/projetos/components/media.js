"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { ImageIcon, PlayIcon } from "@/app/projetos/components/ui";
export function MediaPlaceholder({ label, video = false }) {
    return /*#__PURE__*/ _jsxs("div", {
        className: `media-placeholder ${video ? "video-placeholder" : ""}`,
        "aria-hidden": "true",
        children: [
            video ? /*#__PURE__*/ _jsx("span", {
                className: "play-circle",
                children: /*#__PURE__*/ _jsx(PlayIcon, {})
            }) : /*#__PURE__*/ _jsx(ImageIcon, {}),
            /*#__PURE__*/ _jsx("span", {
                className: "micro-label",
                children: label
            })
        ]
    });
}
export function MediaPreview({ asset, ui, presentation = false }) {
    const [open, setOpen] = useState(false);
    const src = asset.type === "video" ? asset.poster : asset.src;
    const placeholder = /*#__PURE__*/ _jsx(MediaPlaceholder, {
        label: presentation ? ui.videoPlaceholder : ui.coverPlaceholder,
        video: presentation
    });
    if (!presentation) return src ? /*#__PURE__*/ _jsx("img", {
        className: "media-image",
        src: src,
        alt: asset.alt,
        loading: "lazy"
    }) : placeholder;
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx("button", {
                className: "media-trigger",
                onClick: ()=>setOpen(true),
                "aria-label": `${ui.play}: ${asset.alt}`,
                children: src ? /*#__PURE__*/ _jsxs(_Fragment, {
                    children: [
                        /*#__PURE__*/ _jsx("img", {
                            className: "media-image",
                            src: src,
                            alt: asset.alt
                        }),
                        /*#__PURE__*/ _jsx("span", {
                            className: "play-overlay",
                            children: /*#__PURE__*/ _jsx("span", {
                                className: "play-circle",
                                children: /*#__PURE__*/ _jsx(PlayIcon, {})
                            })
                        })
                    ]
                }) : placeholder
            }),
            open && /*#__PURE__*/ _jsx(MediaDialog, {
                asset: asset,
                ui: ui,
                onClose: ()=>setOpen(false)
            })
        ]
    });
}
function MediaDialog({ asset, ui, onClose }) {
    const ref = useRef(null);
    useEffect(()=>{
        const dialog = ref.current;
        const focused = document.activeElement;
        dialog?.showModal();
        const old = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return ()=>{
            dialog?.close();
            document.body.style.overflow = old;
            focused?.focus();
        };
    }, []);
    return /*#__PURE__*/ _jsx("dialog", {
        ref: ref,
        className: "media-dialog glass",
        onCancel: onClose,
        "aria-label": asset.alt,
        onClick: (event)=>{
            if (event.target === event.currentTarget) onClose();
        },
        children: /*#__PURE__*/ _jsxs("div", {
            className: "dialog-content",
            children: [
                /*#__PURE__*/ _jsx("button", {
                    className: "dialog-close",
                    onClick: onClose,
                    "aria-label": ui.close,
                    children: "×"
                }),
                asset.src ? asset.type === "video" ? /*#__PURE__*/ _jsx("video", {
                    src: asset.src,
                    poster: asset.poster,
                    controls: true,
                    autoPlay: true,
                    playsInline: true,
                    children: /*#__PURE__*/ _jsx("track", {
                        kind: "captions"
                    })
                }, asset.id) : /*#__PURE__*/ _jsx("img", {
                    src: asset.src,
                    alt: asset.alt
                }) : /*#__PURE__*/ _jsxs("div", {
                    className: "unavailable-media",
                    children: [
                        /*#__PURE__*/ _jsx("span", {
                            className: "play-circle",
                            children: /*#__PURE__*/ _jsx(PlayIcon, {})
                        }),
                        /*#__PURE__*/ _jsx("h2", {
                            children: ui.unavailableTitle
                        }),
                        /*#__PURE__*/ _jsx("p", {
                            children: ui.unavailableDescription
                        }),
                        /*#__PURE__*/ _jsx("button", {
                            className: "button",
                            onClick: onClose,
                            children: ui.close
                        })
                    ]
                }),
                asset.caption && /*#__PURE__*/ _jsx("p", {
                    className: "media-caption",
                    children: asset.caption
                })
            ]
        })
    });
}
export function Gallery({ assets, ui }) {
    const [active, setActive] = useState(0);
    const [open, setOpen] = useState(false);
    const asset = assets[active];
    if (!asset) return null;
    return /*#__PURE__*/ _jsxs("section", {
        className: "project-gallery",
        "aria-label": ui.galleryLabel,
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "gallery-heading",
                children: [
                    /*#__PURE__*/ _jsxs("p", {
                        className: "eyebrow",
                        children: [
                            "[ ",
                            ui.galleryLabel,
                            " ]"
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("span", {
                        className: "micro-label",
                        children: [
                            String(active + 1).padStart(2, "0"),
                            " / ",
                            String(assets.length).padStart(2, "0")
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ _jsxs("button", {
                className: "gallery-stage glass",
                onClick: ()=>setOpen(true),
                "aria-label": asset.alt,
                children: [
                    asset.type === "image" && asset.src ? /*#__PURE__*/ _jsx("img", {
                        src: asset.src,
                        alt: asset.alt,
                        loading: "lazy"
                    }) : asset.poster ? /*#__PURE__*/ _jsx("img", {
                        src: asset.poster,
                        alt: asset.alt,
                        loading: "lazy"
                    }) : /*#__PURE__*/ _jsx(MediaPlaceholder, {
                        label: asset.alt,
                        video: asset.type === "video"
                    }),
                    asset.type === "video" && asset.poster && /*#__PURE__*/ _jsx("span", {
                        className: "play-overlay",
                        children: /*#__PURE__*/ _jsx("span", {
                            className: "play-circle",
                            children: /*#__PURE__*/ _jsx(PlayIcon, {})
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "gallery-controls",
                children: [
                    /*#__PURE__*/ _jsx("p", {
                        children: asset.caption || asset.alt
                    }),
                    assets.length > 1 && /*#__PURE__*/ _jsxs("div", {
                        children: [
                            /*#__PURE__*/ _jsx("button", {
                                onClick: ()=>setActive((active + assets.length - 1) % assets.length),
                                "aria-label": ui.previous,
                                children: "←"
                            }),
                            /*#__PURE__*/ _jsx("button", {
                                onClick: ()=>setActive((active + 1) % assets.length),
                                "aria-label": ui.next,
                                children: "→"
                            })
                        ]
                    })
                ]
            }),
            open && /*#__PURE__*/ _jsx(MediaDialog, {
                asset: asset,
                ui: ui,
                onClose: ()=>setOpen(false)
            })
        ]
    });
}
