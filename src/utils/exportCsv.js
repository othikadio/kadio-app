/**
 * Export admin transactions as a CSV file.
 * Generates a CSV string with proper UTF-8 BOM handling for Excel compatibility
 * and French character support.
 *
 * @param {Array} transactions - Array of transaction objects with properties:
 *   - id: Transaction ID
 *   - date: Date string (e.g., '2026-03-08')
 *   - type: Transaction type ('abonnement', 'rdv_salon', 'rdv_domicile', 'materiel')
 *   - client: Client name
 *   - partenaire: Partner name
 *   - description: Transaction description
 *   - montant: Transaction amount
 *   - commission_kadio: Kadio commission amount
 *   - statut: Payment status ('recu', 'en_attente')
 */
export function exportTransactionsCsv(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    console.warn('No transactions provided for CSV export')
    alert('Aucune transaction à exporter')
    return
  }

  try {
    // CSV headers
    const headers = [
      'Date',
      'Type',
      'Source',
      'Description',
      'Montant',
      'Commission Kadio',
    ]

    // Transform transactions to CSV rows
    const rows = transactions.map((transaction) => [
      formatDateForCsv(transaction.date),
      getTypeLabel(transaction.type),
      transaction.client || transaction.partenaire || '—',
      buildDescription(transaction),
      formatMontantForCsv(transaction.montant),
      formatMontantForCsv(transaction.commission_kadio),
    ])

    // Build CSV content
    let csvContent = headers.map(escapeForCsv).join(',') + '\n'
    csvContent += rows.map((row) => row.map(escapeForCsv).join(',')).join('\n')

    // Add UTF-8 BOM for Excel compatibility with French characters
    const bom = '\uFEFF'
    const csvWithBom = bom + csvContent

    // Create blob and trigger download
    const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' })
    const filename = `transactions_kadio_${new Date().toISOString().split('T')[0]}.csv`

    downloadFile(blob, filename)

    console.log(`CSV exported: ${filename} (${transactions.length} transactions)`)
  } catch (error) {
    console.error('Error exporting CSV:', error)
    alert('Erreur lors de l\'export CSV. Vérifiez la console.')
  }
}

/**
 * Format a date string (YYYY-MM-DD) to French date format (DD/MM/YYYY)
 */
function formatDateForCsv(dateStr) {
  if (!dateStr) return '—'
  try {
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return dateStr
  }
}

/**
 * Format a montant value as currency with proper French formatting (e.g., "140,00")
 * Note: No $ sign included as per CSV best practices (currency is understood from context)
 */
function formatMontantForCsv(montant) {
  if (montant === null || montant === undefined) return '0,00'
  return Number(montant).toFixed(2).replace('.', ',')
}

/**
 * Get human-readable French label for transaction type
 */
function getTypeLabel(type) {
  const labels = {
    abonnement: 'Abonnement',
    rdv_salon: 'RDV Salon',
    rdv_domicile: 'RDV Domicile',
    materiel: 'Matériel',
  }
  return labels[type] || type
}

/**
 * Build a descriptive text for the transaction
 */
function buildDescription(transaction) {
  // Combine type and relevant info
  const type = getTypeLabel(transaction.type)
  const source = transaction.partenaire ? `via ${transaction.partenaire}` : ''
  const parts = [type, source].filter(Boolean)
  return parts.join(' - ') || transaction.description || '—'
}

/**
 * Escape a value for CSV output
 * Handles quotes and commas properly
 */
function escapeForCsv(value) {
  if (value === null || value === undefined) return ''
  const stringValue = String(value)
  // If value contains comma, newline, or quote, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

/**
 * Trigger download of a file (blob)
 */
function downloadFile(blob, filename) {
  // Create a temporary anchor element
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename

  // Append to body, click, and remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the object URL
  URL.revokeObjectURL(url)
}
