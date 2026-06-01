import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import Chart from 'react-apexcharts'
import * as XLSX from 'xlsx'

const MarketingDashboard = () => {
  // Highly realistic pre-loaded mock data
  const [data, setData] = useState([
    {
      id: 1,
      date: '2026-05-20',
      channel: '인스타그램',
      topic: 'Amiko 플랫폼 서비스 입점 티저',
      reach: 12500,
      likes: 850,
      comments: 120,
      saves: 230,
      shares: 90,
      clicks: 450,
      country: '한국',
    },
    {
      id: 2,
      date: '2026-05-22',
      channel: '틱톡',
      topic: 'Arirakku 브랜드 런칭 댄스 챌린지',
      reach: 45000,
      likes: 3200,
      comments: 450,
      saves: 980,
      shares: 1200,
      clicks: 1800,
      country: '일본',
    },
    {
      id: 3,
      date: '2026-05-25',
      channel: '인스타그램',
      topic: '배송 파트너십 오픈 공식 안내',
      reach: 8900,
      likes: 420,
      comments: 35,
      saves: 45,
      shares: 12,
      clicks: 120,
      country: '한국',
    },
    {
      id: 4,
      date: '2026-05-27',
      channel: '인스타그램',
      topic: 'Arirakku 룩북 리뉴얼 릴스',
      reach: 18000,
      likes: 1450,
      comments: 180,
      saves: 510,
      shares: 240,
      clicks: 890,
      country: '미국',
    },
    {
      id: 5,
      date: '2026-05-30',
      channel: '틱톡',
      topic: 'Amiko 앱 1분 가이드 튜토리얼',
      reach: 35000,
      likes: 2100,
      comments: 310,
      saves: 650,
      shares: 420,
      clicks: 1100,
      country: '베트남',
    },
  ])

  // File upload and SheetJS parser logic
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const rawJson = XLSX.utils.sheet_to_json(ws)

        if (rawJson.length === 0) {
          alert('엑셀 파일에 데이터가 비어 있습니다.')
          return
        }

        // Robust column mapping helper for flexible header synonyms
        const findKey = (row, possibilities) => {
          const keyFound = Object.keys(row).find((k) =>
            possibilities.some(
              (p) =>
                k.toLowerCase().replace(/[\s_]+/g, '') === p.toLowerCase().replace(/[\s_]+/g, '')
            )
          )
          return keyFound ? row[keyFound] : null
        }

        // Convert parsed rows to schema
        const parsedRecords = rawJson.map((row, idx) => {
          const dateRaw = findKey(row, ['게시일', '날짜', 'date', 'pubdate', 'timestamp']) || new Date().toISOString().split('T')[0]
          
          let dateStr = String(dateRaw)
          // Handle Excel numeric date serials
          if (typeof dateRaw === 'number') {
            const excelEpoch = new Date(Date.UTC(1899, 11, 30))
            const calculatedDate = new Date(excelEpoch.getTime() + dateRaw * 24 * 60 * 60 * 1000)
            if (!isNaN(calculatedDate)) {
              dateStr = calculatedDate.toISOString().split('T')[0]
            }
          }

          const channel = findKey(row, ['채널', 'platform', 'channel', '플랫폼', 'sns']) || '인스타그램'
          const topic = findKey(row, ['주제', '제목', 'topic', 'title', 'content', '콘텐츠']) || '소셜 콘텐츠'
          const reach = parseInt(findKey(row, ['도달수', '도달', '조회수', '조회', 'reach', 'views', 'view'])) || 0
          const likes = parseInt(findKey(row, ['좋아요', '좋아요수', 'likes', 'like'])) || 0
          const comments = parseInt(findKey(row, ['댓글', '댓글수', 'comments', 'comment'])) || 0
          const saves = parseInt(findKey(row, ['저장', '저장수', 'saves', 'save'])) || 0
          const shares = parseInt(findKey(row, ['공유', '공유수', 'shares', 'share'])) || 0
          const clicks = parseInt(findKey(row, ['클릭수', '클릭', '링크클릭', 'clicks', 'click'])) || 0
          const country = findKey(row, ['국가', '주요국가', 'country', 'region', '타깃국가']) || '한국'

          return {
            id: idx + 1,
            date: dateStr,
            channel,
            topic,
            reach,
            likes,
            comments,
            saves,
            shares,
            clicks,
            country,
          }
        })

        setData(parsedRecords)
      } catch (error) {
        console.error(error)
        alert('파일을 파싱하는 동안 오류가 발생했습니다. 헤더명이나 파일 형식을 확인해 주세요.')
      }
    }
    reader.readAsBinaryString(file)
  }

  // Delete a record from active state list
  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id))
  }

  // --- Dynamic KPI Calculations ---
  const totalReach = data.reduce((acc, curr) => acc + curr.reach, 0)
  const totalClicks = data.reduce((acc, curr) => acc + curr.clicks, 0)

  // Computed ER for each row = ((Likes + Comments + Saves + Shares) / Reach) * 100
  const rowERs = data.map((item) => {
    if (item.reach === 0) return 0
    return ((item.likes + item.comments + item.saves + item.shares) / item.reach) * 100
  })
  const avgER = rowERs.length > 0 ? rowERs.reduce((acc, curr) => acc + curr, 0) / rowERs.length : 0

  // Top referer country calculation (based on reach sum)
  const countryReachMap = {}
  data.forEach((item) => {
    countryReachMap[item.country] = (countryReachMap[item.country] || 0) + item.reach
  })
  let topCountry = '-'
  let maxReach = 0
  Object.keys(countryReachMap).forEach((c) => {
    if (countryReachMap[c] > maxReach) {
      maxReach = countryReachMap[c]
      topCountry = c
    }
  })

  // --- ApexCharts Data Structuring ---
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date))
  const chartDates = sortedData.map((item) => item.date)
  const chartReachData = sortedData.map((item) => item.reach)
  const chartERData = sortedData.map((item) => {
    if (item.reach === 0) return 0
    return parseFloat(
      (((item.likes + item.comments + item.saves + item.shares) / item.reach) * 100).toFixed(2)
    )
  })

  const mixedChartOptions = {
    chart: {
      id: 'reach-er-trend',
      toolbar: { show: false },
    },
    stroke: {
      width: [0, 3],
      curve: 'smooth',
    },
    colors: ['#321fdb', '#f9b115'],
    fill: {
      opacity: [0.85, 1],
    },
    labels: chartDates,
    xaxis: {
      type: 'category',
    },
    yaxis: [
      {
        title: { text: '도달(조회)수' },
      },
      {
        opposite: true,
        title: { text: '참여율 (ER %)' },
        labels: {
          formatter: (value) => `${value}%`,
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y, { seriesIndex }) => {
          if (typeof y !== 'undefined') {
            return seriesIndex === 0 ? `${y.toLocaleString()} 회` : `${y}%`
          }
          return y
        },
      },
    },
  }

  const mixedChartSeries = [
    {
      name: '도달수',
      type: 'column',
      data: chartReachData,
    },
    {
      name: '참여율 (ER)',
      type: 'line',
      data: chartERData,
    },
  ]

  // Chart B: Country Reach Donut Chart
  const donutLabels = Object.keys(countryReachMap)
  const donutSeries = Object.values(countryReachMap)

  const donutChartOptions = {
    chart: {
      id: 'country-distribution',
    },
    labels: donutLabels,
    colors: ['#321fdb', '#2eb85c', '#f9b115', '#e55353', '#3399ff', '#6f42c1'],
    legend: {
      position: 'bottom',
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: 'bottom' },
        },
      },
    ],
  }

  return (
    <>
      {/* 1. Core KPI Widgets */}
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        <CCol sm={6} xl={3}>
          <CCard className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #321fdb, #1f1498)' }}>
            <CCardBody className="pb-4 px-4 pt-4">
              <div className="small text-white-50 fw-semibold text-uppercase">총 도달 (조회)수</div>
              <div className="fs-2 fw-bold mt-2">{totalReach.toLocaleString()} 회</div>
              <div className="small text-white-50 mt-3">글로벌 누적 소셜 성과</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} xl={3}>
          <CCard className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #f9b115, #f6960b)' }}>
            <CCardBody className="pb-4 px-4 pt-4">
              <div className="small text-white-50 fw-semibold text-uppercase">평균 참여율 (ER)</div>
              <div className="fs-2 fw-bold mt-2">{avgER.toFixed(2)}%</div>
              <div className="small text-white-50 mt-3">업계 표준 대비 고효율 달성</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} xl={3}>
          <CCard className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #2eb85c, #1b8a3e)' }}>
            <CCardBody className="pb-4 px-4 pt-4">
              <div className="small text-white-50 fw-semibold text-uppercase">총 프로필/링크 클릭수</div>
              <div className="fs-2 fw-bold mt-2">{totalClicks.toLocaleString()} 클릭</div>
              <div className="small text-white-50 mt-3">실제 Amiko 웹사이트 전환 연결</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} xl={3}>
          <CCard className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #3399ff, #2378cc)' }}>
            <CCardBody className="pb-4 px-4 pt-4">
              <div className="small text-white-50 fw-semibold text-uppercase">최다 유입 국가</div>
              <div className="fs-2 fw-bold mt-2">{topCountry}</div>
              <div className="small text-white-50 mt-3">현재 점유율 1순위 글로벌 타깃</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* 2. ApexCharts Area */}
      <CRow className="mb-4">
        {/* Chart A: Reach vs ER Trend */}
        <CCol xl={8} className="mb-4">
          <CCard className="border-0 shadow-sm h-100">
            <CCardHeader className="bg-white border-0 pt-4 px-4">
              <h5 className="m-0 fw-bold text-dark">도달수 vs 참여율 트렌드</h5>
              <span className="small text-muted">콘텐츠 게시일별 도달 성과와 평균 참여율을 종합 비교합니다.</span>
            </CCardHeader>
            <CCardBody className="p-4">
              <Chart
                options={mixedChartOptions}
                series={mixedChartSeries}
                type="line"
                height={350}
              />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Chart B: Target Country Donut */}
        <CCol xl={4} className="mb-4">
          <CCard className="border-0 shadow-sm h-100">
            <CCardHeader className="bg-white border-0 pt-4 px-4">
              <h5 className="m-0 fw-bold text-dark">글로벌 타깃 국가 비중</h5>
              <span className="small text-muted">누적 도달수 기반 유입 국가별 세부 점유율 현황입니다.</span>
            </CCardHeader>
            <CCardBody className="p-4 d-flex align-items-center justify-content-center">
              {donutSeries.length > 0 ? (
                <Chart
                  options={donutChartOptions}
                  series={donutSeries}
                  type="donut"
                  width={340}
                />
              ) : (
                <div className="text-muted small">데이터가 없습니다.</div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* 3. Excel File Upload & Data Table Area */}
      <CRow>
        <CCol xl={9} className="mb-4">
          {/* File Upload Card */}
          <CCard className="border-0 shadow-sm mb-4">
            <CCardHeader className="bg-white border-0 pt-4 px-4">
              <h5 className="m-0 fw-bold text-dark">SNS 성과 엑셀/CSV 자동 업로드</h5>
              <span className="small text-muted">엑셀(.xlsx, .xls) 또는 CSV 파일을 업로드하면 대시보드가 실시간으로 자동 갱신됩니다.</span>
            </CCardHeader>
            <CCardBody className="px-4 pb-4">
              <div className="p-4 rounded border-2 border-dashed border-primary text-center bg-light">
                <div className="mb-3">
                  <span className="fs-3">📊</span>
                </div>
                <h6 className="fw-semibold text-dark mb-2">성과 지표 시트 파일 선택</h6>
                <p className="small text-muted mb-3">지원 파일 형식: .xlsx, .xls, .csv (필수 열: 게시일, 채널, 주제, 도달수, 좋아요, 댓글 등)</p>
                <div className="d-inline-block">
                  <input
                    type="file"
                    id="excelUpload"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="form-control"
                    style={{ maxWidth: '350px' }}
                  />
                </div>
              </div>
            </CCardBody>
          </CCard>

          {/* High-density Excel Raw Data Table */}
          <CCard className="border-0 shadow-sm">
            <CCardHeader className="bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="m-0 fw-bold text-dark">소셜 원본 데이터 시트 (Excel 원본 통합뷰)</h5>
                <span className="small text-muted">등록된 모든 소셜 미디어 원본 지표와 연산된 기여도를 한눈에 검토합니다.</span>
              </div>
            </CCardHeader>
            <CCardBody className="px-4 pb-4">
              <div className="table-responsive">
                <CTable bordered hover align="middle" className="mb-0 text-nowrap text-center">
                  <CTableHead className="bg-light">
                    <CTableRow>
                      <CTableHeaderCell>게시일</CTableHeaderCell>
                      <CTableHeaderCell>채널</CTableHeaderCell>
                      <CTableHeaderCell>주제</CTableHeaderCell>
                      <CTableHeaderCell>도달수</CTableHeaderCell>
                      <CTableHeaderCell>좋아요</CTableHeaderCell>
                      <CTableHeaderCell>댓글</CTableHeaderCell>
                      <CTableHeaderCell>저장</CTableHeaderCell>
                      <CTableHeaderCell>공유</CTableHeaderCell>
                      <CTableHeaderCell>클릭수</CTableHeaderCell>
                      <CTableHeaderCell>국가</CTableHeaderCell>
                      <CTableHeaderCell className="text-primary fw-bold">참여율(ER)</CTableHeaderCell>
                      <CTableHeaderCell>관리</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {sortedData.map((item) => {
                      const er = item.reach > 0 ? ((item.likes + item.comments + item.saves + item.shares) / item.reach) * 100 : 0
                      return (
                        <CTableRow key={item.id}>
                          <CTableDataCell className="small">{item.date}</CTableDataCell>
                          <CTableDataCell>
                            <span className={`badge px-2 py-1 ${item.channel === '인스타그램' ? 'bg-danger-subtle text-danger' : 'bg-dark text-white'}`}>
                              {item.channel}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell className="text-start fw-medium small" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.topic}
                          </CTableDataCell>
                          <CTableDataCell className="small">{item.reach.toLocaleString()} 회</CTableDataCell>
                          <CTableDataCell className="small">{item.likes.toLocaleString()}</CTableDataCell>
                          <CTableDataCell className="small">{item.comments.toLocaleString()}</CTableDataCell>
                          <CTableDataCell className="small">{item.saves.toLocaleString()}</CTableDataCell>
                          <CTableDataCell className="small">{item.shares.toLocaleString()}</CTableDataCell>
                          <CTableDataCell className="small text-success fw-medium">{item.clicks.toLocaleString()}</CTableDataCell>
                          <CTableDataCell className="small fw-semibold">{item.country}</CTableDataCell>
                          <CTableDataCell className="text-primary fw-bold small">{er.toFixed(2)}%</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="link"
                              className="text-danger p-0 fw-bold small text-decoration-none"
                              onClick={() => handleDelete(item.id)}
                            >
                              삭제
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                    {data.length === 0 && (
                      <CTableRow>
                        <CTableDataCell colSpan={12} className="py-4 text-muted small">
                          등록된 원본 데이터가 존재하지 않습니다.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Right Column: AI Insight Sidebar */}
        <CCol xl={3} className="mb-4">
          <CCard className="border-0 shadow-sm text-white h-100" style={{ background: 'linear-gradient(135deg, #1d2731, #0f171e)', minHeight: '300px' }}>
            <CCardHeader className="border-0 pt-4 px-4 bg-transparent">
              <h5 className="m-0 fw-bold">🤖 AI 스탠다드 분석</h5>
              <span className="small text-white-50">글로벌 콘텐츠 마케팅 성과 진단</span>
            </CCardHeader>
            <CCardBody className="px-4 pb-4 d-flex flex-column justify-content-between">
              <div>
                <div className="p-3 rounded mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="fw-semibold text-warning small mb-1">📢 API 연결 대기 중</div>
                  <p className="small text-white-50 m-0 leading-relaxed">
                    여기에 OpenAI가 연결되면 글로벌 스탠다드에 맞춘 콘텐츠 피드백이 출력됩니다.
                  </p>
                </div>
                <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="fw-semibold text-info small mb-1">🎯 현재 권장 조치</div>
                  <p className="small text-white-50 m-0 leading-relaxed">
                    틱톡 플랫폼의 Arirakku 브랜드 챌린지 성과가 {avgER.toFixed(1)}%로 매우 높습니다. 틱톡 채널에 비디오 리소스를 더욱 확대 투자하는 것을 권장합니다.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-top border-secondary text-center small text-white-50">
                Verbos Analytics Engine v1.0
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default MarketingDashboard
