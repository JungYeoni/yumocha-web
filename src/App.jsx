import { useEffect, useState } from 'react'
import { Chart, Metric, Notice, PageHeader, plotLayout } from './components'
import { budgetRows, checksums, files, indicators, regions, sources, trendRows, years } from './data'
import { ThemeContext, useTheme, themeColors } from './theme'

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
        <h1>저출생 대응을<br/>예산 너머의 <em>조건</em>과<br/>함께 봅니다.</h1>
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
      <div><p className="eyebrow eyebrow-kr">프로젝트 배경</p><h2>숫자 하나로는<br/>지역을 설명할 수 없으니까</h2></div>
      <div className="prose"><p>출산율의 변화는 한 해의 예산만으로 설명되지 않습니다. 일자리, 주거, 돌봄 접근성, 인구구조처럼 오랜 시간 누적된 지역의 조건과 재정대응을 같은 화면에서 살펴봅니다.</p><p>Yumocha는 정책의 인과효과를 단정하지 않습니다. 재정대응 수준과 이후 변화 사이의 <strong>조건부·시차적 연관성</strong>을 탐색하고, 데이터의 빈틈과 해석의 한계도 함께 공개합니다.</p><p>공개된 지표 값을 그대로 옮기지 않고, 21개 구조환경지표를 원자료 기준으로 전수 재계산해 대조했습니다. 이 과정에서 산식이 다르게 적용된 사례 3건을 발견해 원자료 제공기관의 자료 수정으로 이어졌으며, 남은 지표도 결측·확인 필요 여부를 함께 표시합니다.</p></div>
    </section>
    <section className="principles">
      <article><span>구조환경</span><h3>구조환경</h3><p>지역 주민의 선택을 둘러싼 인구·경제·생활 인프라 조건을 21개 지표로 살펴봅니다.</p></article>
      <article><span>재정대응</span><h3>재정대응</h3><p>시행계획에 기재된 당해연도 계획예산의 규모와 정책영역별 구성을 비교합니다.</p></article>
      <article><span>시차적 연관성</span><h3>시차적 연관성</h3><p>재정대응 이후 1년·2년의 지표 변화가 어떤 관계를 보이는지 신중하게 해석합니다.</p></article>
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
  const c = themeColors[useTheme()]
  const isReal = indicator === 'fertility'
  return <>
    <PageHeader eyebrow="탐색 01" title="지역·연도 추세" description="지역의 시간적 변화와 17개 시도의 상대적 위치를 함께 살펴보세요."/>
    <div className="filter-bar">
      <label>지역<select value={region} onChange={e => setRegion(e.target.value)}>{regions.map(x => <option key={x}>{x}</option>)}</select></label>
      <label>지표<select value={indicator} onChange={e => setIndicator(e.target.value)}>{indicators.map(x => <option value={x.value} key={x.value}>{x.label}</option>)}</select></label>
      <div className="legend"><span className="dot plan3"/>제3차 기본계획<span className="dot plan4"/>제4차 기본계획</div>
    </div>
    <div className="dashboard-grid">
      <section className="panel chart-panel wide">
        <div className="panel-head"><div><p className="eyebrow">{region} · 2016–2024</p><h2>{meta.label} 추세</h2></div><div className="value-chip"><strong>{last[indicator]}</strong> {meta.unit}<small>{last.year} {isReal ? '통계청 공표값' : '구조 검증용 샘플'}</small></div></div>
        <Chart ariaLabel={`${region} ${meta.label} 연도별 추세`} data={[{
          x: years, y: selected.map(x => x[indicator]), type: 'scatter', mode: 'lines+markers',
          line: { color: c.accent, width: 3 }, marker: { color: selected.map(x => x.quality === '검증 완료' ? c.accent : '#fff'), line: {color:c.accent, width:2}, size: 8 },
          hovertemplate: `%{x}년<br>%{y} ${meta.unit}<extra>${region}</extra>`,
        }]} layout={{ height: 350, shapes: [{type:'rect', x0:2015.5, x1:2020.5, y0:0, y1:1, yref:'paper', fillcolor:c.zoneA, line:{width:0}, layer:'below'}, {type:'rect', x0:2020.5, x1:2024.5, y0:0, y1:1, yref:'paper', fillcolor:c.zoneB, line:{width:0}, layer:'below'}], xaxis:{dtick:1, fixedrange:true}, yaxis:{ticksuffix: meta.unit === '%' ? '%' : '', fixedrange:true, rangemode:'tozero'}, showlegend:false }}/>
      </section>
      <aside className="panel insight-panel"><p className="eyebrow eyebrow-kr">변화</p><strong className="big-change">{(last[indicator] - first[indicator]).toFixed(meta.unit === '%' ? 1 : 2)}<small>{meta.unit}</small></strong><p>2016년 대비 2024년 변화</p><hr/><p className="muted">{meta.description}</p><div className="quality-key"><span>●</span> 검증 완료 <span className="hollow">●</span> 확인 필요</div></aside>
      <section className="panel chart-panel wide"><div className="panel-head"><div><p className="eyebrow eyebrow-kr">17개 시도 · 2024</p><h2>시도 비교</h2></div></div>
        <Chart ariaLabel={`17개 시도 ${meta.label} 비교`} data={[{type:'bar', x: regions, y: regions.map(r => trendRows.find(x => x.region === r && x.year === 2024)[indicator]), marker:{color:regions.map(r => r === region ? c.accent : c.mutedBar)}, hovertemplate:`%{x}<br>%{y} ${meta.unit}<extra></extra>`}]} layout={{height:310, xaxis:{tickangle:-35, fixedrange:true}, yaxis:{rangemode:'tozero', fixedrange:true}, showlegend:false}}/>
      </section>
    </div>
    {isReal
      ? <Notice>합계출산율은 통계청이 공표한 지역·연도별 실측치입니다. 나머지 두 지표(청년고용률, 보육시설 보급률)는 21개 구조환경지표 정제본 공개 전까지 <strong>UI 구조 검증용 합성 샘플</strong>로 표시됩니다.</Notice>
      : <Notice type="warn">현재 선택한 지표의 수치는 <strong>UI 구조 검증용 합성 샘플</strong>입니다. 검증 완료 데이터 연결 전에는 연구 결과로 인용할 수 없습니다. 결측값은 0으로 대체하거나 선으로 잇지 않습니다.</Notice>}
  </>
}

