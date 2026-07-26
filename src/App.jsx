import { useEffect, useState } from 'react'
import { Chart, Metric, Notice, PageHeader, plotLayout } from './components'
import { budgetRows, files, indicators, regions, trendRows, years } from './data'

const pages = [
  ['about', '프로젝트 소개'],
  ['trends', '지역·연도 추세'],
  ['structure', '구조환경·재정'],
  ['results', '분석 결과'],
  ['download', '데이터 다운로드'],
]

function About({ navigate }) {
  return <>
    <section className="hero">
      <div>
        <p className="eyebrow eyebrow-kr">지역의 조건을 읽는 데이터 프로젝트</p>
        <h1>저출생 대응을<br/><em>예산 너머의 조건</em>과 함께 봅니다.</h1>
        <p className="lede">2016–2024년 17개 시도의 구조적 여건과 시행계획상 계획예산을 연결해, 지역마다 다른 변화의 맥락을 탐색합니다.</p>
        <div className="hero-actions"><button className="primary" onClick={() => navigate('trends')}>데이터 둘러보기 <span>→</span></button><button className="text-button" onClick={() => navigate('download')}>데이터 내려받기</button></div>
      </div>
      <div className="hero-visual" aria-label="17개 시도와 9개 연도를 나타내는 추상 시각화">
        <span className="orbit orbit-one"/><span className="orbit orbit-two"/>
        <div className="hero-number"><strong>17</strong><span>개 시도</span></div>
        <div className="year-range"><span>2016</span><i/><span>2024</span></div>
        <div className="dot-field">{Array.from({length: 17}, (_, i) => <i key={i} style={{'--i': i}} />)}</div>
      </div>
    </section>
    <section className="summary-strip">
      <div><span>01</span><strong>9개년</strong><p>제3·4차 저출산·고령사회 기본계획 기간</p></div>
      <div><span>02</span><strong>21개 지표</strong><p>인구·주거·고용·돌봄 등 구조환경지표</p></div>
      <div><span>03</span><strong>계획예산</strong><p>실제 집행액이 아닌 시행계획 기재 예산</p></div>
    </section>
    <section className="content-section two-col">
      <div><p className="eyebrow">WHY YUMOCHA</p><h2>숫자 하나로는<br/>지역을 설명할 수 없으니까</h2></div>
      <div className="prose"><p>출산율의 변화는 한 해의 예산만으로 설명되지 않습니다. 일자리, 주거, 돌봄 접근성, 인구구조처럼 오랜 시간 누적된 지역의 조건과 재정대응을 같은 화면에서 살펴봅니다.</p><p>Yumocha는 정책의 인과효과를 단정하지 않습니다. 재정대응 수준과 이후 변화 사이의 <strong>조건부·시차적 연관성</strong>을 탐색하고, 데이터의 빈틈과 해석의 한계도 함께 공개합니다.</p></div>
    </section>
    <section className="principles">
      <article><span>STRUCTURE</span><h3>구조환경</h3><p>지역 주민의 선택을 둘러싼 인구·경제·생활 인프라 조건을 21개 지표로 살펴봅니다.</p></article>
      <article><span>RESPONSE</span><h3>재정대응</h3><p>시행계획에 기재된 당해연도 계획예산의 규모와 정책영역별 구성을 비교합니다.</p></article>
      <article><span>ASSOCIATION</span><h3>시차적 연관성</h3><p>재정대응 이후 1년·2년의 지표 변화가 어떤 관계를 보이는지 신중하게 해석합니다.</p></article>
    </section>
    <Notice type="warn">본 사이트의 예산은 실제 집행액이 아닌 <strong>시행계획상 계획예산</strong>입니다. 분석 결과는 인과효과가 아니라 관찰자료에 기반한 조건부 연관성입니다.</Notice>
  </>
}

