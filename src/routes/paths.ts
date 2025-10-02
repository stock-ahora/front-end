// routes/paths.ts
const ROOTS = {
    DASHBOARD: '/',
    INVENTORY: '/inventory',
    BILLING: '/billing',
    NOTIFICATIONS: '/notifications',
    REPORTS: '/reports',
    SETTINGS: '/settings',
    LOGIN: '/login',
    OCR: '/ocr',
} as const

export const paths = {
    dashboard: { root: ROOTS.DASHBOARD },
    public: { login: ROOTS.LOGIN },

    inventory: {
        root: ROOTS.INVENTORY,
        list: ROOTS.INVENTORY,
        create: `${ROOTS.INVENTORY}/create`,
        edit: (id: string | number) => `${ROOTS.INVENTORY}/${id}/edit`,
        detail: (id: string | number) => `${ROOTS.INVENTORY}/${id}`,
        movements: `${ROOTS.INVENTORY}/movements`,
        categories: `${ROOTS.INVENTORY}/categories`,
        suppliers: `${ROOTS.INVENTORY}/suppliers`,
    },

    ocr: {
        root: ROOTS.OCR,
        scan: `${ROOTS.OCR}/scan`,
        history: `${ROOTS.OCR}/history`,
    },

    billing: {
        root: ROOTS.BILLING,
        vouchers: `${ROOTS.BILLING}/vouchers`,
        voucherDetail: (id: string | number) => `${ROOTS.BILLING}/vouchers/${id}`,
        createVoucher: `${ROOTS.BILLING}/vouchers/create`,
        taxes: `${ROOTS.BILLING}/taxes`,
        exports: `${ROOTS.BILLING}/exports`,
    },

    notifications: {
        root: ROOTS.NOTIFICATIONS,
        pending: `${ROOTS.NOTIFICATIONS}/pending`,
        history: `${ROOTS.NOTIFICATIONS}/history`,
        settings: `${ROOTS.NOTIFICATIONS}/settings`,
    },

    reports: {
        root: ROOTS.REPORTS,
        kpis: `${ROOTS.REPORTS}/kpis`,
        dashboards: `${ROOTS.REPORTS}/dashboards`,
        exports: `${ROOTS.REPORTS}/exports`,
        custom: `${ROOTS.REPORTS}/custom`,
    },

    settings: {
        root: ROOTS.SETTINGS,
        preferences: `${ROOTS.SETTINGS}/preferences`,
        users: `${ROOTS.SETTINGS}/users`,
        roles: `${ROOTS.SETTINGS}/roles`,
        appearance: `${ROOTS.SETTINGS}/appearance`,
        integrations: `${ROOTS.SETTINGS}/integrations`,
    },
}
