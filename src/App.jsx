import { useEffect, useRef, useState } from 'react'
import { Chart, Metric, Notice, PageHeader, plotLayout } from './components'
import { budgetByYear, budgetRows, checksums, cpi, files, indicators, nationalFertility, officialCategory2024, officialCategoryLabels2024, qaDetailRows, qaRows, references, regions, responseByDomain, responseByRegion, sources, structuralIndicators, trendRows, years } from './data'
import { ThemeContext, useTheme, themeColors } from './theme'
import { FiscalResponseAnalysis, RelationshipAnalysis, StructuralIndexAnalysis } from './analysisPages'

const pages = [
  { id: 'about', label: '프로젝트 소개' },
  { label: '활용 데이터', children: [
    { id: 'projects', label: '저출생 대응 예산사업 목록' },
    { id: 'quality', label: '예산 정합성 검증' },
  ] },
  { label: '분석 결과', children: [
    { id: 'structural-analysis', label: '구조환경지수 분석' },
    { id: 'fiscal-analysis', label: '재정대응 분석' },
    { id: 'relationship-analysis', label: '재정지출–출산율 관계' },
  ] },
  { label: '연구 문서', children: [
    { id: 'sources', label: '원출처 목록' },
    { id: 'references', label: '참고문헌' },
  ] },
  { id: 'download', label: '데이터 다운로드' },
]
const flatPages = pages.flatMap(p => p.children || [p])

function About({ navigate }) {
  return <>
    <section className="hero">
      <div>
        <p className="eyebrow eyebrow-kr">저출생 재정대응과 지역 출생환경의 정합성 및 출산율 간 관계 분석</p>
        <h1>아이는 어떤 환경에서<br/><em>태어나는가?</em></h1>
        <p className="lede hero-lede">지역의 구조환경과 지방정부의 저출생 대응 계획예산을<br/>같은 <span>지역 × 연도 × 영역 축으로</span> 연결해 살펴봅니다.</p>
        <div className="hero-actions"><button className="primary" onClick={() => navigate('structural-analysis')}>분석 결과 보기</button><button className="text-button" onClick={() => navigate('download')}>데이터 내려받기</button></div>
      </div>
      <div className="hero-visual hero-image">
        <img src="/project-overview.png" alt="대한민국 지역별 출산환경과 재정대응 데이터를 분석하는 모습" />
      </div>
    </section>
    <section className="summary-strip">
      <div><span>01</span><strong>17개 시도 × 9개년</strong><p>2016–2024년 지역 패널로 장기 변화를 비교</p></div>
      <div><span>02</span><strong>구조환경 × 재정대응</strong><p>동일한 출생환경 영역체계로 두 자료를 연결</p></div>
      <div><span>03</span><strong>시차적 관련성</strong><p>재정반응성과 이후 합계출산율의 관계를 탐색</p></div>
    </section>
    <section className="content-section two-col">
      <div><p className="eyebrow eyebrow-kr">분석 배경과 목적</p><h2>출산율과 예산 총액만으로는<br/>지역의 대응을 설명하기 어렵습니다</h2></div>
      <div className="prose">
        <p>출산은 임신·출산 단계의 직접 지원만으로 설명하기 어려운 다층적인 현상입니다. 고용과 소득, 주거비, 교육·돌봄비용, 의료 접근성, 일·가정 양립과 가족 내 돌봄분담 등 개인과 가구가 마주하는 여러 사회경제적 조건이 함께 작용합니다.</p>
        <p>기존 연구는 지역의 출산환경 또는 저출생 대응예산을 각각 분석해 왔지만, 지역의 구조적 제약과 실제 재정배분이 서로 어떻게 대응하는지를 동일한 영역체계와 장기 시계열에서 연결해 살펴본 연구는 제한적이었습니다.</p>
        <p>Yumocha는 지역별 <strong>구조환경의 수준과 변화</strong>, 이에 뒤따르는 <strong>재정대응</strong>, 그리고 이후 <strong>합계출산율과의 관계</strong>를 순차적으로 탐색합니다. 이를 통해 지방정부의 재정이 출산을 둘러싼 어떤 환경비용과 제약에 대응하고 있는지 살펴볼 수 있는 분석틀을 제시합니다.</p>
        <div className="verify-stats">
          <div><strong>28개</strong><span>기존 21개 원자료 전수 대조 · 신규 7개 구축</span></div>
          <div><strong>153개</strong><span>지역·연도 계획예산 전수 검증 · 세부사업 결측 287건</span></div>
        </div>
        <details className="prose-detail">
          <summary>검증 방법 자세히 보기</summary>
          <p>28개 구조환경지표의 분류체계와 산식은 제주여성가족연구원이 먼저 만든 <a href="https://www.mediajeju.com/news/articleView.html?idxno=361517" target="_blank" rel="noreferrer">출산환경지수 연구</a>(2025, 관련 보도)를 참고했습니다. 기존 21개 지표는 원자료 기준으로 전수 재계산해 대조했으며, 이 과정에서 산식이 다르게 적용된 사례 3건을 발견해 원자료 제공기관의 자료 수정으로 이어졌습니다. 이후 7개 지표를 추가로 구축했으며, 지표별 결측과 확인 필요 여부도 함께 관리합니다.</p>
          <p>계획예산도 시행계획 원문과 세부사업 단위로 직접 대조합니다. 예산금액이 비어 있는 세부사업 287건을 확인했고, 중분류 소계와 세부사업 합계가 어긋나는 항목도 임의로 보정하지 않고 그대로 공개합니다. 자세한 내역은 <button className="text-button-inline" onClick={()=>navigate('quality')}>예산 정합성 검증</button> 페이지에서 확인할 수 있습니다.</p>
        </details>
      </div>
    </section>
    <section className="principles">
      <article><span>지역 여건 진단</span><h3>구조환경은 어떠한가</h3><p>고용·주거·돌봄·의료 등 28개 지표로 지역별 출생환경의 상대적 수준과 장기 변화를 살펴봅니다.</p></article>
      <article><span>재정배분 점검</span><h3>재정은 어디에 대응하는가</h3><p>지역의 구조환경 변화와 영역별 계획예산을 연결해 어떤 제약에 재정이 집중되는지 확인합니다.</p></article>
      <article><span>조건부 관계 탐색</span><h3>이후 출산율과 어떤 관계인가</h3><p>지역·연도 차이와 시간적 선후관계를 고려해 재정대응과 이후 합계출산율의 조건부 관련성을 탐색합니다.</p></article>
    </section>
    <section className="intro-audience">
      <div><p className="eyebrow eyebrow-kr">활용 안내</p><h2>지역의 여건과 정책대응을<br/>같은 기준으로 확인합니다</h2></div>
      <div className="intro-audience-grid">
        <article><strong>정책관리자·지방자치단체</strong><p>개선이 필요한 영역과 기존 사업의 집중 분야를 함께 확인해 신규사업 발굴, 사업 조정, 예산배분 우선순위 검토와 연도별 모니터링의 기초자료로 활용할 수 있습니다.</p></article>
        <article><strong>지역 주민</strong><p>거주지역의 출산·양육 환경과 지방정부의 영역별 재정투입을 다른 지역 및 과거 시점과 비교해 확인할 수 있습니다.</p></article>
      </div>
    </section>
    <Notice type="warn">본 사이트의 예산은 실제 집행액이 아닌 <strong>시행계획상 계획예산</strong>입니다. 관측자료에 기반한 분석이므로 재정지출의 인과효과가 아니라 시간적 선후관계와 지역·연도 차이를 고려한 <strong>조건부 관련성과 재정반응성</strong>으로 해석해야 합니다.</Notice>
  </>
}