function Trends() {
  const [region, setRegion] = useState('서울')
  const [indicator, setIndicator] = useState('fertility')
  const meta = indicators.find(x => x.value === indicator)
  const selected = trendRows.filter(x => x.region === region)
  const last = selected.at(-1)
  const first = selected[0]
  return <>
    <PageHeader eyebrow="EXPLORE 01" title="지역·연도 추세" description="지역의 시간적 변화와 17개 시도의 상대적 위치를 함께 살펴보세요."/>
    <div className="filter-bar">
      <label>지역<select value={region} onChange={e => setRegion(e.target.value)}>{regions.map(x => <option key={x}>{x}</option>)}</select></label>
      <label>지표<select value={indicator} onChange={e => setIndicator(e.target.value)}>{indicators.map(x => <option value={x.value} key={x.value}>{x.label}</option>)}</select></label>
      <div className="legend"><span className="dot plan3"/>제3차 기본계획<span className="dot plan4"/>제4차 기본계획</div>
    </div>
    <div className="dashboard-grid">
      <section className="panel chart-panel wide">
        <div className="panel-head"><div><p className="eyebrow">{region} · 2016–2024</p><h2>{meta.label} 추세</h2></div><div className="value-chip"><strong>{last[indicator]}</strong> {meta.unit}<small>2024 구조 검증용 샘플</small></div></div>
        <Chart ariaLabel={`${region} ${meta.label} 연도별 추세`} data={[{
          x: years, y: selected.map(x => x[indicator]), type: 'scatter', mode: 'lines+markers',
          line: { color: '#cb1dd4', width: 3 }, marker: { color: selected.map(x => x.quality === '검증 완료' ? '#cb1dd4' : '#fff'), line: {color:'#cb1dd4', width:2}, size: 8 },
          hovertemplate: `%{x}년<br>%{y} ${meta.unit}<extra>${region}</extra>`,
        }]} layout={{ height: 350, shapes: [{type:'rect', x0:2015.5, x1:2020.5, y0:0, y1:1, yref:'paper', fillcolor:'#eef1fb', line:{width:0}, layer:'below'}, {type:'rect', x0:2020.5, x1:2024.5, y0:0, y1:1, yref:'paper', fillcolor:'#faeef9', line:{width:0}, layer:'below'}], xaxis:{dtick:1, fixedrange:true}, yaxis:{ticksuffix: meta.unit === '%' ? '%' : '', fixedrange:true, rangemode:'tozero'}, showlegend:false }}/>
      </section>
      <aside className="panel insight-panel"><p className="eyebrow">CHANGE</p><strong className="big-change">{(last[indicator] - first[indicator]).toFixed(meta.unit === '%' ? 1 : 2)}<small>{meta.unit}</small></strong><p>2016년 대비 2024년 변화</p><hr/><p className="muted">{meta.description}</p><div className="quality-key"><span>●</span> 검증 완료 <span className="hollow">●</span> 확인 필요</div></aside>
      <section className="panel chart-panel wide"><div className="panel-head"><div><p className="eyebrow">17 REGIONS · 2024</p><h2>시도 비교</h2></div></div>
        <Chart ariaLabel={`17개 시도 ${meta.label} 비교`} data={[{type:'bar', x: regions, y: regions.map(r => trendRows.find(x => x.region === r && x.year === 2024)[indicator]), marker:{color:regions.map(r => r === region ? '#cb1dd4':'#a9b4c9')}, hovertemplate:`%{x}<br>%{y} ${meta.unit}<extra></extra>`}]} layout={{height:310, xaxis:{tickangle:-35, fixedrange:true}, yaxis:{rangemode:'tozero', fixedrange:true}, showlegend:false}}/>
      </section>
    </div>
    <Notice type="warn">현재 화면의 수치는 <strong>UI 구조 검증용 합성 샘플</strong>입니다. 검증 완료 데이터 연결 전에는 연구 결과로 인용할 수 없습니다. 결측값은 0으로 대체하거나 선으로 잇지 않습니다.</Notice>
  </>
}

