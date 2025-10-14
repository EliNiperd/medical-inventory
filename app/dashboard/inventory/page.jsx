'use client';

import { useState } from 'react';
import { PlusIcon, DocumentArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import InventoryTable from '@/app/ui/components/tables/InventoryTable';
import MedicineForm from '@/app/ui/medicine/medicine-form';
import { useMedicines } from '@/app/hooks/useDashboard';
import { toast } from 'sonner';

export default function InventoryPage() {
  const { medicines, loading, loadMedicines, deleteMedicine } = useMedicines();
  const [showForm, setShowForm] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const locales = {
    es: { locale: 'es-MX', currency: 'MXN' },
    en: { locale: 'en-US', currency: 'USD' },
  };

  // Manejar edición
  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setShowForm(true);
  };

  // Manejar eliminación
  const handleDelete = async (id) => {
    try {
      await deleteMedicine(id);
      toast.success('🗑️ Medicamento eliminado');
    } catch (error) {
      toast.error('Error al eliminar medicamento');
    }
  };

  // Manejar ver detalles
  const handleView = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetails(true);
  };

  // Cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedMedicine(null);
  };

  // Cerrar detalles
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedMedicine(null);
  };

  // Éxito al guardar
  const handleSuccess = () => {
    handleCloseForm();
    loadMedicines(); // Recargar lista
  };

  // Refrescar lista
  const handleRefresh = () => {
    toast.promise(loadMedicines(), {
      loading: 'Actualizando inventario...',
      success: 'Inventario actualizado',
      error: 'Error al actualizar',
    });
  };

  // Exportar a CSV (función básica)
  const handleExport = () => {
    try {
      const headers = ['Nombre', 'Stock', 'Precio', 'Vencimiento', 'Estado'];
      const rows = medicines.map((m) => [
        m.name || m.nombre,
        m.stock_actual || m.quantity,
        m.precio_referencia || m.price,
        new Date(m.expiry_date || m.expiration_date).toLocaleDateString(),
        new Date(m.expiry_date || m.expiration_date) > new Date() ? 'Activo' : 'Vencido',
      ]);

      const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventario_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();

      toast.success('📥 Inventario exportado');
    } catch (error) {
      toast.error('Error al exportar');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                💊 Inventario de Medicamentos
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Gestiona tu inventario completo de medicamentos
              </p>
            </div>
            {/* Acciones principales */}
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                disabled={loading}
              >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refrescar
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                Exportar
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Agregar Medicamento
              </button>
            </div>
          </div>
          {/* Stats rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {medicines.length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Activos</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {
                  medicines.filter((m) => new Date(m.expiry_date || m.expiration_date) > new Date())
                    .length
                }
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Vencidos</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {
                  medicines.filter(
                    (m) => new Date(m.expiry_date || m.expiration_date) <= new Date()
                  ).length
                }
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {medicines
                  .reduce((sum, m) => sum + (m.price || 0) * (m.quantity || 0), 0)
                  .toLocaleString(locales.es.locale, {
                    style: 'currency',
                    currency: locales.es.currency,
                  })}
              </p>
            </div>
          </div>
        </div>
        {/* Tabla de inventario */}
        <InventoryTable
          medicines={medicines}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
        {/* Modal de formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedMedicine ? 'Editar Medicamento' : 'Nuevo Medicamento'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <MedicineForm
                  medicine={selectedMedicine}
                  onSuccess={handleSuccess}
                  onCancel={handleCloseForm}
                />
              </div>
            </div>
          </div>
        )}
        {/* Modal de detalles */}
        {showDetails && selectedMedicine && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Detalles del Medicamento
                </h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Nombre
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedMedicine.name || selectedMedicine.nombre}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Stock Actual
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {selectedMedicine.stock_actual || selectedMedicine.quantity} unidades
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Stock Mínimo
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {selectedMedicine.stock_minimo || selectedMedicine.reorder_point} unidades
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Precio
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      $
                      {(selectedMedicine.precio_referencia || selectedMedicine.price || 0).toFixed(
                        2
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Fecha de Vencimiento
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {new Date(
                        selectedMedicine.expiry_date || selectedMedicine.expiration_date
                      ).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>
                {selectedMedicine.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Descripción
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {selectedMedicine.description}
                    </p>
                  </div>
                )}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      handleCloseDetails();
                      handleEdit(selectedMedicine);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleCloseDetails}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
