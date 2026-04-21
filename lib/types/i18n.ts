
export enum Lang {
    RU = 'ru',
    UZ_LATN = 'uz', // Латиница
    UZ_CYRL = 'uzk', // Кириллица
}

export interface LocalizedContent {
    [Lang.RU]: string;
    [Lang.UZ_LATN]?: string;
    [Lang.UZ_CYRL]?: string;
    [key: string]: string | undefined; // Для совместимости с другими возможными языками
}
