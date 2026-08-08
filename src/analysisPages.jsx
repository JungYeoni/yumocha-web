import { useEffect, useMemo, useState } from 'react'
import { Chart, Metric, Notice, PageHeader, plotLayout } from './components'
import { regions } from './data'
import { themeColors, useTheme } from './theme'
import { KeywordAnalysisSection } from './keywordAnalysis'

const files = {
  structural: '/analysis/structural_index.csv', structuralSub: '/analysis/structural_subcategory.csv', structuralTfr: '/analysis/structural_tfr.csv',
  fiscal: '/analysis/fiscal_index.csv', fiscalSub: '/analysis/fiscal_subcategory.csv', fiscalTotal: '/analysis/fiscal_total.csv',
  responseModel: '/analysis/responsiveness_model.csv', responseRegion: '/analysis/responsiveness_region.csv',
  tfrModels: '/analysis/budget_tfr_models.csv', tfrClusters: '/analysis/budget_tfr_clusters.csv', clusters: '/analysis/region_clusters.csv',
}

function parseCsv(text) {
  const rows = []; let row = [], value = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) { if (ch === '"') { if (text[i + 1] === '"') { value += '"'; i++ } else quoted = false } else value += ch }
    else if (ch === '"') quoted = true
    else if (ch === ',') { row.push(value); value = '' }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(value); if (row.some(Boolean)) rows.push(row); row = []; value = '' }
    else value += ch
  }
  if (value || row.length) { row.push(value); rows.push(row) }
  const headers = rows.shift().map((x, i) => i === 0 ? x.replace(/^\uFEFF/, '') : x)
  return rows.map(values => Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ''])))
}

function useAnalysisData(keys) {
  const [data, setData] = useState(null); const [error, setError] = useState(false)
  const keyString = keys.join(',')
  useEffect(() => { const requested = keyString.split(','); Promise.all(requested.map(async key => [key, parseCsv(await (await fetch(files[key])).text())])).then(entries => setData(Object.fromEntries(entries))).catch(() => setError(true)) }, [keyString])
  return { data, error }
}

const n = value => value === '' || value == null ? null : Number(value)
const shortDomain = value => value.replace(/^\d-\d\.\s*/, '')
const domainKey = value => shortDomain(value).replace(/\s/g, '')
const domainPalette = ['#246BEB', '#00A6A6', '#F5A623', '#7B61FF', '#E45C8A', '#2E8B57', '#E76F51', '#4D7CFE', '#8A6D3B', '#6C757D', '#00B8D9']

function DataTable({ rows, columns }) {
  return <div className="analysis-table-wrap"><table className="analysis-table"><thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{columns.map(c => <td key={c.key}>{c.format ? c.format(row[c.key], row) : row[c.key]}</td>)}</tr>)}</tbody></table></div>
}

function Loading({ error }) { return error ? <Notice type="warn">분석 데이터를 불러오지 못했습니다.</Notice> : <p className="muted">분석 데이터를 불러오는 중입니다…</p> }

function averageBy(rows, keyOf) {
  const groups = rows.reduce((map, row) => { const key = keyOf(row); if (!map.has(key)) map.set(key, []); map.get(key).push(row); return map }, new Map())
  return [...groups.values()].map(group => {
    const result = { ...group[0] }
    Object.keys(result).forEach(key => {
      const values = group.map(row => row[key]).filter(value => value !== '' && value != null && Number.isFinite(Number(value)))
      if (values.length) result[key] = values.reduce((sum, value) => sum + Number(value), 0) / values.length
    })
    if ('region' in result) result.region = '전체 평균'
    if ('지역' in result) result['지역'] = '전체 평균'
    return result
  })
}

