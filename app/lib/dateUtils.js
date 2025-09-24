export const formatDate = (date) => {
    if (!date) return "N/D";
    return new Date(date).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};