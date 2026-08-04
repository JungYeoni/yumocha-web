<p align="center">
  <img src="public/logo.png" alt="Yumocha 로고" width="112" />
</p>

<h1 align="center">Yumocha</h1>
<p align="center">지역의 구조적 여건과 저출생 대응 시행계획상 계획예산을 함께 살펴보는 데이터 웹사이트</p>

<p align="center">
  <a href="https://github.com/JungYeoni/yumocha-web/actions/workflows/ci.yml"><img src="https://github.com/JungYeoni/yumocha-web/actions/workflows/ci.yml/badge.svg" alt="CI 상태"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/code-MIT-246BEB.svg" alt="코드 라이선스 MIT"></a>
  <a href="CONTENT_LICENSE.md"><img src="https://img.shields.io/badge/content-CC%20BY%204.0-6b7280.svg" alt="콘텐츠 라이선스 CC BY 4.0"></a>
  <img src="https://img.shields.io/badge/React-19-61DAFB.svg" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-6-646CFF.svg" alt="Vite 6">
</p>

<p align="center"><a href="CHANGELOG.md">📖 변경 이력 보기</a></p>

> [!IMPORTANT]
> 지금 화면의 차트 수치는 UI 구조 검증용 합성 샘플입니다. 연구 결과로 인용할 수 없습니다. 실제 수치는 데이터 검증이 끝나는 대로 교체됩니다.

## 📋 목차

