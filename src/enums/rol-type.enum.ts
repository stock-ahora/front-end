// Roles oficiales de stock ahora o como se llame la wea esto esta fico a pregutar a los kabrops
export enum TruStockRole {
    ADMIN   = 'TA_ADMIN',    // Acceso total (configuración, usuarios, etc.)
    MANAGER = 'TA_MANAGER',  // Gestión avanzada (reportes, facturación, inventario)
    OPERATOR= 'TA_OPERATOR', // Operación diaria (inventario, OCR, facturas)
    VIEWER  = 'TA_VIEWER',   // Solo lectura sergio
}
