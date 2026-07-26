export const regions = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
export const years = Array.from({ length: 9 }, (_, i) => 2016 + i)

const bases = { 서울: 1.09, 부산: 1.1, 대구: 1.19, 인천: 1.14, 광주: 1.17, 대전: 1.18, 울산: 1.42, 세종: 1.82, 경기: 1.2, 강원: 1.24, 충북: 1.36, 충남: 1.4, 전북: 1.25, 전남: 1.47, 경북: 1.4, 경남: 1.36, 제주: 1.43 }
export const trendRows = regions.flatMap((region, r) => years.map((year, i) => ({
  region, year,
  fertility: Math.max(.55, +(bases[region] - i * .055 + Math.sin((r + i) * .7) * .035).toFixed(2)),
  youthShare: +(15.8 - i * .28 + (r % 5) * .18).toFixed(1),
  childcare: +(58 + i * 2.8 + (r % 4) * 3.2).toFixed(1),
  quality: (region === '세종' && year === 2016) || (region === '제주' && year === 2022) ? '확인 필요' : '검증 완료',
})))

export const indicators = [
  { value: 'fertility', label: '합계출산율', unit: '명', description: '여성 1명이 평생 낳을 것으로 예상되는 평균 출생아 수. 재정대응과의 연관성을 살펴보는 종속변수로 사용합니다.' },
  { value: 'youthShare', label: '청년고용률', unit: '%', description: '20~34세 인구 중 취업자 비중(청년 취업자 수 ÷ 청년 인구 수 × 100). 21개 구조환경지표 중 하나입니다.' },
  { value: 'childcare', label: '보육시설 보급률', unit: '%', description: '0~4세 인구 대비 보육시설 정원 비율(보육시설 정원 ÷ 0~4세 인구 × 100). 원자료 검증 과정에서 산식 오류가 확인되어 재정팀 자료가 수정된 지표입니다.' },
]

export const budgetRows = regions.map((region, i) => ({
  region,
  budget: 3200 + ((i * 1937) % 12400),
  family: 32 + (i % 5) * 3,
  care: 28 + (i % 4) * 2,
  housing: 24 - (i % 3),
  work: 16 - (i % 4),
}))

export const files = [
  { name: '분석 패널 CSV', file: 'analysis_panel.csv', description: '지역·연도 단위 분석용 패널', rows: '연결 대기', size: '—', status: '준비 중' },
  { name: '구조환경지표 검증본', file: 'structural_indicators.csv', description: '21개 지표와 품질 상태', rows: '연결 대기', size: '—', status: '준비 중' },
  { name: '계획예산 집계본', file: 'regional_budget_summary.csv', description: '당해예산 기준 지역·연도 집계', rows: '연결 대기', size: '—', status: '준비 중' },
  { name: '품질 플래그', file: 'quality_flags.csv', description: '결측·보간·검증 이력', rows: '연결 대기', size: '—', status: '준비 중' },
  { name: '데이터 사전', file: 'DATA_DICTIONARY.xlsx', description: '컬럼 정의와 단위·출처', rows: '—', size: '—', status: '준비 중' },
]