function Structure() {
  const sorted = [...budgetRows].sort((a,b) => b.budget-a.budget)
  const c = themeColors[useTheme()]
  return <>
    <PageHeader eyebrow="탐색 02" title="구조환경·재정 현황" description="지역의 구조적 여건과 계획예산의 규모·구성을 나란히 비교합니다."/>
    <div className="metric-row"><Metric label="분석 지역" value="17" sub="전국 광역 시도"/><Metric label="구조환경지표" value="21" sub="원자료 검증 완료"/><Metric label="예산 기준" value="당해예산" sub="전년도예산 제외"/><Metric label="데이터 기간" value="9년" sub="2016–2024"/></div>
    <section className="panel chart-panel">
      <div className="panel-head"><div><p className="eyebrow eyebrow-kr">계획예산</p><h2>지역별 계획예산 비교</h2></div><p className="muted">단위: 억 원 · 구조 검증용 샘플</p></div>
      <Chart ariaLabel="지역별 계획예산 막대 차트" data={[{type:'bar', orientation:'h', y:sorted.map(x=>x.region).reverse(), x:sorted.map(x=>x.budget).reverse(), marker:{color:sorted.map((_,i)=>`rgba(${c.accentRgb}, ${.42 + i/40})`).reverse()}, hovertemplate:'%{y}<br>%{x:,.0f}억 원<extra></extra>'}]} layout={{height:500, margin:{...plotLayout.margin,l:45}, xaxis:{tickformat:',', fixedrange:true}, yaxis:{fixedrange:true}, showlegend:false}}/>
    </section>
    <section className="panel chart-panel">
      <div className="panel-head"><div><p className="eyebrow eyebrow-kr">정책영역 구성</p><h2>정책영역별 예산 구성</h2></div></div>
      <Chart ariaLabel="지역별 정책영역 예산 구성 차트" data={[
        ['가족지원','family',1],['돌봄·교육','care',.7],['주거','housing',.45],['일·생활 균형','work',.22]
      ].map(([name,key,alpha])=>({type:'bar', name, x:regions, y:budgetRows.map(x=>x[key]), marker:{color:`rgba(${c.accentRgb},${alpha})`}, hovertemplate:`%{x}<br>${name} %{y}%<extra></extra>`}))} layout={{height:360,barmode:'stack',xaxis:{tickangle:-35,fixedrange:true},yaxis:{ticksuffix:'%',range:[0,100],fixedrange:true},legend:{orientation:'h',y:1.15,x:0}}}/>
    </section>
    <Notice type="warn">계획예산은 사업 추진 의지와 재정 규모를 보여주는 행정계획상 수치이며, 실제 집행액이나 정책효과를 의미하지 않습니다. 시행계획 문서의 '당해예산'은 연초에 편성한 본예산이며, 추경·이월을 반영해 연말에 확정되는 최종 집행 예산과는 다릅니다. 본 사이트는 각 연도 시행계획의 당해예산(본예산)만 합산하며, 다음 연도 문서에 기재된 전년도예산(최종예산)은 사업 폐지·명칭 변경 시 누락될 수 있어 사용하지 않습니다.</Notice>
  </>
}