function Trends() {
  const [region, setRegion] = useState('서울')
  const [indicator, setIndicator] = useState('fertility')
  const meta = indicators.find(x => x.value === indicator)
  const c = themeColors[useTheme()]
  const nationalSeries = indicator === 'fertility' ? nationalFertility : (structuralIndicators[indicator]?.['전국'] ?? Array(9).fill(null))
  useEffect(() => { if (region === '전국' && nationalSeries.every(v => v == null)) setRegion('서울') }, [region, nationalSeries])
  const selected = region === '전국'
    ? years.map((year, i) => ({ region: '전국', year, [indicator]: nationalSeries[i] }))
    : trendRows.filter(x => x.region === region)
  const available = selected.filter(x => x[indicator] != null)
  const last = available.at(-1) ?? selected.at(-1)
  const first = available[0] ?? selected[0]
  const compareYear = [...years].reverse().find(y => trendRows.some(x => x.year === y && x[indicator] != null)) ?? years.at(-1)
  return <>
    <PageHeader eyebrow="추세" title="지표 추이" description="지역의 시간적 변화와 17개 시도의 상대적 위치를 함께 살펴보세요."/>
    <div className="filter-bar">
      <label>지역<select value={region} onChange={e => setRegion(e.target.value)}><option>전국</option>{regions.map(x => <option key={x}>{x}</option>)}</select></label>
      <label>지표<select value={indicator} onChange={e => setIndicator(e.target.value)}>{indicators.map(x => <option value={x.value} key={x.value}>{x.label}</option>)}</select></label>
      <div className="legend"><span className="dot plan3"/>제3차 기본계획<span className="dot plan4"/>제4차 기본계획</div>
    </div>
    <Notice>저출산·고령사회 기본계획은 5년 단위로 개편됩니다. 2016~2020년 제3차 계획은 출산율을 끌어올리는 데 목표를 두고 신혼부부, 난임부부 등 특정 대상 지원에 집중했습니다. 2021년부터 시작된 제4차 계획은 출산율 목표치를 없애고 모든 가족과 개인의 삶의 질을 높이는 쪽으로 정책 목표를 바꿨고, 지원 대상도 1인가구와 한부모가족 등 다양한 가족형태로 넓어졌습니다.</Notice>
    <p className="sr-only" aria-live="assertive">{region} {meta.label} 차트로 업데이트됨. 최신값 {last[indicator]}{meta.unit}({last.year}년)</p>
    <div className="dashboard-grid">
      <section className="panel chart-panel wide">
        <div className="panel-head"><div><p className="eyebrow">{region} · 2016–2024</p><h2>{meta.label} 추세</h2></div><div className="value-chip"><strong>{last[indicator]}</strong> {meta.unit}<small>{last.year} 원자료 검증 완료</small></div></div>
        <Chart ariaLabel={`${region} ${meta.label} 연도별 추세`} data={[{
          x: years, y: selected.map(x => x[indicator]), type: 'scatter', mode: 'lines+markers',
          line: { color: c.accent, width: 3 }, marker: { color: c.accent, size: 8 }, connectgaps: false,
          hovertemplate: `%{x}년<br>%{y} ${meta.unit}<extra>${region}</extra>`,
        }]} layout={{ height: 350, shapes: [{type:'rect', x0:2015.5, x1:2020.5, y0:0, y1:1, yref:'paper', fillcolor:c.zoneA, line:{width:0}, layer:'below'}, {type:'rect', x0:2020.5, x1:2024.5, y0:0, y1:1, yref:'paper', fillcolor:c.zoneB, line:{width:0}, layer:'below'}], xaxis:{dtick:1, fixedrange:true}, yaxis:{ticksuffix: meta.unit === '%' ? '%' : '', fixedrange:true, rangemode:'tozero'}, showlegend:false }}/>
      </section>
      <aside className="panel insight-panel"><p className="eyebrow eyebrow-kr">변화</p><strong className="big-change">{(last[indicator] - first[indicator]).toFixed(meta.unit === '%' ? 1 : 2)}<small>{meta.unit}</small></strong><p>{first.year}년 대비 {last.year}년 변화</p><hr/><p className="muted">{meta.description}</p></aside>
      <section className="panel chart-panel wide"><div className="panel-head"><div><p className="eyebrow eyebrow-kr">17개 시도 · {compareYear}</p><h2>시도 비교</h2></div></div>
        <Chart ariaLabel={`17개 시도 ${meta.label} 비교`} data={[{type:'bar', x: regions, y: regions.map(r => trendRows.find(x => x.region === r && x.year === compareYear)?.[indicator] ?? null), marker:{color:regions.map(r => r === region ? c.accent : c.mutedBar)}, hovertemplate:`%{x}<br>%{y} ${meta.unit}<extra></extra>`}]} layout={{height:310, xaxis:{tickangle:-35, fixedrange:true}, yaxis:{rangemode:'tozero', fixedrange:true}, showlegend:false}}/>
      </section>
    </div>
    {meta.caveat
      ? <Notice type="warn">{meta.caveat}</Notice>
      : <Notice>28개 구조환경지표는 기존 21개 지표의 원자료 전수 대조와 신규 7개 지표 구축·검증을 거쳐 공개합니다. 격년·비정기 조사 지표는 결측값을 0으로 대체하거나 선으로 잇지 않고 그대로 비워 둡니다.</Notice>}
  </>
}

