// app/api/dashboard/metrics/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    //const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    // Obtener todos los medicamentos para cálculos
    const allMedicines = await prisma.medicines.findMany({
      select: {
        id: true,
        name: true,
        quantity_on_hans: true,
        reorder_point: true,
        expiration_date: true,
        price: true,
      },
    });

    // 1. Total de medicamentos
    const totalMedicines = allMedicines.length;

    // 2. Medicamentos próximos a vencer (< 30 días)
    const expiringSoon = allMedicines.filter((m) => {
      const expiryDate = new Date(m.expiration_date);
      return expiryDate <= thirtyDaysFromNow && expiryDate > now;
    }).length;

    // 3. Medicamentos con stock bajo
    const lowStock = allMedicines.filter((m) => m.stock_actual < m.stock_minimo).length;

    // 4. Valor total del inventario
    const totalValue = allMedicines.reduce((sum, m) => sum + m.price * m.quantity_on_hans, 0);

    // 5. Medicamentos vencidos
    const expired = allMedicines.filter((m) => new Date(m.expiration_date) < now).length;

    // 6. Medicamentos en alerta (múltiples condiciones)
    const alerts = [];

    allMedicines.forEach((med) => {
      const expiryDate = new Date(med.expiration_date);
      const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

      // Vencidos
      if (daysUntilExpiry < 0) {
        alerts.push({
          id: med.id,
          type: 'expired',
          severity: 'critical',
          medicine: med.name,
          message: `Vencido hace ${Math.abs(daysUntilExpiry)} días`,
          daysUntilExpiry: daysUntilExpiry,
          action: 'Eliminar del inventario',
          stock: med.quantity_on_hans,
        });
      }
      // Crítico (< 30 días)
      else if (daysUntilExpiry <= 30) {
        alerts.push({
          id: med.id,
          type: 'critical',
          severity: 'warning',
          medicine: med.name,
          message: `Vence en ${daysUntilExpiry} días`,
          daysUntilExpiry: daysUntilExpiry,
          action: 'Usar con prioridad',
          stock: med.quantity_on_hans,
        });
      }
      // Advertencia (30-90 días)
      else if (daysUntilExpiry <= 90) {
        alerts.push({
          id: med.id,
          type: 'warning',
          severity: 'info',
          medicine: med.name,
          message: `Vence en ${Math.ceil(daysUntilExpiry / 30)} meses`,
          daysUntilExpiry: daysUntilExpiry,
          action: 'Monitorear',
          stock: med.quantity_on_hans,
        });
      }

      // Stock bajo
      if (med.quantity_on_hans < med.reorder_point) {
        alerts.push({
          id: med.id,
          type: 'low_stock',
          severity: 'warning',
          medicine: med.name,
          message: `Stock bajo: ${med.quantity_on_hans} de ${med.reorder_point} unidades`,
          action: 'Reabastecer',
          stock: med.quantity_on_hans,
          minStock: med.reorder_point,
        });
      }
    });

    // Ordenar alertas por severidad (critical > warning > info)
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    // Obtener movimientos recientes (últimos 30 días) para tendencia
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentMovements = await prisma.inventoryMovement.findMany({
      where: {
        created_at: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        type: true,
        quantity: true,
        created_at: true,
      },
    });

    // Calcular consumo promedio (salidas)
    const outMovements = recentMovements.filter((m) => m.type === 'OUT');
    const totalOut = outMovements.reduce((sum, m) => sum + m.quantity, 0);
    const averageConsumption = totalOut > 0 ? (totalOut / 30).toFixed(1) : 0;

    return NextResponse.json({
      success: true,
      metrics: {
        total: totalMedicines,
        expiringSoon,
        lowStock,
        expired,
        totalValue: parseFloat(totalValue.toFixed(2)),
      },
      alerts: alerts.slice(0, 10), // Top 10 alertas más importantes
      trends: {
        averageConsumption: parseFloat(averageConsumption),
        totalMovements: recentMovements.length,
      },
      timestamp: now.toISOString(),
    });
  } catch (error) {
    //console.error('❌ Dashboard Metrics Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener métricas del dashboard',
        message: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
