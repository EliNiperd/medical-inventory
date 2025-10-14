'use client';
import { useState, useEffect } from 'react';
import {
  BeakerIcon as Pill,
  ExclamationCircleIcon as AlertCircle,
  ArrowDownOnSquareIcon as TrendingDown,
  CurrencyDollarIcon as DollarSign,
  CalendarIcon as Calendar,
  CubeIcon as Package,
} from '@heroicons/react/24/outline';

import { fetchFilteredMedicines } from '@/app/dashboard/medicine/actions';
import {
  ActiveVsExpiredChart,
  ExpiringMedicinesChart,
  CategoryDistributionChart,
} from '@/app/ui/dashborad/DashboardCharts';
import Link from 'next/link';

// Card de Métrica Reutilizable
const MetricCard = ({ title, value, icon: Icon, color = 'blue', subtitle, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700',
    orange:
      'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-700',
    red: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-700',
    green:
      'bg-green-50 text-green-600 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-700',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">{trend}</p>
        </div>
      )}
    </div>
  );
};

// Componente de Alerta para Medicamentos que Requieren Atención
function AlertItem({ type, medicine, daysUntilExpiry, action }) {
  const icons = {
    expired: '🔴',
    critical: '🟠',
    warning: '🟡',
    low_stock: '🔵',
  };

  const messages = {
    expired: 'Vencido',
    critical: `Vence en ${daysUntilExpiry} dias`,
    warning: `Vence en${Math.ceil(daysUntilExpiry / 30)} meses`,
    low_stock: `Quedan ${medicine.quantity_on_hans} unidades`,
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-2xl">{icons[type]}</span>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{medicine.name_medicine}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{messages[type]}</p>
        </div>
      </div>
      <button className="text-sm px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
        {action}
      </button>
    </div>
  );
}

// Dashboard Principal
export default function DashboardComponent() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    expiringSoon: 0,
    lowStock: 0,
    totalValue: 0,
  });
  const locales = {
    es: { locale: 'es-MX', currency: 'MXN' },
    en: { locale: 'en-US', currency: 'USD' },
  };
  //console.log(locales);

  // Simular carga de datos (reemplazar con API real)
  useEffect(() => {
    // Datos mock para demostración
    const mockMedicines = [
      {
        id: 1,
        name_medicine: 'Paracetamol 500mg',
        name_medicine: 'Paracetamol',
        quantity_on_hans: 3,
        reorder_point: 10,
        expiration_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 días
        price: 25.5,
      },
      {
        id: 2,
        name_medicine: 'Ibuprofeno 400mg',
        name_medicine: 'Ibuprofeno',
        quantity_on_hans: 20,
        reorder_point: 10,
        expiration_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Vencido
        price: 45.0,
      },
      {
        id: 3,
        name_medicine: 'Loratadina 10mg',
        name_medicine: 'Loratadina',
        quantity_on_hans: 15,
        reorder_point: 5,
        expiration_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 meses
        price: 89.5,
      },
      {
        id: 4,
        name_medicine: 'Amoxicilina 500mg',
        name_medicine: 'Amoxicilina',
        quantity_on_hans: 8,
        reorder_point: 10,
        expiration_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 días
        price: 120.0,
      },
      {
        id: 5,
        name_medicine: 'Metformina 850mg',
        name_medicine: 'Metformina',
        quantity_on_hans: 25,
        reorder_point: 15,
        expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
        price: 180.0,
      },
    ];

    const fetchData = async () => {
      try {
        const response = await fetchFilteredMedicines();
        setTimeout(() => {
          setMedicines(response.medicines);
          calculateMetrics(response.medicines);
          generateAlerts(response.medicines);
          setLoading(false);
          //console.log(response);
        }, 800);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    //console.log('👉🏻 Medicamentos cargados:', mockMedicines);
    // setTimeout(() => {
    //   setMedicines(mockMedicines);
    //   calculateMetrics(mockMedicines);
    //   generateAlerts(mockMedicines);
    //   setLoading(false);
    // }, 800);
  }, []);

  // Calcular métricas
  const calculateMetrics = (meds) => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const expiringSoon = meds.filter((m) => {
      const expiryDate = new Date(m.expiration_date);
      return expiryDate <= thirtyDaysFromNow && expiryDate > now;
    }).length;

    const lowStock = meds.filter((m) => m.quantity_on_hans < m.reorder_point).length;

    const totalValue = meds.reduce((sum, m) => sum + m.price * m.quantity_on_hans, 0);

    setMetrics({
      total: meds.length,
      expiringSoon,
      lowStock,
      totalValue: totalValue.toFixed(2),
    });
  };

  // Generar alertas
  const generateAlerts = (meds) => {
    const now = new Date();
    const alertsList = [];

    meds.forEach((med) => {
      const expiryDate = new Date(med.expiration_date);
      const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

      // Vencidos
      if (daysUntilExpiry < 0) {
        alertsList.push({
          type: 'expired',
          medicine: med,
          daysUntilExpiry: Math.abs(daysUntilExpiry),
          action: 'Eliminar',
        });
      }
      // Crítico (< 30 días)
      else if (daysUntilExpiry <= 30) {
        alertsList.push({
          type: 'critical',
          medicine: med,
          daysUntilExpiry,
          action: 'Usar primero',
        });
      }
      // Stock bajo
      if (med.quantity_on_hans < med.reorder_point) {
        alertsList.push({
          type: 'low_stock',
          medicine: med,
          action: 'Reabastecer',
        });
      }
    });

    setAlerts(alertsList.slice(0, 5)); // Máximo 5 alertas
  };

  if (loading) {
    return (
      <main>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 h-32"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Invetario de Medicamentos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona tu inventario de medicamentos de forma inteligente
            </p>
          </div>

          {/* Métricas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Medicamentos"
              value={metrics.total}
              icon={Pill}
              color="blue"
              subtitle="En inventario"
            />

            <MetricCard
              title="Próximos a Vencer"
              value={metrics.expiringSoon}
              icon={AlertCircle}
              color="orange"
              subtitle="En los próximos 30 días"
            />

            <MetricCard
              title="Stock Bajo"
              value={metrics.lowStock}
              icon={TrendingDown}
              color="red"
              subtitle="Por debajo del mínimo"
            />

            <MetricCard
              title="Valor Total"
              value={`${metrics.totalValue ? Intl.NumberFormat(locales.es.locale, { style: 'currency', currency: locales.es.currency }).format(metrics.totalValue) : 0}`}
              icon={DollarSign}
              color="green"
              subtitle="Valor del inventario"
            />
          </div>

          {/* Sección de Alertas */}
          {alerts.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Requieren Atención ({alerts.length})
                </h2>
              </div>
              <div className="space-y-2">
                {alerts.map((alert, index) => (
                  <AlertItem
                    key={index}
                    type={alert.type}
                    medicine={alert.medicine}
                    daysUntilExpiry={alert.daysUntilExpiry}
                    action={alert.action}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Gráficas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Gráfica: Activos vs Vencidos */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <ActiveVsExpiredChart medicines={medicines} />
            </div>

            {/* Gráfica: Próximos a Vencer */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <ExpiringMedicinesChart medicines={medicines} />
            </div>
          </div>

          {/* Gráfica: Distribución por Categoría (opcional) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <CategoryDistributionChart medicines={medicines} />
          </div>

          {/* Acciones Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/inventory"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
            >
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                Ver Inventario Completo
              </span>
            </Link>

            <button className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 transition-colors">
              <Pill className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-gray-900 dark:text-white">Agregar Medicamento</span>
            </button>

            <button className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-gray-900 dark:text-white">Ver Calendario</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