function Structure() {
  const sorted = [...budgetRows].sort((a,b) => b.budget-a.budget)
  const c = themeColors[useTheme()]
  const [budgetView, setBudgetView] = useState('domain')
  const [trendRegion, setTrendRegion] = useState(regions[0])
  const nominalSeries = budgetByYear[trendRegion].map(v => +(v/100).toFixed(0))
  const realSeries = budgetByYear[trendRegion].map((v,i) => +(v/100/(cpi[i]/100)).toFixed(0))
  const alphas = [1, .7, .45, .22]
  const domainData = [
    ['가족지원','family',1],['돌봄·교육','care',.7],['주거','housing',.45],['일·생활 균형','work',.22]
  ].map(([name,key,alpha])=>({type:'bar', name, x:regions, y:budgetRows.map(x=>x[key]), marker:{color:`rgba(${c.accentRgb},${alpha})`}, hovertemplate:`%{x}<br>${name} %{y}%<extra></extra>`}))
  const officialData = officialCategoryLabels2024.map((name, i) => ({
    type:'bar', name, x: regions,
    y: regions.map(r => { const vals = officialCategory2024[r]; return +(vals[i] / vals.reduce((a,b)=>a+b,0) * 100).toFixed(1) }),
    marker:{color:`rgba(${c.accentRgb},${alphas[i]})`}, hovertemplate:`%{x}<br>${name} %{y}%<extra></extra>`,
  }))
  return <>
    <PageHeader eyebrow="현황" title="재정 현황" description="지역의 구조적 여건과 계획예산의 규모·구성을 나란히 비교합니다."/>
    <div className="metric-row"><Metric label="분석 지역" value="17" sub="전국 광역 시도"/><Metric label="구조환경지표" value="28" sub="검증·구축 완료"/><Metric label="예산 기준" value="당해예산" sub="전년도예산 제외"/><Metric label="데이터 기간" value="9년" sub="2016–2024"/></div>
    <section className="panel chart-panel">
      <div className="panel-head"><div><p className="eyebrow eyebrow-kr">계획예산</p><h2>지역별 계획예산 비교</h2></div><div className="panel-head-note"><p className="muted">단위: 억 원 · 구조 검증용 샘플</p><a className="text-button-inline" href="https://www.betterfuture.go.kr/front/policySpace/actionPlan.do" target="_blank" rel="noreferrer">시행계획 원문 보기 ↗</a></div></div>
      <Chart tall ariaLabel="지역별 계획예산 막대 차트" data={[{type:'bar', orientation:'h', y:sorted.map(x=>x.region).reverse(), x:sorted.map(x=>x.budget).reverse(), marker:{color:sorted.map((_,i)=>`rgba(${c.accentRgb}, ${.42 + i/40})`).reverse()}, hovertemplate:'%{y}<br>%{x:,.0f}억 원<extra></extra>'}]} layout={{height:500, margin:{...plotLayout.margin,l:45}, xaxis:{tickformat:',', fixedrange:true}, yaxis:{fixedrange:true}, showlegend:false}}/>
    </section>
    <div className="filter-bar chart-filter">
      <label>지역<select value={trendRegion} onChange={e => setTrendRegion(e.target.value)}>{regions.map(x => <option key={x}>{x}</option>)}</select></label>
    </div>
    <p className="sr-only" aria-live="assertive">{trendRegion} 계획예산 추이 차트로 업데이트됨</p>
    <section className="panel chart-panel">
      <div className="panel-head"><div><p className="eyebrow eyebrow-kr">연도별 추이</p><h2>{trendRegion} 계획예산 추이</h2></div><p className="muted">단위: 억 원 · 실질은 2020년 불변가격 환산(통계청 소비자물가지수) · 실제 집계값</p></div>
      <Chart ariaLabel={`${trendRegion} 계획예산 명목·실질 추이`} data={[
        {x:years, y:nominalSeries, type:'scatter', mode:'lines+markers', name:'명목', line:{color:c.accent,width:3}, marker:{size:7,color:c.accent}, hovertemplate:'%{x}년<br>명목 %{y:,.0f}억 원<extra></extra>'},
        {x:years, y:realSeries, type:'scatter', mode:'lines+markers', name:'실질(2020년 기준)', line:{color:c.line,width:2,dash:'dot'}, marker:{size:7,color:c.line}, hovertemplate:'%{x}년<br>실질 %{y:,.0f}억 원<extra></extra>'},
      ]} layout={{height:360, xaxis:{dtick:1,fixedrange:true}, yaxis:{tickformat:',',fixedrange:true,rangemode:'tozero'}, legend:{orientation:'h',y:1.15,x:0}}}/>
    </section>
    <section className="panel chart-panel">
      <div className="panel-head"><div><p className="eyebrow eyebrow-kr">정책영역 구성</p><h2>정책영역별 예산 구성</h2></div><p className="muted">{budgetView==='official' ? '2024년 · 저출산·고령사회 기본계획(제4차) 공식 분류 · 실제 집계값' : '구조 검증용 샘플'}</p></div>
      <div className="chart-toggle">
        <button className={budgetView==='domain'?'active':''} aria-pressed={budgetView==='domain'} onClick={()=>setBudgetView('domain')}>출생환경지표 영역 기준</button>
        <button className={budgetView==='official'?'active':''} aria-pressed={budgetView==='official'} onClick={()=>setBudgetView('official')}>기본계획 공식 분류기준</button>
      </div>
      <Chart ariaLabel="지역별 정책영역 예산 구성 차트" data={budgetView==='domain' ? domainData : officialData} layout={{height:360,barmode:'stack',xaxis:{tickangle:-35,fixedrange:true},yaxis:{ticksuffix:'%',range:[0,100],fixedrange:true},legend:{orientation:'h',y:1.15,x:0}}}/>
    </section>
    <Notice type="warn">계획예산은 사업 추진 의지와 재정 규모를 보여주는 행정계획상 수치이며, 실제 집행액이나 정책효과를 의미하지 않습니다. 시행계획 문서의 '당해예산'은 연초에 편성한 본예산이며, 추경·이월을 반영해 연말에 확정되는 최종 집행 예산과는 다릅니다. 본 사이트는 각 연도 시행계획의 당해예산(본예산)만 합산하며, 다음 연도 문서에 기재된 전년도예산(최종예산)은 사업 폐지·명칭 변경 시 누락될 수 있어 사용하지 않습니다.</Notice>
  </>
}

