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
  { name: '분석 패널 CSV', file: 'analysis_panel.csv', description: '지역·연도 단위 재정반응성 기초분석 패널(시차 변수 포함)', rows: '153행', size: '12.6KB', status: '다운로드' },
  { name: '계획예산 집계본', file: 'regional_budget_summary.csv', description: '당해예산 기준 지역·연도 집계 및 합계출산율', rows: '153행', size: '8.8KB', status: '다운로드' },
  { name: '품질 플래그', file: 'quality_flags.csv', description: '기초패널 QA 요약(검증 항목별 집계값)', rows: '9행', size: '240B', status: '다운로드' },
  { name: '전국 합계출산율 추세', file: 'national_fertility_trend.csv', description: '연도별 전국 합계출산율(통계청 공표값)', rows: '9행', size: '125B', status: '다운로드' },
  { name: '구조환경지표 검증본', file: 'structural_indicators.csv', description: '21개 지표와 품질 상태', rows: '연결 대기', size: '—', status: '준비 중' },
  { name: '데이터 사전', file: 'DATA_DICTIONARY.xlsx', description: '컬럼 정의와 단위·출처', rows: '—', size: '—', status: '준비 중' },
]

export const checksums = {
  'analysis_panel.csv': '7c5a25277216b1df16261b771d3d83f8223d620631baa3eb8d6265b6fce2e866',
  'regional_budget_summary.csv': 'b8e613ba815817bd6560a3faa2b9ae2b73ebb944b5fef4d25af7b031fde9c467',
  'quality_flags.csv': 'a5c2ba524e032fb0a4c78e433840c9a4e671f7a30c161f78bef5d823be0c24d7',
  'national_fertility_trend.csv': '24787e561b613b801891041b69477eb5bb42b20e733e63e3a8abb08e802cb2b9',
}

