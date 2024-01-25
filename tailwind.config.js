import colors from 'tailwindcss/colors'
import typography from '@tailwindcss/typography'

export default {
  content: [],
  plugins: [typography],
  theme: {
    colors: {
      primary: '#4DBE65',
      'outer-space': '#091337',
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      slate: colors.slate,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            'h1, h2, h3, h4': {
              'scroll-margin-top': '1rem',
            },
            'h1, h2': {
              padding: '0.8rem',
              borderRadius: '2px',
              color: theme('colors.white'),
              backgroundColor: theme('colors.primary'),
            },
            'h3, h4': {
              borderLeft: '4px solid',
              borderColor: theme('colors.primary'),
              fontWeight: theme('fontWeight.semibold'),
            },
            h3: {
              padding: '0.8rem',
              margin: '2rem 0 0.8rem',
            },
            h4: {
              'padding-left': '0.8rem',
              margin: '1.5rem 0 0.6rem',
            },
            'h1 a, h2 a, h3 a, h4 a': {
              fontWeight: 'inherit',
              borderBottom: 'none !important',
              color: 'inherit',
            },
            a: {
              fontWeight: theme('fontWeight.medium'),
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              color: theme('colors.primary'),
            },
            'a:hover': {
              borderColor: theme('colors.primary'),
            },
            'ul li::marker': {
              color: theme('colors.primary'),
            },
            code: {
              padding: '0.25rem 0.375rem',
              borderRadius: '0.375rem',
              backgroundColor: theme('colors.gray.200'),
            },
            'code::before': {
              content: '',
            },
            'code::after': {
              content: '',
            },
            blockquote: {
              borderColor: theme('colors.primary'),
            },
            'blockquote p:first-of-type::before': {
              content: '',
            },
            'blockquote p:last-of-type::after': {
              content: '',
            },
          },
        },
      }),
    },
  },
}
