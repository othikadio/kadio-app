import jsPDF from 'jspdf'

/**
 * Export a client invoice (facture) as a PDF using jsPDF.
 * Generates a professional invoice with Kadio branding, gold accents, and transaction details.
 *
 * @param {Object} facture - Invoice object with properties:
 *   - numero: Invoice number (e.g., 'KADIO-2026-0041')
 *   - date: Date string (e.g., '2026-03-08')
 *   - service: Service name (e.g., 'Knotless braids')
 *   - partenaire: Partner/stylist name
 *   - montant: Amount in dollars
 *   - statut: Payment status ('paye', 'impaye', 'en_attente')
 *   - clientName: Client name (optional, defaults to 'Client')
 */
export function exportFacturePdf(facture) {
  if (!facture) {
    console.warn('No invoice provided for PDF export')
    return
  }

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    // Constants
    const COLOR_GOLD = [184, 146, 42]    // #B8922A
    const COLOR_DARK = [14, 12, 9]       // #0E0C09
    const COLOR_LIGHT = [250, 250, 248]  // #FAFAF8
    const MARGIN_LEFT = 20
    const MARGIN_RIGHT = 20
    const PAGE_WIDTH = doc.internal.pageSize.getWidth()
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT

    // Set default font
    doc.setFont('Helvetica')

    // ───── Header: Logo & Company Info ─────
    doc.setFontSize(20)
    doc.setTextColor(...COLOR_GOLD)
    doc.text('KADIO COIFFURE', MARGIN_LEFT, 20)

    doc.setFontSize(10)
    doc.setTextColor(...COLOR_DARK)
    doc.text('Longueuil, QC', MARGIN_LEFT, 27)

    // Horizontal gold line
    doc.setDrawColor(...COLOR_GOLD)
    doc.setLineWidth(0.5)
    doc.line(MARGIN_LEFT, 32, PAGE_WIDTH - MARGIN_RIGHT, 32)

    // ───── Invoice Metadata ─────
    let yPos = 42

    doc.setFontSize(11)
    doc.setFont('Helvetica', 'bold')
    doc.setTextColor(...COLOR_DARK)
    doc.text('Facture', MARGIN_LEFT, yPos)

    yPos += 8

    doc.setFontSize(10)
    doc.setFont('Helvetica', 'normal')
    const invoiceData = [
      { label: 'N° Facture:', value: facture.numero || '—' },
      { label: 'Date:', value: formatDateForPdf(facture.date) },
      { label: 'Statut:', value: getStatutLabel(facture.statut) },
    ]

    invoiceData.forEach((item) => {
      doc.text(item.label, MARGIN_LEFT, yPos)
      doc.text(item.value, MARGIN_LEFT + 40, yPos)
      yPos += 6
    })

    // ───── Client & Service Details ─────
    yPos += 6

    doc.setFontSize(11)
    doc.setFont('Helvetica', 'bold')
    doc.setTextColor(...COLOR_DARK)
    doc.text('Détails du service', MARGIN_LEFT, yPos)

    yPos += 8

    doc.setFontSize(10)
    doc.setFont('Helvetica', 'normal')
    const serviceData = [
      { label: 'Service:', value: facture.service || '—' },
      { label: 'Prestataire:', value: facture.partenaire || '—' },
      { label: 'Montant:', value: formatMontantForPdf(facture.montant) },
    ]

    serviceData.forEach((item) => {
      doc.text(item.label, MARGIN_LEFT, yPos)
      doc.text(item.value, MARGIN_LEFT + 40, yPos)
      yPos += 6
    })

    // ───── Summary Box ─────
    yPos += 8

    // Gold background box for total
    const boxY = yPos - 2
    const boxHeight = 18
    doc.setFillColor(...COLOR_LIGHT)
    doc.rect(MARGIN_LEFT, boxY, CONTENT_WIDTH, boxHeight, 'F')

    // Gold border
    doc.setDrawColor(...COLOR_GOLD)
    doc.setLineWidth(1)
    doc.rect(MARGIN_LEFT, boxY, CONTENT_WIDTH, boxHeight)

    doc.setFontSize(10)
    doc.setFont('Helvetica', 'normal')
    doc.setTextColor('rgba(14,12,9,0.6)')
    doc.text('Montant total', MARGIN_LEFT + 5, yPos + 4)

    doc.setFontSize(16)
    doc.setFont('Helvetica', 'bold')
    doc.setTextColor(...COLOR_GOLD)
    doc.text(formatMontantForPdf(facture.montant), MARGIN_LEFT + 5, yPos + 12)

    yPos += boxHeight + 8

    // ───── Commission Info (smaller text) ─────
    yPos += 4
    doc.setFontSize(9)
    doc.setFont('Helvetica', 'italic')
    doc.setTextColor('rgba(14,12,9,0.45)')
    const commissionText = [
      'Kadio gère la plateforme, les paiements sécurisés et le support client.',
      'Une commission de 20% est appliquée pour couvrir ces services.',
    ]
    commissionText.forEach((line) => {
      doc.text(line, MARGIN_LEFT, yPos)
      yPos += 4
    })

    // ───── Footer ─────
    const footerY = doc.internal.pageSize.getHeight() - 15

    doc.setFontSize(10)
    doc.setFont('Helvetica', 'bold')
    doc.setTextColor(...COLOR_GOLD)
    doc.text('Merci pour votre confiance!', PAGE_WIDTH / 2, footerY, { align: 'center' })

    // Footer line
    doc.setDrawColor(...COLOR_GOLD)
    doc.setLineWidth(0.5)
    doc.line(MARGIN_LEFT, footerY + 3, PAGE_WIDTH - MARGIN_RIGHT, footerY + 3)

    // Kadio copyright
    doc.setFontSize(8)
    doc.setTextColor('rgba(14,12,9,0.35)')
    doc.text(`© ${new Date().getFullYear()} Kadio Coiffure. Tous droits réservés.`, PAGE_WIDTH / 2, footerY + 8, { align: 'center' })

    // ───── Auto-download ─────
    const filename = `Kadio_Facture_${facture.numero?.replace(/\//g, '-')}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename)

    console.log(`PDF exported: ${filename}`)
  } catch (error) {
    console.error('Error exporting PDF:', error)
    alert('Erreur lors de l\'export PDF. Vérifiez la console.')
  }
}

/**
 * Format a date string (YYYY-MM-DD) to French date format (e.g., "8 mars 2026")
 */
function formatDateForPdf(dateStr) {
  if (!dateStr) return '—'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

/**
 * Format a montant value as currency (e.g., "140,00 $")
 */
function formatMontantForPdf(montant) {
  if (montant === null || montant === undefined) return '—'
  return `${Number(montant).toFixed(2).replace('.', ',')} $`
}

/**
 * Get human-readable French label for payment status
 */
function getStatutLabel(statut) {
  const labels = {
    paye: 'Payée',
    impaye: 'Non payée',
    en_attente: 'En attente',
  }
  return labels[statut] || statut
}
