'use client';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
} from 'recharts';
import { getExpiryStatus } from '@/lib/utils/expiryAlerts';

// Colores para la gráficas
const COLORS = {
  expired: '#ef4444', // red-500
  critical: '#f97316', // orange-500
  warning: '#eab308', // yellow-500
  ok: '#22c55e', // green-500
  analgesic: '#3b82f6', // blue-500
  antibiotic: '#8b5cf6', // purple-500
  antihistamine: '#ec4899', // pink-500
  medicamento: '#10b981', // emerald-500
  'prueba 10': '#f59e0b', // amber-500
  other: '#6b7280', // gray-500
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="label text-sm font-semibold">{`${label}`}</p>
        {payload.map((item, index) => (
          <p key={index} className="desc text-sm" style={{ color: item.color }}>
            {`${item.name}: ${item.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

/**
 * Gráfica de Dona - Medicamentos Activos vs Vencidos
 */
export function ActiveVsExpiredChart({ medicines = [] }) {
  const now = new Date();

  const stats = {
    active: medicines.filter((med) => new Date(med.expiry_date || med.expiration_date) > now)
      .length,
    expired: medicines.filter((med) => new Date(med.expiry_date || med.expiration_date) <= now)
      .length,
  };

  const data = [
    { name: 'Activos', value: stats.active, color: COLORS.ok },
    { name: 'Vencidos', value: stats.expired, color: COLORS.expired },
  ];

  if (medicines.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        <p>No hay medicamentos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Medicamentos Activos vs Vencidos
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="mr-4">Total: {medicines.length}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Leyenda personalizada */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.ok }}></div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Activos</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.active}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.expired }}></div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Vencidos</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.expired}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Gráfica de Barras - Próximos a Vencer (30 días)
 */
export function ExpiringMedicinesChart({ medicines = [] }) {
  const now = new Date();
  const weeklyData = [];
  for (let i = 0; i < 5; i++) {
    const weekStart = new Date(now.getTime() + i * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const medicinesInWeek = medicines.filter((med) => {
      const expiryDate = new Date(med.expiry_date || med.expiration_date);
      return expiryDate >= weekStart && expiryDate < weekEnd;
    });
    const expired = medicinesInWeek.filter((med) => {
      const status = getExpiryStatus(med.expiry_date || med.expiration_date);
      return status.level === 'expired' || status.level === 'expired_today';
    }).length;

    const critical = medicinesInWeek.filter((med) => {
      const status = getExpiryStatus(med.expiry_date || med.expiration_date);
      return status.level === 'urgent' || status.level === 'critical';
    }).length;

    const warning = medicinesInWeek.filter((med) => {
      const status = getExpiryStatus(med.expiry_date || med.expiration_date);
      return status.level === 'warning';
    }).length;

    weeklyData.push({
      week: `Semana ${i + 1}`,
      vencidos: expired,
      criticos: critical,
      advertencia: warning,
      total: medicinesInWeek.length,
    });
  }

  if (medicines.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Próximos a Vencer (30 días)
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">Por semana</div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 12 }}
            className="fill-gray-500 dark:fill-gray-400"
            axisLine={{ className: 'stroke-gray-300 dark:stroke-gray-700' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="fill-gray-500 dark:fill-gray-400"
            axisLine={{ className: 'stroke-gray-300 dark:stroke-gray-700' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
          <Legend wrapperClass="pt-4 text-sm text-gray-600 dark:text-gray-300" />
          <Bar dataKey="vencidos" fill={COLORS.expired} radius={[4, 4, 0, 0]} name="Vencidos" />
          <Bar dataKey="criticos" fill={COLORS.critical} radius={[4, 4, 0, 0]} name="Críticos" />
          <Bar
            dataKey="advertencia"
            fill={COLORS.warning}
            radius={[4, 4, 0, 0]}
            name="Advertencia"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t dark:border-gray-700">
        <div className="text-center">
          <div
            className="w-3 h-3 rounded-full mx-auto mb-1"
            style={{ backgroundColor: COLORS.expired }}
          ></div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Vencidos</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {weeklyData.reduce((sum, week) => sum + week.vencidos, 0)}
          </p>
        </div>
        <div className="text-center">
          <div
            className="w-3 h-3 rounded-full mx-auto mb-1"
            style={{ backgroundColor: COLORS.critical }}
          ></div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Críticos</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {weeklyData.reduce((sum, week) => sum + week.criticos, 0)}
          </p>
        </div>
        <div className="text-center">
          <div
            className="w-3 h-3 rounded-full mx-auto mb-1"
            style={{ backgroundColor: COLORS.warning }}
          ></div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Advertencia</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {weeklyData.reduce((sum, week) => sum + week.advertencia, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Gráfica de Dona - Distribución por Categoría
 */
export function CategoryDistributionChart({ medicines = [] }) {
  const categories = medicines.reduce((acc, med) => {
    const category = med.category_name || med.idCategory || 'Otros';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(categories).map(([name, value]) => ({
    name,
    value,
    color: COLORS[name.toLowerCase()] || COLORS.other,
  }));

  if (medicines.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Distribución por Categoría
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) =>
              percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Lista de categorías */}
      <div className="space-y-2 pt-4 border-t dark:border-gray-700">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
