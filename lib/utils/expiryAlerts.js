// lib/utils/expiryAlerts.js

/**
 * Obtiene el estado de caducidad de un medicamento
 * @param {Date|string} expiryDate - Fecha de caducidad del medicamento
 * @returns {Object} Estado con nivel, color, mensaje, icono y acción
 */
export function getExpiryStatus(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return {
      level: 'expired',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      message: `Vencido hace ${Math.abs(daysUntilExpiry)} días`,
      icon: '🔴',
      emoji: '⚠️',
      action: 'Eliminar del inventario',
      priority: 1,
    };
  }

  if (daysUntilExpiry === 0) {
    return {
      level: 'expired_today',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      message: 'Vence hoy',
      icon: '🔴',
      emoji: '⚠️',
      action: 'No usar - Eliminar',
      priority: 1,
    };
  }

  if (daysUntilExpiry <= 7) {
    return {
      level: 'urgent',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      message: `Vence en ${daysUntilExpiry} días`,
      icon: '🔴',
      emoji: '🚨',
      action: 'Usar inmediatamente',
      priority: 2,
    };
  }

  if (daysUntilExpiry <= 30) {
    return {
      level: 'critical',
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      message: `Vence en ${daysUntilExpiry} días`,
      icon: '🟠',
      emoji: '⏰',
      action: 'Usar con prioridad',
      priority: 3,
    };
  }

  if (daysUntilExpiry <= 90) {
    const months = Math.ceil(daysUntilExpiry / 30);
    return {
      level: 'warning',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      message: `Vence en ${months} ${months === 1 ? 'mes' : 'meses'}`,
      icon: '🟡',
      emoji: '📅',
      action: 'Monitorear',
      priority: 4,
    };
  }

  return {
    level: 'ok',
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
    message: 'Stock saludable',
    icon: '🟢',
    emoji: '✅',
    action: null,
    priority: 5,
  };
}

/**
 * Obtiene el estado de stock de un medicamento
 * @param {number} stockActual - Stock actual
 * @param {number} stockMinimo - Stock mínimo configurado
 * @returns {Object} Estado del stock
 */
export function getStockStatus(stockActual, stockMinimo) {
  const percentage = (stockActual / stockMinimo) * 100;

  if (stockActual === 0) {
    return {
      level: 'out_of_stock',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      message: 'Sin stock',
      icon: '🔴',
      emoji: '❌',
      action: 'Comprar urgente',
      priority: 1,
    };
  }

  if (percentage < 50) {
    return {
      level: 'critical',
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      message: `Stock crítico: ${stockActual} unidades`,
      icon: '🟠',
      emoji: '⚠️',
      action: 'Reabastecer pronto',
      priority: 2,
    };
  }

  if (stockActual < stockMinimo) {
    return {
      level: 'low',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      message: `Stock bajo: ${stockActual} de ${stockMinimo}`,
      icon: '🟡',
      emoji: '📦',
      action: 'Reabastecer',
      priority: 3,
    };
  }

  return {
    level: 'ok',
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
    message: 'Stock adecuado',
    icon: '🟢',
    emoji: '✅',
    action: null,
    priority: 5,
  };
}

/**
 * Genera todas las alertas para un medicamento
 * @param {Object} medicine - Objeto medicamento con todas sus propiedades
 * @returns {Array} Array de alertas generadas
 */
export function generateMedicineAlerts(medicine) {
  const alerts = [];

  // Alerta de caducidad
  const expiryStatus = getExpiryStatus(medicine.expiry_date);
  if (expiryStatus.level !== 'ok') {
    alerts.push({
      id: `expiry_${medicine.id}`,
      medicineId: medicine.id,
      medicineName: medicine.nombre,
      type: 'expiry',
      ...expiryStatus,
    });
  }

  // Alerta de stock
  const stockStatus = getStockStatus(medicine.stock_actual, medicine.stock_minimo);
  if (stockStatus.level !== 'ok') {
    alerts.push({
      id: `stock_${medicine.id}`,
      medicineId: medicine.id,
      medicineName: medicine.nombre,
      type: 'stock',
      ...stockStatus,
    });
  }

  return alerts;
}

/**
 * Agrupa y prioriza alertas de múltiples medicamentos
 * @param {Array} medicines - Array de medicamentos
 * @returns {Object} Alertas agrupadas por tipo y priorizadas
 */
export function processAllAlerts(medicines) {
  const allAlerts = [];

  medicines.forEach((medicine) => {
    const medicineAlerts = generateMedicineAlerts(medicine);
    allAlerts.push(...medicineAlerts);
  });

  // Ordenar por prioridad (1 = más urgente)
  allAlerts.sort((a, b) => a.priority - b.priority);

  // Agrupar por tipo
  const grouped = {
    expired: allAlerts.filter((a) => a.level === 'expired' || a.level === 'expired_today'),
    urgent: allAlerts.filter((a) => a.level === 'urgent'),
    critical: allAlerts.filter((a) => a.type === 'expiry' && a.level === 'critical'),
    lowStock: allAlerts.filter((a) => a.type === 'stock'),
    warning: allAlerts.filter((a) => a.level === 'warning'),
  };

  return {
    all: allAlerts,
    grouped,
    summary: {
      total: allAlerts.length,
      expired: grouped.expired.length,
      urgent: grouped.urgent.length,
      critical: grouped.critical.length,
      lowStock: grouped.lowStock.length,
      warning: grouped.warning.length,
    },
  };
}

/**
 * Calcula días restantes hasta la fecha de vencimiento
 * @param {Date|string} expiryDate - Fecha de vencimiento
 * @returns {number} Días hasta vencimiento (negativo si ya venció)
 */
export function getDaysUntilExpiry(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

/**
 * Formatea una fecha de manera legible
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatExpiryDate(date) {
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('es-MX', options);
}

/**
 * Obtiene mensaje de notificación para toast
 * @param {Object} alert - Objeto de alerta
 * @returns {Object} Objeto con título, descripción y tipo para toast
 */
export function getToastMessage(alert) {
  const messages = {
    expired: {
      title: `${alert.emoji} Medicamento Vencido`,
      description: `${alert.medicineName}: ${alert.message}`,
      type: 'error',
    },
    expired_today: {
      title: `${alert.emoji} Vence Hoy`,
      description: `${alert.medicineName} vence hoy. No usar.`,
      type: 'error',
    },
    urgent: {
      title: `${alert.emoji} Urgente`,
      description: `${alert.medicineName}: ${alert.message}`,
      type: 'warning',
    },
    critical: {
      title: `${alert.emoji} Atención`,
      description: `${alert.medicineName}: ${alert.message}`,
      type: 'warning',
    },
    warning: {
      title: `${alert.emoji} Monitorear`,
      description: `${alert.medicineName}: ${alert.message}`,
      type: 'info',
    },
    out_of_stock: {
      title: `${alert.emoji} Sin Stock`,
      description: `${alert.medicineName} agotado`,
      type: 'error',
    },
    low: {
      title: `${alert.emoji} Stock Bajo`,
      description: `${alert.medicineName}: ${alert.message}`,
      type: 'warning',
    },
  };

  return (
    messages[alert.level] || {
      title: 'Alerta',
      description: alert.message,
      type: 'info',
    }
  );
}
