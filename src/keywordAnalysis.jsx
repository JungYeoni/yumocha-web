import { useEffect, useState } from 'react'
import { Notice } from './components'

const views = {
  name: {
    label: '세부사업명',
    title: '세부사업명에서 두드러진 핵심어',
    description: '사업의 명칭에 반복적으로 드러나는 정책 대상과 지원 수단을 세부영역별로 살펴봅니다.',
    src: '/analysis/keyword-business-name-wordcloud.png',
    data: '/analysis/keyword-business-name.csv',
    alt: '2016년부터 2024년까지 세부영역별 세부사업명 TF-IDF 핵심어 워드클라우드',
  },
  content: {
    label: '주요내용',
    title: '주요내용에서 두드러진 핵심어',
    description: '사업 설명에 나타난 실제 지원 대상과 제공 방식의 언어적 특징을 세부영역별로 살펴봅니다.',
    src: '/analysis/keyword-main-content-wordcloud.png',
    data: '/analysis/keyword-main-content.csv',
    alt: '2016년부터 2024년까지 세부영역별 주요내용 TF-IDF 핵심어 워드클라우드',
  },
}

export function KeywordAnalysisSection() {
  const [view, setView] = useState('name')
  const [keywordRows, setKeywordRows] = useState([])
  const [subarea, setSubarea] = useState('')
  const current = views[view]
  const subareas = [...new Set(keywordRows.map(row => row.subarea))]
  const selectedRows = keywordRows.filter(row => row.subarea === subarea)
  const scores = selectedRows.map(row => row.score)
  const minScore = Math.min(...scores)
  const maxScore = Math.max(...scores)

  useEffect(() => {
    let active = true
    fetch(current.data)
      .then(response => response.text())
      .then(text => {
        if (!active) return
        const rows = text.trim().split(/\r?\n/).slice(1).map(line => {
          const [area, rank, word, score, documents, totalDocuments] = line.split(',')
          return { subarea: area, rank: Number(rank), word, score: Number(score), documents: Number(documents), totalDocuments: Number(totalDocuments) }
        })
        setKeywordRows(rows)
        setSubarea(rows[0]?.subarea || '')
      })
    return () => { active = false }
  }, [current.data])

  return <>
    <h2 className="analysis-section-title">저출생 대응 세부사업 핵심어</h2>
    <p className="analysis-section-description">2016–2024년 17개 시도의 저출생 대응 세부사업을 바탕으로, 사업명과 주요내용에서 영역별로 상대적으로 두드러지는 단어를 살펴봅니다.</p>

    <section className="keyword-summary" aria-label="분석 개요">
      <div><strong>2016–2024</strong><span>분석 기간</span></div>
      <div><strong>57,979건</strong><span>핵심어 분석 입력</span></div>
      <div><strong>12개</strong><span>출생환경 세부영역</span></div>
      <div><strong>상위 20개</strong><span>영역별 핵심어</span></div>
    </section>

    <Notice>워드클라우드의 글자 크기는 해당 세부영역에서 상대적으로 두드러진 <strong>평균 TF-IDF 점수</strong>를 나타냅니다. 정책의 중요도·예산 규모·효과를 의미하지 않습니다.</Notice>

    <section className="keyword-explorer">
      <div className="keyword-tabs" role="tablist" aria-label="분석 텍스트 선택">
        {Object.entries(views).map(([key, item]) => <button
          key={key}
          type="button"
          role="tab"
          aria-selected={view === key}
          className={view === key ? 'active' : ''}
          onClick={() => setView(key)}
        >{item.label}</button>)}
      </div>

      <article className="keyword-figure" role="tabpanel">
        <div className="keyword-figure-head">
          <div><p className="eyebrow eyebrow-kr">{current.label} 분석</p><h2>{current.title}</h2><p>{current.description}</p></div>
          <a href={current.src} target="_blank" rel="noreferrer">전체 이미지 크게 보기 ↗</a>
        </div>
        <a className="keyword-image-link" href={current.src} target="_blank" rel="noreferrer" aria-label={`${current.title} 원본 이미지 열기`}>
          <img src={current.src} alt={current.alt} loading="lazy" />
        </a>
        <p className="keyword-caption">각 영역 안에서 글자가 클수록 그 영역의 사업 문서에서 상대적으로 특징적인 단어입니다. 단어의 정확한 점수나 영역 간 크기를 직접 비교하는 용도로는 사용하지 않습니다.</p>

        <section className="keyword-detail" aria-label={`${current.label} 세부영역별 핵심어 탐색`}>
          <div className="keyword-detail-head">
            <div><p className="eyebrow eyebrow-kr">세부영역 탐색</p><h3>영역을 선택해 핵심어를 자세히 보세요</h3><p>전체 이미지와 같은 결과를 영역별 워드클라우드와 순위 목록으로 나누어 보여줍니다.</p></div>
            <label>세부영역<select value={subarea} onChange={event => setSubarea(event.target.value)}>{subareas.map(area => <option key={area}>{area}</option>)}</select></label>
          </div>
          <div className="keyword-detail-grid">
            <div className="keyword-cloud" aria-label={`${subarea} 워드클라우드`}>
              {selectedRows.map((row, index) => {
                const ratio = maxScore === minScore ? 0.5 : (row.score - minScore) / (maxScore - minScore)
                return <span key={row.word} className={`keyword-tone-${index % 5}`} style={{ fontSize: `${17 + ratio * 31}px`, fontWeight: 550 + Math.round(ratio * 250) }} title={`평균 TF-IDF ${row.score.toFixed(4)}`}>{row.word}</span>
              })}
            </div>
            <div className="keyword-list-wrap">
              <h4>{subarea} 상위 핵심어</h4>
              <ol className="keyword-list">{selectedRows.map(row => <li key={row.word}><span>{row.word}</span><small>{row.documents.toLocaleString()}개 문서</small></li>)}</ol>
            </div>
          </div>
        </section>
      </article>
    </section>

    <section className="keyword-reading">
      <div><p className="eyebrow eyebrow-kr">해석 안내</p><h2>두 결과를 함께 읽어주세요</h2></div>
      <div>
        <p><strong>세부사업명</strong>은 정책이 표면적으로 내세우는 대상과 수단을, <strong>주요내용</strong>은 실제 사업 설명에 나타나는 지원 방식과 대상을 보여줍니다.</p>
        <p>두 결과의 차이를 살펴보면 사업 명칭과 구체적인 설명에서 강조되는 정책 언어가 어떻게 다른지 탐색할 수 있습니다.</p>
      </div>
    </section>

    <section className="keyword-method">
      <h2>분석 방법과 유의사항</h2>
      <div className="keyword-method-grid">
        <article><strong>분석 단위</strong><p>각 세부사업 행을 하나의 문서로 보고 세부사업명과 주요내용을 서로 다른 말뭉치로 분석했습니다.</p></article>
        <article><strong>핵심어 산출</strong><p>두 글자 이상의 일반명사·고유명사를 추출하고, 사업별 TF-IDF를 세부영역별 평균으로 집계해 상위 20개를 표시했습니다.</p></article>
        <article><strong>해석 범위</strong><p>2016–2024년 전체 문서의 언어적 특징을 요약한 기술 분석입니다. 인과관계나 정책 성과를 검증한 결과가 아닙니다.</p></article>
        <article><strong>분석 한계</strong><p>영역별 표본 수, 반복 사업, 복합명사 분리와 원자료의 작성 방식에 따라 결과가 달라질 수 있습니다.</p></article>
      </div>
    </section>
  </>
}
