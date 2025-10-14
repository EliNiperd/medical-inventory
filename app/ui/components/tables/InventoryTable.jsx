'use client';

import { useState } from 'react';
import { Pill, Search, Filter, Edit, Trash2, Eye, AlertCircle } from 'lucide-react';
import { getExpiryStatus, getStockStatus } from '@/lib/utils/expiryAlerts';
import { toast } from 'sonner';

export default function InventoryTable({
  medicines = [],
  onEdit,
  onDelete,
  onView,
  loading = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, expired, expiring, low_stock
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filtrar medicamentos
  const filteredMedicines = medicines.filter((med) => {
    // Filtro de búsqueda
    const matchesSearch =
      med.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.principio_activo?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filtro por tipo
    if (filterType === 'all') return true;

    const expiryStatus = getExpiryStatus(med.expiry_date || med.expiration_date);
    const stockStatus = getStockStatus(
      med.stock_actual || med.quantity,
      med.stock_minimo || med.reorder_point
    );

    switch (filterType) {
      case 'expired':
        return expiryStatus.level === 'expired' || expiryStatus.level === 'expired_today';
      case 'expiring':
        return expiryStatus.level === 'critical' || expiryStatus.level === 'urgent';
      case 'low_stock':
        return (
          stockStatus.level === 'critical' ||
          stockStatus.level === 'low' ||
          stockStatus.level === 'out_of_stock'
        );
      case 'active':
        return expiryStatus.level === 'ok' && stockStatus.level === 'ok';
      default:
        return true;
    }
  });

  // Ordenar medicamentos
  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case 'name':
        aValue = a.name || a.nombre || '';
        bValue = b.name || b.nombre || '';
        break;
      case 'expiry':
        aValue = new Date(a.expiry_date || a.expiration_date);
        bValue = new Date(b.expiry_date || b.expiration_date);
        break;
      case 'stock':
        aValue = a.stock_actual || a.quantity || 0;
        bValue = b.stock_actual || b.quantity || 0;
        break;
      case 'price':
        aValue = a.precio_referencia || a.price || 0;
        bValue = b.precio_referencia || b.price || 0;
        break;
      default:
        aValue = a[sortField] || '';
        bValue = b[sortField] || '';
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Cambiar ordenamiento
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Manejar eliminación con confirmación
  const handleDelete = (medicine) => {
    toast.custom(
      (t) => (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                ¿Eliminar medicamento?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {medicine.name || medicine.nombre} será eliminado permanentemente
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    toast.dismiss(t);
                    onDelete(medicine.id);
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => toast.dismiss(t)}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header con búsqueda y filtros */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Buscar medicamentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Todos ({medicines.length})
            </button>
            <button
              onClick={() => setFilterType('expiring')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'expiring'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Por vencer
            </button>
            <button
              onClick={() => setFilterType('expired')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'expired'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Vencidos
            </button>
            <button
              onClick={() => setFilterType('low_stock')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'low_stock'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Stock bajo
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Medicamento
                  {sortField === 'name' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('stock')}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Stock
                  {sortField === 'stock' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('expiry')}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Vencimiento
                  {sortField === 'expiry' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Precio
                  {sortField === 'price' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedMedicines.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-12 text-center">
                  <Pill className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    No se encontraron medicamentos
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                    {searchQuery
                      ? 'Intenta con otro término de búsqueda'
                      : 'Agrega tu primer medicamento'}
                  </p>
                </td>
              </tr>
            ) : (
              sortedMedicines.map((medicine) => {
                const expiryStatus = getExpiryStatus(
                  medicine.expiry_date || medicine.expiration_date
                );
                const stockStatus = getStockStatus(
                  medicine.stock_actual || medicine.quantity,
                  medicine.stock_minimo || medicine.reorder_point
                );

                return (
                  <tr
                    key={medicine.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
                          <Pill className="w-5 h-5 text-blue-600 dark:text-blue-200" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {medicine.name_medicine}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {medicine.description || 'Sin descripción'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${expiryStatus.bgColor} ${expiryStatus.textColor}`}
                        >
                          {expiryStatus.icon} {expiryStatus.message}
                        </span>
                        {stockStatus.level !== 'ok' && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.textColor}`}
                          >
                            {stockStatus.icon} {stockStatus.message}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {medicine.quantity_on_hans} unidades
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Mínimo: {medicine.reorder_point || 0}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {new Date(
                          medicine.expiry_date || medicine.expiration_date
                        ).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${(medicine.precio_referencia || medicine.price || 0).toFixed(2)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(medicine)}
                            className="p-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(medicine)}
                            className="p-2 text-gray-600 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => handleDelete(medicine)}
                            className="p-2 text-gray-600 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con contador */}
      {sortedMedicines.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando <span className="font-medium">{sortedMedicines.length}</span> de{' '}
            <span className="font-medium">{medicines.length}</span> medicamentos
          </p>
        </div>
      )}
    </div>
  );
}
