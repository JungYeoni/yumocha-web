<p align="center">
  <img src="public/logo.png" alt="Yumocha 로고" width="112" />
</p>

<h1 align="center">Yumocha</h1>
<p align="center">지역의 구조적 여건과 저출생 대응 시행계획상 계획예산을 함께 살펴보는 데이터 웹사이트</p>

<p align="center">
  <a href="https://github.com/JungYeoni/yumocha-web/actions/workflows/ci.yml"><img src="https://github.com/JungYeoni/yumocha-web/actions/workflows/ci.yml/badge.svg" alt="CI 상태"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/code-MIT-246BEB.svg" alt="코드 라이선스 MIT"></a>
  <a href="CONTENT_LICENSE.md"><img src="https://img.shields.io/badge/content-CC%20BY%204.0-6b7280.svg" alt="콘텐츠 라이선스 CC BY 4.0"></a>
</p>

> [!IMPORTANT]
> 지금 화면의 차트 수치는 UI 구조 검증용 합성 샘플입니다. 연구 결과로 인용할 수 없습니다. 실제 수치는 데이터 검증이 끝나는 대로 교체됩니다.

## 이 프로젝트는

2016년부터 2024년까지 17개 시도의 인구·주거·고용·돌봄 등 구조환경지표 21개를, 저출생 대응 시행계획상 계획예산과 나란히 놓고 봅니다. 계획예산은 시행계획에 기재된 예산이며 실제 집행액과 다를 수 있습니다.

기준 기간은 제3·4차 저출산·고령사회 기본계획 기간(2016–2024년, 9개년)입니다.

## 화면 구성

- **프로젝트 소개**: 프로젝트 배경과 데이터 범위
- **지표 추이**: 지역의 시간적 변화와 17개 시도의 상대적 위치
- **재정 현황**: 지역의 구조적 여건과 계획예산의 규모·구성 비교
- **분석 결과**
  - 재정반응성 분석: 재정대응 수준과 이후 합계출산율 변화의 조건부·시차적 연관성
  - 예산 정합성 검증: 계획예산 세부사업의 결측 비율과 중분류 소계 검증 결과
  - 사업 목록: 시행계획 원문에서 추출한 지역·연도별 세부사업 목록
- **데이터 다운로드**: 분석에 사용한 집계 데이터와 품질 정보를 버전 단위로 공개

## 로컬에서 실행하기

준비물: Node.js 20 이상

```bash
npm install
npm run dev
```

빌드:

```bash
npm run build
```

## 데이터는 어디서 오나요

이 저장소는 분석 저장소에서 미리 정제하고 검증한 CSV/JSON만 읽습니다. 원자료 정제, LLM 호출, 회귀 재계산은 여기서 하지 않습니다.

원자료 처리 과정은 [yumocha (분석 저장소)](https://github.com/JungYeoni/yumocha)에서 확인할 수 있습니다.

## 기술 스택

- React 19, Vite
- react-plotly.js (차트)
- Pretendard GOV (서체)

## 라이선스

| 대상 | 라이선스 | 문서 |
|---|---|---|
| 코드 | MIT | [LICENSE](LICENSE) |
| 직접 작성한 콘텐츠 (설명문, 그래프) | CC BY 4.0 | [CONTENT_LICENSE.md](CONTENT_LICENSE.md) |
| 데이터 | 원자료별 상이 | [DATA_LICENSE.md](DATA_LICENSE.md), [SOURCES.csv](SOURCES.csv) |

> [!NOTE]
> `SOURCES.csv`의 원자료 출처 감사는 아직 진행 중입니다. 확정 전까지는 각 원자료 제공기관의 이용조건이 우선 적용됩니다.

<p align="center"><sub>© 2026 LeeJungYeon</sub></p>
