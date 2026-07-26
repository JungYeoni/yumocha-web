# Yumocha Web

지역의 구조적 여건과 저출생 대응 시행계획상 계획예산을 함께 살펴보는 데이터 웹사이트입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

웹은 분석 저장소에서 사전 생성한 검증 완료 CSV/JSON만 읽습니다. 원자료 정제, LLM 호출, 회귀 재계산은 웹에서 수행하지 않습니다.

현재 화면의 차트 수치는 UI 구조 검증용 합성 샘플이며 연구 결과로 인용할 수 없습니다.

## 라이선스

- 코드: MIT
- 직접 작성한 콘텐츠: CC BY 4.0
- 데이터: `DATA_LICENSE.md` 및 `SOURCES.csv` 참고
