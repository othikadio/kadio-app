/**
 * Logo wordmark KADIO — minimaliste, typographique
 * Cormorant Garamond 400, letter-spacing 0.08em, uppercase
 *
 * Props:
 *   variant: 'light' (texte clair sur fond sombre) | 'dark' (texte sombre sur fond clair)
 *   size:    'sm' | 'md' | 'lg'
 */

const SIZES = {
  sm: { fontSize: '16px', letterSpacing: '0.12em' },
  md: { fontSize: '22px', letterSpacing: '0.12em' },
  lg: { fontSize: '36px', letterSpacing: '0.14em' },
}

const COLORS = {
  light: '#FAFAF8',
  dark:  '#0E0C09',
  or:    '#B8922A',
}

export default function Logo({ variant = 'or', size = 'md', style = {}, ...props }) {
  const s = SIZES[size] || SIZES.md
  const color = COLORS[variant] || COLORS.or

  return (
    <span
      style={{
        fontFamily: `'Cormorant Garamond', serif`,
        fontWeight: 400,
        fontSize: s.fontSize,
        letterSpacing: s.letterSpacing,
        textTransform: 'uppercase',
        textIndent: s.letterSpacing,
        color,
        textDecoration: 'none',
        display: 'inline-block',
        lineHeight: 1,
        userSelect: 'none',
        ...style,
      }}
      {...props}
    >
      KADIO
    </span>
  )
}