function Results() {
  const coef = [{lag:'1년 시차',x:.018,lo:-.012,hi:.048},{lag:'2년 시차',x:.031,lo:-.006,hi:.068}]
  const c = themeColors[useTheme()]
  return <>
    <PageHeader eyebrow="분석" title="분석 결과" description="재정대응 수준과 이후 합계출산율 변화의 조건부·시차적 연관성을 살펴봅니다."><span className="status-pill">결과 연결 대기</span></PageHeader>
    <Notice>회귀모형과 종합지수 확정 후 검증된 결과가 이 페이지에 연결됩니다. 아래 구성은 결과 표시 방식의 미리보기이며 계수는 설명용 가상값입니다.</Notice>
    <div className="metric-row"><Metric label="분석 단위" value="지역 × 연도" sub="패널 데이터"/><Metric label="시차 설정" value="t+1 · t+2" sub="1년·2년 후 변화"/><Metric label="추정 대상" value="조건부 연관성" sub="인과효과 아님"/></div>
    <div className="results-grid">
      <section className="panel chart-panel"><div className="panel-head"><div><p className="eyebrow eyebrow-kr">회귀계수 플롯</p><h2>핵심 회귀계수와 95% 신뢰구간</h2></div></div>
        <Chart ariaLabel="회귀계수와 신뢰구간 예시" data={[{type:'scatter',mode:'markers',y:coef.map(x=>x.lag),x:coef.map(x=>x.x),error_x:{type:'data',symmetric:false,array:coef.map(x=>x.hi-x.x),arrayminus:coef.map(x=>x.x-x.lo),color:c.accent,thickness:2,width:5},marker:{size:12,color:c.accent},hovertemplate:'%{y}<br>계수 %{x:.3f}<extra>설명용 가상값</extra>'}]} layout={{height:300,shapes:[{type:'line',x0:0,x1:0,y0:-.5,y1:1.5,line:{color:c.line,dash:'dot'}}],xaxis:{title:'표준화 회귀계수',fixedrange:true},yaxis:{fixedrange:true},showlegend:false}}/>
      </section>
      <aside className="panel reading-guide"><p className="eyebrow eyebrow-kr">읽는 법</p><h2>어떻게 읽나요?</h2><ol><li><strong>점</strong>은 추정된 연관성의 방향과 크기를 나타냅니다.</li><li><strong>가로선</strong>은 95% 신뢰구간입니다.</li><li>신뢰구간이 0을 포함하면 통계적 불확실성이 큽니다.</li></ol></aside>
    </div>
    <section className="limitations"><div><p className="eyebrow eyebrow-kr">해석</p><h2>숫자보다 먼저<br/>확인할 것</h2></div><ul><li>관찰자료 분석은 미측정 교란과 역인과 가능성을 배제하지 못합니다.</li><li>계획예산은 실제 집행 시점·규모와 다를 수 있습니다.</li><li>지역별 정책 구성과 대상 집단의 차이를 계수 하나로 환원할 수 없습니다.</li><li>전국 공표값과 17개 시도의 단순평균은 구분해 표시합니다.</li><li>다년도로 관측치를 늘려도 같은 지역의 인접 연도 값은 서로 비슷해(자기상관), 분석의 실질 정보량은 지역 수 17개에 가깝습니다.</li></ul></section>
  </>
}

