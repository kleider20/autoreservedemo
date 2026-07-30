export interface LayoutTemplate {
    id: number;
    name: string;
    slug: string;
    type: string;
    type_label: string;
    version: string;
    author: string;
    description: string | null;
    thumbnail: string | null;
    is_protected: boolean;
    is_active: boolean;
    assigned_to: string[];
    allowed_page_types: string[];
    created_at: string;
}

export interface PageTypeOption {
    value: string;
    label: string;
}