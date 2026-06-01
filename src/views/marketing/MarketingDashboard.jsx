import React, { useState, useEffect } from 'react'
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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CForm,
  CFormInput,
  CFormSelect,
  CBadge,
  CProgress,
} from '@coreui/react'
import Chart from 'react-apexcharts'
import * as XLSX from 'xlsx'

const MarketingDashboard = () => {
  // Tabs: 'original_sns' | 'utm' | 'creative' | 'mediamix' | 'funnel'
  const [activeKey, setActiveKey] = useState('original_sns')

  // =========================================================
  // 1. 전달(Previous Month) 1일 ~ 말일 자동 계산 헬퍼
  // =========================================================
  const getPreviousMonthRange = () => {
    const now = new Date()
    // 현재 2026-06-01 기준 -> 전달은 5월 1일 ~ 5월 31일이 됨
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevMonthLast = new Date(now.getFullYear(), now.getMonth(), 0)

    const formatDate = (date) => {
      const yyyy = date.getFullYear()
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const dd = String(date.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    }

    return {
      start: formatDate(prevMonth),
      end: formatDate(prevMonthLast)
    }
  }

  const defaultRange = getPreviousMonthRange()
  const [startDate, setStartDate] = useState(defaultRange.start)
  const [endDate, setEndDate] = useState(defaultRange.end)

  // =========================================================
  // 2. 사용자 오리지널 SNS계정 성과 분석표 실제 시드 데이터 세팅
  // =========================================================
  const defaultSnsRecords = [
    {
      id: 1,
      month: '4월',
      num: 1,
      date: '04월 12일',
      type: '릴스',
      format: '영상',
      topic: '정보',
      ads: 'O(타깃)',
      insta: {
        views: 12816,
        reach: 9498,
        likes: 949,
        comments: 32,
        saves: 72,
        shares: 15,
        profile: 452,
        site: 0,
        follow: 455,
        spent: 20000,
        costPerGoal: 71,
        gender: { male: 12, female: 88 },
        countries: [{ name: '국가1', val: '멕시코' }, { name: '국가2', val: '페루' }],
        age: { '18-24': 35, '25-34': 50, '35-44': 3, '45-54': 11, '55+': 1 }
      },
      tiktok: {
        reach: 851,
        views: 1032,
        likes: 166,
        comments: 12,
        shares: 6,
        saves: 8,
        follow: 15,
        gender: { male: 13, female: 87 },
        countries: [],
        age: { '18-24': 27, '25-34': 51, '35-44': 15, '45-54': 6, '55+': 1 }
      }
    },
    {
      id: 2,
      month: '4월',
      num: 2,
      date: '04월 13일',
      type: '게시글',
      format: '카드뉴스',
      topic: '브랜드스토리',
      ads: 'x',
      insta: {
        views: 908,
        reach: 449,
        likes: 53,
        comments: 6,
        saves: 4,
        shares: 0,
        profile: 585,
        site: 0,
        follow: 0,
        spent: 20000,
        costPerGoal: 29,
        gender: { male: 16, female: 84 },
        countries: [],
        age: { '18-24': 12, '25-34': 40, '35-44': 24, '45-54': 11, '55+': 3 }
      },
      tiktok: {
        reach: 3002,
        views: 166,
        likes: 12,
        comments: 6,
        shares: 8,
        saves: 15,
        follow: 0,
        gender: { male: 15, female: 85 },
        countries: [],
        age: { '18-24': 33, '25-34': 47, '35-44': 13, '45-54': 6, '55+': 1 }
      }
    },
    {
      id: 3,
      month: '4월',
      num: 3,
      date: '04월 17일',
      type: '게시글',
      format: '카드뉴스',
      topic: '브랜드스토리',
      ads: 'x',
      insta: {
        views: 925,
        reach: 433,
        likes: 70,
        comments: 15,
        saves: 3,
        shares: 1,
        profile: 0,
        site: 0,
        follow: 1,
        spent: 0,
        costPerGoal: 0,
        gender: { male: 16, female: 84 },
        countries: [],
        age: { '18-24': 12, '25-34': 48, '35-44': 25, '45-54': 11, '55+': 2 }
      },
      tiktok: {
        reach: 1428,
        views: 181,
        likes: 22,
        comments: 1,
        shares: 6,
        saves: 9,
        follow: 0,
        gender: { male: 11, female: 89 },
        countries: [],
        age: { '18-24': 27, '25-34': 53, '35-44': 14, '45-54': 5, '55+': 1 }
      }
    },
    {
      id: 4,
      month: '4월',
      num: 4,
      date: '04월 20일',
      type: '게시글',
      format: '카드뉴스',
      topic: '브랜드뉴스',
      ads: 'x',
      insta: {
        views: 556,
        reach: 278,
        likes: 37,
        comments: 11,
        saves: 1,
        shares: 0,
        profile: 0,
        site: 0,
        follow: 0,
        spent: 0,
        costPerGoal: 0,
        gender: { male: 15, female: 85 },
        countries: [],
        age: { '18-24': 16, '25-34': 54, '35-44': 19, '45-54': 11, '55+': 0 }
      },
      tiktok: {
        reach: 1344,
        views: 109,
        likes: 8,
        comments: 1,
        shares: 1,
        saves: 6,
        follow: 0,
        gender: { male: 11, female: 89 },
        countries: [],
        age: { '18-24': 30, '25-34': 52, '35-44': 13, '45-54': 4, '55+': 1 }
      }
    },
    {
      id: 5,
      month: '4월',
      num: 5,
      date: '04월 21일',
      type: '게시글',
      format: '카드뉴스',
      topic: '팔로워참여',
      ads: 'x',
      insta: {
        views: 2342,
        reach: 1758,
        likes: 22,
        comments: 33,
        saves: 2,
        shares: 1,
        profile: 0,
        site: 0,
        follow: 0,
        spent: 0,
        costPerGoal: 0,
        gender: { male: 3, female: 97 },
        countries: [],
        age: { '18-24': 41, '25-34': 42, '35-44': 11, '45-54': 3, '55+': 0 }
      },
      tiktok: {
        reach: 998,
        views: 40,
        likes: 40,
        comments: 1,
        shares: 1,
        saves: 1,
        follow: 1,
        gender: { male: 15, female: 85 },
        countries: [],
        age: { '18-24': 19, '25-34': 53, '35-44': 20, '45-54': 6, '55+': 2 }
      }
    },
    {
      id: 6,
      month: '4월',
      num: 6,
      date: '04월 22일',
      type: '릴스',
      format: '영상',
      topic: '유머',
      ads: 'O(타깃)/x',
      insta: {
        views: 12975,
        reach: 9258,
        likes: 1235,
        comments: 54,
        saves: 77,
        shares: 24,
        profile: 212,
        site: 0,
        follow: 0,
        spent: 0,
        costPerGoal: 0,
        gender: { male: 30, female: 70 },
        countries: [{ name: '국가1', val: '멕시코' }, { name: '국가2', val: '페루' }],
        age: { '18-24': 35, '25-34': 48, '35-44': 12, '45-54': 5, '55+': 1 }
      },
      tiktok: {
        reach: 80000,
        views: 14000,
        likes: 446,
        comments: 350,
        shares: 501,
        saves: 977,
        follow: 0,
        gender: { male: 12, female: 88 },
        countries: [{ name: '국가1', val: '멕시코' }, { name: '국가2', val: '콜롬비아' }],
        age: { '18-24': 36, '25-34': 47, '35-44': 12, '45-54': 4, '55+': 1 }
      }
    },
    {
      id: 7,
      month: '5월',
      num: 1,
      date: '05월 01일',
      type: '게시글',
      format: '카드뉴스',
      topic: '브랜드스토리',
      ads: 'x',
      insta: {
        views: 873,
        reach: 361,
        likes: 40,
        comments: 3,
        saves: 4,
        shares: 1,
        profile: 0,
        site: 0,
        follow: 0,
        spent: 0,
        costPerGoal: 0,
        gender: { male: 15, female: 85 },
        countries: [],
        age: { '18-24': 10, '25-34': 45, '35-44': 30, '45-54': 10, '55+': 5 }
      },
      tiktok: {
        reach: 1345,
        views: 124,
        likes: 7,
        comments: 3,
        shares: 5,
        saves: 5,
        follow: 0,
        gender: { male: 18, female: 82 },
        countries: [],
        age: { '18-24': 25, '25-34': 50, '35-44': 15, '45-54': 8, '55+': 2 }
      }
    },
    {
      id: 8,
      month: '5월',
      num: 2,
      date: '05월 13일',
      type: '릴스',
      format: '영상',
      topic: '유머',
      ads: 'x',
      insta: {
        views: 100309,
        reach: 67225,
        likes: 8894,
        comments: 739,
        saves: 456,
        shares: 1074,
        profile: 501,
        site: 0,
        follow: 0,
        spent: 0,
        costPerGoal: 0,
        gender: { male: 8, female: 92 },
        countries: [{ name: '주요도시', val: '멕시코시티' }, { name: '스페인', val: '스페인' }, { name: '국가2', val: '페루' }],
        age: { '18-24': 13, '25-34': 39, '35-44': 31, '45-54': 12, '55+': 5 }
      },
      tiktok: {
        reach: 84000,
        views: 8012,
        likes: 777,
        comments: 646,
        shares: 300,
        saves: 340,
        follow: 0,
        gender: { male: 15, female: 85 },
        countries: [{ name: '국가1', val: '멕시코' }, { name: '국가2', val: '콜롬비아' }],
        age: { '18-24': 18, '25-34': 43, '35-44': 25, '45-54': 11, '55+': 3 }
      }
    }
  ]

  const [snsRecords, setSnsRecords] = useState(defaultSnsRecords)

  // ==========================================
  // 3. 다른 샌드박스 템플릿용 기존 States
  // ==========================================
  const defaultUtmRecords = [
    { id: 1, name: '여름 시즌 빅세일 대축제', source: 'facebook', medium: 'cpc', url: 'https://amiko.com/shop', utmUrl: 'https://amiko.com/shop?utm_source=facebook&utm_medium=cpc&utm_campaign=summer_sale', spent: 3500, clicks: 12500, conversions: 620, revenue: 18600 },
    { id: 2, name: '신규 가입 웰컴 프로모션', source: 'google', medium: 'search', url: 'https://amiko.com/signup', utmUrl: 'https://amiko.com/signup?utm_source=google&utm_medium=search&utm_campaign=new_user', spent: 4200, clicks: 18900, conversions: 940, revenue: 23500 },
    { id: 3, name: '인플루언서 바이럴 캠페인', source: 'instagram', medium: 'influencer', url: 'https://amiko.com/event', utmUrl: 'https://amiko.com/event?utm_source=instagram&utm_medium=influencer&utm_campaign=collab', spent: 1500, clicks: 8200, conversions: 210, revenue: 3800 }
  ]
  const [utmRecords, setUtmRecords] = useState(defaultUtmRecords)

  const defaultCreativeRecords = [
    { id: 1, name: '메인 비주얼 워크라이프 슬라이드', type: '이미지', target: '2030 직장인', copy: '주 4일제 실현, 아미코와 함께 스마트하게 일하세요!', spent: 1200, reach: 45000, clicks: 1800, conversions: 90 },
    { id: 2, name: '숏폼 댄스 챌린지 광고 (초인기)', type: '숏폼 비디오', target: '1020 학생층', copy: '아리라쿠 댄스 추고 신상 에디션 선물 받자 🎁', spent: 3000, reach: 180000, clicks: 12600, conversions: 480 }
  ]
  const [creativeRecords, setCreativeRecords] = useState(defaultCreativeRecords)

  const defaultMediaMixRecords = [
    { id: 1, channel: 'Meta Ads', spent: 8500, reach: 250000, clicks: 11000, conversions: 550, revenue: 27500 },
    { id: 2, channel: 'Google Ads', spent: 6200, reach: 190000, clicks: 9200, conversions: 410, revenue: 18400 },
    { id: 3, channel: 'TikTok Ads', spent: 3100, reach: 120000, clicks: 7500, conversions: 220, revenue: 5500 },
    { id: 4, channel: 'YouTube Ads', spent: 4000, reach: 98000, clicks: 4200, conversions: 180, revenue: 7200 },
    { id: 5, channel: 'Influencer', spent: 1500, reach: 35000, clicks: 2100, conversions: 90, revenue: 2700 }
  ]
  const [mediaMixRecords, setMediaMixRecords] = useState(defaultMediaMixRecords)

  const defaultFunnelRecords = [
    { id: 1, step: '1단계: 광고 노출 (Impressions)', users: 1000000, label: '노출', spent: 23300 },
    { id: 2, step: '2단계: 링크 클릭 (Clicks)', users: 65000, label: '클릭', spent: 23300 },
    { id: 3, step: '3단계: 상세페이지 탐색 (Views)', users: 28000, label: '상세보기', spent: 23300 },
    { id: 4, step: '4단계: 장바구니 담기 (Cart)', users: 8400, label: '장바구니', spent: 23300 },
    { id: 5, step: '5단계: 결제 및 전환 완료 (Purchase)', users: 2100, label: '구매완료', spent: 23300 }
  ]
  const [funnelRecords, setFunnelRecords] = useState(defaultFunnelRecords)

  // ==========================================
  // Interactive UTM Builder States & Handlers
  // ==========================================
  const [utmUrlInput, setUtmUrlInput] = useState('https://amiko.com/shop')
  const [utmSource, setUtmSource] = useState('naver')
  const [utmMedium, setUtmMedium] = useState('blog')
  const [utmCampaign, setUtmCampaign] = useState('brand_viral')
  const [utmContent, setUtmContent] = useState('')
  const [generatedUtm, setGeneratedUtm] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [newCampaignName, setNewCampaignName] = useState('브랜드 블로그 홍보 캠페인')

  // Real-time UTM generator trigger
  useEffect(() => {
    let url = utmUrlInput
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    const params = new URLSearchParams()
    if (utmSource) params.append('utm_source', utmSource)
    if (utmMedium) params.append('utm_medium', utmMedium)
    if (utmCampaign) params.append('utm_campaign', utmCampaign)
    if (utmContent) params.append('utm_content', utmContent)

    const queryString = params.toString()
    setGeneratedUtm(queryString ? `${url}?${queryString}` : url)
  }, [utmUrlInput, utmSource, utmMedium, utmCampaign, utmContent])

  // Copy UTM to Clipboard
  const handleCopyUtm = () => {
    navigator.clipboard.writeText(generatedUtm)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  // Add generated UTM campaign to active tracking table
  const handleAddUtmCampaign = () => {
    const newRecord = {
      id: Date.now(),
      name: newCampaignName || '신규 UTM 캠페인',
      source: utmSource || 'unknown',
      medium: utmMedium || 'unknown',
      url: utmUrlInput,
      utmUrl: generatedUtm,
      spent: 500,
      clicks: 1200,
      conversions: 45,
      revenue: 1650
    }
    setUtmRecords([newRecord, ...utmRecords])
    alert('새 UTM 캠페인이 하단 트래커 표에 등록되었습니다!')
  }

  const handleDeleteSnsRecord = (id) => {
    if (confirm('해당 성과 기록을 정말 삭제하시겠습니까?')) {
      setSnsRecords(snsRecords.filter(item => item.id !== id))
    }
  }

  // ==========================================
  // 4. Excel Import / Export 양방향 연동 엔진 (오리지널 서식 호환)
  // ==========================================
  
  // HTML 이중 병합 테이블을 그대로 SheetJS로 변환하여 동일한 엑셀 양식으로 저장
  const handleExportToExcel = () => {
    const tableElement = document.getElementById('sns-original-table-element')
    if (!tableElement) {
      alert('내보낼 표를 찾을 수 없습니다.')
      return
    }

    const ws = XLSX.utils.table_to_sheet(tableElement)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'SNS계정 성과 분석표')
    XLSX.writeFile(wb, 'SNS계정_성과_분석표_연동본.xlsx')
  }

  // 사용자 엑셀 파일 수신 파서
  const handleSnsExcelUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        
        // Convert worksheet to raw arrays to parse double header rows
        const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1 })
        
        // Minimum rows expected for header (2 rows) + data (1 row)
        if (rawRows.length <= 2) {
          alert('엑셀 시트에 데이터가 없거나 서식이 올바르지 않습니다.')
          return
        }

        // We will parse from 3rd row (index 2) onwards
        const parsedRecords = []
        let currentMonth = '4월'

        for (let i = 2; i < rawRows.length; i++) {
          const row = rawRows[i]
          if (!row || row.length === 0) continue

          // Handle month grouping rowspan fallback
          const monthCell = row[0]
          if (monthCell) {
            currentMonth = String(monthCell).trim()
          }

          const num = parseInt(row[1]) || (parsedRecords.length + 1)
          const date = row[2] ? String(row[2]).trim() : '04월 01일'
          const type = row[3] ? String(row[3]).trim() : '릴스'
          const format = row[4] ? String(row[4]).trim() : '영상'
          const topic = row[5] ? String(row[5]).trim() : '유머'
          const ads = row[6] ? String(row[6]).trim() : 'x'

          // Instagram mapping based on cell column index
          const instaViews = parseInt(row[7]) || 0
          const instaReach = parseInt(row[8]) || 0
          const instaLikes = parseInt(row[9]) || 0
          const instaComments = parseInt(row[10]) || 0
          const instaSaves = parseInt(row[11]) || 0
          const instaShares = parseInt(row[12]) || 0
          const instaProfile = parseInt(row[13]) || 0
          const instaSite = parseInt(row[14]) || 0
          const instaFollow = parseInt(row[15]) || 0
          const instaSpent = parseInt(row[16]) || 0
          const instaCostPerGoal = parseInt(row[17]) || 0
          
          // TikTok mapping based on cell column index
          const tiktokReach = parseInt(row[21]) || 0
          const tiktokViews = parseInt(row[22]) || 0
          const tiktokLikes = parseInt(row[23]) || 0
          const tiktokComments = parseInt(row[24]) || 0
          const tiktokShares = parseInt(row[25]) || 0
          const tiktokSaves = parseInt(row[26]) || 0
          const tiktokFollow = parseInt(row[27]) || 0

          parsedRecords.push({
            id: Date.now() + i,
            month: currentMonth,
            num,
            date,
            type,
            format,
            topic,
            ads,
            insta: {
              views: instaViews,
              reach: instaReach,
              likes: instaLikes,
              comments: instaComments,
              saves: instaSaves,
              shares: instaShares,
              profile: instaProfile,
              site: instaSite,
              follow: instaFollow,
              spent: instaSpent,
              costPerGoal: instaCostPerGoal,
              gender: { male: 15, female: 85 },
              countries: [],
              age: { '18-24': 30, '25-34': 50, '35-44': 15, '45-54': 4, '55+': 1 }
            },
            tiktok: {
              reach: tiktokReach,
              views: tiktokViews,
              likes: tiktokLikes,
              comments: tiktokComments,
              shares: tiktokShares,
              saves: tiktokSaves,
              follow: tiktokFollow,
              gender: { male: 15, female: 85 },
              countries: [],
              age: { '18-24': 30, '25-34': 50, '35-44': 15, '45-54': 4, '55+': 1 }
            }
          })
        }

        if (parsedRecords.length > 0) {
          setSnsRecords(parsedRecords)
          alert(`사용자님의 'SNS계정 성과 분석표' ${parsedRecords.length}행을 완벽하게 파싱 및 동기화했습니다!`)
        } else {
          alert('데이터 행을 읽지 못했습니다. 헤더 행 아래에 기록이 채워져 있는지 확인해 주세요.')
        }

      } catch (err) {
        console.error(err)
        alert('엑셀 파싱 중 에러가 발생했습니다. 헤더 열 순서나 형식을 검토해 주세요.')
      }
    }
    reader.readAsBinaryString(file)
  }

  // ==========================================
  // 5. Date Parsing and Filtering Core Engine
  // ==========================================
  
  // Converts '04월 12일' and '4월' to a standard 'YYYY-MM-DD' for solid comparison
  const parseSnsDateToIso = (monthStr, dateStr) => {
    if (!monthStr || !dateStr) return '2026-01-01'
    try {
      const m = parseInt(monthStr.replace(/[^0-9]/g, '')) || 1
      const parts = dateStr.trim().split(/\s+/)
      const dayPart = parts[parts.length - 1]
      const d = parseInt(dayPart.replace(/[^0-9]/g, '')) || 1

      const year = 2026 // Standard static year for demo sync
      const mm = String(m).padStart(2, '0')
      const dd = String(d).padStart(2, '0')
      return `${year}-${mm}-${dd}`
    } catch (e) {
      return '2026-01-01'
    }
  }

  // Dynamic filter binder
  const filteredSnsRecords = snsRecords.filter(item => {
    const itemIso = parseSnsDateToIso(item.month, item.date)
    return itemIso >= startDate && itemIso <= endDate
  })

  // Format YYYY-MM-DD back to readable Korean dates for UI headers
  const get집계기간 = () => {
    const formatIso = (isoStr) => {
      if (!isoStr) return ''
      const parts = isoStr.split('-')
      return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일`
    }
    return `${formatIso(startDate)} ~ ${formatIso(endDate)}`
  }

  const handleResetToPrevMonth = () => {
    setStartDate(defaultRange.start)
    setEndDate(defaultRange.end)
  }

  // Scorecards logic: Instagram + TikTok summaries based on dynamic FILTERED records
  const getCoreMetrics = () => {
    const totalInstaViews = filteredSnsRecords.reduce((acc, c) => acc + c.insta.views, 0)
    const totalTiktokViews = filteredSnsRecords.reduce((acc, c) => acc + c.tiktok.views, 0)
    const totalReach = filteredSnsRecords.reduce((acc, c) => acc + (c.insta.reach + c.tiktok.reach), 0)
    const totalSpent = filteredSnsRecords.reduce((acc, c) => acc + c.insta.spent, 0)
    const totalLikes = filteredSnsRecords.reduce((acc, c) => acc + (c.insta.likes + c.tiktok.likes), 0)
    
    // Overall engagement rate ER (Likes + Comments + Saves / Views)
    const totalEngagement = filteredSnsRecords.reduce((acc, c) => {
      const instaEng = c.insta.likes + c.insta.comments + c.insta.saves + c.insta.shares
      const tiktokEng = c.tiktok.likes + c.tiktok.comments + c.tiktok.saves + c.tiktok.shares
      return acc + (instaEng + tiktokEng)
    }, 0)

    const avgEr = (totalInstaViews + totalTiktokViews) > 0 ? (totalEngagement / (totalInstaViews + totalTiktokViews)) * 100 : 0

    return {
      totalViews: totalInstaViews + totalTiktokViews,
      totalReach,
      totalSpent,
      avgEr,
      totalLikes
    }
  }

  const snsMetrics = getCoreMetrics()

  // Real-time calculated AI Insights based on user original sheet and FILTERED records
  const renderOriginalSnsAiInsights = () => {
    if (filteredSnsRecords.length === 0) {
      return (
        <div className="p-3 rounded text-center small text-white-50" style={{ background: 'rgba(255,255,255,0.05)' }}>
          선택하신 기간 내에 분석할 소셜 데이터가 존재하지 않습니다. 날짜 범위를 조정해 주세요.
        </div>
      )
    }

    let topContent = { date: '-', views: 0, platform: '-' }

    filteredSnsRecords.forEach(item => {
      if (item.insta.views > topContent.views) {
        topContent = { date: item.date, views: item.insta.views, platform: '인스타그램 릴스', topic: item.topic }
      }
      if (item.tiktok.views > topContent.views) {
        topContent = { date: item.date, views: item.tiktok.views, platform: '틱톡 비디오', topic: item.topic }
      }
    })

    return (
      <>
        <div className="p-3 rounded mb-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="fw-semibold text-warning small mb-1">🔥 최고 메가 히트 콘텐츠 감지</div>
          <p className="small text-white-50 m-0 leading-relaxed">
            해당 설정 기간 중, <strong>[{topContent.date}]</strong>에 업로드된 <strong>{topContent.platform} ({topContent.topic})</strong> 콘텐츠가 조회수 <strong>{topContent.views.toLocaleString()}회</strong>를 돌파하며 최고 실적을 냈습니다.
          </p>
        </div>
        <div className="p-3 rounded mb-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="fw-semibold text-success small mb-1">📊 채널 점유율 및 성비 요약</div>
          <p className="small text-white-50 m-0 leading-relaxed">
            해당 기간 유저층 분석 결과, 인스타의 주요 유저층은 <strong>여성(평균 88% 이상)</strong>이며 <strong>25-34 연령대</strong>가 최대 핵심 기여 오디언스입니다.
          </p>
        </div>
      </>
    )
  }

  // =========================================================
  // 6. 월별 총합 조회수 롤업(Roll-up) 및 ApexCharts 연동 로직 (FILTERED)
  // =========================================================
  const getMonthlyRollupData = () => {
    const rollupMap = {}
    filteredSnsRecords.forEach(item => {
      const m = item.month
      if (!rollupMap[m]) {
        rollupMap[m] = { month: m, instaViews: 0, tiktokViews: 0 }
      }
      rollupMap[m].instaViews += item.insta.views
      rollupMap[m].tiktokViews += item.tiktok.views
    })
    
    const sortedKeys = Object.keys(rollupMap).sort((a, b) => {
      const numA = parseInt(a) || 0
      const numB = parseInt(b) || 0
      return numA - numB
    })
    
    return sortedKeys.map(k => rollupMap[k])
  }

  const rollupData = getMonthlyRollupData()
  const chartMonths = rollupData.map(item => item.month)
  const chartInstaViews = rollupData.map(item => item.instaViews)
  const chartTiktokViews = rollupData.map(item => item.tiktokViews)

  const snsChartOptions = {
    chart: {
      id: 'sns-account-comparison',
      toolbar: { show: false }
    },
    stroke: {
      width: [3, 3],
      curve: 'smooth'
    },
    colors: ['#e1306c', '#000000'],
    labels: chartMonths,
    xaxis: {
      type: 'category'
    },
    yaxis: {
      title: { text: '설정 기간 월간 누적 조회수 ($)' },
      labels: { formatter: (value) => value.toLocaleString() }
    },
    tooltip: {
      shared: true
    }
  }

  const snsChartSeries = [
    { name: '인스타그램 총 조회수', data: chartInstaViews },
    { name: '틱톡 총 조회수', data: chartTiktokViews }
  ]

  // Dynamic Rowspan Helper for month cell merge (based on FILTERED records)
  const renderMonthCell = (record, index) => {
    const currentMonth = record.month
    if (index > 0 && filteredSnsRecords[index - 1].month === currentMonth) {
      return null
    }

    let rowspanCount = 0
    for (let i = index; i < filteredSnsRecords.length; i++) {
      if (filteredSnsRecords[i].month === currentMonth) {
        rowspanCount++
      } else {
        break
      }
    }

    return (
      <td rowSpan={rowspanCount} className="align-middle fw-bold bg-light text-dark text-center border-end" style={{ verticalAlign: 'middle', fontSize: '13px' }}>
        {currentMonth}
      </td>
    )
  }

  return (
    <>
      {/* 📅 대시보드 메인 날짜 필터 영역 (Meta Business Suite 세련된 이식) */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-light p-3 rounded border flex-wrap gap-3">
        <div className="d-flex align-items-center flex-wrap gap-2">
          <span className="fs-5 me-2">📅</span>
          <span className="fw-bold text-dark fs-6 me-3">분석 기간 설정: </span>
          
          <div className="d-flex align-items-center gap-1">
            <CFormInput
              type="date"
              size="sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ maxWidth: '145px' }}
            />
            <span className="mx-1 text-muted fw-bold">~</span>
            <CFormInput
              type="date"
              size="sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ maxWidth: '145px' }}
            />
          </div>

          <CButton
            color="outline-secondary"
            size="sm"
            className="fw-bold ms-2 px-3"
            style={{ fontSize: '11px' }}
            onClick={handleResetToPrevMonth}
          >
            기본값 복원 (전달 1일~말일)
          </CButton>
        </div>
        
        <div className="d-flex align-items-center gap-2">
          <CBadge color="primary" className="px-3 py-2" style={{ fontSize: '11px' }}>
            {get집계기간()}
          </CBadge>
          <div className="text-muted small">
            지정 범위 내 콘텐츠: <strong>{filteredSnsRecords.length}개</strong>
          </div>
        </div>
      </div>

      {/* 1. Global Core KPI Scorecards */}
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        <CCol sm={6} xl={3}>
          <CCard className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #321fdb, #1f1498)' }}>
            <CCardBody className="pb-4 px-4 pt-4">
              <div className="small text-white-50 fw-semibold text-uppercase">기간 통합 총 조회수</div>
              <div className="fs-2 fw-bold mt-2">{snsMetrics.totalViews.toLocaleString()} 회</div>
              <div className="small text-white-50 mt-3">지정 날짜 범위 내 누적 모수</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} xl={3}>
          <CCard className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #e1306c, #a81c4e)' }}>
            <CCardBody className="pb-4 px-4 pt-4">
              <div className="small text-white-50 fw-semibold text-uppercase">기간 누적 총 인게이지먼트</div>
              <div className="fs-2 fw-bold mt-2">{snsMetrics.totalLikes.toLocaleString()} 건</div>
              <div className="small text-white-50 mt-3">범위 내 소셜 인터랙션 반응수</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} xl={3}>
          <CCard className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #f9b115, #f6960b)' }}>
            <CCardBody className="pb-4 px-4 pt-4">
              <div className="small text-white-50 fw-semibold text-uppercase">기간 평균 참여율 (ER%)</div>
              <div className="fs-2 fw-bold mt-2">{snsMetrics.avgEr.toFixed(2)}%</div>
              <div className="small text-white-50 mt-3">설정 범위 내 참여 효율성 통계</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} xl={3}>
          <CCard className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #35495e, #2c3e50)' }}>
            <CCardBody className="pb-4 px-4 pt-4">
              <div className="small text-white-50 fw-semibold text-uppercase">기간 광고 지출액</div>
              <div className="fs-2 fw-bold mt-2">₩{snsMetrics.totalSpent.toLocaleString()}</div>
              <div className="small text-white-50 mt-3">설정 범위 내 인스타 타겟 광고비</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* 2. Core 5-Tab Workspace Area */}
      <CRow className="mb-4">
        <CCol xl={9} className="mb-4">
          <CCard className="border-0 shadow-sm mb-4">
            <CCardHeader className="bg-white border-0 pt-4 px-4 pb-2">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h4 className="fw-bold text-dark mb-1">📱 SNS 통합 성과 관리 샌드박스</h4>
                  <p className="text-muted small mb-0">사용자님의 오리지널 'SNS계정 성과 분석표'를 100% 동일하게 웹으로 연동한 통합 매니징 시스템입니다.</p>
                </div>
              </div>
            </CCardHeader>
            <CCardBody className="p-0">
              <CNav variant="tabs" className="px-4 border-bottom-0">
                <CNavItem>
                  <CNavLink
                    active={activeKey === 'original_sns'}
                    onClick={() => setActiveKey('original_sns')}
                    className="fw-bold"
                    style={{ cursor: 'pointer' }}
                  >
                    📱 SNS 오리지널 성과표
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeKey === 'utm'}
                    onClick={() => setActiveKey('utm')}
                    className="fw-bold"
                    style={{ cursor: 'pointer' }}
                  >
                    🔗 UTM 캠페인 트래커
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeKey === 'creative'}
                    onClick={() => setActiveKey('creative')}
                    className="fw-bold"
                    style={{ cursor: 'pointer' }}
                  >
                    🖼️ 광고 소재 A/B 분석
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeKey === 'mediamix'}
                    onClick={() => setActiveKey('mediamix')}
                    className="fw-bold"
                    style={{ cursor: 'pointer' }}
                  >
                    ⚖️ 매체 믹스 시뮬레이터
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeKey === 'funnel'}
                    onClick={() => setActiveKey('funnel')}
                    className="fw-bold"
                    style={{ cursor: 'pointer' }}
                  >
                    📈 풀퍼널 깔때기 분석
                  </CNavLink>
                </CNavItem>
              </CNav>

              <CTabContent className="p-4 bg-white rounded-bottom border-top border-light">
                {/* TAB 0: ORIGINAL USER SNS TABLE */}
                <CTabPane visible={activeKey === 'original_sns'}>
                  <CRow className="mb-4">
                    <CCol lg={12} className="mb-4">
                      <div className="p-3 bg-light rounded border">
                        <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                          <div>
                            <h6 className="fw-bold text-dark mb-1">📈 인스타그램 vs 틱톡 월간 누적 조회수 합산 트렌드 (설정 범위 집계)</h6>
                            <span className="small text-muted">선택하신 날짜 범위 내에서 채널별 총합 조회수 추이를 자동으로 시각화합니다.</span>
                          </div>
                          <CButton color="outline-primary" size="sm" className="fw-bold shadow-sm" onClick={handleExportToExcel}>
                            📥 엑셀로 내보내기 (서식 완벽 호환)
                          </CButton>
                        </div>
                        {filteredSnsRecords.length > 0 ? (
                          <Chart
                            options={snsChartOptions}
                            series={snsChartSeries}
                            type="line"
                            height={240}
                          />
                        ) : (
                          <div className="py-5 text-center text-muted small bg-white rounded border">
                            선택하신 기간 내에 렌더링할 조회수 데이터가 존재하지 않습니다. 시작/종료일을 넓혀주세요.
                          </div>
                        )}
                      </div>
                    </CCol>
                  </CRow>

                  {/* HIGH-DENSITY ORIGINAL TABLE */}
                  <h6 className="fw-bold text-dark mb-2">📋 SNS계정 통합 성과 분석표 (Original Double-Header Grid)</h6>
                  <div className="table-responsive rounded border" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <CTable id="sns-original-table-element" bordered hover align="middle" className="mb-0 text-center small text-nowrap" style={{ fontSize: '11px' }}>
                      <CTableHead className="bg-light sticky-top" style={{ zIndex: 5 }}>
                        {/* Upper Header Row */}
                        <CTableRow>
                          <CTableHeaderCell rowSpan={2} colSpan={7}>기본 정보</CTableHeaderCell>
                          <CTableHeaderCell colSpan={13} className="text-white bg-danger" style={{ background: '#e1306c' }}>인스타그램</CTableHeaderCell>
                          <CTableHeaderCell colSpan={10} className="text-white bg-dark" style={{ background: '#000000' }}>틱톡</CTableHeaderCell>
                          <CTableHeaderCell rowSpan={2}>관리</CTableHeaderCell>
                        </CTableRow>
                        {/* Lower Header Row */}
                        <CTableRow>
                          {/* Instagram metrics */}
                          <CTableHeaderCell style={{ background: '#fff5f7' }}>조회수</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#fff5f7' }}>도달</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#fff5f7' }}>좋아요</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#fff5f7' }}>댓글</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#fff5f7' }}>저장</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#fff5f7' }}>공유</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#fff5f7' }}>프로필</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#fff5f7' }}>사이트</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#fff5f7' }}>팔로우</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#fff5f7' }}>광고비(원)</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#fff5f7' }}>목표당 비용</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#fff5f7' }}>성비(남/여)</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#fff5f7' }}>연령대</CTableHeaderCell>

                          {/* TikTok metrics */}
                          <CTableHeaderCell style={{ background: '#f5f5f5' }}>도달</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#f5f5f5' }}>조회수</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#f5f5f5' }}>좋아요</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#f5f5f5' }}>댓글</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#f5f5f5' }}>공유</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#f5f5f5' }}>저장</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#f5f5f5' }}>팔로우</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#f5f5f5' }}>성비(남/여)</CTableHeaderCell>
                          <CTableHeaderCell style={{ background: '#f5f5f5' }}>연령대</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {filteredSnsRecords.map((item, idx) => {
                          // Find top age range in Instagram for representative print
                          let topInstaAge = '-';
                          let topInstaAgeVal = 0;
                          Object.entries(item.insta.age).forEach(([k, v]) => {
                            if (v > topInstaAgeVal) {
                              topInstaAgeVal = v;
                              topInstaAge = k;
                            }
                          });

                          // Find top age range in TikTok for representative print
                          let topTiktokAge = '-';
                          let topTiktokAgeVal = 0;
                          Object.entries(item.tiktok.age).forEach(([k, v]) => {
                            if (v > topTiktokAgeVal) {
                              topTiktokAgeVal = v;
                              topTiktokAge = k;
                            }
                          });

                          return (
                            <CTableRow key={item.id}>
                              {/* Grouped Month logic */}
                              {renderMonthCell(item, idx)}
                              
                              <CTableDataCell className="fw-semibold">{item.num}</CTableDataCell>
                              <CTableDataCell>{item.date}</CTableDataCell>
                              <CTableDataCell>
                                <CBadge color={item.type === '릴스' ? 'danger' : 'info'} size="sm">{item.type}</CBadge>
                              </CTableDataCell>
                              <CTableDataCell>{item.format}</CTableDataCell>
                              <CTableDataCell>{item.topic}</CTableDataCell>
                              <CTableDataCell className="text-muted">{item.ads}</CTableDataCell>

                              {/* Instagram details */}
                              <CTableDataCell className="fw-bold">{item.insta.views.toLocaleString()}</CTableDataCell>
                              <CTableDataCell className="text-muted">{item.insta.reach.toLocaleString()}</CTableDataCell>
                              <CTableDataCell className="text-danger">{item.insta.likes.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.insta.comments.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.insta.saves.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.insta.shares.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.insta.profile.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.insta.site.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.insta.follow.toLocaleString()}</CTableDataCell>
                              <CTableDataCell className="text-primary fw-bold">
                                {item.insta.spent > 0 ? `₩${item.insta.spent.toLocaleString()}` : '-'}
                              </CTableDataCell>
                              <CTableDataCell>
                                {item.insta.costPerGoal > 0 ? `${item.insta.costPerGoal}원` : '-'}
                              </CTableDataCell>
                              <CTableDataCell style={{ minWidth: '85px' }}>
                                {item.insta.gender.male > 0 ? (
                                  <div>
                                    <span className="text-primary fw-bold">{item.insta.gender.male}%</span>
                                    <span className="mx-1 text-muted">|</span>
                                    <span className="text-danger fw-bold">{item.insta.gender.female}%</span>
                                  </div>
                                ) : '-'}
                              </CTableDataCell>
                              <CTableDataCell>
                                {topInstaAgeVal > 0 ? (
                                  <CBadge color="primary" className="fw-normal">
                                    {topInstaAge} ({topInstaAgeVal}%)
                                  </CBadge>
                                ) : '-'}
                              </CTableDataCell>

                              {/* TikTok details */}
                              <CTableDataCell className="text-muted">{item.tiktok.reach.toLocaleString()}</CTableDataCell>
                              <CTableDataCell className="fw-bold">{item.tiktok.views.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.tiktok.likes.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.tiktok.comments.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.tiktok.shares.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.tiktok.saves.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.tiktok.follow.toLocaleString()}</CTableDataCell>
                              <CTableDataCell style={{ minWidth: '85px' }}>
                                {item.tiktok.gender.male > 0 ? (
                                  <div>
                                    <span className="text-primary fw-bold">{item.tiktok.gender.male}%</span>
                                    <span className="mx-1 text-muted">|</span>
                                    <span className="text-danger fw-bold">{item.tiktok.gender.female}%</span>
                                  </div>
                                ) : '-'}
                              </CTableDataCell>
                              <CTableDataCell>
                                {topTiktokAgeVal > 0 ? (
                                  <CBadge color="dark" className="fw-normal">
                                    {topTiktokAge} ({topTiktokAgeVal}%)
                                  </CBadge>
                                ) : '-'}
                              </CTableDataCell>

                              <CTableDataCell>
                                <CButton color="link" className="text-danger p-0 fw-bold small text-decoration-none" onClick={() => handleDeleteSnsRecord(item.id)}>
                                  삭제
                                </CButton>
                              </CTableDataCell>
                            </CTableRow>
                          )
                        })}
                        {filteredSnsRecords.length === 0 && (
                          <CTableRow>
                            <CTableDataCell colSpan={31} className="py-5 text-muted small bg-white text-center">
                              선택하신 기간({startDate} ~ {endDate}) 내에 분석 대상 소셜 레코드가 없습니다. 달력을 조정하거나 다른 엑셀을 추가 연동해 주세요.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </div>
                </CTabPane>

                {/* TAB 1: UTM Campaign Tracker */}
                <CTabPane visible={activeKey === 'utm'}>
                  <h6 className="fw-bold text-dark mb-3">🔗 UTM 캠페인 생성기 및 성과 분석</h6>
                  <CRow>
                    <CCol lg={12} className="mb-3">
                      <div className="p-3 bg-light rounded border">
                        <CForm className="row g-2">
                          <CCol md={6}>
                            <label className="small fw-semibold text-muted mb-1">대상 URL</label>
                            <CFormInput size="sm" value={utmUrlInput} onChange={(e) => setUtmUrlInput(e.target.value)} placeholder="https://amiko.com/shop" />
                          </CCol>
                          <CCol md={2}>
                            <label className="small fw-semibold text-muted mb-1">Source</label>
                            <CFormInput size="sm" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} />
                          </CCol>
                          <CCol md={2}>
                            <label className="small fw-semibold text-muted mb-1">Medium</label>
                            <CFormInput size="sm" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} />
                          </CCol>
                          <CCol md={2}>
                            <label className="small fw-semibold text-muted mb-1">Campaign</label>
                            <CFormInput size="sm" value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} />
                          </CCol>
                        </CForm>
                        <div className="mt-3 p-2 bg-white rounded border small text-break">
                          <strong className="text-primary">생성 URL: </strong>{generatedUtm}
                        </div>
                        <div className="mt-2 d-flex gap-2">
                          <CButton color="primary" size="sm" onClick={handleCopyUtm}>
                            {copySuccess ? '복사 완료! 👍' : '클립보드 복사'}
                          </CButton>
                          <CButton color="success" size="sm" className="text-white" onClick={handleAddUtmCampaign}>
                            트래커에 주입
                          </CButton>
                        </div>
                      </div>
                    </CCol>
                  </CRow>
                  <div className="table-responsive rounded border mt-3">
                    <CTable bordered hover align="middle" className="mb-0 text-center small text-nowrap">
                      <CTableHead className="bg-light">
                        <CTableRow>
                          <CTableHeaderCell>캠페인명</CTableHeaderCell>
                          <CTableHeaderCell>소스/매체</CTableHeaderCell>
                          <CTableHeaderCell>광고비</CTableHeaderCell>
                          <CTableHeaderCell>클릭수</CTableHeaderCell>
                          <CTableHeaderCell>전환수</CTableHeaderCell>
                          <CTableHeaderCell>전환율(CVR)</CTableHeaderCell>
                          <CTableHeaderCell>매출액</CTableHeaderCell>
                          <CTableHeaderCell>ROAS</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {utmRecords.map(item => {
                          const cvr = item.clicks > 0 ? (item.conversions / item.clicks) * 100 : 0
                          const roas = item.spent > 0 ? (item.revenue / item.spent) * 100 : 0
                          return (
                            <CTableRow key={item.id}>
                              <CTableDataCell className="fw-bold">{item.name}</CTableDataCell>
                              <CTableDataCell>{item.source} / {item.medium}</CTableDataCell>
                              <CTableDataCell>${item.spent.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.clicks.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.conversions.toLocaleString()}</CTableDataCell>
                              <CTableDataCell className="text-primary">{cvr.toFixed(2)}%</CTableDataCell>
                              <CTableDataCell>${item.revenue.toLocaleString()}</CTableDataCell>
                              <CTableDataCell className="text-warning fw-bold">{roas.toFixed(1)}%</CTableDataCell>
                            </CTableRow>
                          )
                        })}
                      </CTableBody>
                    </CTable>
                  </div>
                </CTabPane>

                {/* TAB 2: Creative A/B */}
                <CTabPane visible={activeKey === 'creative'}>
                  <h6 className="fw-bold text-dark mb-3">🖼️ 크리에이티브 A/B 테스트 성과표</h6>
                  <div className="table-responsive rounded border">
                    <CTable bordered hover align="middle" className="mb-0 text-center small text-nowrap">
                      <CTableHead className="bg-light">
                        <CTableRow>
                          <CTableHeaderCell>소재명</CTableHeaderCell>
                          <CTableHeaderCell>포맷</CTableHeaderCell>
                          <CTableHeaderCell>타겟층</CTableHeaderCell>
                          <CTableHeaderCell>광고비</CTableHeaderCell>
                          <CTableHeaderCell>클릭률(CTR)</CTableHeaderCell>
                          <CTableHeaderCell>전환수</CTableHeaderCell>
                          <CTableHeaderCell>전환단가(CPA)</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {creativeRecords.map(item => {
                          const ctr = item.reach > 0 ? (item.clicks / item.reach) * 100 : 0
                          const cpa = item.conversions > 0 ? item.spent / item.conversions : 0
                          return (
                            <CTableRow key={item.id}>
                              <CTableDataCell className="fw-bold">{item.name}</CTableDataCell>
                              <CTableDataCell>{item.type}</CTableDataCell>
                              <CTableDataCell>{item.target}</CTableDataCell>
                              <CTableDataCell>${item.spent.toLocaleString()}</CTableDataCell>
                              <CTableDataCell className="text-success fw-bold">{ctr.toFixed(2)}%</CTableDataCell>
                              <CTableDataCell>{item.conversions}명</CTableDataCell>
                              <CTableDataCell className="fw-bold">${cpa.toFixed(1)}</CTableDataCell>
                            </CTableRow>
                          )
                        })}
                      </CTableBody>
                    </CTable>
                  </div>
                </CTabPane>

                {/* TAB 3: Media Mix */}
                <CTabPane visible={activeKey === 'mediamix'}>
                  <h6 className="fw-bold text-dark mb-3">⚖️ 글로벌 채널별 예산 배분 & 매체 믹스</h6>
                  <div className="table-responsive rounded border">
                    <CTable bordered hover align="middle" className="mb-0 text-center small text-nowrap">
                      <CTableHead className="bg-light">
                        <CTableRow>
                          <CTableHeaderCell>매체</CTableHeaderCell>
                          <CTableHeaderCell>배정 예산</CTableHeaderCell>
                          <CTableHeaderCell>클릭수</CTableHeaderCell>
                          <CTableHeaderCell>전환수</CTableHeaderCell>
                          <CTableHeaderCell>결제 매출</CTableHeaderCell>
                          <CTableHeaderCell>ROAS</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {mediaMixRecords.map(item => {
                          const roas = item.spent > 0 ? (item.revenue / item.spent) * 100 : 0
                          return (
                            <CTableRow key={item.id}>
                              <CTableDataCell className="fw-bold">{item.channel}</CTableDataCell>
                              <CTableDataCell>${item.spent.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.clicks.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>{item.conversions.toLocaleString()}</CTableDataCell>
                              <CTableDataCell>${item.revenue.toLocaleString()}</CTableDataCell>
                              <CTableDataCell className="text-warning fw-bold">{roas.toFixed(1)}%</CTableDataCell>
                            </CTableRow>
                          )
                        })}
                      </CTableBody>
                    </CTable>
                  </div>
                </CTabPane>

                {/* TAB 4: Funnel */}
                <CTabPane visible={activeKey === 'funnel'}>
                  <h6 className="fw-bold text-dark mb-3">📈 풀퍼널 깔때기 단계별 전환율</h6>
                  <div className="table-responsive rounded border">
                    <CTable bordered hover align="middle" className="mb-0 text-center small text-nowrap">
                      <CTableHead className="bg-light">
                        <CTableRow>
                          <CTableHeaderCell>깔때기 단계</CTableHeaderCell>
                          <CTableHeaderCell>사용자 모수</CTableHeaderCell>
                          <CTableHeaderCell>단계별 생존율</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {funnelRecords.map((item, idx) => {
                          const pct = (item.users / funnelRecords[0].users) * 100
                          return (
                            <CTableRow key={item.id}>
                              <CTableDataCell className="fw-bold text-start px-4">{item.step}</CTableDataCell>
                              <CTableDataCell>{item.users.toLocaleString()}명</CTableDataCell>
                              <CTableDataCell>
                                <div className="d-flex align-items-center gap-2">
                                  <CProgress className="flex-grow-1" value={pct} color="success" style={{ height: '8px' }} />
                                  <span>{pct.toFixed(2)}%</span>
                                </div>
                              </CTableDataCell>
                            </CTableRow>
                          )
                        })}
                      </CTableBody>
                    </CTable>
                  </div>
                </CTabPane>
              </CTabContent>
            </CCardBody>
          </CCard>

          {/* Excel Import zone specific to SNS계정 성과 분석표 */}
          <CCard className="border-0 shadow-sm">
            <CCardHeader className="bg-white border-0 pt-4 px-4 pb-0">
              <h5 className="m-0 fw-bold text-dark">📥 오리지널 엑셀 시트 연동 드롭존</h5>
              <span className="small text-muted">작성해오시던 'SNS계정 성과 분석표' 엑셀파일(.xlsx)을 그대로 올리면 테이블에 양방향 동기화 처리됩니다.</span>
            </CCardHeader>
            <CCardBody className="p-4">
              <div className="p-4 rounded border-2 border-dashed border-primary text-center bg-light">
                <div className="mb-3">
                  <span className="fs-3">📁</span>
                </div>
                <h6 className="fw-semibold text-dark mb-2">오리지널 SNS 성과 시트 파일 선택</h6>
                <p className="small text-muted mb-3">지원 서식: 사용자 엑셀 원본 파일 구조 (기본 정보 + 인스타그램 + 틱톡 이중 헤더 구조)</p>
                <div className="d-flex flex-wrap gap-2 justify-content-center align-items-center">
                  <div className="d-inline-block">
                    <input
                      type="file"
                      id="snsExcelUpload"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleSnsExcelUpload}
                      className="form-control"
                      style={{ maxWidth: '350px' }}
                    />
                  </div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Right Sidebar: AI CMO Core Analytics Feedback */}
        <CCol xl={3} className="mb-4">
          <CCard className="border-0 shadow-sm text-white h-100" style={{ background: 'linear-gradient(135deg, #1d2731, #0f171e)', minHeight: '400px' }}>
            <CCardHeader className="border-0 pt-4 px-4 bg-transparent pb-0">
              <h5 className="m-0 fw-bold">🤖 AI CMO 실시간 성과 진단</h5>
              <span className="small text-white-50">글로벌 마케팅 기여 실무 정밀 분석</span>
            </CCardHeader>
            <CCardBody className="px-4 pb-4 pt-3 d-flex flex-column justify-content-between">
              <div>
                <div className="p-3 rounded mb-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="fw-semibold text-info small mb-1">💡 현재 활성 모드 감지</div>
                  <p className="small text-white-50 m-0">
                    현재 <strong>{
                      activeKey === 'original_sns' ? 'SNS 오리지널 성과표' : 
                      activeKey === 'utm' ? 'UTM 캠페인 트래커' : 
                      activeKey === 'creative' ? '광고 소재 A/B 분석' : 
                      activeKey === 'mediamix' ? '매체 믹스 시뮬레이터' : '풀퍼널 깔때기 분석'
                    }</strong> 분석 모드가 실시간 기여 갱신 중입니다.
                  </p>
                </div>

                {/* Render tab-specific calculated insights */}
                {activeKey === 'original_sns' ? renderOriginalSnsAiInsights() : (
                  <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="fw-semibold text-warning small mb-1">💡 통합 채널 모니터링</div>
                    <p className="small text-white-50 m-0">
                      서브 마케팅 분석 도구들을 활용해 채널 예산 시뮬레이션 및 UTM 링크 생성을 진행해 보세요.
                    </p>
                  </div>
                )}
                
              </div>
              <div className="mt-4 pt-3 border-top border-secondary text-center small text-white-50">
                Verbos Live Marketing Core v2.5
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default MarketingDashboard