function sumBy(rows, keyOf) {
  const groups = rows.reduce((map, row) => { const key = keyOf(row); if (!map.has(key)) map.set(key, []); map.get(key).push(row); return map }, new Map())
  return [...groups.values()].map(group => ({ ...group[0], '당해계획예산_백만원_provisional': group.reduce((sum, row) => sum + (n(row['당해계획예산_백만원_provisional']) || 0), 0), '당해계획예산_백만원': group.reduce((sum, row) => sum + (n(row['당해계획예산_백만원']) || 0), 0) }))
}

function BirthEnvironmentAnalysis({ section }) {
  const { data, error } = useAnalysisData(['structural', 'structuralSub', 'structuralTfr', 'fiscal', 'fiscalSub', 'fiscalTotal'])
  const [region, setRegion] = useState('전체'); const [category, setCategory] = useState('가족·생활'); const [domain, setDomain] = useState('돌봄여건')
  const c = themeColors[useTheme()]
  const structuralPage = section === 'structural'
  const pageTitle = structuralPage ? '구조환경지수 분석' : '재정대응 분석'
  const categories = [...new Set((data?.structuralSub || []).map(x => x.category))]
  const categoryDomains = [...new Set((data?.structuralSub || []).filter(x => x.category === category).map(x => x.subcategory))]
  if (!data) return <><PageHeader title={pageTitle} description="분석 데이터를 불러오고 있습니다."/><Loading error={error}/></>
  const domains = [...new Set(data.structuralSub.map(x => x.subcategory))]
  const fiscalDomains = [...new Set(data.fiscalSub.map(x => x['세부영역']))]
  const allRegions = region === '전체'
  const s = allRegions ? averageBy(data.structural, x => x.year) : data.structural.filter(x => x.region === region)
  const ssRows = data.structuralSub.filter(x => x.subcategory === domain && (allRegions || x.region === region))
  const ss = allRegions ? averageBy(ssRows, x => x.year) : ssRows
  const st = allRegions ? averageBy(data.structuralTfr, x => x['연도']) : data.structuralTfr.filter(x => x['지역'] === region)
  const f = allRegions ? averageBy(data.fiscal, x => x['연도']) : data.fiscal.filter(x => x['지역'] === region)
  const fsRows = data.fiscalSub.filter(x => allRegions || x['지역'] === region)
  const fs = allRegions ? averageBy(fsRows, x => `${x['연도']}|${x['세부영역']}`) : fsRows
  const ft = allRegions ? averageBy(data.fiscalTotal, x => x['연도']) : data.fiscalTotal.filter(x => x['지역'] === region)
  const compositionRows = allRegions ? sumBy(data.fiscalSub, x => `${x['연도']}|${x['세부영역']}`) : fsRows
  const compositionTotals = Object.fromEntries((allRegions ? sumBy(data.fiscalTotal, x => x['연도']) : data.fiscalTotal.filter(x => x['지역'] === region)).map(x => [x['연도'], n(x['당해계획예산_백만원'])]))
  const matchedFiscalDomain = fiscalDomains.find(d => domainKey(d) === domainKey(domain)) || fiscalDomains[0]
  const fsDomain = fs.filter(x => x['세부영역'] === matchedFiscalDomain)
  const structuralTotalByYear = Object.fromEntries(s.map(x => [x.year, n(x.pooled_index)]))
  const selectedDomainColor = domainPalette[Math.max(0, domains.indexOf(domain)) % domainPalette.length]
  return <>
    <PageHeader title={pageTitle} description={structuralPage ? '2016–2024년 17개 시도의 구조환경 종합·세부영역 지수와 합계출산율 순위를 비교합니다.' : '2016–2024년 17개 시도의 재정대응지수와 1인당 실질 계획예산을 비교합니다.'}/>
    <div className="filter-bar"><label>지역 선택<select value={region} onChange={e=>setRegion(e.target.value)}><option value="전체">전체 (17개 시도 단순평균)</option>{regions.map(x=><option key={x}>{x}</option>)}</select></label><label>대영역 선택<select value={category} onChange={e=>{const next=e.target.value;setCategory(next);setDomain(data.structuralSub.find(x=>x.category===next)?.subcategory||'')}}>{categories.map(x=><option key={x}>{x}</option>)}</select></label><label>세부영역 선택<select value={domain} onChange={e=>setDomain(e.target.value)}>{categoryDomains.map(x=><option key={x}>{x}</option>)}</select></label></div>
    {allRegions && <Notice>‘전체’ 추세와 표는 공식 전국값이 아니라 17개 시도의 단순평균입니다. 단, 예산 구성비 차트는 보고서 기준에 따라 17개 시도 예산을 먼저 합산해 계산합니다.</Notice>}
    {structuralPage && <>
    <h2 className="analysis-section-title">구조환경지수</h2>
    <p className="analysis-section-description">고용·주거·돌봄·의료 등 지역의 출생 관련 구조적 여건을 종합한 상대 지수로, 점수가 높을수록 여건이 상대적으로 양호합니다.</p>
    <div className="metric-row"><Metric label="2024 종합지수" value={n(s.at(-1)?.pooled_index)?.toFixed(1)} sub={allRegions?'17개 시도 단순평균':`17개 시도 중 ${s.at(-1)?.pooled_rank}위`}/><Metric label={`${domain} 점수`} value={n(ss.at(-1)?.subcategory_score)?.toFixed(1)} sub={`${ss.at(-1)?.year}년`}/><Metric label="2024 TFR" value={n(st.at(-1)?.['합계출산율'])?.toFixed(3)} sub={allRegions?'17개 시도 단순평균':`17개 시도 중 ${st.at(-1)?.['TFR_연도별순위']}위`}/><Metric label="순위 동행성" value={n(st.at(-1)?.['연도별_Spearman_rho'])?.toFixed(2)} sub="연도별 시도 순위 Spearman ρ"/></div>
    <div className="results-grid"><section className="panel"><h2>종합지수 결과와 추세</h2><Chart interpretation="연도 간 비교가 가능한 고정 표준화 기준의 상대 점수입니다. 점수 변화는 절대적 복지 향상이나 정책효과가 아니라 17개 시도 안에서의 상대적 구조환경 변화를 뜻합니다." data={[{x:s.map(x=>x.year),y:s.map(x=>n(x.pooled_index)),type:'scatter',mode:'lines+markers',name:'종합지수',line:{color:c.accent}}]} layout={{height:320,xaxis:{dtick:1},yaxis:{range:[0,100]}}}/><DataTable rows={s} columns={[{key:'year',label:'연도'},{key:'pooled_index',label:'종합지수',format:v=>n(v).toFixed(2)},{key:'pooled_rank',label:'순위'}]}/></section>
    <section className="panel"><h2>세부영역 지수 결과와 추세</h2><Chart interpretation={`현재 선택한 ‘${domain}’의 상대점수 추세입니다. 선의 색은 아래 세부영역 구성 차트에서 같은 영역에 사용한 색과 같습니다. 조사주기와 원자료 공표 기준 차이가 포함될 수 있어 인접 연도의 작은 차이는 신중하게 읽어야 합니다.`} data={[{x:ss.map(x=>x.year),y:ss.map(x=>n(x.subcategory_score)),type:'scatter',mode:'lines+markers',name:domain,line:{color:selectedDomainColor,width:3},marker:{color:selectedDomainColor,size:7},connectgaps:false}]} layout={{height:320,xaxis:{dtick:1},yaxis:{range:[0,100]}}}/><DataTable rows={ss} columns={[{key:'year',label:'연도'},{key:'subcategory_score',label:'세부영역 점수',format:v=>n(v).toFixed(2)},{key:'subcategory_contribution',label:'종합지수 구성비',format:(v,row)=>`${(n(v)/structuralTotalByYear[row.year]*100).toFixed(1)}%`}]}/></section></div>
    <section className="panel"><h2>종합지수 산출 시 적용된 영역별 비중</h2><Chart interpretation="웹 표시용 산출값입니다. 세부영역 점수에 고정 가중치를 적용한 값이 해당 연도 종합지수에서 차지하는 비율이며, 모든 영역을 합하면 100%입니다. 실제 생활환경이나 정책예산의 비율을 뜻하지 않습니다." data={domains.map((d,i)=>{const rows=data.structuralSub.filter(x=>(allRegions||x.region===region)&&x.subcategory===d);const displayRows=allRegions?averageBy(rows,x=>x.year):rows;return {type:'bar',name:d,x:displayRows.map(x=>x.year),y:displayRows.map(x=>n(x.subcategory_contribution)/structuralTotalByYear[x.year]*100),marker:{color:domainPalette[i%domainPalette.length]},hovertemplate:`${d}<br>%{x}년 · 산출 비중 %{y:.1f}%<extra></extra>`}})} layout={{height:440,barmode:'stack',xaxis:{dtick:1},yaxis:{title:'종합지수 산출 비중 (%)',range:[0,100]}}}/></section>
    <section className="panel"><h2>구조환경 종합지수와 합계출산율 순위 비교</h2><Chart interpretation="두 순위선이 비슷하게 움직이는지는 구조환경과 합계출산율의 동행 여부를 보여줄 뿐입니다. 같은 방향이 관찰돼도 구조환경이 출산율을 변화시켰다는 인과관계로 해석할 수 없습니다." data={[{x:st.map(x=>x['연도']),y:st.map(x=>n(x['구조환경_연도별순위점수'])),type:'scatter',mode:'lines+markers',name:'구조환경 순위점수',line:{color:c.accent}},{x:st.map(x=>x['연도']),y:st.map(x=>n(x['TFR_연도별순위점수'])),type:'scatter',mode:'lines+markers',name:'TFR 순위점수',line:{color:c.line,dash:'dot'}}]} layout={{height:360,yaxis:{title:'순위점수 (높을수록 상위)',range:[0,100]},legend:{orientation:'h'}}}/></section>
    </>}
    {!structuralPage && <>
    <h2 className="analysis-section-title">재정대응지수</h2>
    <p className="analysis-section-description">지역 인구 대비 저출생 대응 실질 계획예산을 표준화한 상대 지수로, 점수가 높을수록 재정 투입 수준이 상대적으로 큽니다.</p>
    <div className="results-grid"><section className="panel"><h2>종합지수 결과와 추세</h2><Chart interpretation="재정대응점수는 실질 1인당 계획예산을 표준화한 상대 지수입니다. 상승은 실제 집행이나 정책성과가 아니라 다른 시도·연도 대비 계획예산 투입 수준이 커졌음을 뜻합니다." data={[{x:f.map(x=>x['연도']),y:f.map(x=>n(x['종합재정대응점수_0_100'])),type:'scatter',mode:'lines+markers',line:{color:c.accent}}]} layout={{height:320,yaxis:{range:[0,100]}}}/><DataTable rows={f} columns={[{key:'연도',label:'연도'},{key:'종합재정대응점수_0_100',label:'종합점수',format:v=>n(v).toFixed(2)},{key:'연도별_종합재정대응순위',label:'순위'}]}/></section>
    <section className="panel"><h2>세부영역 지수 결과와 추세</h2><Chart interpretation={`현재 선택한 ‘${domain}’의 실질 1인당 계획예산 상대점수입니다. 선의 색은 아래 세부영역 구성 차트에서 같은 영역에 사용한 색과 같습니다. 작은 점수 차이를 실제 원화 차이처럼 읽어서는 안 됩니다.`} data={[{x:fsDomain.map(x=>x['연도']),y:fsDomain.map(x=>n(x['세부영역_재정대응점수_0_100'])),type:'scatter',mode:'lines+markers',line:{color:selectedDomainColor,width:3},marker:{color:selectedDomainColor,size:7},connectgaps:false}]} layout={{height:320,yaxis:{range:[0,100]}}}/><DataTable rows={fsDomain} columns={[{key:'연도',label:'연도'},{key:'세부영역_재정대응점수_0_100',label:'세부점수',format:v=>n(v).toFixed(2)},{key:'log1p_인구1인당_실질예산',label:'log1p 예산',format:v=>n(v).toFixed(3)}]}/></section></div>
    <section className="panel"><h2>세부영역별 계획예산 비중</h2><Chart interpretation="보고서와 동일하게 해당 지역·연도의 세부영역 계획예산을 전체 저출생 대응 계획예산으로 나눠 계산했습니다. 전체 선택 시에는 17개 시도 예산을 먼저 합산합니다. 지표체계 외 예산이 분모에 포함되므로 색 막대 합계는 100%보다 작을 수 있습니다." data={fiscalDomains.map((d,i)=>{const rows=compositionRows.filter(x=>x['세부영역']===d);return {type:'bar',name:shortDomain(d),x:rows.map(x=>x['연도']),y:rows.map(x=>compositionTotals[x['연도']]?n(x['당해계획예산_백만원_provisional'])/compositionTotals[x['연도']]*100:null),marker:{color:domainPalette[i%domainPalette.length]},hovertemplate:`${shortDomain(d)}<br>%{x}년 · 예산 비중 %{y:.2f}%<extra></extra>`}})} layout={{height:440,barmode:'stack',yaxis:{title:'전체 계획예산 대비 비중 (%)',rangemode:'tozero'}}}/></section>
    <h2 className="analysis-section-title">1인당 재정대응 예산액 log1p</h2>
    <div className="results-grid"><section className="panel"><h2>전체예산 측정값과 추세</h2><Chart interpretation="20–39세 인구 1인당 실질 계획예산의 장기 추세입니다. 계획예산은 집행액·결산액이 아니며, log1p 값의 변화는 원 단위의 동일한 증감폭을 의미하지 않습니다." data={[{x:ft.map(x=>x['연도']),y:ft.map(x=>n(x['log1p_20_39세_1인당_실질예산'])),type:'scatter',mode:'lines+markers',line:{color:c.accent}}]} layout={{height:320,yaxis:{title:'log1p 20–39세 1인당 예산'}}}/><DataTable rows={ft} columns={[{key:'연도',label:'연도'},{key:'20_39세_1인당_실질예산_원',label:'1인당 실질예산',format:v=>`${Math.round(n(v)).toLocaleString()}원`},{key:'log1p_20_39세_1인당_실질예산',label:'log1p',format:v=>n(v).toFixed(3)}]}/></section>
    <section className="panel"><h2>세부영역별 측정값과 추세</h2><Chart interpretation={`현재 선택한 ‘${domain}’의 1인당 실질 계획예산을 log1p로 변환한 추세입니다. 선의 색은 아래 세부영역 구성 차트에서 같은 영역에 사용한 색과 같습니다.`} data={[{x:fsDomain.map(x=>x['연도']),y:fsDomain.map(x=>n(x['log1p_인구1인당_실질예산'])),type:'scatter',mode:'lines+markers',line:{color:selectedDomainColor,width:3},marker:{color:selectedDomainColor,size:7},connectgaps:false}]} layout={{height:320,yaxis:{title:'log1p 1인당 실질예산'}}}/><DataTable rows={fsDomain} columns={[{key:'연도',label:'연도'},{key:'인구1인당_실질예산_원',label:'1인당 실질예산',format:v=>`${Math.round(n(v)).toLocaleString()}원`},{key:'log1p_인구1인당_실질예산',label:'log1p',format:v=>n(v).toFixed(3)}]}/></section></div>
    <KeywordAnalysisSection />
    </>}
  </>
}

