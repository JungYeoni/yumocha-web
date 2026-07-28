import Plot from 'react-plotly.js'
import { useTheme, themeColors } from './theme'

export const plotConfig = { displaylogo: false, responsive: true, modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'] }
export const plotLayout = {
  margin: { t: 24, r: 20, b: 48, l: 52 },
}

export function plotLayoutFor(theme) {
  const c = themeColors[theme]
  return {
    paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Pretendard GOV, sans-serif', color: theme === 'dark' ? '#F2F4F6' : '#1E2124', size: 12 },
    margin: { t: 24, r: 20, b: 48, l: 52 },
    hoverlabel: { bgcolor: c.accent, bordercolor: c.accent, font: { color: c.textOnAccent } },
  }
}

export function Chart({ data, layout = {}, ariaLabel, tall }) {
  const theme = useTheme()
  return <div className={`chart${tall ? ' chart-tall' : ''}`} role="img" aria-label={ariaLabel}><Plot data={data} layout={{ ...plotLayoutFor(theme), ...layout, autosize: true }} config={plotConfig} useResizeHandler style={{ width: '100%', height: '100%' }} /></div>
}

export function PageHeader({ eyebrow, title, description, children }) {
  return <header className="page-header">
    <div><p className="eyebrow eyebrow-kr">{eyebrow}</p><h1>{title}</h1><p className="lede">{description}</p></div>
    {children}
  </header>
}

export function Notice({ type = 'info', children }) {
  return <div className={`notice ${type}`}><span aria-hidden="true">{type === 'warn' ? '!' : 'i'}</span><p>{children}</p></div>
}

export function Metric({ label, value, sub }) {
  return <div className="metric"><p>{label}</p><strong>{value}</strong><small>{sub}</small></div>
}