function Structure() {
  const sorted = [...budgetRows].sort((a,b) => b.budget-a.budget)
  return <>
    <PageHeader eyebrow="EXPLORE 02" title="구조환경·재정 현황" description="지역의 구조적 여건과 계획예산의 규모·구성을 나란히 비교합니다."/>
    <div className="metric-row"><Metric label="분석 지역" value="17" sub="전국 광역 시도"/><Metric label="구조환경지표" value="21" sub="원자료 검증 완료"/><Metric label="예산 기준" value="당해예산" sub="전년도예산 제외"/><Metric label="데이터 기간" value="9년" sub="2016–2024"/></div>
    <section className="panel chart-panel">
      <div className="panel-head"><div><p className="eyebrow">PLANNED BUDGET</p><h2>지역별 계획예산 비교</h2></div><p className="muted">단위: 억 원 · 구조 검증용 샘플</p></div>
      <Chart ariaLabel="지역별 계획예산 막대 차트" data={[{type:'bar', orientation:'h', y:sorted.map(x=>x.region).reverse(), x:sorted.map(x=>x.budget).reverse(), marker:{color:sorted.map((_,i)=>`rgba(36, 55, 123, ${.42 + i/40})`).reverse()}, hovertemplate:'%{y}<br>%{x:,.0f}억 원<extra></extra>'}]} layout={{height:500, margin:{...plotLayout.margin,l:45}, xaxis:{tickformat:',', fixedrange:true}, yaxis:{fixedrange:true}, showlegend:false}}/>
    </section>
    <section className="panel chart-panel">
      <div className="panel-head"><div><p className="eyebrow">POLICY MIX</p><h2>정책영역별 예산 구성</h2></div></div>
      <Chart ariaLabel="지역별 정책영역 예산 구성 차트" data={[
        ['가족지원','family','#24377b'],['돌봄·교육','care','#697ec4'],['주거','housing','#cb1dd4'],['일·생활 균형','work','#b87fb1']
      ].map(([name,key,color])=>({type:'bar', name, x:regions, y:budgetRows.map(x=>x[key]), marker:{color}, hovertemplate:`%{x}<br>${name} %{y}%<extra></extra>`}))} layout={{height:360,barmode:'stack',xaxis:{tickangle:-35,fixedrange:true},yaxis:{ticksuffix:'%',range:[0,100],fixedrange:true},legend:{orientation:'h',y:1.15,x:0}}}/>
    </section>
    <Notice type="warn">계획예산은 사업 추진 의지와 재정 규모를 보여주는 행정계획상 수치이며, 실제 집행액이나 정책효과를 의미하지 않습니다.</Notice>
  </>
}

function Results() {
  const coef = [{lag:'1년 시차',x:.018,lo:-.012,hi:.048},{lag:'2년 시차',x:.031,lo:-.006,hi:.068}]
  return <>
    <PageHeader eyebrow="ANALYSIS" title="분석 결과" description="재정대응 수준과 이후 합계출산율 변화의 조건부·시차적 연관성을 살펴봅니다."><span className="status-pill">결과 연결 대기</span></PageHeader>
    <Notice>회귀모형과 종합지수 확정 후 검증된 결과가 이 페이지에 연결됩니다. 아래 구성은 결과 표시 방식의 미리보기이며 계수는 설명용 가상값입니다.</Notice>
    <div className="metric-row"><Metric label="분석 단위" value="지역 × 연도" sub="패널 데이터"/><Metric label="시차 설정" value="t+1 · t+2" sub="1년·2년 후 변화"/><Metric label="추정 대상" value="조건부 연관성" sub="인과효과 아님"/></div>
    <div className="results-grid">
      <section className="panel chart-panel"><div className="panel-head"><div><p className="eyebrow">COEFFICIENT PLOT</p><h2>핵심 회귀계수와 95% 신뢰구간</h2></div></div>
        <Chart ariaLabel="회귀계수와 신뢰구간 예시" data={[{type:'scatter',mode:'markers',y:coef.map(x=>x.lag),x:coef.map(x=>x.x),error_x:{type:'data',symmetric:false,array:coef.map(x=>x.hi-x.x),arrayminus:coef.map(x=>x.x-x.lo),color:'#cb1dd4',thickness:2,width:5},marker:{size:12,color:'#cb1dd4'},hovertemplate:'%{y}<br>계수 %{x:.3f}<extra>설명용 가상값</extra>'}]} layout={{height:300,shapes:[{type:'line',x0:0,x1:0,y0:-.5,y1:1.5,line:{color:'#8a94a8',dash:'dot'}}],xaxis:{title:'표준화 회귀계수',fixedrange:true},yaxis:{fixedrange:true},showlegend:false}}/>
      </section>
      <aside className="panel reading-guide"><p className="eyebrow">HOW TO READ</p><h2>어떻게 읽나요?</h2><ol><li><strong>점</strong>은 추정된 연관성의 방향과 크기를 나타냅니다.</li><li><strong>가로선</strong>은 95% 신뢰구간입니다.</li><li>신뢰구간이 0을 포함하면 통계적 불확실성이 큽니다.</li></ol></aside>
    </div>
    <section className="limitations"><div><p className="eyebrow">INTERPRETATION</p><h2>숫자보다 먼저<br/>확인할 것</h2></div><ul><li>관찰자료 분석은 미측정 교란과 역인과 가능성을 배제하지 못합니다.</li><li>계획예산은 실제 집행 시점·규모와 다를 수 있습니다.</li><li>지역별 정책 구성과 대상 집단의 차이를 계수 하나로 환원할 수 없습니다.</li><li>전국 공표값과 17개 시도의 단순평균은 구분해 표시합니다.</li></ul></section>
  </>
}

