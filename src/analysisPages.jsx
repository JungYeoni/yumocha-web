import { useEffect, useMemo, useState } from 'react'
import { Chart, Metric, Notice, PageHeader, plotLayout } from './components'
import { regions, years } from './data'
import { themeColors, useTheme } from './theme'

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

function DataTable({ rows, columns }) {
  return <div className="analysis-table-wrap"><table className="analysis-table"><thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{columns.map(c => <td key={c.key}>{c.format ? c.format(row[c.key], row) : row[c.key]}</td>)}</tr>)}</tbody></table></div>
}

function Loading({ error }) { return error ? <Notice type="warn">분석 데이터를 불러오지 못했습니다.</Notice> : <p className="muted">분석 데이터를 불러오는 중입니다…</p> }

function BirthEnvironmentAnalysis({ section }) {
  const { data, error } = useAnalysisData(['structural', 'structuralSub', 'structuralTfr', 'fiscal', 'fiscalSub', 'fiscalTotal'])
  const [region, setRegion] = useState('서울'); const [year, setYear] = useState(2022); const [domain, setDomain] = useState('돌봄여건')
  const c = themeColors[useTheme()]
  const structuralPage = section === 'structural'
  const pageTitle = structuralPage ? '구조환경지수 분석' : '재정대응 분석'
  if (!data) return <><PageHeader title={pageTitle} description="분석 데이터를 불러오고 있습니다."/><Loading error={error}/></>
  const domains = [...new Set(data.structuralSub.map(x => x.subcategory))]
  const fiscalDomains = [...new Set(data.fiscalSub.map(x => x['세부영역']))]
  const s = data.structural.filter(x => x.region === region); const ss = data.structuralSub.filter(x => x.region === region && x.subcategory === domain)
  const st = data.structuralTfr.filter(x => x['지역'] === region); const f = data.fiscal.filter(x => x['지역'] === region)
  const fs = data.fiscalSub.filter(x => x['지역'] === region); const ft = data.fiscalTotal.filter(x => x['지역'] === region)
  const fsDomain = fs.filter(x => x['세부영역'] === (fiscalDomains.find(d => shortDomain(d) === shortDomain(domain)) || fiscalDomains[0]))
  const yearFs = fs.filter(x => n(x['연도']) === year); const yearSs = data.structuralSub.filter(x => x.region === region && n(x.year) === year + 2)
  const logSum = yearFs.reduce((sum, x) => sum + (n(x['log1p_인구1인당_실질예산']) || 0), 0)
  const comparisonDomains = fiscalDomains.map(shortDomain)
  const budgetComparison = Object.fromEntries(yearFs.map(x => [domainKey(x['세부영역']), logSum ? n(x['log1p_인구1인당_실질예산']) / logSum * 100 : 0]))
  const structuralComparison = Object.fromEntries(yearSs.map(x => [domainKey(x.subcategory), n(x.subcategory_contribution)]))
  return <>
    <PageHeader title={pageTitle} description={structuralPage ? '2016–2024년 17개 시도의 구조환경 종합·세부영역 지수와 합계출산율 순위를 비교합니다.' : '2016–2024년 17개 시도의 재정대응지수와 1인당 실질 계획예산을 비교합니다.'}/>
    <div className="filter-bar"><label>시도<select value={region} onChange={e=>setRegion(e.target.value)}>{regions.map(x=><option key={x}>{x}</option>)}</select></label><label>세부영역<select value={domain} onChange={e=>setDomain(e.target.value)}>{domains.map(x=><option key={x}>{x}</option>)}</select></label></div>
    {structuralPage && <>
    <h2 className="analysis-section-title">구조환경지수</h2>
    <p className="analysis-section-description">고용·주거·돌봄·의료 등 지역의 출생 관련 구조적 여건을 종합한 상대 지수로, 점수가 높을수록 여건이 상대적으로 양호합니다.</p>
    <div className="metric-row"><Metric label="2024 종합지수" value={n(s.at(-1)?.pooled_index)?.toFixed(1)} sub={`17개 시도 중 ${s.at(-1)?.pooled_rank}위`}/><Metric label={`${domain} 점수`} value={n(ss.at(-1)?.subcategory_score)?.toFixed(1)} sub={`${ss.at(-1)?.year}년`}/><Metric label="2024 TFR" value={n(st.at(-1)?.['합계출산율'])?.toFixed(3)} sub={`17개 시도 중 ${st.at(-1)?.['TFR_연도별순위']}위`}/><Metric label="순위 동행성" value={n(st.at(-1)?.['연도별_Spearman_rho'])?.toFixed(2)} sub="연도별 시도 순위 Spearman ρ"/></div>
    <div className="results-grid"><section className="panel"><h2>종합지수 결과와 추세</h2><Chart interpretation="연도 간 비교가 가능한 고정 표준화 기준의 상대 점수입니다. 점수 변화는 절대적 복지 향상이나 정책효과가 아니라 17개 시도 안에서의 상대적 구조환경 변화를 뜻합니다." data={[{x:s.map(x=>x.year),y:s.map(x=>n(x.pooled_index)),type:'scatter',mode:'lines+markers',name:'종합지수',line:{color:c.accent}}]} layout={{height:320,xaxis:{dtick:1},yaxis:{range:[0,100]}}}/><DataTable rows={s} columns={[{key:'year',label:'연도'},{key:'pooled_index',label:'종합지수',format:v=>n(v).toFixed(2)},{key:'pooled_rank',label:'순위'}]}/></section>
    <section className="panel"><h2>세부영역 지수 결과와 추세</h2><Chart interpretation="선택한 세부영역에서 해당 시도의 상대적 여건이 어떻게 움직였는지 보여줍니다. 조사주기와 원자료 공표 기준 차이가 포함될 수 있어 인접 연도의 작은 차이는 신중하게 읽어야 합니다." data={[{x:ss.map(x=>x.year),y:ss.map(x=>n(x.subcategory_score)),type:'scatter',mode:'lines+markers',name:domain,line:{color:c.accent}}]} layout={{height:320,xaxis:{dtick:1},yaxis:{range:[0,100]}}}/><DataTable rows={ss} columns={[{key:'year',label:'연도'},{key:'subcategory_score',label:'세부영역 점수',format:v=>n(v).toFixed(2)},{key:'subcategory_contribution',label:'종합지수 기여도',format:v=>n(v).toFixed(2)}]}/></section></div>
    <section className="panel"><h2>종합지수의 세부영역별 비중</h2><Chart interpretation="막대의 각 영역은 종합지수에 반영된 기여분입니다. AHP 가중치는 모든 연도에 고정 적용되므로 영역 간 크기는 점수뿐 아니라 가중치의 영향도 함께 받습니다." data={domains.map((d,i)=>{const rows=data.structuralSub.filter(x=>x.region===region&&x.subcategory===d);return {type:'bar',name:d,x:rows.map(x=>x.year),y:rows.map(x=>n(x.subcategory_contribution)),marker:{color:`rgba(${c.accentRgb},${.25+(i%5)*.15})`}}})} layout={{height:420,barmode:'stack',xaxis:{dtick:1},yaxis:{title:'종합지수 기여도'}}}/></section>
    <section className="panel"><h2>구조환경 종합지수와 합계출산율 순위 비교</h2><Chart interpretation="두 순위선이 비슷하게 움직이는지는 구조환경과 합계출산율의 동행 여부를 보여줄 뿐입니다. 같은 방향이 관찰돼도 구조환경이 출산율을 변화시켰다는 인과관계로 해석할 수 없습니다." data={[{x:st.map(x=>x['연도']),y:st.map(x=>n(x['구조환경_연도별순위점수'])),type:'scatter',mode:'lines+markers',name:'구조환경 순위점수',line:{color:c.accent}},{x:st.map(x=>x['연도']),y:st.map(x=>n(x['TFR_연도별순위점수'])),type:'scatter',mode:'lines+markers',name:'TFR 순위점수',line:{color:c.line,dash:'dot'}}]} layout={{height:360,yaxis:{title:'순위점수 (높을수록 상위)',range:[0,100]},legend:{orientation:'h'}}}/></section>
    </>}
    {!structuralPage && <>
    <h2 className="analysis-section-title">재정대응지수</h2>
    <p className="analysis-section-description">지역 인구 대비 저출생 대응 실질 계획예산을 표준화한 상대 지수로, 점수가 높을수록 재정 투입 수준이 상대적으로 큽니다.</p>
    <div className="results-grid"><section className="panel"><h2>종합지수 결과와 추세</h2><Chart interpretation="재정대응점수는 실질 1인당 계획예산을 표준화한 상대 지수입니다. 상승은 실제 집행이나 정책성과가 아니라 다른 시도·연도 대비 계획예산 투입 수준이 커졌음을 뜻합니다." data={[{x:f.map(x=>x['연도']),y:f.map(x=>n(x['종합재정대응점수_0_100'])),type:'scatter',mode:'lines+markers',line:{color:c.accent}}]} layout={{height:320,yaxis:{range:[0,100]}}}/><DataTable rows={f} columns={[{key:'연도',label:'연도'},{key:'종합재정대응점수_0_100',label:'종합점수',format:v=>n(v).toFixed(2)},{key:'연도별_종합재정대응순위',label:'순위'}]}/></section>
    <section className="panel"><h2>세부영역 지수 결과와 추세</h2><Chart interpretation="세부영역 점수는 영역별 실질 1인당 계획예산의 상대적 수준입니다. 영역별 원예산 규모 차이가 매우 커 log1p 변환 후 비교했으며, 작은 점수 차이를 실제 원화 차이처럼 읽어서는 안 됩니다." data={[{x:fsDomain.map(x=>x['연도']),y:fsDomain.map(x=>n(x['세부영역_재정대응점수_0_100'])),type:'scatter',mode:'lines+markers',line:{color:c.accent}}]} layout={{height:320,yaxis:{range:[0,100]}}}/><DataTable rows={fsDomain} columns={[{key:'연도',label:'연도'},{key:'세부영역_재정대응점수_0_100',label:'세부점수',format:v=>n(v).toFixed(2)},{key:'log1p_인구1인당_실질예산',label:'log1p 예산',format:v=>n(v).toFixed(3)}]}/></section></div>
    <section className="panel"><h2>세부영역별 log1p 비중</h2><Chart interpretation="영역별 예산 규모의 큰 편차를 완화하기 위해 log1p 값을 사용했습니다. 막대 구성은 재정 배분의 상대적 방향을 보여주며 실제 예산액 비율과는 다릅니다." data={fiscalDomains.map((d,i)=>{const rows=fs.filter(x=>x['세부영역']===d);return {type:'bar',name:shortDomain(d),x:rows.map(x=>x['연도']),y:rows.map(x=>n(x['log1p_인구1인당_실질예산'])),marker:{color:`rgba(${c.accentRgb},${.25+(i%5)*.15})`}}})} layout={{height:420,barmode:'stack',yaxis:{title:'log1p 1인당 실질예산'}}}/></section>
    <section className="panel"><h2>재정대응 종합지수와 합계출산율 순위 비교</h2><Chart interpretation="재정대응점수는 실질 1인당 계획예산을 표준화한 상대 지수입니다. 상승은 실제 집행이나 정책성과가 아니라 다른 시도·연도 대비 계획예산 투입 수준이 커졌음을 뜻합니다." data={[{x:f.map(x=>x['연도']),y:f.map(x=>18-n(x['연도별_종합재정대응순위'])),type:'scatter',mode:'lines+markers',name:'재정대응 역순위',line:{color:c.accent}},{x:st.map(x=>x['연도']),y:st.map(x=>18-n(x['TFR_연도별순위'])),type:'scatter',mode:'lines+markers',name:'TFR 역순위',line:{color:c.line,dash:'dot'}}]} layout={{height:360,yaxis:{title:'역순위 (높을수록 상위)'},legend:{orientation:'h'}}}/></section>
    <h2 className="analysis-section-title">1인당 재정대응 예산액 log1p</h2>
    <div className="results-grid"><section className="panel"><h2>전체예산 측정값과 추세</h2><Chart interpretation="20–39세 인구 1인당 실질 계획예산의 장기 추세입니다. 계획예산은 집행액·결산액이 아니며, log1p 값의 변화는 원 단위의 동일한 증감폭을 의미하지 않습니다." data={[{x:ft.map(x=>x['연도']),y:ft.map(x=>n(x['log1p_20_39세_1인당_실질예산'])),type:'scatter',mode:'lines+markers',line:{color:c.accent}}]} layout={{height:320,yaxis:{title:'log1p 20–39세 1인당 예산'}}}/><DataTable rows={ft} columns={[{key:'연도',label:'연도'},{key:'20_39세_1인당_실질예산_원',label:'1인당 실질예산',format:v=>`${Math.round(n(v)).toLocaleString()}원`},{key:'log1p_20_39세_1인당_실질예산',label:'log1p',format:v=>n(v).toFixed(3)}]}/></section>
    <section className="panel"><h2>세부영역별 측정값과 추세</h2><Chart interpretation="세부영역 점수는 영역별 실질 1인당 계획예산의 상대적 수준입니다. 영역별 원예산 규모 차이가 매우 커 log1p 변환 후 비교했으며, 작은 점수 차이를 실제 원화 차이처럼 읽어서는 안 됩니다." data={[{x:fsDomain.map(x=>x['연도']),y:fsDomain.map(x=>n(x['log1p_인구1인당_실질예산'])),type:'scatter',mode:'lines+markers',line:{color:c.accent}}]} layout={{height:320,yaxis:{title:'log1p 1인당 실질예산'}}}/><DataTable rows={fsDomain} columns={[{key:'연도',label:'연도'},{key:'인구1인당_실질예산_원',label:'1인당 실질예산',format:v=>`${Math.round(n(v)).toLocaleString()}원`},{key:'log1p_인구1인당_실질예산',label:'log1p',format:v=>n(v).toFixed(3)}]}/></section></div>
    <section className="panel"><h2>세부영역별 예산 log1p 비중</h2><Chart interpretation="영역별 예산 규모의 큰 편차를 완화하기 위해 log1p 값을 사용했습니다. 막대 구성은 재정 배분의 상대적 방향을 보여주며 실제 예산액 비율과는 다릅니다." data={fiscalDomains.map((d,i)=>{const rows=fs.filter(x=>x['세부영역']===d);return {type:'bar',name:shortDomain(d),x:rows.map(x=>x['연도']),y:rows.map(x=>n(x['log1p_인구1인당_실질예산'])),marker:{color:`rgba(${c.accentRgb},${.25+(i%5)*.15})`}}})} layout={{height:420,barmode:'stack'}}/></section>
    <section className="panel comparison-panel"><div className="panel-head"><h2>{year}년 예산 비중과 {year+2}년 구조환경 기여도 비교</h2><label className="local-chart-filter">비교 기준연도<select value={year} onChange={e=>setYear(+e.target.value)}>{years.slice(0,7).map(x=><option key={x}>{x}</option>)}</select></label></div><Chart interpretation="시점이 다른 두 영역 구성을 나란히 본 탐색적 비교입니다. 두 막대는 산식과 단위가 다르므로 절대 크기보다 어느 영역에 상대적으로 무게가 실렸는지를 확인해야 합니다." data={[{type:'bar',orientation:'h',name:`${year} 예산 log1p 비중`,y:[...comparisonDomains].reverse(),x:[...comparisonDomains].reverse().map(d=>budgetComparison[domainKey(d)]??null),marker:{color:c.accent},hovertemplate:'%{y}<br>예산 log1p 비중 %{x:.1f}<extra></extra>'},{type:'bar',orientation:'h',name:`${year+2} 구조환경 기여도`,y:[...comparisonDomains].reverse(),x:[...comparisonDomains].reverse().map(d=>structuralComparison[domainKey(d)]??null),marker:{color:c.line},hovertemplate:'%{y}<br>구조환경 기여도 %{x:.1f}<extra></extra>'}]} layout={{height:590,barmode:'group',margin:{t:70,r:30,b:55,l:205},xaxis:{title:'비교값',rangemode:'tozero'},yaxis:{fixedrange:true,ticklabelposition:'outside',ticklabelstandoff:12},legend:{orientation:'h',x:0,y:1.12,xanchor:'left',yanchor:'bottom'}}}/><Notice type="warn">두 막대는 산식과 단위가 다른 비교용 지표입니다. 크기의 직접 비교보다 영역별 구성 방향을 확인하세요.</Notice></section>
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
    <div className="results-grid"><section className="panel"><h2>반응성 높은·낮은 세부영역</h2><p className="muted">음의 계수가 클수록 환경 하락 뒤 재정비중 증가 방향과 가깝습니다.</p><DataTable rows={response} columns={[{key:'모형',label:'영역'},{key:'계수',label:'계수',format:v=>n(v).toFixed(4)},{key:'음의계수_재정대응방향',label:'방향 일치'}]}/></section><section className="panel"><h2>시도별 탐색 집단</h2><Chart interpretation="시도별 상관은 전반적으로 약했으며 탐색 집단은 정책성과 순위가 아닙니다. 지역별 66개 관측치를 합친 기술통계이므로 표본 구성과 예산누락주의의 영향을 함께 봐야 합니다." data={[{type:'bar',x:regionResponse.map(x=>x['지역']),y:regionResponse.map(x=>n(x['반대방향_변화비율_pct'])),marker:{color:c.accent},customdata:regionResponse.map(x=>x['대응성_탐색집단']),hovertemplate:'%{x}<br>%{y:.1f}%<br>%{customdata}<extra></extra>'}]} layout={{height:380,xaxis:{tickangle:-35},yaxis:{title:'대응 방향 변화비율 (%)'}}}/></section></div>
    <h2 className="analysis-section-title">재정대응예산과 합계출산율</h2>
    <div className="filter-bar"><label>모형<select value={version} onChange={e=>setVersion(e.target.value)}>{versions.map(x=><option key={x}>{x}</option>)}</select></label></div>
    <section className="panel"><h2>단년도·3개년 평균예산의 후행 TFR 관계</h2><Chart interpretation="보고서 기준으로 3개년 평균 t+2 모형의 돌봄 여건만 BH 보정 후 양의 관계가 유지됐고, 다른 영역은 유의하지 않았습니다. 이 결과 역시 고정효과를 조건으로 한 관련성이며 예산의 인과효과가 아닙니다." tall data={[{type:'scatter',mode:'markers',y:modelRows.map(x=>shortDomain(x['모형'])),x:modelRows.map(x=>n(x['계수'])),error_x:{type:'data',symmetric:false,array:modelRows.map(x=>n(x['95%신뢰구간_상한'])-n(x['계수'])),arrayminus:modelRows.map(x=>n(x['계수'])-n(x['95%신뢰구간_하한'])),color:c.accent},marker:{color:modelRows.map(x=>x['FDR_0.05_유의']==='True'?c.accent:c.mutedBar),size:10},customdata:modelRows.map(x=>[x['p값'],x['관측치']]),hovertemplate:'%{y}<br>계수 %{x:.4f}<br>p=%{customdata[0]} · n=%{customdata[1]}<extra></extra>'}]} layout={{height:520,margin:{...plotLayout.margin,l:120},shapes:[{type:'line',x0:0,x1:0,y0:-.5,y1:modelRows.length-.5,line:{color:c.line,dash:'dot'}}],xaxis:{title:'예산–후행 TFR 회귀계수'},showlegend:false}}/><DataTable rows={modelRows} columns={[{key:'모형',label:'세부영역'},{key:'계수',label:'계수',format:v=>n(v).toFixed(4)},{key:'p값',label:'p값',format:v=>n(v).toFixed(3)},{key:'FDR_q값',label:'FDR q',format:v=>v? n(v).toFixed(3):'—'},{key:'관측치',label:'n'}]}/></section>
    <section className="panel"><h2>구조환경 3개 군집별 계수 비교</h2><Chart interpretation="구조환경 군집 간 계수 차이는 통계적으로 확인되지 않았습니다. 특히 대전·세종만 포함된 소군집은 추정이 불안정하므로 유형별 효과 차이의 근거가 아닌 민감도 결과로 읽어야 합니다." tall data={[1,2,3].map((cluster,i)=>{const rows=data.tfrClusters.filter(x=>x['시차']==='t+2'&&n(x['군집'])===cluster);return {type:'bar',name:`군집 ${cluster}`,x:rows.map(x=>shortDomain(x['모형'])),y:rows.map(x=>n(x['계수'])),marker:{color:`rgba(${c.accentRgb},${.35+i*.3})`}}})} layout={{height:520,barmode:'group',xaxis:{tickangle:-35},yaxis:{title:'3개년 평균예산–t+2 TFR 계수'},legend:{orientation:'h'}}}/><DataTable rows={data.clusters} columns={[{key:'region',label:'시도'},{key:'군집_3개',label:'구조환경 군집'},{key:'가족·생활',label:'가족·생활',format:v=>n(v).toFixed(1)},{key:'경제·고용·주거',label:'경제·고용·주거',format:v=>n(v).toFixed(1)},{key:'보건·안전',label:'보건·안전',format:v=>n(v).toFixed(1)},{key:'사회·문화',label:'사회·문화',format:v=>n(v).toFixed(1)}]}/></section>
  </>
}