function Download({ navigate }) {
  return <>
    <PageHeader eyebrow="공개 데이터" title="데이터 다운로드" description="분석에 사용한 집계 데이터와 품질 정보를 버전 단위로 공개합니다."><div className="version-card"><span>최신 버전</span><strong>v0.1.0 · 부분 공개</strong><small>생성일 2026-07-27</small></div></PageHeader>
    <Notice type="warn">계획예산·QA 집계 등 이 프로젝트가 직접 생성한 파일부터 우선 공개합니다. 21개 구조환경지표의 원자료 측정값이 포함된 정제본은 원출처별 재배포 조건 확인이 끝날 때까지 공개하지 않습니다.</Notice>
    <section className="download-list">
      <div className="download-head"><span>파일</span><span>행 수</span><span>크기</span><span>상태</span></div>
      {files.map(x=>{
        const ready = x.status === '공개'
        const Row = ready ? 'a' : 'article'
        return <Row key={x.file} className={ready?'downloadable':''} {...(ready?{href:`/${x.file}`,download:true}:{})}><div><span className="file-icon">↓</span><div><strong>{x.name}</strong><code>{x.file}</code><p>{x.description}</p></div></div><span>{x.rows}</span><span>{x.size}</span><span className={ready?'file-status ready':'file-status'}>{x.status}</span></Row>
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
    <Notice>현재 공개된 4개 파일의 SHA-256 체크섬이 <code>SHA256SUMS.txt</code>에 기록되어 있습니다. 남은 파일은 공개되는 대로 추가됩니다.</Notice>
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
          <div><strong>{x.name}</strong><span className="muted">{x.provider}</span></div>
          <span className="muted">{x.period}</span>
          <a href={x.url} target="_blank" rel="noreferrer">원문 보기 ↗</a>
        </article>)}
      </div>
    </section>)}
    <p className="back-link"><button className="text-button" onClick={()=>navigate('download')}>← 데이터 다운로드로 돌아가기</button></p>
  </>
}

export default function App() {
  const getPage = () => location.hash.slice(1) || 'about'
  const [page, setPage] = useState(getPage)
  const [menu, setMenu] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('yumocha-theme') || 'light')
  useEffect(() => { const onHash=()=>{setPage(getPage());setMenu(false);scrollTo(0,0)}; addEventListener('hashchange',onHash); return()=>removeEventListener('hashchange',onHash)},[])
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('yumocha-theme', theme) }, [theme])
  const navigate = id => { location.hash = id }
  const Current = { about: About, trends: Trends, structure: Structure, results: Results, download: Download, sources: Sources, license: DataLicense, 'content-license': ContentLicense, privacy: PrivacyPolicy, checksums: Checksums }[page] || About
  return <ThemeContext.Provider value={theme}><div className="site-shell">
    <a href="#main-content" className="skip-link">본문 바로가기</a>
    <header className="topbar"><button className="brand" onClick={()=>navigate('about')} aria-label="Yumocha 홈"><span><img src="/logo.png" alt="" /></span><strong>Yumocha</strong></button>
      <nav className={menu?'open':''}>{pages.map(([id,label])=><button className={page===id?'active':''} key={id} onClick={()=>navigate(id)}>{label}</button>)}</nav>
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
          {pages.map(([id,label])=><button key={id} onClick={()=>navigate(id)}>{label}</button>)}
        </div>
        <div className="footer-col">
          <h3>관련 사이트</h3>
          <a href="https://github.com/JungYeoni/yumocha" target="_blank" rel="noreferrer">분석 저장소 ↗</a>
          <button onClick={()=>navigate('sources')}>원출처 목록</button>
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