function Results() {
  const c = themeColors[useTheme()]
  return <>
    <PageHeader eyebrow="분석" title="재정 대응 방향" description="구조환경이 하락한 뒤 같은 영역의 계획예산 비중이 증가했는지 살펴봅니다."><span className="status-pill">실제 분석 결과</span></PageHeader>
    <Notice>구조환경지수가 <strong>t→t+1</strong>에 하락하고, 같은 세부영역의 계획예산 비중이 <strong>t+2→t+3</strong>에 증가한 경우를 ‘대응 방향 일치’로 집계했습니다. 이는 기술통계이며 정책 성과나 인과효과를 뜻하지 않습니다.</Notice>
    <div className="metric-row"><Metric label="구조환경 하락" value="295건" sub="2016–2021 기준 변화 사례"/><Metric label="후행 예산비중 증가" value="147건" sub="같은 세부영역"/><Metric label="방향 일치율" value="49.8%" sub="147 / 295건"/><Metric label="분석 범위" value="17개 시도" sub="11개 세부영역"/></div>
    <div className="results-grid">
      <section className="panel chart-panel"><div className="panel-head"><div><p className="eyebrow eyebrow-kr">세부영역</p><h2>구조환경 하락 뒤 예산비중 증가율</h2></div></div>
        <Chart tall ariaLabel="세부영역별 대응 방향 일치율" data={[{type:'bar',orientation:'h',y:responseByDomain.map(x=>x.domain).reverse(),x:responseByDomain.map(x=>x.rate).reverse(),customdata:responseByDomain.map(x=>[x.increases,x.declines]).reverse(),marker:{color:c.accent},hovertemplate:'%{y}<br>%{customdata[0]}/%{customdata[1]}건 · %{x:.1f}%<extra></extra>'}]} layout={{height:520,margin:{...plotLayout.margin,l:120},xaxis:{title:'대응 방향 일치율 (%)',range:[0,70],fixedrange:true},yaxis:{fixedrange:true},showlegend:false}}/>
      </section>
      <aside className="panel reading-guide"><p className="eyebrow eyebrow-kr">읽는 법</p><h2>어떻게 읽나요?</h2><ol><li><strong>49.8%</strong>는 하락 사례의 약 절반에서만 이후 예산비중 증가가 관찰됐다는 뜻입니다.</li><li>경제적 여건은 2건, 산후조리 여건은 0건이라 영역 간 비교에 적합하지 않습니다.</li><li>예산누락주의 사례를 제외하면 일부 영역의 비율이 달라질 수 있습니다.</li></ol></aside>
    </div>
    <section className="panel chart-panel"><div className="panel-head"><div><p className="eyebrow eyebrow-kr">17개 시도</p><h2>지역별 대응 방향 일치율</h2></div><p className="muted">막대 위에 증가건수/하락사례수 표시</p></div>
      <Chart tall ariaLabel="시도별 대응 방향 일치율" data={[{type:'bar',x:responseByRegion.map(x=>x.region),y:responseByRegion.map(x=>x.rate),text:responseByRegion.map(x=>`${x.increases}/${x.declines}`),textposition:'outside',customdata:responseByRegion.map(x=>[x.rank,x.caution]),marker:{color:responseByRegion.map((_,i)=>`rgba(${c.accentRgb},${1-i*.035})`)},hovertemplate:'%{x}<br>%{text}건 · %{y:.1f}%<br>공동 %{customdata[0]}위 · 누락주의 %{customdata[1]}건<extra></extra>'}]} layout={{height:520,margin:{...plotLayout.margin,t:45},xaxis:{tickangle:-35,fixedrange:true},yaxis:{title:'대응 방향 일치율 (%)',range:[0,72],fixedrange:true},showlegend:false}}/>
    </section>
    <Notice type="warn">지역 순위는 <strong>재정 대응의 방향 일치율</strong> 순위일 뿐 정책 성과·예산 효과·행정역량 순위가 아닙니다. 사례 수가 적으면 비율이 크게 흔들릴 수 있으므로 반드시 분자와 분모를 함께 확인하세요.</Notice>
    <section className="limitations"><div><p className="eyebrow eyebrow-kr">해석</p><h2>숫자보다 먼저<br/>확인할 것</h2></div><ul><li>예산비중은 합계가 제한된 구성자료라 다른 영역의 증가가 해당 영역의 감소로 이어질 수 있습니다.</li><li>계획예산은 실제 집행액이 아니며 사업 통합·분리와 기록방식 변화가 증감에 포함될 수 있습니다.</li><li>구조환경 하락과 후행 예산비중 증가가 함께 나타났다고 해서 환경 악화가 예산 증가를 유발했다고 볼 수 없습니다.</li><li>2021년 제4차 기본계획부터 정책 목표와 분류 체계가 재편되어 시계열 비교에 주의가 필요합니다.</li></ul></section>
  </>
}