export function StructuralIndexAnalysis() { return <BirthEnvironmentAnalysis section="structural"/> }
export function FiscalResponseAnalysis() { return <BirthEnvironmentAnalysis section="fiscal"/> }

export function RelationshipAnalysis() {
  const { data, error } = useAnalysisData(['responseModel','responseRegion','tfrModels','tfrClusters','clusters'])
  const [version,setVersion]=useState('3개년평균_t+2'); const c=themeColors[useTheme()]
  const modelRows=useMemo(()=>data?.tfrModels.filter(x=>x['모형버전']===version)??[],[data,version])
  if(!data) return <><PageHeader title="재정지출과 출산율 간 관계"/><Loading error={error}/></>
  const response=[...data.responseModel].sort((a,b)=>n(a['계수'])-n(b['계수']))
  const regionResponse=[...data.responseRegion].sort((a,b)=>n(a['대응성_기술순위'])-n(b['대응성_기술순위']))
  const versions=[...new Set(data.tfrModels.map(x=>x['모형버전']))]
  return <>
    <PageHeader title="재정지출과 출산율 간 관계" description="대응성 모형과 단년도·3개년 평균예산의 후행 TFR 관계를 실제 회귀결과로 확인합니다."/>
    <Notice type="warn">모든 결과는 지역·연도 고정효과를 사용한 관찰자료의 조건부 관계입니다. 계수는 인과효과나 정책 성과를 의미하지 않습니다.</Notice>
    <h2 className="analysis-section-title">예산비중과 구조환경 변화의 대응성</h2>
    <section className="panel"><h2>모형 1 — t→t+1 환경변화와 t+2→t+3 재정비중 변화</h2><Chart interpretation="11개 세부영역 모두 BH 다중검정 보정 후 유의하지 않았습니다. 음의 계수가 재정대응 가설과 같은 방향이지만, 계수 크기만으로 영역의 반응성이나 정책성과를 순위화하지 않습니다." tall data={[{type:'scatter',mode:'markers',y:response.map(x=>shortDomain(x['모형'])),x:response.map(x=>n(x['계수'])),error_x:{type:'data',symmetric:false,array:response.map(x=>n(x['95%신뢰구간_상한'])-n(x['계수'])),arrayminus:response.map(x=>n(x['계수'])-n(x['95%신뢰구간_하한'])),color:c.accent},marker:{color:response.map(x=>x['FDR_0.05_유의']==='True'?c.accent:c.mutedBar),size:10},customdata:response.map(x=>[x['p값'],x['관측치']]),hovertemplate:'%{y}<br>계수 %{x:.4f}<br>p=%{customdata[0]} · n=%{customdata[1]}<extra></extra>'}]} layout={{height:520,margin:{...plotLayout.margin,l:120},shapes:[{type:'line',x0:0,x1:0,y0:-.5,y1:response.length-.5,line:{color:c.line,dash:'dot'}}],xaxis:{title:'회귀계수 (음수면 대응 방향 일치)'},showlegend:false}}/><DataTable rows={response} columns={[{key:'모형',label:'세부영역'},{key:'계수',label:'계수',format:v=>n(v).toFixed(4)},{key:'p값',label:'p값',format:v=>n(v).toFixed(3)},{key:'FDR_q값',label:'FDR q',format:v=>n(v).toFixed(3)},{key:'관측치',label:'n'}]}/></section>
    <section className="panel"><h2>시도별 대응 방향 일치율</h2><Chart interpretation="구조환경과 후행 예산비중이 반대 방향으로 변한 사례의 비율입니다. 시도별 상관은 전반적으로 약했고 셀별 관측 수도 적으므로 정책성과나 반응성 순위가 아닌 기술통계로만 읽어야 합니다." data={[{type:'bar',x:regionResponse.map(x=>x['지역']),y:regionResponse.map(x=>n(x['반대방향_변화비율_pct'])),marker:{color:c.accent},customdata:regionResponse.map(x=>[x['비영변화_관측치'],x['관측치']]),hovertemplate:'%{x}<br>방향 일치 %{y:.1f}%<br>유효 관측 %{customdata[0]}/%{customdata[1]}<extra></extra>'}]} layout={{height:380,xaxis:{tickangle:-35},yaxis:{title:'반대 방향 변화비율 (%)'}}}/></section>
    <h2 className="analysis-section-title">재정대응예산과 합계출산율</h2>
    <div className="filter-bar"><label>모형<select value={version} onChange={e=>setVersion(e.target.value)}>{versions.map(x=><option key={x}>{x}</option>)}</select></label></div>
    <section className="panel"><h2>단년도·3개년 평균예산의 후행 TFR 관계</h2><Chart interpretation="보고서 기준으로 3개년 평균 t+2 모형의 돌봄 여건만 BH 보정 후 양의 관계가 유지됐고, 다른 영역은 유의하지 않았습니다. 이 결과 역시 고정효과를 조건으로 한 관련성이며 예산의 인과효과가 아닙니다." tall data={[{type:'scatter',mode:'markers',y:modelRows.map(x=>shortDomain(x['모형'])),x:modelRows.map(x=>n(x['계수'])),error_x:{type:'data',symmetric:false,array:modelRows.map(x=>n(x['95%신뢰구간_상한'])-n(x['계수'])),arrayminus:modelRows.map(x=>n(x['계수'])-n(x['95%신뢰구간_하한'])),color:c.accent},marker:{color:modelRows.map(x=>x['FDR_0.05_유의']==='True'?c.accent:c.mutedBar),size:10},customdata:modelRows.map(x=>[x['p값'],x['관측치']]),hovertemplate:'%{y}<br>계수 %{x:.4f}<br>p=%{customdata[0]} · n=%{customdata[1]}<extra></extra>'}]} layout={{height:520,margin:{...plotLayout.margin,l:120},shapes:[{type:'line',x0:0,x1:0,y0:-.5,y1:modelRows.length-.5,line:{color:c.line,dash:'dot'}}],xaxis:{title:'예산–후행 TFR 회귀계수'},showlegend:false}}/><DataTable rows={modelRows} columns={[{key:'모형',label:'세부영역'},{key:'계수',label:'계수',format:v=>n(v).toFixed(4)},{key:'p값',label:'p값',format:v=>n(v).toFixed(3)},{key:'FDR_q값',label:'FDR q',format:v=>v? n(v).toFixed(3):'—'},{key:'관측치',label:'n'}]}/></section>
    <section className="panel"><h2>구조환경 3개 군집별 계수 비교</h2><Chart interpretation="부분표본 계수의 크기만으로 군집 차이를 판단할 수 없습니다. 별도의 전체표본 상호작용 검정에서는 t+2 가사수행 격차 한 영역만 군집 간 차이가 BH 보정 후 남았고, 다른 영역은 확인되지 않았습니다. 대전·세종만 포함된 군집 2는 추론이 불가능해 점추정치만 탐색적으로 표시합니다." tall data={[1,2,3].map((cluster,i)=>{const rows=data.tfrClusters.filter(x=>x['시차']==='t+2'&&n(x['군집'])===cluster);return {type:'bar',name:`군집 ${cluster}`,x:rows.map(x=>shortDomain(x['모형'])),y:rows.map(x=>n(x['계수'])),marker:{color:domainPalette[i]}}})} layout={{height:520,barmode:'group',xaxis:{tickangle:-35},yaxis:{title:'3개년 평균예산–t+2 TFR 계수'},legend:{orientation:'h'}}}/><DataTable rows={data.clusters} columns={[{key:'region',label:'시도'},{key:'군집_3개',label:'구조환경 군집'},{key:'가족·생활',label:'가족·생활',format:v=>n(v).toFixed(1)},{key:'경제·고용·주거',label:'경제·고용·주거',format:v=>n(v).toFixed(1)},{key:'보건·안전',label:'보건·안전',format:v=>n(v).toFixed(1)},{key:'사회·문화',label:'사회·문화',format:v=>n(v).toFixed(1)}]}/></section>
  </>
}