function Download() {
  return <>
    <PageHeader eyebrow="OPEN DATA" title="데이터 다운로드" description="분석에 사용한 집계 데이터와 품질 정보를 버전 단위로 공개합니다."><div className="version-card"><span>LATEST VERSION</span><strong>출시 준비 중</strong><small>생성일 —</small></div></PageHeader>
    <Notice type="warn">원문이 대량 포함된 전체 정제본은 원출처별 재배포 조건 감사가 끝날 때까지 공개하지 않습니다.</Notice>
    <section className="download-list">
      <div className="download-head"><span>파일</span><span>행 수</span><span>크기</span><span>상태</span></div>
      {files.map(x=><article key={x.file}><div><span className="file-icon">↓</span><div><strong>{x.name}</strong><code>{x.file}</code><p>{x.description}</p></div></div><span>{x.rows}</span><span>{x.size}</span><span className="file-status">{x.status}</span></article>)}
    </section>
    <section className="license-box"><div><p className="eyebrow">DATA USE</p><h2>데이터 이용조건</h2></div><div><p>프로젝트가 독자적으로 생성한 데이터 구조, 품질 플래그, 집계값 및 분석 결과는 별도 표시가 없는 한 <strong>CC BY 4.0</strong>으로 제공합니다.</p><p>원자료에서 유래한 항목의 권리는 각 제공기관에 있으며 원출처 이용조건이 우선 적용됩니다. 본 데이터는 공공기관의 공식 승인이나 보증을 의미하지 않습니다.</p><div className="inline-links"><a href="/DATA_LICENSE.md">데이터 이용조건</a><a href="/SOURCES.csv">원출처 목록</a><a href="/SHA256SUMS.txt">체크섬</a></div></div></section>
  </>
}

export default function App() {
  const getPage = () => location.hash.slice(1) || 'about'
  const [page, setPage] = useState(getPage)
  const [menu, setMenu] = useState(false)
  useEffect(() => { const onHash=()=>{setPage(getPage());setMenu(false);scrollTo(0,0)}; addEventListener('hashchange',onHash); return()=>removeEventListener('hashchange',onHash)},[])
  const navigate = id => { location.hash = id }
  const Current = { about: About, trends: Trends, structure: Structure, results: Results, download: Download }[page] || About
  return <div className="site-shell">
    <header className="topbar"><button className="brand" onClick={()=>navigate('about')} aria-label="Yumocha 홈"><span>Y</span><strong>Yumocha</strong></button>
      <nav className={menu?'open':''}>{pages.map(([id,label])=><button className={page===id?'active':''} key={id} onClick={()=>navigate(id)}>{label}</button>)}</nav>
      <button className="menu-button" onClick={()=>setMenu(!menu)} aria-label="메뉴 열기">{menu?'×':'☰'}</button>
    </header>
    <main className={page==='about'?'home':''}><Current navigate={navigate}/></main>
    <footer><div className="footer-brand"><span>Y</span><div><strong>Yumocha</strong><p>지역의 조건과 재정대응을 함께 읽습니다.</p></div></div><div><p>코드 MIT · 자체 콘텐츠 CC BY 4.0</p><a href="https://github.com/JungYeoni/yumocha" target="_blank" rel="noreferrer">분석 저장소 ↗</a></div></footer>
  </div>
}
