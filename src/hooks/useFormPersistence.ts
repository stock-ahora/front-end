import { useEffect, useCallback, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface UseFormPersistenceProps {
  methods: UseFormReturn<any>
  storageKey: string
  excludeFields?: string[]
  autoSave?: boolean
  debounceTime?: number
  onDataRestored?: () => void // Nuevo callback para cuando se restauran datos
}

export const useFormPersistence = ({
  methods,
  storageKey,
  excludeFields = [],
  autoSave = true,
  debounceTime = 500,
  onDataRestored
}: UseFormPersistenceProps) => {
  const { watch, setValue, getValues, formState } = methods
  const hasLoadedRef = useRef(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Función para verificar si un valor tiene contenido significativo
  const hasSignificantValue = (value: any): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (typeof value === 'number') return value !== 0
    if (typeof value === 'boolean') return true // Los booleanos siempre son significativos
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object' && value.$d) return true // Fechas dayjs
    if (typeof value === 'object') return Object.keys(value).length > 0
    return false
  }

  // Función para verificar si el formulario tiene datos significativos
  const hasSignificantData = useCallback(
    (data: any = null): boolean => {
      const dataToCheck = data || getValues()

      // Excluir campos que no deben considerarse
      const fieldsToCheck = Object.keys(dataToCheck).filter(
        (key) =>
          !excludeFields.includes(key) &&
          key !== 'active' && // Excluir campos booleanos por defecto
          key !== 'id' // Excluir ID
      )

      // Verificar si al menos un campo tiene contenido significativo
      return fieldsToCheck.some((key) => {
        const value = dataToCheck[key]
        return hasSignificantValue(value)
      })
    },
    [getValues, excludeFields]
  )

  // Limpiar datos guardados
  const clearSavedData = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey)
    } catch (error) {
      console.error('❌ Error clearing saved data:', error)
    }
  }, [storageKey])

  // Limpiar timeout pendiente de auto-save
  const clearPendingSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = null
    }
  }, [])

  // Guardar datos en sessionStorage
  const saveFormData = useCallback(() => {
    try {
      const currentValues = getValues()

      // Solo guardar si hay datos significativos
      if (!hasSignificantData(currentValues)) {
        console.log(
          `⏭️ No hay datos significativos para guardar en: ${storageKey}`
        )
        return
      }

      let dataToSave = { ...currentValues }

      // Excluir campos específicos si es necesario
      excludeFields.forEach((field) => {
        if (field in dataToSave) {
          const { [field]: _, ...rest } = dataToSave
          dataToSave = rest
        }
      })

      // Convertir fechas de dayjs a string para serialización
      Object.keys(dataToSave).forEach((key) => {
        const value = dataToSave[key]
        if (value && typeof value === 'object' && value.$d) {
          // Es un objeto dayjs
          dataToSave[key] = value.toISOString()
        }
      })

      sessionStorage.setItem(storageKey, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('❌ Error saving form data:', error)
    }
  }, [getValues, storageKey, excludeFields, hasSignificantData])

  // Cargar datos desde sessionStorage
  const loadFormData = useCallback(async () => {
    try {
      const savedData = sessionStorage.getItem(storageKey)
      if (!savedData) return false

      const parsedData = JSON.parse(savedData)

      // Verificar si los datos guardados tienen contenido significativo
      if (!hasSignificantData(parsedData)) {
        console.log(
          `⏭️ Datos guardados no tienen contenido significativo: ${storageKey}`
        )
        clearSavedData()
        return false
      }

      // Importar dayjs una sola vez
      const dayjs = (await import('dayjs')).default

      // Restaurar cada campo
      Object.keys(parsedData).forEach((key) => {
        if (parsedData[key] !== undefined && parsedData[key] !== null) {
          const value = parsedData[key]

          // Convertir strings de fecha de vuelta a dayjs si es necesario
          if (
            typeof value === 'string' &&
            (key.includes('Date') || key.includes('date')) &&
            value.includes('T')
          ) {
            setValue(key, dayjs(value))
          } else {
            setValue(key, value)
          }
        }
      })

      console.log(`✅ Formulario restaurado desde: ${storageKey}`)

      // Llamar al callback si se proporcionó
      if (onDataRestored) {
        onDataRestored()
      }

      return true
    } catch (error) {
      console.error('❌ Error loading form data:', error)
      return false
    }
  }, [setValue, storageKey, clearSavedData, hasSignificantData, onDataRestored])

  // Verificar si hay datos guardados con contenido significativo
  const hasSavedData = useCallback(() => {
    try {
      const savedData = sessionStorage.getItem(storageKey)
      if (!savedData) return false

      const parsedData = JSON.parse(savedData)
      return hasSignificantData(parsedData)
    } catch (error) {
      return false
    }
  }, [storageKey, hasSignificantData])

  // Auto-guardar cuando cambian los valores (opcional)
  const formValues = watch()

  useEffect(() => {
    if (!autoSave) return

    // Solo auto-guardar si el formulario ha sido tocado
    if (!formState.isDirty) return

    // Limpiar timeout anterior si existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveFormData()
    }, debounceTime)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [formValues, saveFormData, autoSave, debounceTime, formState.isDirty])

  // Cargar datos al montar el componente - CORREGIDO PARA EVITAR RECURSIVIDAD
  useEffect(() => {
    // Solo cargar una vez al montar
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      loadFormData()
    }
  }, []) // Sin dependencias para evitar re-ejecución

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return {
    saveFormData,
    loadFormData,
    clearSavedData,
    clearPendingSave,
    hasSavedData,
    hasSignificantData
  }
}
