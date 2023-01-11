//Get actual date with format DD/MM/YYYY

export const actualDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
}).replace(/\//g, '/');