export type ManagedPageKey = "studio" | "solutions" | "contactPage" | "portfolio";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type ManagedPage = {
  key: ManagedPageKey;
  label: string;
  description: string;
  href: string;
};