- [⚡ 핵심 가치](#-핵심-가치)
- [🎯 프로젝트 개요](#-프로젝트-개요)
- [🔄 데이터 흐름](#-데이터-흐름)
- [🧭 화면 구성](#-화면-구성)
- [🔧 기술 스택](#-기술-스택)
- [🚀 시작하기](#-시작하기)
- [📐 개발 규칙](#-개발-규칙)
- [📚 문서와 데이터](#-문서와-데이터)
- [📄 라이선스](#-라이선스)

---

## ⚡ 핵심 가치

<table>
<tr>
<td width="25%" align="center">
<h3>🧮 정적, 그래서 단순</h3>
<p>원자료 정제·회귀 계산 없이<br/>검증된 CSV/JSON만 읽어 그림</p>
</td>
<td width="25%" align="center">
<h3>🔍 정합성 그대로 공개</h3>
<p>계획예산 결측률·중분류 소계<br/>오차를 숨기지 않고 페이지로 노출</p>
</td>
<td width="25%" align="center">
<h3>📄 라이선스 3분리</h3>
<p>코드·콘텐츠·데이터의<br/>이용조건을 각각 따로 명시</p>
</td>
<td width="25%" align="center">
<h3>🔗 출처 추적 가능</h3>
<p>지표별 원자료·접근일·라이선스를<br/><code>SOURCES.csv</code>로 관리</p>
</td>
</tr>
</table>

## 🎯 프로젝트 개요

**Yumocha**는 2016년부터 2024년까지 17개 시도의 인구·주거·고용·돌봄 등 구조환경지표 21개를, 저출생 대응 시행계획상 계획예산과 나란히 놓고 보는 데이터 웹사이트입니다. 계획예산은 시행계획에 기재된 예산이며 실제 집행액과 다를 수 있습니다.

기준 기간은 제3·4차 저출산·고령사회 기본계획 기간(2016–2024년, 9개년)입니다.

### 주요 특징

- ✅ **17개 시도 × 9개년** 구조환경지표 21종을 계획예산과 비교
- ✅ **정합성 검증 공개**: 세부사업 결측률, 중분류 소계 오차를 지역별로 노출
- ✅ **읽기 전용 정적 구조**: 원자료 처리는 별도 분석 저장소에서만 수행
- ✅ **라이선스 분리 공개**: 코드(MIT) · 콘텐츠(CC BY 4.0) · 데이터(원자료별 상이)

## 🔄 데이터 흐름

```mermaid
graph LR
    A[공공기관 원자료] --> B[yumocha<br/>분석 저장소]
    B -->|검증 완료 CSV/JSON| C[yumocha-web<br/>이 저장소]
    C -->|npm run build| D[정적 빌드]
    D --> E[브라우저]
```

이 저장소는 분석 저장소에서 미리 정제하고 검증한 CSV/JSON만 읽습니다. 원자료 정제, LLM 호출, 회귀 재계산은 여기서 하지 않습니다.

원자료 처리 과정은 [yumocha (분석 저장소)](https://github.com/JungYeoni/yumocha)에서 확인할 수 있습니다.

## 🧭 화면 구성

| 페이지 | 보여주는 것 |
|---|---|
| 프로젝트 소개 | 프로젝트 배경과 데이터 범위 |
| 지표 추이 | 지역의 시간적 변화와 17개 시도의 상대적 위치 |
| 재정 현황 | 지역의 구조적 여건과 계획예산의 규모·구성 비교 |
| 분석 결과 › 재정반응성 분석 | 재정대응 수준과 이후 합계출산율 변화의 조건부·시차적 연관성 |
| 분석 결과 › 예산 정합성 검증 | 계획예산 세부사업의 결측 비율과 중분류 소계 검증 결과 |
| 분석 결과 › 사업 목록 | 시행계획 원문에서 추출한 지역·연도별 세부사업 목록 |
| 데이터 다운로드 | 분석에 사용한 집계 데이터와 품질 정보를 버전 단위로 공개 |

## 🔧 기술 스택

<table>
<tr>
<th width="20%">카테고리</th>
<th width="25%">기술</th>
<th width="55%">용도</th>
</tr>
<tr>
<td rowspan="2"><b>🎨 프레임워크</b></td>
<td>React 19</td>
<td>UI 컴포넌트</td>
</tr>
<tr>
<td>Vite 6</td>
<td>개발 서버, 번들링</td>
</tr>
<tr>
<td><b>📈 시각화</b></td>
<td>react-plotly.js</td>
<td>지표·예산 차트</td>
</tr>
<tr>
<td><b>🔤 서체</b></td>
<td>Pretendard GOV</td>
<td>공공기관 배포 서체</td>
</tr>
<tr>
<td><b>🧹 코드 품질</b></td>
<td>ESLint</td>
<td>react-hooks / react-refresh 규칙 포함 정적 분석</td>
</tr>
<tr>
<td><b>⚙️ 자동화</b></td>
<td>GitHub Actions, git-cliff</td>
<td>CI 린트·빌드 검증, 커밋 기반 CHANGELOG 자동 생성</td>
</tr>
</table>

## 🚀 시작하기

### 사전 요구사항

- Node.js 20 이상

### 설치 및 실행

```bash
git clone https://github.com/JungYeoni/yumocha-web.git
cd yumocha-web
npm install
npm run dev
```

### 빌드

```bash
npm run build
```

## 📐 개발 규칙

1. **커밋 메시지**: [Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다. `main`에 푸시하면 `cliff.toml` 설정에 따라 `CHANGELOG.md`가 자동 생성됩니다.
2. **CI 검증**: PR과 `main` 푸시마다 `npm run lint`, `npm run build`가 자동 실행됩니다 (`.github/workflows/ci.yml`).
3. 1인 프로젝트로 운영 중이라 별도 브랜치 전략 문서나 자동 테스트 스위트는 아직 없습니다. 필요해지면 추가할 예정입니다.

## 📚 문서와 데이터

| 문서 | 내용 |
|---|---|
| [CHANGELOG.md](CHANGELOG.md) | 커밋 기반으로 자동 생성되는 변경 이력 |
| [SOURCES.csv](SOURCES.csv) | 지표별 원자료 출처, 접근일, 라이선스 |
| [DATA_LICENSE.md](DATA_LICENSE.md) | 데이터 이용조건 |
| [CONTENT_LICENSE.md](CONTENT_LICENSE.md) | 직접 작성한 콘텐츠 이용조건 |
| 앱 내 데이터 다운로드 페이지 | 집계 데이터와 품질 정보를 버전 단위로 제공 |

> [!NOTE]
> `SOURCES.csv`의 원자료 출처 감사는 아직 진행 중입니다. 확정 전까지는 각 원자료 제공기관의 이용조건이 우선 적용됩니다.

## 📄 라이선스

| 대상 | 라이선스 | 문서 |
|---|---|---|
| 코드 | MIT | [LICENSE](LICENSE) |
| 직접 작성한 콘텐츠 (설명문, 그래프) | CC BY 4.0 | [CONTENT_LICENSE.md](CONTENT_LICENSE.md) |
| 데이터 | 원자료별 상이 | [DATA_LICENSE.md](DATA_LICENSE.md), [SOURCES.csv](SOURCES.csv) |

---

<div align="center">

**Made by LeeJungYeon**

[🔗 분석 저장소](https://github.com/JungYeoni/yumocha) · [📖 변경 이력](CHANGELOG.md)

<sub>© 2026 LeeJungYeon</sub>

</div>