function Quality() {
  const [region, setRegion] = useState(regions[0])
  const [resultFilter, setResultFilter] = useState('전체')
  const c = themeColors[useTheme()]
  const byKey = Object.fromEntries(qaRows.map(r => [`${r.region}-${r.year}`, r]))
  const z = regions.map(r => years.map(year => +(byKey[`${r}-${year}`].missing / byKey[`${r}-${year}`].detail * 100).toFixed(1)))
  const totalMissing = qaRows.reduce((s,r)=>s+r.missing, 0)
  const totalDetail = qaRows.reduce((s,r)=>s+r.detail, 0)
  const missingRows = qaRows.filter(r=>r.missing>0).length
  const flagged = qaRows.filter(r=>r.note)
  const missingByRegion = regions.map(r => [r, qaRows.filter(x=>x.region===r).reduce((s,x)=>s+x.missing,0)]).sort((a,b)=>b[1]-a[1])
  const [topRegion, topRegionMissing] = missingByRegion[0]
  const resultClass = { 일치: 'ok', 불일치: 'mismatch', 판정불가: 'unknown' }
  return <>
    <PageHeader eyebrow="분석" title="예산 정합성 검증" description="계획예산 세부사업의 결측 비율과 중분류 소계 검증 결과를 지역별로 살펴봅니다."><span className="status-pill">공개 데이터 기반</span></PageHeader>
    <Notice>analysis_panel.csv·QA 검증결과에 포함된 실제 집계값입니다(가상값 아님). 결측 세부사업은 계획예산 합계에서 제외되므로, 결측이 많은 지역·연도는 실제보다 예산이 과소집계됐을 수 있습니다. 중분류명은 시행계획 원문의 목차 구조를 그대로 표기하며, 연도별로 명칭이 달라질 수 있습니다.</Notice>
    <div className="metric-row">
      <Metric label="결측 세부사업" value={`${totalMissing}건`} sub={`전체 ${totalDetail.toLocaleString()}건 중 ${(totalMissing/totalDetail*100).toFixed(1)}%`}/>
      <Metric label="결측 발생 지역·연도" value={`${missingRows}개`} sub="전체 153개 지역·연도 중"/>
      <Metric label="결측 최다 연도" value="2018년" sub="123건 · 전체 결측의 43%"/>
      <Metric label="결측 최다 지역" value={topRegion} sub={`${topRegionMissing}건 · 전체 결측의 ${(topRegionMissing/totalMissing*100).toFixed(1)}%`}/>
    </div>
    <section className="panel chart-panel wide">
      <div className="panel-head"><div><p className="eyebrow eyebrow-kr">지역 × 연도</p><h2>세부사업 예산결측 비율</h2></div><p className="muted">단위: % (해당 지역·연도 세부사업수 대비)</p></div>
      <Chart tall ariaLabel="지역과 연도별 예산결측 비율 히트맵" data={[{ type:'heatmap', z, x: years, y: regions, colorscale: [[0, c.zoneA],[1, c.accent]], hoverongaps:false, hovertemplate:'%{y} %{x}<br>결측비율 %{z}%<extra></extra>', colorbar:{ title:'%', thickness:14 } }]} layout={{ height:520, xaxis:{ type:'category', fixedrange:true }, yaxis:{ fixedrange:true, autorange:'reversed' } }}/>
    </section>
    <aside className="panel reading-guide qa-guide"><p className="eyebrow eyebrow-kr">방법</p><h2>어떻게 검증했나요?</h2><ol><li><strong>세부사업 결측</strong>: 시행계획 원문에 세부사업 항목은 있지만 예산금액 칸이 비어 있으면 결측으로 표시합니다.</li><li><strong>중분류 소계 검증</strong>: 시행계획 원문에 적힌 중분류별 소계값(원문)과, 그 아래 딸린 세부사업 예산을 모두 더한 값(집계)을 비교합니다.</li><li><strong>판정 기준</strong>: 두 값의 오차율이 허용기준 이내면 일치, 벗어나면 불일치, 원문에 소계값 자체가 없으면 판정불가로 표시합니다.</li><li><strong>불일치의 의미</strong>: 소계와 세부사업 합계가 다르다는 뜻일 뿐, 어느 쪽이 맞는지는 판단하지 않습니다. 원문 기재 오류일 수도, 저희가 세부사업을 일부 놓쳤을 수도 있어 임의로 보정하지 않고 그대로 둡니다. 해당 지역·연도의 예산 총액은 이 점을 감안해 참고하십시오.</li></ol></aside>
    {flagged.length>0 && <div className="notice warn qa-flagged"><span aria-hidden="true">!</span><div><strong>원자료 누락 주의 지역·연도</strong><ul>{flagged.map(r=><li key={`${r.region}-${r.year}`}><strong>{r.region} {r.year}년:</strong> {r.note}</li>)}</ul></div></div>}
    <div className="filter-bar qa-detail-filter">
      <label>지역<select value={region} onChange={e => setRegion(e.target.value)}>{regions.map(x => <option key={x}>{x}</option>)}</select></label>
      <label>결과<select value={resultFilter} onChange={e => setResultFilter(e.target.value)}><option>전체</option><option>일치</option><option>불일치</option><option>판정불가</option></select></label>
    </div>
    <p className="sr-only" aria-live="assertive">{region} {resultFilter !== '전체' && `${resultFilter} `}연도별 중분류 소계 검증 내역으로 업데이트됨</p>
    <section className="panel qa-detail">
      <div className="panel-head"><div><p className="eyebrow eyebrow-kr">{region}</p><h2>연도별 중분류 소계 검증 내역</h2></div><p className="muted">중분류 소계(원문) ↔ 세부사업 합계(집계) 비교 · 단위: 백만 원</p></div>
      {!qaDetailRows.some(r => r.region === region && (resultFilter === '전체' || r.result === resultFilter)) && <p className="muted">조건에 맞는 결과가 없습니다.</p>}
      {years.map(year => {
        const rows = qaDetailRows.filter(r => r.region === region && r.year === year && (resultFilter === '전체' || r.result === resultFilter))
        if (!rows.length) return null
        return <div className="qa-year-group" key={year}>
          <h4>{year}년</h4>
          <ul>{rows.map((r,i) => <li key={i}>
            <span className={`qa-badge qa-${resultClass[r.result]}`}>{r.result}</span>
            <span className="qa-category">{r.category}</span>
            <span className="qa-amount">{r.orig != null ? `원문 ${r.orig.toLocaleString()}` : '원문 결측'} · 집계 {r.calc.toLocaleString()}</span>
            {r.rate != null && r.rate > 0 && <span className="qa-rate">오차율 {r.rate}%</span>}
            {r.reason && <span className="qa-reason">{r.reason}</span>}
          </li>)}</ul>
        </div>
      })}
    </section>
  </>
}

function parseProjectCsv(text) {
  const rows = []
  let row = [], cur = '', inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') { if (text[i+1] === '"') { cur += '"'; i++ } else inQuotes = false }
      else cur += ch
    } else {
      if (ch === '"') inQuotes = true
      else if (ch === ',') { row.push(cur); cur = '' }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i+1] === '\n') i++
        row.push(cur); cur = ''
        rows.push(row); row = []
      } else cur += ch
    }
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row) }
  return rows.filter(r => r.length > 1 || r[0] !== '')
}

function pageWindow(current, total, span = 2) {
  const pages = [1]
  const start = Math.max(2, current - span)
  const end = Math.min(total - 1, current + span)
  if (start > 2) pages.push('…s')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('…e')
  if (total > 1) pages.push(total)
  return pages
}

function normalizeOfficialClass(year, value) {
  const text = (value || '').replace(/\([^)]*(?:사업|과제|공통|자체)[^)]*\)/g, '').replace(/^[ⅠⅡⅢⅣIVX\d.\s]+/, '').replace(/[·･․]/g, ' ').replace(/\s+/g, ' ').trim()
  if (+year <= 2018) {
    if (/출산이 행복한/.test(text)) return '출산이 행복한 지역 조성'
    if (/안정된 생활.*건강한 노년/.test(text)) return '안정된 생활·건강한 노년·활기찬 노후'
    if (/대응\s*기반|대응기반/.test(text)) return '저출산·고령사회 대응기반 강화'
    if (/고령/.test(text)) return '고령사회 대책'
    if (/저출산/.test(text)) return '저출산 대책'
  }
  if (+year <= 2020) {
    if (/함께 돌보고 함께 일하는/.test(text)) return '함께 돌보고 함께 일하는 사회'
    if (/행복한 노후/.test(text)) return '함께 만들어가는 행복한 노후'
    if (/인구.*변화|인구구조/.test(text)) return '인구구조 변화 적극 대비'
  }
  if (/함께 일하고 함께 돌보는/.test(text)) return '함께 일하고 함께 돌보는 사회'
  if (/건강하고 능동적인 고령사회/.test(text)) return '건강하고 능동적인 고령사회'
  if (/모두의 역량이 고루 발휘/.test(text)) return '모두의 역량이 고루 발휘되는 사회'
  if (/인구구조 변화에 대한 적응/.test(text)) return '인구구조 변화에 대한 적응'
  return text
}

function FilterMultiSelect({ label, note, options, selected, onChange }) {
  const detailsRef = useRef(null)
  useEffect(() => {
    const close = event => {
      if (event.type === 'keydown' && event.key !== 'Escape') return
      if (event.type === 'pointerdown' && detailsRef.current?.contains(event.target)) return
      if (detailsRef.current) detailsRef.current.open = false
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close) }
  }, [])
  return <div className="filter-field"><span>{label}</span>{note && <small>{note}</small>}<details ref={detailsRef} className="filter-multiselect"><summary>{selected.length ? `${selected.length}개 선택` : '전체'}</summary><div className="filter-options"><button type="button" onClick={()=>onChange([])}>전체 보기</button>{options.map(x=><label key={x}><input type="checkbox" checked={selected.includes(String(x))} onChange={e=>onChange(e.target.checked?[...selected,String(x)]:selected.filter(value=>value!==String(x)))}/><span>{x}</span></label>)}</div></details></div>
}

