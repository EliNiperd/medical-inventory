// hooks/useDashboard.js
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getToastMessage } from '@/lib/utils/expiryAlerts';

/**
 * Hook personalizado para gestionar el estado del dashboard
 * @returns {Object} Estado y funciones del dashboard
 */
export function useDashboard() {
  const [metrics, setMetrics] = useState({
    total: 0,
    expiringSoon: 0,
    lowStock: 0,
    expired: 0,
    totalValue: 0,
  });

  const [alerts, setAlerts] = useState([]);
  const [trends, setTrends] = useState({
    averageConsumption: 0,
    totalMovements: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Función para cargar métricas desde la API
  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard/metrics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Siempre obtener datos frescos
      });

      if (!response.ok) {
        throw new Error('Error al cargar métricas del dashboard');
      }

      const data = await response.json();

      if (data.success) {
        setMetrics(data.metrics);
        setAlerts(data.alerts || []);
        setTrends(data.trends || { averageConsumption: 0, totalMovements: 0 });
        setLastUpdate(new Date(data.timestamp));

        return data;
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (err) {
      //console.error('Error loading dashboard metrics:', err);
      setError(err.message);

      // Mostrar error con toast
      toast.error('Error al cargar el dashboard', {
        description: err.message,
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para refrescar métricas manualmente
  const refresh = async () => {
    toast.promise(loadMetrics(), {
      loading: 'Actualizando dashboard...',
      success: 'Dashboard actualizado',
      error: 'Error al actualizar',
    });
  };

  // Cargar métricas al montar el componente
  useEffect(() => {
    loadMetrics();
  }, []);

  // Mostrar alertas importantes al cargar
  useEffect(() => {
    if (!loading && alerts.length > 0) {
      // Filtrar solo alertas críticas para no saturar
      const criticalAlerts = alerts.filter(
        (a) => a.severity === 'critical' && a.type === 'expired'
      );

      const urgentAlerts = alerts.filter(
        (a) => a.severity === 'warning' && ['critical', 'urgent'].includes(a.type)
      );

      // Mostrar alerta de vencidos
      if (criticalAlerts.length > 0) {
        const alert = criticalAlerts[0];
        const toastData = getToastMessage(alert);

        toast.error(toastData.title, {
          description: `${criticalAlerts.length} medicamento(s) requieren atención inmediata`,
          duration: 8000,
          action: {
            label: 'Ver todo',
            onClick: () => {
              // Navegar a sección de alertas o abrir modal
              console.log('Navigate to alerts');
            },
          },
        });
      }
      // Mostrar alerta de próximos a vencer
      else if (urgentAlerts.length > 0) {
        toast.warning('⏰ Medicamentos próximos a vencer', {
          description: `${urgentAlerts.length} medicamento(s) vencen pronto`,
          duration: 6000,
        });
      }

      // Alerta de stock bajo
      const lowStockAlerts = alerts.filter((a) => a.type === 'low_stock');
      if (lowStockAlerts.length > 0) {
        setTimeout(() => {
          toast.info('📦 Stock bajo detectado', {
            description: `${lowStockAlerts.length} medicamento(s) necesitan reabastecimiento`,
            duration: 5000,
          });
        }, 1500); // Delay para no saturar
      }
    }
  }, [loading, alerts]);

  return {
    // Estado
    metrics,
    alerts,
    trends,
    loading,
    error,
    lastUpdate,

    // Funciones
    refresh,
    loadMetrics,

    // Helpers computados
    hasAlerts: alerts.length > 0,
    hasCriticalAlerts: alerts.some((a) => a.severity === 'critical'),
    alertsCount: alerts.length,
  };
}

/**
 * Hook para cargar lista completa de medicamentos
 * @returns {Object} Medicamentos y funciones CRUD
 */
export function useMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/medicines', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Error al cargar medicamentos');
      }

      const data = await response.json();
      setMedicines(data.medicines || []);

      return data.medicines;
    } catch (err) {
      //console.error('Error loading medicines:', err);
      setError(err.message);
      toast.error('Error al cargar medicamentos');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addMedicine = async (medicineData) => {
    try {
      const response = await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicineData),
      });

      if (!response.ok) {
        throw new Error('Error al agregar medicamento');
      }

      const data = await response.json();

      // Actualizar lista local
      setMedicines((prev) => [...prev, data.medicine]);

      toast.success('✅ Medicamento agregado', {
        description: `${data.medicine.nombre} añadido al inventario`,
      });

      return data.medicine;
    } catch (err) {
      //console.error('Error adding medicine:', err);
      toast.error('Error al agregar medicamento');
      throw err;
    }
  };

  const updateMedicine = async (id, updates) => {
    try {
      const response = await fetch(`/api/medicines/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar medicamento');
      }

      const data = await response.json();

      // Actualizar lista local
      setMedicines((prev) => prev.map((m) => (m.id === id ? data.medicine : m)));

      toast.success('✅ Medicamento actualizado');

      return data.medicine;
    } catch (err) {
      //console.error('Error updating medicine:', err);
      toast.error('Error al actualizar medicamento');
      throw err;
    }
  };

  const deleteMedicine = async (id) => {
    try {
      const response = await fetch(`/api/medicines/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar medicamento');
      }

      // Actualizar lista local
      setMedicines((prev) => prev.filter((m) => m.id !== id));

      toast.success('🗑️ Medicamento eliminado');

      return true;
    } catch (err) {
      //console.error('Error deleting medicine:', err);
      toast.error('Error al eliminar medicamento');
      throw err;
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  return {
    medicines,
    loading,
    error,
    loadMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    count: medicines.length,
  };
}