export const sources = [
  { group: "경제·고용·주거", name: "청년 고용률", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "https://kosis.kr/statHtml/statHtml.do?conn_path=I2&orgId=101&tblId=DT_1B04006" },
  { group: "경제·고용·주거", name: "청년층 정규직 근로자 비율", provider: "마이크로데이터 통합서비스(MDIS)", period: "2016-2024", url: "https://mdis.mods.go.kr/ofrData/selectOrgOfrData.do?curMenuNo=UI_POR_P9220" },
  { group: "경제·고용·주거", name: "주택가격", provider: "마이크로데이터 통합서비스(MDIS)", period: "2016-2024", url: "https://mdis.mods.go.kr/ofrData/selectOrgOfrData.do?curMenuNo=UI_POR_P9220" },
  { group: "경제·고용·주거", name: "자가점유비율", provider: "마이크로데이터 통합서비스(MDIS)", period: "2016-2024", url: "https://mdis.mods.go.kr/ofrData/selectOrgOfrData.do?curMenuNo=UI_POR_P9220" },
  { group: "경제·고용·주거", name: "주거비", provider: "마이크로데이터 통합서비스(MDIS)", period: "2016-2024", url: "https://mdis.mods.go.kr/ofrData/selectOrgOfrData.do?curMenuNo=UI_POR_P9220" },
  { group: "경제·고용·주거", name: "소득 만족도", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1SSIC050R&conn_path=I2" },
  { group: "경제·고용·주거", name: "소득 수준", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "http://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=INH_1C96_04&tmprScrId=20260721120610036_ceed1f44c26d41c3" },
  { group: "경제·고용·주거", name: "근로시간", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "https://kosis.kr/statHtml/statHtml.do?orgId=118&tblId=DT_118N_MON048&conn_path=I2" },
  { group: "가족·생활", name: "보육시설 보급률", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "https://kosis.kr/statHtml/statHtml.do?orgId=112&tblId=DT_15407_NN003" },
  { group: "가족·생활", name: "방과후 돌봄시설 보급도", provider: "보건복지부", period: "2016-2024", url: "https://www.mohw.go.kr/board.es?mid=a10411010100&bid=0019&act=view&list_no=347082&tag=&nPage=1" },
  { group: "가족·생활", name: "사교육비 지출액", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "https://kosis.kr/statHtml/statHtml.do?conn_path=I3&orgId=101&tblId=DT_1PE101" },
  { group: "가족·생활", name: "문화기반시설 보급도", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1YL20931" },
  { group: "가족·생활", name: "도시공원 보급도", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "http://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1YL21281&tmprScrId=20260715192137553_dbabe38d3c9b47a4" },
  { group: "가족·생활", name: "여가생활 만족도", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "http://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=INH_1SSCL091R&tmprScrId=20260715192258581_2e67f903b62d42df" },
  { group: "가족·생활", name: "가사노동 공동 참여도", provider: "마이크로데이터 통합서비스(MDIS)", period: "2020, 2023", url: "https://mdis.mods.go.kr/ofrData/selectOrgOfrData.do?curMenuNo=UI_POR_P9220" },
  { group: "가족·생활", name: "돌봄노동 공동 참여도", provider: "마이크로데이터 통합서비스(MDIS)", period: "2020, 2023", url: "https://mdis.mods.go.kr/ofrData/selectOrgOfrData.do?curMenuNo=UI_POR_P9220" },
  { group: "보건·안전", name: "분만 가능 산부인과 보급도", provider: "건강보험심사평가원(HIRA) 보건의료빅데이터", period: "2016-2024", url: "https://opendata.hira.or.kr/" },
  { group: "보건·안전", name: "분만실 병상수 보급도", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "http://kosis.kr/statHtml/statHtml.do?orgId=354&tblId=DT_HIRA49_3&tmprScrId=20260716080206914_911e31072f104c33" },
  { group: "보건·안전", name: "난임시술기관 보급도", provider: "건강보험심사평가원(HIRA) 보건의료빅데이터", period: "2016-2024", url: "https://opendata.hira.or.kr/" },
  { group: "보건·안전", name: "소아청소년과 보급도", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "https://kosis.kr/statHtml/statHtml.do?orgId=354&tblId=DT_HIRA4S" },
  { group: "보건·안전", name: "소아청소년과 전문인력 보급도", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "http://kosis.kr/statHtml/statHtml.do?orgId=354&tblId=DT_HIRA4S&tmprScrId=20260716081611653_ffbf4ac7f2d74c33" },
  { group: "보건·안전", name: "산후조리원 보급도 (2023)", provider: "공공데이터포털", period: "2023", url: "https://www.data.go.kr/data/15004303/fileData.do" },
  { group: "보건·안전", name: "산후조리원 보급도 (2024~)", provider: "한국사회보장정보원 아이사랑포털", period: "2024-2025", url: "https://www.childcare.go.kr/?menuno=640" },
  { group: "보건·안전", name: "산후조리원 이용 요금 (2023)", provider: "공공데이터포털", period: "2023", url: "https://www.data.go.kr/data/15004303/fileData.do" },
  { group: "보건·안전", name: "산후조리원 이용 요금 (2024~)", provider: "한국사회보장정보원 아이사랑포털", period: "2024-2025", url: "https://www.childcare.go.kr/?menuno=640" },
  { group: "보건·안전", name: "학교폭력 발생률", provider: "학교알리미(교육부)", period: "2016-2024", url: "https://www.schoolinfo.go.kr/si/pi/pnsipi_a01_l0_excel.do" },
  { group: "보건·안전", name: "어린이 교통사고 발생률", provider: "도로교통공단 TAAS", period: "2016-2024", url: "https://taas.koroad.or.kr/sta/acs/gus/selectAgeTfcacd.do?menuId=WEB_KMP_OVT_MVT_TAG_AGT" },
  { group: "보건·안전", name: "사회 안전에 대한 인식", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "http://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=INH_1SSSA010R&tmprScrId=20260715193106893_96d42d37ebd74f98" },
  { group: "사회·제도", name: "저출생 대응 예산액", provider: "저출산고령사회위원회", period: "2016-2024", url: "https://www.betterfuture.go.kr/front/policySpace/actionPlan.do" },
  { group: "사회·제도", name: "육아휴직 사용률", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "http://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_CC2024I001&tmprScrId=20260715193449982_69e1e3cf99074921" },
  { group: "사회·제도", name: "가족친화인증기업 비율", provider: "공공데이터포털", period: "2016-2024", url: "https://www.data.go.kr/data/3071994/fileData.do#layer_data_infomation" },
  { group: "사회·제도", name: "결혼에 대한 인식", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "http://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1SSFA060R&tmprScrId=20260715194650901_292f93e266614faf" },
  { group: "사회·제도", name: "출산에 대한 인식", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "http://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1SSFA056R&tmprScrId=20260715194805121_4ef2430a1f714ed8" },
  { group: "사회·제도", name: "가사분담에 대한 성평등 인식", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "http://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1SSFA112R&tmprScrId=20260715194955138_1fefe54110914dfa" },
  { group: "사회·제도", name: "사회경제적 지위에 대한 인식", provider: "마이크로데이터 통합서비스(MDIS)", period: "2015, 2020, 2023", url: "https://mdis.mods.go.kr/ofrData/selectOrgOfrData.do?curMenuNo=UI_POR_P9220" },
  { group: "분석 대상 변수", name: "합계출산율", provider: "KOSIS(통계청 국가통계포털)", period: "2016-2024", url: "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1B81A21" },
]