function ProjectList() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(false)
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedYears, setSelectedYears] = useState([])
  const [officialClasses, setOfficialClasses] = useState([])
  const [environmentClasses, setEnvironmentClasses] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 50

  useEffect(() => {
    fetch('/regional_project_list.csv')
      .then(r => { if (!r.ok) throw new Error('load failed'); return r.text() })
      .then(text => {
        const parsed = parseProjectCsv(text)
        setRows(parsed.slice(1).map(r => ({
          year: r[0], region: r[1], major: r[2], minor: r[3], type: r[4], name: r[5],
          cur: r[6] ? +r[6] : null, prev: r[7] ? +r[7] : null, diffAmt: r[8] ? +r[8] : null, diffPct: r[9] ? +r[9] : null,
          environmentMajor: r[10] || '', environmentMinor: r[11] || '',
          officialClass: normalizeOfficialClass(r[0], r[3]),
        })))
      })
      .catch(() => setError(true))
  }, [])

  useEffect(() => { setPage(1) }, [selectedRegions, selectedYears, officialClasses, environmentClasses, search])

  const filtered = rows ? rows.filter(r =>
    (selectedRegions.length === 0 || selectedRegions.includes(r.region)) &&
    (selectedYears.length === 0 || selectedYears.includes(r.year)) &&
    (officialClasses.length === 0 || officialClasses.includes(r.officialClass)) &&
    (environmentClasses.length === 0 || environmentClasses.includes(r.environmentMinor)) &&
    (search === '' || r.name.includes(search))
  ) : []
  const officialOptions = rows ? [...new Set(rows.filter(r => selectedYears.length === 0 || selectedYears.includes(r.year)).map(r => r.officialClass).filter(Boolean))].sort() : []
  const environmentOptions = rows ? [...new Set(rows.map(r => r.environmentMinor).filter(Boolean))].sort() : []
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage)

  return <>
    <PageHeader eyebrow="활용 데이터" title="저출생 대응 예산사업 목록" description="시행계획 원문에서 추출한 지역·연도별 세부사업 목록입니다."><a className="primary" href="/regional_project_list.csv" download>CSV로 다운로드 <span>↓</span></a></PageHeader>
    <Notice type="warn">이 목록은 각 지자체가 개별 발간한 시행계획 PDF를 파싱해 정제한 세부사업명·예산입니다. 원문 발간처가 별도 재사용 허가(공공누리 등)를 명시하지 않아 참고용으로만 활용해 주세요. 증감률은 전년도 시행계획과 비교한 값이 아니라, 동일 연도 시행계획에 각 세부사업의 전년도 예산으로 표기된 금액을 기준으로 계산했습니다. 사업명 변경·신설·폐지 또는 원문 기재 방식에 따라 결측되거나 왜곡될 수 있습니다.</Notice>
    <div className="filter-bar project-filter-bar">
      <FilterMultiSelect label="지역" note="복수 선택 가능" options={regions} selected={selectedRegions} onChange={setSelectedRegions}/>
      <FilterMultiSelect label="연도" note="복수 선택 가능" options={years} selected={selectedYears} onChange={values=>{setSelectedYears(values);setOfficialClasses([])}}/>
      <FilterMultiSelect label="저출산·고령사회위원회 분류" note="복수 선택 가능" options={officialOptions} selected={officialClasses} onChange={setOfficialClasses}/>
      <FilterMultiSelect label="출생환경지표 분류" note="유모차팀, 2026 · 복수 선택 가능" options={environmentOptions} selected={environmentClasses} onChange={setEnvironmentClasses}/>
      <label>사업명 검색<input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="사업명을 입력하세요"/></label>
    </div>
    <p className="muted project-filter-guide">저출산·고령사회위원회 분류는 각 연도 시행계획 원문을 따릅니다. 2016–2018년, 2019–2020년, 2021–2024년은 해당 기간 기본계획의 분류체계가 적용되어 연도 간 분류명이 다를 수 있습니다. 출생환경지표 분류는 유모차팀이 세부사업명과 주요내용을 기준으로 전수 검토한 단일 영역이며, 소계와 미분류를 제외한 사업목록 57,978건 모두 분류가 완료되어 있습니다.</p>
    {!rows && !error && <p className="muted">불러오는 중입니다… (약 8MB · 57,000여 건)</p>}
    {error && <Notice type="warn">목록을 불러오지 못했습니다. 새로고침해 주세요.</Notice>}
    {rows && <>
      <p className="muted">총 {filtered.length.toLocaleString()}건{selectedRegions.length > 0 && ` · 지역 ${selectedRegions.length}개`}{selectedYears.length > 0 && ` · 연도 ${selectedYears.length}개`} · 단위: 백만 원</p>
      <section className="project-table">
        <div className="project-row project-head"><span>연도</span><span>지역</span><span>위원회 중분류</span><span>출생환경 분류</span><span>세부사업명</span><span>당해예산</span><span>증감률</span></div>
        {pageRows.map((r, i) => <div className="project-row" key={i}>
          <span>{r.year}</span><span>{r.region}</span><span>{r.officialClass}</span><span>{r.environmentMinor}</span><span>{r.name}</span>
          <span>{r.cur != null ? r.cur.toLocaleString() : ''}</span>
          <span className={r.diffPct > 0 ? 'up' : r.diffPct < 0 ? 'down' : ''}>{r.diffPct != null ? `${r.diffPct > 0 ? '+' : ''}${r.diffPct}%` : ''}</span>
        </div>)}
      </section>
      <div className="pagination">
        <button className="page-nav" disabled={page === 1} onClick={() => setPage(p => p - 1)}>이전</button>
        {pageWindow(page, totalPages).map((p, i) => typeof p === 'number'
          ? <button key={p} className={`page-num${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          : <span key={p + i} className="pagination-ellipsis">…</span>
        )}
        <button className="page-nav" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>다음</button>
      </div>
    </>}
  </>
}

function Download({ navigate }) {
  return <>
    <PageHeader eyebrow="공개 데이터" title="데이터 다운로드" description="분석 화면에 사용한 지수·예산·회귀·군집 결과와 품질 정보를 내려받을 수 있습니다."><div className="version-card"><span>최신 버전</span><strong>v0.2.0 · 분석 결과 공개</strong><small>생성일 2026-08-08</small></div></PageHeader>
    <Notice type="warn">구조환경·재정대응 지수와 분석 결과는 공개합니다. 구조환경지표의 원자료 측정값이 포함된 정제본은 원출처별 재배포 조건 확인이 끝날 때까지 공개하지 않습니다.</Notice>
    <section className="download-list">
      <div className="download-head"><span>파일</span><span>행 수</span><span>크기</span><span>상태</span></div>
      {files.map(x=>{
        const ready = x.status === '공개'
        return <article key={x.file} className={ready?'downloadable':''}>
          <div>
            {ready ? <a className="file-icon" href={`/${x.file}`} download aria-label={`${x.name} 다운로드`}>↓</a> : <span className="file-icon">↓</span>}
            <div>
              {ready ? <a href={`/${x.file}`} download><strong>{x.name}</strong></a> : <strong>{x.name}</strong>}
              <code>{x.file}</code>
              <p>{x.description}</p>
              <p className="download-use"><span>주요 활용</span>{x.use}</p>
              {x.sourceUrl && <a className="file-source-link" href={x.sourceUrl} target="_blank" rel="noreferrer">{x.sourceLabel} ↗</a>}
            </div>
          </div>
          <span>{x.rows}</span><span>{x.size}</span><span className={ready?'file-status ready':'file-status'}>{x.status}</span>
        </article>
      })}
    </section>
    <section className="license-box"><div><p className="eyebrow eyebrow-kr">데이터 이용</p><h2>데이터 이용조건</h2></div><div><p>프로젝트가 독자적으로 생성한 데이터 구조, 품질 플래그, 집계값 및 분석 결과는 별도 표시가 없는 한 <strong>CC BY 4.0</strong>으로 제공합니다.</p><p>원자료에서 유래한 항목의 권리는 각 제공기관에 있으며 원출처 이용조건이 우선 적용됩니다. 본 데이터는 공공기관의 공식 승인이나 보증을 의미하지 않습니다.</p><div className="inline-links"><button onClick={()=>navigate('license')}>데이터 이용조건</button><button onClick={()=>navigate('sources')}>원출처 목록 ↗</button><button onClick={()=>navigate('checksums')}>체크섬</button></div></div></section>
  </>
}

function DataLicense({ navigate }) {
  return <>
    <PageHeader eyebrow="공개 데이터" title="데이터 이용조건" description="이 프로젝트가 만든 데이터 구조·집계값과 원자료의 권리 구분을 안내합니다."/>
    <section className="content-section">
      <div className="prose">
        <p>본 프로젝트가 독자적으로 생성한 데이터 구조, 품질 플래그, 집계값 및 분석 결과는 별도 표시가 없는 한 <strong>CC BY 4.0</strong>으로 제공합니다.</p>
        <p>원자료에서 유래한 항목의 권리는 각 원자료 제공기관에 있으며 해당 자료에는 원출처 이용조건이 우선 적용됩니다. 자세한 출처와 이용조건은 <button className="text-button-inline" onClick={()=>navigate('sources')}>원출처 목록</button>을 확인하십시오.</p>
        <p>본 데이터는 공공기관의 공식 승인이나 보증을 의미하지 않으며 계획예산은 실제 집행액과 다를 수 있습니다.</p>
      </div>
    </section>
    <p className="back-link"><button className="text-button" onClick={()=>navigate('download')}>← 데이터 다운로드로 돌아가기</button></p>
  </>
}

function ContentLicense({ navigate }) {
  return <>
    <PageHeader eyebrow="공개 데이터" title="콘텐츠 이용조건" description="사이트에 직접 작성한 설명문·그래프의 이용조건입니다."/>
    <section className="content-section">
      <div className="prose">
        <p>별도 표시가 없는 한 이 저장소에서 직접 작성한 설명문과 그래프는 <a href="https://creativecommons.org/licenses/by/4.0/deed.ko" target="_blank" rel="noreferrer">Creative Commons Attribution 4.0 International</a>로 제공합니다.</p>
        <p>© 2026 LeeJungYeon</p>
      </div>
    </section>
    <p className="back-link"><button className="text-button" onClick={()=>navigate('download')}>← 데이터 다운로드로 돌아가기</button></p>
  </>
}

function PrivacyPolicy({ navigate }) {
  return <>
    <PageHeader eyebrow="공개 데이터" title="개인정보처리방침" description="Yumocha는 지역의 구조환경지표와 계획예산을 다루는 데이터 공개 프로젝트입니다."/>
    <section className="content-section">
      <div className="prose">
        <h3>수집하는 개인정보</h3>
        <p>본 사이트는 회원가입, 로그인, 문의 양식, 댓글 등 이용자로부터 개인정보를 직접 입력받는 기능을 제공하지 않습니다. 따라서 이름, 이메일, 전화번호 등 개인을 식별할 수 있는 정보를 수집하지 않습니다.</p>
        <h3>방문 기록 및 쿠키</h3>
        <p>본 사이트는 별도의 방문자 분석(애널리틱스) 스크립트나 광고 목적의 쿠키를 사용하지 않습니다. 정적 파일을 호스팅하는 배포 플랫폼(Vercel) 자체의 서버 접속 로그가 통상적인 수준으로 생성될 수 있으나, 이는 본 사이트가 직접 수집·처리하지 않습니다.</p>
        <h3>외부 링크</h3>
        <p>본 사이트의 다운로드·출처 페이지에는 원자료를 제공한 외부 기관의 웹사이트로 연결되는 링크가 포함될 수 있습니다. 이동한 외부 사이트에서의 개인정보 처리는 해당 사이트의 정책을 따릅니다.</p>
        <h3>문의</h3>
        <p>본 방침에 대한 문의는 <a href="https://github.com/JungYeoni/yumocha-web/issues" target="_blank" rel="noreferrer">GitHub 이슈</a>를 통해 남겨주십시오.</p>
        <h3>변경 이력</h3>
        <p>이 방침이 변경될 경우 이 문서를 통해 변경 사항을 반영합니다. 최종 수정일: 2026-07-27</p>
      </div>
    </section>
    <p className="back-link"><button className="text-button" onClick={()=>navigate('about')}>← 홈으로 돌아가기</button></p>
  </>
}

function Checksums({ navigate }) {
  return <>
    <PageHeader eyebrow="공개 데이터" title="체크섬" description="공개 파일의 무결성을 확인할 수 있는 SHA-256 체크섬입니다."><a className="primary" href="/SHA256SUMS.txt" download>SHA256SUMS.txt 다운로드 <span>↓</span></a></PageHeader>
    <Notice>현재 공개된 {files.filter(x=>x.status==='공개').length}개 파일의 SHA-256 체크섬이 <code>SHA256SUMS.txt</code>에 기록되어 있습니다.</Notice>
    <section className="checksum-list">
      {files.filter(x=>x.status==='공개').map(x=><article key={x.file}><strong>{x.file}</strong><code>{checksums[x.file]}</code></article>)}
    </section>
    <p className="back-link"><button className="text-button" onClick={()=>navigate('download')}>← 데이터 다운로드로 돌아가기</button></p>
  </>
}

function Sources({ navigate }) {
  const groups = [...new Set(sources.map(x => x.group))]
  return <>
    <PageHeader eyebrow="공개 데이터" title="원출처 목록" description={`이 프로젝트가 사용한 지표 ${sources.length}개의 공식 통계표·원자료 출처입니다. 링크는 원문 조회용이며, 원자료 자체를 재배포하지 않습니다.`}>
      <a className="primary" href="/SOURCES.csv" download>CSV로 다운로드 <span>↓</span></a>
    </PageHeader>
    <Notice>출처 링크는 팀이 자료 수집 시점(2026년 7월)에 확인한 주소입니다. 통계표 URL은 제공기관 개편으로 바뀔 수 있어, 접속이 안 되면 통계표명으로 다시 검색해 주세요.</Notice>
    {groups.map(group => <section className="source-group" key={group}>
      <h3>{group}</h3>
      <div className="source-list">
        {sources.filter(x => x.group === group).map(x => <article className="source-row" key={x.name}>
          <div><strong>{x.name}</strong><span className="muted">{x.provider}</span>{x.note && <span className="muted source-note">{x.note}</span>}</div>
          <span className="muted">{x.period}</span>
          <a href={x.url} target="_blank" rel="noreferrer">원문 보기 ↗</a>
        </article>)}
      </div>
    </section>)}
    <p className="back-link"><button className="text-button" onClick={()=>navigate('download')}>← 데이터 다운로드로 돌아가기</button></p>
  </>
}

function References({ navigate }) {
  const groups = [...new Set(references.map(x => x.group))]
  return <>
    <PageHeader eyebrow="연구 문서" title="참고문헌" description={`분석의 이론적 배경과 방법론을 구성하는 국내외 문헌 ${references.length}건입니다.`} />
    <Notice>참고문헌은 분석의 개념·방법론적 근거이며, 지표 산출에 직접 사용한 통계와 원자료는 <button className="text-button-inline" onClick={()=>navigate('sources')}>원출처 목록</button>에서 확인할 수 있습니다.</Notice>
    {groups.map(group => <section className="source-group" key={group}>
      <h3>{group}</h3>
      <div className="reference-list">
        {references.filter(x => x.group === group).map(x => <article className="reference-row" key={`${x.authors}-${x.year}-${x.title}`}>
          <span className="reference-year">{x.year}</span>
          <div><strong>{x.authors}</strong><p>{x.title}</p><span className="muted">{x.detail}</span></div>
          {x.url ? <a href={x.url} target="_blank" rel="noreferrer">DOI 보기 ↗</a> : <span className="muted reference-no-link">—</span>}
        </article>)}
      </div>
    </section>)}
    <p className="back-link"><button className="text-button" onClick={()=>navigate('about')}>← 프로젝트 소개로 돌아가기</button></p>
  </>
}

export default function App() {
  const getPage = () => location.hash.slice(1) || 'about'
  const [page, setPage] = useState(getPage)
  const [menu, setMenu] = useState(false)
  const [openGroup, setOpenGroup] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('yumocha-theme') || 'light')
  useEffect(() => { const onHash=()=>{setPage(getPage());setMenu(false);setOpenGroup(null);scrollTo(0,0)}; addEventListener('hashchange',onHash); return()=>removeEventListener('hashchange',onHash)},[])
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('yumocha-theme', theme) }, [theme])
  useEffect(() => {
    if (!openGroup) return
    const onClick = e => { if (!e.target.closest('.nav-group')) setOpenGroup(null) }
    addEventListener('click', onClick)
    return () => removeEventListener('click', onClick)
  }, [openGroup])
  const navigate = id => { location.hash = id }
  const Current = { about: About, 'structural-analysis': StructuralIndexAnalysis, 'fiscal-analysis': FiscalResponseAnalysis, 'relationship-analysis': RelationshipAnalysis, trends: Trends, structure: Structure, results: Results, quality: Quality, projects: ProjectList, download: Download, sources: Sources, references: References, license: DataLicense, 'content-license': ContentLicense, privacy: PrivacyPolicy, checksums: Checksums }[page] || About
  return <ThemeContext.Provider value={theme}><div className="site-shell">
    <a href="#main-content" className="skip-link">본문 바로가기</a>
    <header className="topbar"><div className="brand-lockup"><button className="brand" onClick={()=>navigate('about')} aria-label="Yumocha 홈"><span><img src="/logo.png" alt="" /></span><strong>Yumocha</strong></button><p className="competition-name"><span>2026년 기획예산처</span>재정데이터 분석 대학(원)생 경진대회</p></div>
      <nav className={menu?'open':''}>{pages.map(p => p.children
        ? <div className="nav-group" key={p.label}>
            <button className={p.children.some(c=>c.id===page)?'active':''} aria-haspopup="true" aria-expanded={openGroup===p.label} onClick={()=>setOpenGroup(openGroup===p.label?null:p.label)}>{p.label}<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>
            <div className={`nav-dropdown${openGroup===p.label?' open':''}`}>{p.children.map(c=><button className={page===c.id?'active':''} key={c.id} onClick={()=>navigate(c.id)}>{c.label}</button>)}</div>
          </div>
        : <button className={page===p.id?'active':''} key={p.id} onClick={()=>navigate(p.id)}>{p.label}</button>)}</nav>
      <button className="theme-toggle" onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-label={theme==='dark'?'기본 화면 모드로 전환':'선명한 화면 모드로 전환'}>
        {theme==='dark'
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></svg>}
      </button>
      <button className="menu-button" onClick={()=>setMenu(!menu)} aria-label="메뉴 열기">{menu?'×':'☰'}</button>
    </header>
    <main id="main-content" className={page==='about'?'home':''}><Current navigate={navigate}/></main>
    <footer>
      <div className="footer-top">
        <div className="footer-brand"><span><img src="/logo.png" alt="" /></span><div><strong>Yumocha</strong><p>지역의 조건과 재정대응을 함께 읽습니다.</p></div></div>
        <div className="footer-col">
          <h3>연락처</h3>
          <a href="https://github.com/JungYeoni/yumocha-web/issues" target="_blank" rel="noreferrer">GitHub 이슈로 문의 ↗</a>
        </div>
        <div className="footer-col">
          <h3>바로가기</h3>
          {flatPages.map(({id,label})=><button key={id} onClick={()=>navigate(id)}>{label}</button>)}
        </div>
        <div className="footer-col">
          <h3>관련 사이트</h3>
          <a href="https://github.com/JungYeoni/yumocha" target="_blank" rel="noreferrer">분석 저장소 ↗</a>
          <button onClick={()=>navigate('sources')}>원출처 목록</button>
          <button onClick={()=>navigate('references')}>참고문헌</button>
        </div>
      </div>
      <div className="footer-policy">
        <button onClick={()=>navigate('privacy')}><strong>개인정보처리방침</strong></button>
        <button onClick={()=>navigate('license')}>데이터 이용조건</button>
        <button onClick={()=>navigate('content-license')}>콘텐츠 이용조건</button>
        <button onClick={()=>navigate('checksums')}>체크섬</button>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Yumocha · 코드 MIT · 자체 콘텐츠 CC BY 4.0</p>
      </div>
    </footer>
  </div></ThemeContext.Provider>
}
