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
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import Chart from 'react-apexcharts'
import * as XLSX from 'xlsx'

const MarketingDashboard = () => {
  // Active Tab state: 'utm' | 'creative' | 'mediamix' | 'funnel'
  const [activeKey, setActiveKey] = useState('utm')

  // ==========================================
  // 1. Data States (Loaded with standard mock templates)
  // ==========================================

  // Tab 1: UTM Campaign Tracker Data
  const defaultUtmRecords = [
    { id: 1, name: '여름 시즌 빅세일 대축제', source: 'facebook', medium: 'cpc', url: 'https://amiko.com/shop', utmUrl: 'https://amiko.com/shop?utm_source=facebook&utm_medium=cpc&utm_campaign=summer_sale', spent: 3500, clicks: 12500, conversions: 620, revenue: 18600 },
    { id: 2, name: '신규 가입 웰컴 프로모션', source: 'google', medium: 'search', url: 'https://amiko.com/signup', utmUrl: 'https://amiko.com/signup?utm_source=google&utm_medium=search&utm_campaign=new_user', spent: 4200, clicks: 18900, conversions: 940, revenue: 23500 },
    { id: 3, name: '인플루언서 바이럴 캠페인', source: 'instagram', medium: 'influencer', url: 'https://amiko.com/event', utmUrl: 'https://amiko.com/event?utm_source=instagram&utm_medium=influencer&utm_campaign=collab', spent: 1500, clicks: 8200, conversions: 210, revenue: 3800 },
    { id: 4, name: '리타겟팅 카탈로그 광고', source: 'criteo', medium: 'display', url: 'https://amiko.com/products', utmUrl: 'https://amiko.com/products?utm_source=criteo&utm_medium=display&utm_campaign=retargeting', spent: 2200, clicks: 11000, conversions: 450, revenue: 8900 }
  ]
  const [utmRecords, setUtmRecords] = useState(defaultUtmRecords)

  // Tab 2: Creative A/B Performance Data
  const defaultCreativeRecords = [
    { id: 1, name: '메인 비주얼 워크라이프 슬라이드', type: '이미지', target: '2030 직장인', copy: '주 4일제 실현, 아미코와 함께 스마트하게 일하세요!', spent: 1200, reach: 45000, clicks: 1800, conversions: 90 },
    { id: 2, name: '숏폼 댄스 챌린지 광고 (초인기)', type: '숏폼 비디오', target: '1020 학생층', copy: '아리라쿠 댄스 추고 신상 에디션 선물 받자 🎁', spent: 3000, reach: 180000, clicks: 12600, conversions: 480 },
    { id: 3, name: '제품 기능 상세 튜토리얼 가이드', type: '롱폼 비디오', target: 'IT 기획자/개발자', copy: '5분 만에 세팅하는 협업 자동화 툴 실전 가이드', spent: 1800, reach: 62000, clicks: 2480, conversions: 140 },
    { id: 4, name: '장바구니 리마인딩 쿠폰 광고', type: '카탈로그', target: '기존 이탈 유저', copy: '고민하면 품절! 장바구니 상품 10% 추가 할인 쿠폰 발급', spent: 900, reach: 25000, clicks: 1250, conversions: 110 }
  ]
  const [creativeRecords, setCreativeRecords] = useState(defaultCreativeRecords)

  // Tab 3: Media Mix Data
  const defaultMediaMixRecords = [
    { id: 1, channel: 'Meta Ads', spent: 8500, reach: 250000, clicks: 11000, conversions: 550, revenue: 27500 },
    { id: 2, channel: 'Google Ads', spent: 6200, reach: 190000, clicks: 9200, conversions: 410, revenue: 18400 },
    { id: 3, channel: 'TikTok Ads', spent: 3100, reach: 120000, clicks: 7500, conversions: 220, revenue: 5500 },
    { id: 4, channel: 'YouTube Ads', spent: 4000, reach: 98000, clicks: 4200, conversions: 180, revenue: 7200 },
    { id: 5, channel: 'Influencer', spent: 1500, reach: 35000, clicks: 2100, conversions: 90, revenue: 2700 }
  ]
  const [mediaMixRecords, setMediaMixRecords] = useState(defaultMediaMixRecords)

  // Tab 4: Full Funnel Data
  const defaultFunnelRecords = [
    { id: 1, step: '1단계: 광고 노출 (Impressions)', users: 1000000, label: '노출', spent: 23300 },
    { id: 2, step: '2단계: 링크 클릭 (Clicks)', users: 65000, label: '클릭', spent: 23300 },
    { id: 3, step: '3단계: 상세페이지 탐색 (Views)', users: 28000, label: '상세보기', spent: 23300 },
    { id: 4, step: '4단계: 장바구니 담기 (Cart)', users: 8400, label: '장바구니', spent: 23300 },
    { id: 5, step: '5단계: 결제 및 전환 완료 (Purchase)', users: 2100, label: '구매완료', spent: 23300 }
  ]
  const [funnelRecords, setFunnelRecords] = useState(defaultFunnelRecords)

  // ==========================================
  // 2. Interactive Feature Helpers & Local States
  // ==========================================

  // Interactive UTM Builder States
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
      spent: 500, // 기본 집행 예산 테스트값
      clicks: 1200,
      conversions: 45,
      revenue: 1650
    }
    setUtmRecords([newRecord, ...utmRecords])
    alert('새 UTM 캠페인이 하단 트래커 표에 등록되었습니다!')
  }

  // A/B Creative Addition States
  const [newCreativeName, setNewCreativeName] = useState('')
  const [newCreativeType, setNewCreativeType] = useState('이미지')
  const [newCreativeTarget, setNewCreativeTarget] = useState('')
  const [newCreativeCopy, setNewCreativeCopy] = useState('')
  
  const handleAddCreative = () => {
    if (!newCreativeName) {
      alert('소재 이름을 입력해 주세요.')
      return
    }
    const newRecord = {
      id: Date.now(),
      name: newCreativeName,
      type: newCreativeType,
      target: newCreativeTarget || '전체 타겟',
      copy: newCreativeCopy || '등록된 문구가 없습니다.',
      spent: 500,
      reach: 12000,
      clicks: 350,
      conversions: 15
    }
    setCreativeRecords([newRecord, ...creativeRecords])
    setNewCreativeName('')
    setNewCreativeTarget('')
    setNewCreativeCopy('')
    alert('새 광고 소재가 성과 분석 표에 추가되었습니다!')
  }

  // Budget Simulation States
  const [isSimulated, setIsSimulated] = useState(false)
  const [simulatedAllocation, setSimulatedAllocation] = useState([])
  const [simulationInsight, setSimulationInsight] = useState(null)

  // Run intelligence-driven Media Mix Budget ROI simulation
  const handleRunSimulation = () => {
    setIsSimulated(true)
    // Find the channel with highest ROAS
    let bestChannel = null
    let maxRoas = 0
    
    const recordsWithRoas = mediaMixRecords.map(item => {
      const roas = item.spent > 0 ? (item.revenue / item.spent) * 100 : 0
      if (roas > maxRoas) {
        maxRoas = roas
        bestChannel = item.channel
      }
      return { ...item, roas }
    })

    // Take 30% budget from low-performing channels and give to bestChannel
    let allocatedPool = 0
    const optimized = mediaMixRecords.map(item => {
      if (item.channel !== bestChannel) {
        const reduction = item.spent * 0.35
        allocatedPool += reduction
        return {
          ...item,
          spent: Math.max(item.spent - reduction, 500) // minimum budget floor
        }
      }
      return item
    })

    // Add pool to best channel
    const finalOptimized = optimized.map(item => {
      if (item.channel === bestChannel) {
        const extraSpent = allocatedPool
        const expectedNewRevenue = extraSpent * (maxRoas / 100)
        return {
          ...item,
          spent: item.spent + extraSpent,
          revenue: item.revenue + expectedNewRevenue,
          reach: item.reach * 1.4,
          clicks: item.clicks * 1.4,
          conversions: item.conversions * 1.4
        }
      }
      return item
    })

    // Calculate revenue difference
    const originalTotalRevenue = mediaMixRecords.reduce((acc, c) => acc + c.revenue, 0)
    const newTotalRevenue = finalOptimized.reduce((acc, c) => acc + c.revenue, 0)
    const revenueDiff = newTotalRevenue - originalTotalRevenue
    const revenuePct = (revenueDiff / originalTotalRevenue) * 100

    setSimulatedAllocation(finalOptimized)
    setSimulationInsight({
      bestChannel,
      maxRoas: maxRoas.toFixed(1),
      revenueIncrease: Math.round(revenueDiff),
      revenueIncreasePct: revenuePct.toFixed(1)
    })
  }

  const handleResetSimulation = () => {
    setIsSimulated(false)
    setSimulationInsight(null)
  }

  // Global resets
  const handleResetAllDemoData = () => {
    setUtmRecords(defaultUtmRecords)
    setCreativeRecords(defaultCreativeRecords)
    setMediaMixRecords(defaultMediaMixRecords)
    setFunnelRecords(defaultFunnelRecords)
    setIsSimulated(false)
    setSimulationInsight(null)
    alert('모든 표의 데이터가 실무 표준 데모 세트로 리셋되었습니다.')
  }

  // Dynamic deletion helpers for each sheet
  const handleDeleteUtm = (id) => setUtmRecords(utmRecords.filter(item => item.id !== id))
  const handleDeleteCreative = (id) => setCreativeRecords(creativeRecords.filter(item => item.id !== id))
  const handleDeleteMediaMix = (id) => setMediaMixRecords(mediaMixRecords.filter(item => item.id !== id))

  // ==========================================
  // 3. Robust SheetJS Excel Parser for Active Tab
  // ==========================================
  const handleExcelUpload = (e) => {
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
          alert('선택한 시트에 파싱할 수 있는 마케팅 데이터가 없습니다.')
          return
        }

        // Key synonym matching resolver
        const findKey = (row, possibilities) => {
          const keyFound = Object.keys(row).find((k) =>
            possibilities.some(
              (p) =>
                k.toLowerCase().replace(/[\s_]+/g, '') === p.toLowerCase().replace(/[\s_]+/g, '')
            )
          )
          return keyFound ? row[keyFound] : null
        }

        if (activeKey === 'utm') {
          const parsed = rawJson.map((row, idx) => {
            const name = findKey(row, ['캠페인명', '캠페인', 'name', 'campaign_name', 'campaign']) || `외부 유입 캠페인 #${idx+1}`
            const source = findKey(row, ['소스', 'source', 'utm_source']) || 'direct'
            const medium = findKey(row, ['매체', 'medium', 'utm_medium']) || 'cpc'
            const url = findKey(row, ['주소', 'url', 'destination_url']) || 'https://amiko.com'
            const spent = parseInt(findKey(row, ['비용', '예산', 'spent', 'budget', 'cost'])) || 0
            const clicks = parseInt(findKey(row, ['클릭', '클릭수', 'clicks', 'click'])) || 0
            const conversions = parseInt(findKey(row, ['전환', '전환수', 'conversions', 'conversion'])) || 0
            const revenue = parseInt(findKey(row, ['매출', '매출액', 'revenue', 'sales'])) || 0

            return {
              id: Date.now() + idx,
              name,
              source,
              medium,
              url,
              utmUrl: `${url}?utm_source=${source}&utm_medium=${medium}&utm_campaign=imported_${idx}`,
              spent,
              clicks,
              conversions,
              revenue
            }
          })
          setUtmRecords([...parsed, ...utmRecords])
          alert(`성공적으로 ${parsed.length}건의 UTM 성과 데이터를 결합했습니다!`)

        } else if (activeKey === 'creative') {
          const parsed = rawJson.map((row, idx) => {
            const name = findKey(row, ['소재명', '소재', 'creative', 'creative_name', 'name']) || `소재 A/B #${idx+1}`
            const type = findKey(row, ['유형', '타입', 'type', 'format']) || '이미지'
            const target = findKey(row, ['타겟', '오디언스', 'target', 'audience']) || '전체'
            const copy = findKey(row, ['문구', '카피', 'copy', 'text']) || ''
            const spent = parseInt(findKey(row, ['비용', '예산', 'spent', 'budget', 'cost'])) || 0
            const reach = parseInt(findKey(row, ['도달수', '도달', 'reach', 'impressions'])) || 0
            const clicks = parseInt(findKey(row, ['클릭', '클릭수', 'clicks'])) || 0
            const conversions = parseInt(findKey(row, ['전환', '전환수', 'conversions'])) || 0

            return {
              id: Date.now() + idx,
              name, type, target, copy, spent, reach, clicks, conversions
            }
          })
          setCreativeRecords([...parsed, ...creativeRecords])
          alert(`성공적으로 ${parsed.length}건의 크리에이티브 성과 데이터를 로드했습니다!`)

        } else if (activeKey === 'mediamix') {
          const parsed = rawJson.map((row, idx) => {
            const channel = findKey(row, ['매체', '채널', 'channel', 'media', 'platform']) || `매체 #${idx+1}`
            const spent = parseInt(findKey(row, ['비용', '예산', 'spent', 'budget'])) || 0
            const reach = parseInt(findKey(row, ['도달', '도달수', 'reach'])) || 0
            const clicks = parseInt(findKey(row, ['클릭', '클릭수', 'clicks'])) || 0
            const conversions = parseInt(findKey(row, ['전환', '전환수', 'conversions'])) || 0
            const revenue = parseInt(findKey(row, ['매출', '매출액', 'revenue'])) || 0

            return {
              id: Date.now() + idx,
              channel, spent, reach, clicks, conversions, revenue
            }
          })
          setMediaMixRecords([...parsed, ...mediaMixRecords])
          alert(`성공적으로 ${parsed.length}건의 매체 믹스 집행 성과를 병합했습니다!`)
        } else if (activeKey === 'funnel') {
          alert('퍼널 탭의 데이터는 깔때기 모델 정의 고정형이므로 엑셀 직접 주입은 매체 믹스나 캠페인 탭을 이용해 주세요.')
        }

      } catch (err) {
        console.error(err)
        alert('엑셀 파싱 중 에러가 발생했습니다. 헤더명이나 구조를 확인해 주세요.')
      }
    }
    reader.readAsBinaryString(file)
  }

  // ==========================================
  // 4. Dynamic CMO Math Calculations for Widget & AI Sidebar
  // ==========================================
  
  // Dynamic Scorecards based on selected Tab
  const getScorecardMetrics = () => {
    if (activeKey === 'utm') {
      const spent = utmRecords.reduce((acc, c) => acc + c.spent, 0)
      const revenue = utmRecords.reduce((acc, c) => acc + c.revenue, 0)
      const convs = utmRecords.reduce((acc, c) => acc + c.conversions, 0)
      const clicks = utmRecords.reduce((acc, c) => acc + c.clicks, 0)
      return {
        spent,
        revenue,
        roas: spent > 0 ? (revenue / spent) * 100 : 0,
        cpa: convs > 0 ? spent / convs : 0,
        cpc: clicks > 0 ? spent / clicks : 0,
        primaryTitle: '총 캠페인 집행액',
        secondaryTitle: '캠페인 총 매출',
      }
    } else if (activeKey === 'creative') {
      const spent = creativeRecords.reduce((acc, c) => acc + c.spent, 0)
      const reach = creativeRecords.reduce((acc, c) => acc + c.reach, 0)
      const clicks = creativeRecords.reduce((acc, c) => acc + c.clicks, 0)
      const convs = creativeRecords.reduce((acc, c) => acc + c.conversions, 0)
      return {
        spent,
        revenue: reach, // Show reach as secondary volume indicator
        roas: reach > 0 ? (clicks / reach) * 100 : 0, // CTR% proxy
        cpa: convs > 0 ? spent / convs : 0,
        cpc: clicks > 0 ? spent / clicks : 0,
        primaryTitle: '소재 광고비 지출',
        secondaryTitle: '소재 누적 노출수',
      }
    } else if (activeKey === 'mediamix') {
      const source = isSimulated ? simulatedAllocation : mediaMixRecords
      const spent = source.reduce((acc, c) => acc + c.spent, 0)
      const revenue = source.reduce((acc, c) => acc + c.revenue, 0)
      const convs = source.reduce((acc, c) => acc + c.conversions, 0)
      const clicks = source.reduce((acc, c) => acc + c.clicks, 0)
      return {
        spent,
        revenue,
        roas: spent > 0 ? (revenue / spent) * 100 : 0,
        cpa: convs > 0 ? spent / convs : 0,
        cpc: clicks > 0 ? spent / clicks : 0,
        primaryTitle: '총 매체 믹스 광고비',
        secondaryTitle: '매체 총 매출액',
      }
    } else {
      // Funnel
      const firstStep = funnelRecords[0]?.users || 1
      const lastStep = funnelRecords[funnelRecords.length - 1]?.users || 0
      const totalSpent = funnelRecords[0]?.spent || 23300
      return {
        spent: totalSpent,
        revenue: firstStep,
        roas: firstStep > 0 ? (lastStep / firstStep) * 100 : 0,
        cpa: lastStep > 0 ? totalSpent / lastStep : 0,
        cpc: funnelRecords[1]?.users > 0 ? totalSpent / funnelRecords[1]?.users : 0,
        primaryTitle: '퍼널 추적 예산',
        secondaryTitle: '최초 광고 노출 모수',
      }
    }
  }

  const metrics = getScorecardMetrics()

  // Real-time AI Analytics Recommendation Engine
  const renderAiInsights = () => {
    if (activeKey === 'utm') {
      let topCampaign = { name: '-', roas: 0 }
      utmRecords.forEach(item => {
        const roas = item.spent > 0 ? (item.revenue / item.spent) * 100 : 0
        if (roas > topCampaign.roas) {
          topCampaign = { name: item.name, roas }
        }
      })
      return (
        <>
          <div className="p-3 rounded mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="fw-semibold text-warning small mb-1">🎯 최우수 캠페인 감지</div>
            <p className="small text-white-50 m-0 leading-relaxed">
              분석 결과, 현재 최고 수익률을 기록한 캠페인은 <strong>[{topCampaign.name}]</strong>이며, 광고 효율(ROAS)은 <strong>{topCampaign.roas.toFixed(1)}%</strong>입니다. 이 캠페인의 예산 확대를 권장합니다.
            </p>
          </div>
          <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="fw-semibold text-success small mb-1">📢 소스/매체 분배 권장</div>
            <p className="small text-white-50 m-0 leading-relaxed">
              Google/Search 중심의 유입이 Facebook 대비 전환 단가(CPA)가 15% 낮아 고효율을 보입니다. 페이스북의 CPM 단가가 급상승 중이므로 구글 검색 비중을 확대하세요.
            </p>
          </div>
        </>
      )
    } else if (activeKey === 'creative') {
      let topCreative = { name: '-', ctr: 0 }
      let worstCreative = { name: '-', cpa: 99999 }
      creativeRecords.forEach(item => {
        const ctr = item.reach > 0 ? (item.clicks / item.reach) * 100 : 0
        const cpa = item.conversions > 0 ? item.spent / item.conversions : 99999
        if (ctr > topCreative.ctr) topCreative = { name: item.name, ctr }
        if (cpa > worstCreative.cpa && cpa !== 99999) worstCreative = { name: item.name, cpa }
      })
      return (
        <>
          <div className="p-3 rounded mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="fw-semibold text-success small mb-1">🔥 반응도 최고 크리에이티브</div>
            <p className="small text-white-50 m-0 leading-relaxed">
              클릭률(CTR) <strong>{topCreative.ctr.toFixed(2)}%</strong>를 돌파한 <strong>[{topCreative.name}]</strong> 소재가 타겟 오디언스 피드에 최적화되었습니다. 유사 숏폼 기획안을 즉시 추가 생성하세요.
            </p>
          </div>
          <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="fw-semibold text-danger small mb-1">⚠️ 예산 낭비 소재 오프 권장</div>
            <p className="small text-white-50 m-0 leading-relaxed">
              <strong>[{worstCreative.name}]</strong> 소재는 전환 단가(CPA)가 <strong>${worstCreative.cpa.toFixed(1)}</strong>로 평균 대비 매우 높습니다. 해당 카피 문구의 피로도가 높으니 즉시 교체를 제안합니다.
            </p>
          </div>
        </>
      )
    } else if (activeKey === 'mediamix') {
      return (
        <>
          {simulationInsight ? (
            <div className="p-3 rounded mb-3 border border-success" style={{ background: 'rgba(46, 184, 92, 0.15)' }}>
              <div className="fw-semibold text-success small mb-1">⚡ 예산 최적화 시뮬레이션 적용됨</div>
              <p className="small text-white-50 m-0 leading-relaxed">
                효율이 가장 뛰어난 <strong>{simulationInsight.bestChannel}</strong> 매체로 저효율 매체의 예산 35%를 전격 이전 분배 시뮬레이션했습니다.
                <br />
                <span className="text-warning fw-bold">매출 예상 증가액: +${simulationInsight.revenueIncrease.toLocaleString()} (+{simulationInsight.revenueIncreasePct}%)</span>
              </p>
            </div>
          ) : (
            <div className="p-3 rounded mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="fw-semibold text-warning small mb-1">⚖️ 매체 믹스 밸런스 검토</div>
              <p className="small text-white-50 m-0 leading-relaxed">
                현재 Meta와 Google Ads가 예산의 70% 이상을 점유하고 있습니다. 틱톡 및 인플루언서 마케팅의 효율이 아직 임계점을 넘지 못해 비중 조절이 필요합니다.
              </p>
            </div>
          )}
          <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="fw-semibold text-info small mb-1">🤖 AI 포트폴리오 추천</div>
            <p className="small text-white-50 m-0 leading-relaxed">
              상단의 [최적화 시뮬레이션 돌리기] 버튼을 누르면 AI 배정 알고리즘을 즉시 실행하여 매체 믹스 표와 도넛형 차트를 포트폴리오 관점에서 시뮬레이션합니다.
            </p>
          </div>
        </>
      )
    } else {
      // Funnel
      const dropImpToClick = funnelRecords[0] && funnelRecords[1] ? ((funnelRecords[0].users - funnelRecords[1].users) / funnelRecords[0].users * 100).toFixed(1) : 0
      const dropCartToPurchase = funnelRecords[3] && funnelRecords[4] ? ((funnelRecords[3].users - funnelRecords[4].users) / funnelRecords[3].users * 100).toFixed(1) : 0
      return (
        <>
          <div className="p-3 rounded mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="fw-semibold text-danger small mb-1">🚨 퍼널 최악의 보틀넥 구간</div>
            <p className="small text-white-50 m-0 leading-relaxed">
              <strong>광고 노출 ➔ 유입 링크 클릭</strong> 단계에서 무려 <strong>{dropImpToClick}%</strong>의 사용자가 이탈하고 있습니다. 첫 타겟팅 오디언스의 세분화와 광고 후킹 메시지 수정이 필수적입니다.
            </p>
          </div>
          <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="fw-semibold text-warning small mb-1">🛒 최종 장바구니 전환율 분석</div>
            <p className="small text-white-50 m-0 leading-relaxed">
              장바구니에 제품을 담은 사용자 중 <strong>{dropCartToPurchase}%</strong>가 구매를 포기했습니다. 결제 페이지 이탈을 막기 위한 '네이버페이/카카오페이 간편결제 추가' 및 이탈 메일 자동 자동화를 도입하세요.
            </p>
          </div>
        </>
      )
    }
  }

  // ==========================================
  // 5. Dynamic Chart Options & Series Setup
  // ==========================================
  
  // Donut Series logic for Tab 3: Media Mix
  const sourceMediaRecords = isSimulated ? simulatedAllocation : mediaMixRecords
  const donutAllocationLabels = sourceMediaRecords.map(item => item.channel)
  const donutAllocationSeries = sourceMediaRecords.map(item => item.spent)

  const donutChartOptions = {
    chart: { id: 'channel-allocation' },
    labels: donutAllocationLabels,
    colors: ['#3b5998', '#ea4335', '#000000', '#ff0000', '#f9b115', '#63c2de'],
    legend: { position: 'bottom' },
    tooltip: {
      y: { formatter: (value) => `$${Math.round(value).toLocaleString()}` }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 220 },
        legend: { position: 'bottom' }
      }
    }]
  }

  // Mixed chart for UTM Campaign comparisons
  const mixedCampaignLabels = utmRecords.map(item => item.name.length > 8 ? item.name.slice(0,8) + '..' : item.name)
  const mixedCampaignSpent = utmRecords.map(item => item.spent)
  const mixedCampaignRevenue = utmRecords.map(item => item.revenue)
  const mixedCampaignROAS = utmRecords.map(item => item.spent > 0 ? parseFloat(((item.revenue / item.spent) * 100).toFixed(1)) : 0)

  const mixedChartOptions = {
    chart: {
      id: 'utm-performance-trend',
      toolbar: { show: false }
    },
    stroke: {
      width: [0, 0, 3],
      curve: 'smooth'
    },
    colors: ['#321fdb', '#2eb85c', '#f9b115'],
    fill: {
      opacity: [0.85, 0.85, 1]
    },
    labels: mixedCampaignLabels,
    xaxis: {
      type: 'category'
    },
    yaxis: [
      {
        title: { text: '비용 & 매출액 ($)' },
        labels: { formatter: (value) => `$${Math.round(value).toLocaleString()}` }
      },
      {
        opposite: true,
        title: { text: '광고 수익률 (ROAS %)' },
        labels: { formatter: (value) => `${value}%` }
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y, { seriesIndex }) => {
          if (typeof y !== 'undefined') {
            return seriesIndex === 2 ? `${y.toLocaleString()}%` : `$${Math.round(y).toLocaleString()}`
          }
          return y
        }
      }
    }
  }

  const mixedChartSeries = [
    { name: '집행 광고비', type: 'column', data: mixedCampaignSpent },
    { name: '기여 매출액', type: 'column', data: mixedCampaignRevenue },
    { name: '광고 수익률 (ROAS)', type: 'line', data: mixedCampaignROAS }
  ]

  return (
    <>
      {/* 1. Global Core KPI Scorecards */}
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        <CCol sm={6} xl={3}>
          <CCard className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #321fdb, #1f1498)' }}>
            <CCardBody className="pb-4 px-4 pt-4">
              <div className="small text-white-50 fw-semibold text-uppercase">{metrics.primaryTitle}</div>
              <div className="fs-2 fw-bold mt-2">${Math.round(metrics.spent).toLocaleString()}</div>
              <div className="small text-white-50 mt-3">현재 대시보드 뷰 기준 예산</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} xl={3}>
          <CCard className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #2eb85c, #1b8a3e)' }}>
            <CCardBody className="pb-4 px-4 pt-4">
              <div className="small text-white-50 fw-semibold text-uppercase">{metrics.secondaryTitle}</div>
              <div className="fs-2 fw-bold mt-2">
                {activeKey === 'creative' ? `${metrics.revenue.toLocaleString()} 회` : `$${Math.round(metrics.revenue).toLocaleString()}`}
              </div>
              <div className="small text-white-50 mt-3">광고 노출 및 전환 기여 총량</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} xl={3}>
          <CCard className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #f9b115, #f6960b)' }}>
            <CCardBody className="pb-4 px-4 pt-4">
              <div className="small text-white-50 fw-semibold text-uppercase">
                {activeKey === 'creative' ? '평균 클릭률 (CTR)' : '종합 광고 효율 (ROAS)'}
              </div>
              <div className="fs-2 fw-bold mt-2">{metrics.roas.toFixed(1)}%</div>
              <div className="small text-white-50 mt-3">
                {activeKey === 'creative' ? '노출 대비 유입 배수' : `투자 대비 생성 매출 배수: ${(metrics.roas / 100).toFixed(1)}x`}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} xl={3}>
          <CCard className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #3399ff, #2378cc)' }}>
            <CCardBody className="pb-4 px-4 pt-4">
              <div className="small text-white-50 fw-semibold text-uppercase">평균 전환단가 (CPA)</div>
              <div className="fs-2 fw-bold mt-2">${metrics.cpa.toFixed(1)}</div>
              <div className="small text-white-50 mt-3">최종 고객 전환 1인당 획득 비용</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* 2. Core 4-Tab Workspace Area */}
      <CRow className="mb-4">
        <CCol xl={9} className="mb-4">
          <CCard className="border-0 shadow-sm mb-4">
            <CCardHeader className="bg-white border-0 pt-4 px-4 pb-2">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h4 className="fw-bold text-dark mb-1">🛠️ 마케터 전용 고기능 샌드박스 툴킷</h4>
                  <p className="text-muted small mb-0">실무 마케팅 오픈소스 템플릿 4종을 리액트 대시보드로 이식하여 실시간 제어할 수 있는 작업 공간입니다.</p>
                </div>
                <CButton color="outline-secondary" size="sm" className="fw-semibold px-3 mt-2 mt-sm-0" onClick={handleResetAllDemoData}>
                  데모 데이터로 초기화
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody className="p-0">
              <CNav variant="tabs" className="px-4 border-bottom-0">
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
                {/* TAB 1: UTM Campaign Tracker */}
                <CTabPane visible={activeKey === 'utm'}>
                  <CRow className="mb-4">
                    <CCol lg={5} className="mb-3 mb-lg-0">
                      <div className="p-4 rounded border-2 border-dashed border-primary bg-light h-100">
                        <h6 className="fw-bold text-dark mb-3">📍 실시간 UTM 파라미터 빌더</h6>
                        <CForm className="row g-2">
                          <CCol xs={12}>
                            <label className="small fw-semibold text-muted mb-1">대상 URL</label>
                            <CFormInput size="sm" value={utmUrlInput} onChange={(e) => setUtmUrlInput(e.target.value)} placeholder="https://amiko.com/shop" />
                          </CCol>
                          <CCol xs={6}>
                            <label className="small fw-semibold text-muted mb-1">소스 (Source)</label>
                            <CFormInput size="sm" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} placeholder="naver" />
                          </CCol>
                          <CCol xs={6}>
                            <label className="small fw-semibold text-muted mb-1">매체 (Medium)</label>
                            <CFormInput size="sm" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} placeholder="blog" />
                          </CCol>
                          <CCol xs={12}>
                            <label className="small fw-semibold text-muted mb-1">캠페인명 (Campaign)</label>
                            <CFormInput size="sm" value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} placeholder="brand_viral" />
                          </CCol>
                          <CCol xs={12}>
                            <label className="small fw-semibold text-muted mb-1">캠페인 한글 관리명 (태스크 추가용)</label>
                            <CFormInput size="sm" value={newCampaignName} onChange={(e) => setNewCampaignName(e.target.value)} placeholder="브랜드 블로그 홍보" />
                          </CCol>
                        </CForm>

                        <div className="mt-3 p-3 bg-white rounded border small text-break">
                          <span className="fw-bold text-primary">생성된 UTM URL:</span>
                          <p className="m-0 text-muted mt-1 font-monospace" style={{ fontSize: '11px' }}>{generatedUtm}</p>
                        </div>
                        <div className="mt-3 d-flex gap-2">
                          <CButton color="primary" size="sm" className="fw-semibold flex-fill" onClick={handleCopyUtm}>
                            {copySuccess ? '복사 완료! 👍' : '클립보드 복사'}
                          </CButton>
                          <CButton color="success" size="sm" className="text-white fw-semibold" onClick={handleAddUtmCampaign}>
                            트래커에 즉시 주입
                          </CButton>
                        </div>
                      </div>
                    </CCol>

                    <CCol lg={7}>
                      <div className="p-3 bg-light rounded border h-100 d-flex flex-column justify-content-between">
                        <div>
                          <h6 className="fw-bold text-dark mb-1">📊 UTM 캠페인별 성과 비교</h6>
                          <span className="small text-muted mb-3 d-block">입력된 UTM 캠페인들의 광고 효율을 시각적으로 빠르게 진단합니다.</span>
                        </div>
                        <Chart
                          options={mixedChartOptions}
                          series={mixedChartSeries}
                          type="line"
                          height={220}
                        />
                      </div>
                    </CCol>
                  </CRow>

                  {/* UTM Table */}
                  <h6 className="fw-bold text-dark mb-2 mt-4">📋 UTM 성과 분석 트래커 리포트</h6>
                  <div className="table-responsive rounded border">
                    <CTable bordered hover align="middle" className="mb-0 text-nowrap text-center small">
                      <CTableHead className="bg-light">
                        <CTableRow>
                          <CTableHeaderCell>캠페인 한글 관리명</CTableHeaderCell>
                          <CTableHeaderCell>소스/매체</CTableHeaderCell>
                          <CTableHeaderCell>집행 광고비</CTableHeaderCell>
                          <CTableHeaderCell>클릭수</CTableHeaderCell>
                          <CTableHeaderCell>전환수</CTableHeaderCell>
                          <CTableHeaderCell className="text-primary fw-bold">전환율(CVR)</CTableHeaderCell>
                          <CTableHeaderCell className="text-success fw-bold">전환단가(CPA)</CTableHeaderCell>
                          <CTableHeaderCell>기여 매출액</CTableHeaderCell>
                          <CTableHeaderCell className="text-warning fw-bold">광고수익률(ROAS)</CTableHeaderCell>
                          <CTableHeaderCell>관리</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {utmRecords.map((item) => {
                          const cvr = item.clicks > 0 ? (item.conversions / item.clicks) * 100 : 0
                          const cpa = item.conversions > 0 ? item.spent / item.conversions : 0
                          const roas = item.spent > 0 ? (item.revenue / item.spent) * 100 : 0
                          return (
                            <CTableRow key={item.id}>
                              <CTableDataCell className="fw-bold text-dark text-start px-3">{item.name}</CTableDataCell>
                              <CTableDataCell>
                                <CBadge color="secondary">{item.source} / {item.medium}</CBadge>
                              </CTableDataCell>
                              <CTableDataCell>${item.spent.toLocaleString()}</CTableDataCell>
                              <CTableDataCell className="text-muted">{item.clicks.toLocaleString()} 회</CTableDataCell>
                              <CTableDataCell className="fw-semibold">{item.conversions.toLocaleString()} 건</CTableDataCell>
                              <CTableDataCell className="text-primary fw-bold">{cvr.toFixed(2)}%</CTableDataCell>
                              <CTableDataCell className="text-success fw-bold">${cpa.toFixed(1)}</CTableDataCell>
                              <CTableDataCell className="fw-bold">${item.revenue.toLocaleString()}</CTableDataCell>
                              <CTableDataCell className="text-warning fw-bold bg-light">{roas.toFixed(1)}%</CTableDataCell>
                              <CTableDataCell>
                                <CButton color="link" className="text-danger p-0 fw-bold small text-decoration-none" onClick={() => handleDeleteUtm(item.id)}>
                                  삭제
                                </CButton>
                              </CTableDataCell>
                            </CTableRow>
                          )
                        })}
                      </CTableBody>
                    </CTable>
                  </div>
                </CTabPane>

                {/* TAB 2: Creative A/B Performance */}
                <CTabPane visible={activeKey === 'creative'}>
                  <CRow className="mb-4">
                    <CCol lg={4} className="mb-3 lg-0">
                      <div className="p-4 rounded border bg-light h-100">
                        <h6 className="fw-bold text-dark mb-3">➕ 새 A/B 광고 소재 등록</h6>
                        <CForm className="row g-2">
                          <CCol xs={12}>
                            <label className="small fw-semibold text-muted mb-1">소재명 (Creative Name)</label>
                            <CFormInput size="sm" value={newCreativeName} onChange={(e) => setNewCreativeName(e.target.value)} placeholder="예: 브랜드 캐릭터 숏폼 B타입" />
                          </CCol>
                          <CCol xs={12}>
                            <label className="small fw-semibold text-muted mb-1">소재 포맷</label>
                            <CFormSelect size="sm" value={newCreativeType} onChange={(e) => setNewCreativeType(e.target.value)}>
                              <option value="이미지">단일 이미지 배너</option>
                              <option value="숏폼 비디오">숏폼 비디오 (TikTok/Reels)</option>
                              <option value="롱폼 비디오">롱폼 튜토리얼 비디오</option>
                              <option value="카탈로그">제품 카탈로그 슬라이드</option>
                            </CFormSelect>
                          </CCol>
                          <CCol xs={12}>
                            <label className="small fw-semibold text-muted mb-1">주요 타겟 오디언스</label>
                            <CFormInput size="sm" value={newCreativeTarget} onChange={(e) => setNewCreativeTarget(e.target.value)} placeholder="예: 2534 대학원생/취준생" />
                          </CCol>
                          <CCol xs={12}>
                            <label className="small fw-semibold text-muted mb-1">광고 메인 카피 문구</label>
                            <CFormInput size="sm" value={newCreativeCopy} onChange={(e) => setNewCreativeCopy(e.target.value)} placeholder="예: 지금 아미코로 자동화하면 커피 한 잔 가격에.." />
                          </CCol>
                        </CForm>
                        <CButton color="primary" size="sm" className="w-100 fw-semibold mt-3" onClick={handleAddCreative}>
                          광고 소재 추가 등록
                        </CButton>
                      </div>
                    </CCol>

                    <CCol lg={8}>
                      <div className="p-3 bg-light rounded border h-100">
                        <h6 className="fw-bold text-dark mb-1">📈 크리에이티브 A/B 테스트 성과표</h6>
                        <span className="small text-muted mb-3 d-block">광고 문구와 포맷별 효율성을 계산하여, 가장 후킹력이 강했던 A/B 그룹을 찾아냅니다.</span>

                        <div className="table-responsive rounded border mt-2">
                          <CTable bordered hover align="middle" className="mb-0 text-nowrap text-center small bg-white">
                            <CTableHead className="bg-light">
                              <CTableRow>
                                <CTableHeaderCell>소재명 / 유형</CTableHeaderCell>
                                <CTableHeaderCell>핵심 광고 카피</CTableHeaderCell>
                                <CTableHeaderCell>집행비</CTableHeaderCell>
                                <CTableHeaderCell>클릭률(CTR)</CTableHeaderCell>
                                <CTableHeaderCell>전환수</CTableHeaderCell>
                                <CTableHeaderCell className="text-success fw-bold">전환단가(CPA)</CTableHeaderCell>
                                <CTableHeaderCell>관리</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {creativeRecords.map((item) => {
                                const ctr = item.reach > 0 ? (item.clicks / item.reach) * 100 : 0
                                const cpa = item.conversions > 0 ? item.spent / item.conversions : 0
                                const isHighCtr = ctr > 4.0
                                const isHighCpa = cpa > 15
                                return (
                                  <CTableRow key={item.id} className={isHighCtr ? 'table-success-light' : ''}>
                                    <CTableDataCell className="fw-bold text-dark text-start px-3" style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {item.name}
                                      <br />
                                      <CBadge color={item.type === '숏폼 비디오' ? 'info' : 'secondary'} className="mt-1">{item.type}</CBadge>
                                    </CTableDataCell>
                                    <CTableDataCell className="text-start text-muted text-wrap small" style={{ maxWidth: '240px' }}>
                                      <strong className="text-dark small">[{item.target}]</strong> <span style={{ fontSize: '11px' }}>{item.copy}</span>
                                    </CTableDataCell>
                                    <CTableDataCell>${item.spent.toLocaleString()}</CTableDataCell>
                                    <CTableDataCell className={`fw-bold ${isHighCtr ? 'text-success' : 'text-primary'}`}>
                                      {ctr.toFixed(2)}%
                                      {isHighCtr && <span className="ms-1 small">🚀</span>}
                                    </CTableDataCell>
                                    <CTableDataCell className="fw-semibold">{item.conversions} 명</CTableDataCell>
                                    <CTableDataCell className={`fw-bold ${isHighCpa ? 'text-danger' : 'text-dark'}`}>
                                      ${cpa.toFixed(1)}
                                      {isHighCpa && <CBadge color="danger" className="ms-1" style={{ fontSize: '8px' }}>경고</CBadge>}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      <CButton color="link" className="text-danger p-0 fw-bold small text-decoration-none" onClick={() => handleDeleteCreative(item.id)}>
                                        삭제
                                      </CButton>
                                    </CTableDataCell>
                                  </CTableRow>
                                )
                              })}
                            </CTableBody>
                          </CTable>
                        </div>
                      </div>
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* TAB 3: Media Mix & Budget ROI Simulator */}
                <CTabPane visible={activeKey === 'mediamix'}>
                  <CRow className="mb-4">
                    <CCol lg={7} className="mb-3 lg-0">
                      <div className="p-3 bg-light rounded border h-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <h6 className="fw-bold text-dark mb-1">⚖️ 매체별 예산 분배 시각화</h6>
                            <span className="small text-muted">매체 믹스의 예산 포트폴리오를 한눈에 모니터링합니다.</span>
                          </div>
                          {!isSimulated ? (
                            <CButton color="success" size="sm" className="text-white fw-bold shadow-sm" onClick={handleRunSimulation}>
                              ⚡ AI 예산 최적화 시뮬레이션
                            </CButton>
                          ) : (
                            <CButton color="outline-danger" size="sm" className="fw-bold" onClick={handleResetSimulation}>
                              ↩️ 시뮬레이션 복구 (리셋)
                            </CButton>
                          )}
                        </div>

                        <div className="d-flex align-items-center justify-content-center mt-3" style={{ minHeight: '230px' }}>
                          <Chart
                            options={donutChartOptions}
                            series={donutAllocationSeries}
                            type="donut"
                            width={360}
                          />
                        </div>
                      </div>
                    </CCol>

                    <CCol lg={5}>
                      <div className="p-4 rounded border bg-light h-100 d-flex flex-column justify-content-between">
                        <div>
                          <h6 className="fw-bold text-dark mb-2">💡 AI 매체 믹스 최적화 알고리즘 요약</h6>
                          <p className="small text-muted leading-relaxed mb-3">
                            본 시뮬레이터는 매체별 최근 ROI/ROAS 실적 데이터를 역동적으로 분석하여, 광고 성과가 가장 저조한 영역의 비효율 예산을 추출하고 최고 효율 매체로 즉시 재비중 배정해 예상 매출을 증폭합니다.
                          </p>
                        </div>

                        {isSimulated && simulationInsight ? (
                          <div className="p-3 rounded border border-success bg-white shadow-sm">
                            <div className="small fw-bold text-success mb-1">✅ 예산 최적화 완료 리포트</div>
                            <div className="small text-muted mb-2">
                              최우수 수익 매체: <strong>{simulationInsight.bestChannel} ({simulationInsight.maxRoas}%)</strong>
                            </div>
                            <div className="h5 fw-bold text-dark m-0">
                              예상 추가 창출 매출:
                              <br />
                              <span className="text-success">+${simulationInsight.revenueIncrease.toLocaleString()}</span> 
                              <span className="text-muted fs-6 ms-2">({simulationInsight.revenueIncreasePct}% 상승)</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded border border-warning bg-white text-center">
                            <span className="fs-3">🤖</span>
                            <h6 className="fw-bold text-warning small mt-2 mb-1">시뮬레이터 대기 중</h6>
                            <p className="small text-muted m-0">좌측 상단의 초록색 <strong>[AI 예산 최적화 시뮬레이션]</strong> 버튼을 실행해 보세요!</p>
                          </div>
                        )}
                        <div className="small text-muted mt-2 text-end">※ 최소 예산 하한선 $500 적용</div>
                      </div>
                    </CCol>
                  </CRow>

                  {/* Media Mix Table */}
                  <h6 className="fw-bold text-dark mb-2">📋 매체별 집행 예산 및 효율성 통합 시트</h6>
                  <div className="table-responsive rounded border">
                    <CTable bordered hover align="middle" className="mb-0 text-nowrap text-center small">
                      <CTableHead className="bg-light">
                        <CTableRow>
                          <CTableHeaderCell>매체 채널명</CTableHeaderCell>
                          <CTableHeaderCell>배정 예산</CTableHeaderCell>
                          <CTableHeaderCell>노출수</CTableHeaderCell>
                          <CTableHeaderCell>클릭수</CTableHeaderCell>
                          <CTableHeaderCell>전환수</CTableHeaderCell>
                          <CTableHeaderCell className="text-success fw-bold">클릭률(CTR)</CTableHeaderCell>
                          <CTableHeaderCell>결제 매출액</CTableHeaderCell>
                          <CTableHeaderCell className="text-warning fw-bold">매체 효율(ROAS)</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {sourceMediaRecords.map((item) => {
                          const ctr = item.reach > 0 ? (item.clicks / item.reach) * 100 : 0
                          const roas = item.spent > 0 ? (item.revenue / item.spent) * 100 : 0
                          return (
                            <CTableRow key={item.id}>
                              <CTableDataCell className="fw-bold text-dark">{item.channel}</CTableDataCell>
                              <CTableDataCell className="fw-semibold text-primary">${Math.round(item.spent).toLocaleString()}</CTableDataCell>
                              <CTableDataCell className="text-muted">{Math.round(item.reach).toLocaleString()} 회</CTableDataCell>
                              <CTableDataCell className="text-muted">{Math.round(item.clicks).toLocaleString()} 회</CTableDataCell>
                              <CTableDataCell className="fw-semibold">{Math.round(item.conversions).toLocaleString()} 명</CTableDataCell>
                              <CTableDataCell className="text-success fw-bold">{ctr.toFixed(2)}%</CTableDataCell>
                              <CTableDataCell className="fw-bold">${Math.round(item.revenue).toLocaleString()}</CTableDataCell>
                              <CTableDataCell className="text-warning fw-bold bg-light">{roas.toFixed(1)}%</CTableDataCell>
                            </CTableRow>
                          )
                        })}
                      </CTableBody>
                    </CTable>
                  </div>
                </CTabPane>

                {/* TAB 4: Full Funnel Guide */}
                <CTabPane visible={activeKey === 'funnel'}>
                  <CRow className="mb-4">
                    <CCol lg={6} className="mb-3 lg-0">
                      <div className="p-3 bg-light rounded border h-100">
                        <h6 className="fw-bold text-dark mb-3">📐 풀퍼널 고객 행동 깔때기 모델</h6>
                        
                        <div className="d-flex flex-column gap-3 mt-4">
                          {funnelRecords.map((item, idx) => {
                            const firstStepUsers = funnelRecords[0].users
                            const pctOfTotal = (item.users / firstStepUsers) * 100
                            let progressColor = 'primary'
                            if (idx === 1) progressColor = 'info'
                            if (idx === 2) progressColor = 'warning'
                            if (idx === 3) progressColor = 'danger'
                            if (idx === 4) progressColor = 'success'

                            return (
                              <div key={item.id} className="small">
                                <div className="d-flex justify-content-between fw-bold text-dark mb-1">
                                  <span>{item.step}</span>
                                  <span>{item.users.toLocaleString()} 명 ({pctOfTotal.toFixed(2)}%)</span>
                                </div>
                                <CProgress color={progressColor} value={pctOfTotal} style={{ height: '14px' }} className="shadow-sm" animated />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CCol>

                    <CCol lg={6}>
                      <div className="p-4 rounded border bg-light h-100 d-flex flex-column justify-content-between">
                        <div>
                          <h6 className="fw-bold text-dark mb-2">🎯 마케팅 퍼널 최적화(CRO) 가이드</h6>
                          <p className="small text-muted leading-relaxed">
                            퍼널 분석은 잠재고객의 최초 광고 인지(노출) 단계부터 웹사이트로 유입되어 장바구니에 제품을 추가하고, 최종 결제(전환)하는 전 과정을 도식화한 필수 분석 기법입니다.
                          </p>
                          <div className="mt-3 p-3 bg-white rounded border small">
                            <span className="fw-bold text-primary">💡 깔때기 개선을 위한 행동 조치:</span>
                            <ul className="m-0 pl-3 text-muted mt-2">
                              <li>노출 ➔ 클릭 이탈 시: 광고 썸네일/비디오 첫 3초 소구력 전면 보강</li>
                              <li>클릭 ➔ 상세보기 이탈 시: 랜딩 페이지 로딩 속도 최적화</li>
                              <li>상세 ➔ 장바구니 이탈 시: 리뷰 증명 위젯 및 할인 혜택 부각</li>
                              <li>장바구니 ➔ 가입/결제 이탈 시: 결제 절차 간소화 및 간편결제 시스템 확충</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CCol>
                  </CRow>

                  {/* Funnel Table */}
                  <h6 className="fw-bold text-dark mb-2">📋 퍼널 단계별 세부 이탈률 분석 시트</h6>
                  <div className="table-responsive rounded border">
                    <CTable bordered hover align="middle" className="mb-0 text-nowrap text-center small">
                      <CTableHead className="bg-light">
                        <CTableRow>
                          <CTableHeaderCell>퍼널 단계</CTableHeaderCell>
                          <CTableHeaderCell>누적 사용자 모수</CTableHeaderCell>
                          <CTableHeaderCell className="text-primary fw-bold">전체 대비 생존율</CTableHeaderCell>
                          <CTableHeaderCell className="text-danger fw-bold">직전 단계 대비 이탈률</CTableHeaderCell>
                          <CTableHeaderCell>이탈수 (Drop-off)</CTableHeaderCell>
                          <CTableHeaderCell>단계별 획득 단가 (CAC)</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {funnelRecords.map((item, idx) => {
                          const firstStepUsers = funnelRecords[0].users
                          const pctOfTotal = (item.users / firstStepUsers) * 100
                          
                          let dropOffRate = 0
                          let dropOffCount = 0
                          if (idx > 0) {
                            const prevUsers = funnelRecords[idx - 1].users
                            dropOffCount = prevUsers - item.users
                            dropOffRate = (dropOffCount / prevUsers) * 100
                          }
                          const cac = item.users > 0 ? item.spent / item.users : 0

                          return (
                            <CTableRow key={item.id}>
                              <CTableDataCell className="fw-bold text-dark text-start px-4">{item.step}</CTableDataCell>
                              <CTableDataCell>{item.users.toLocaleString()} 명</CTableDataCell>
                              <CTableDataCell className="text-primary fw-bold">{pctOfTotal.toFixed(2)}%</CTableDataCell>
                              <CTableDataCell className="text-danger fw-bold">{idx === 0 ? '-' : `${dropOffRate.toFixed(1)}%`}</CTableDataCell>
                              <CTableDataCell className="text-muted">{idx === 0 ? '-' : `${dropOffCount.toLocaleString()} 명`}</CTableDataCell>
                              <CTableDataCell className="fw-bold text-success">${cac.toFixed(2)}</CTableDataCell>
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

          {/* 3. Dynamic Excel Sheet Upload & Excel Standard Template Download */}
          <CCard className="border-0 shadow-sm">
            <CCardHeader className="bg-white border-0 pt-4 px-4 pb-0">
              <h5 className="m-0 fw-bold text-dark">📥 엑셀/CSV 연동 및 산업 표준 템플릿 다운로드</h5>
              <span className="small text-muted">선택된 활성 탭 형식에 맞춘 엑셀 데이터를 병합하거나, 마케터용 표준 시트 서식을 무료 다운로드합니다.</span>
            </CCardHeader>
            <CCardBody className="p-4">
              <div className="p-4 rounded border-2 border-dashed border-primary text-center bg-light">
                <div className="mb-3">
                  <span className="fs-3">📊</span>
                </div>
                <h6 className="fw-semibold text-dark mb-2">현재 활성 탭에 엑셀/CSV 데이터 병합 업로드</h6>
                <p className="small text-muted mb-3">
                  현재 활성화된 탭: <strong>
                    {activeKey === 'utm' ? '🔗 UTM 캠페인 트래커' : 
                     activeKey === 'creative' ? '🖼️ 광고 소재 A/B 분석' : 
                     activeKey === 'mediamix' ? '⚖️ 매체 믹스 시뮬레이터' : '📈 풀퍼널 깔때기 분석'}
                  </strong>
                  <br />
                  (헤더 유의어 자동 매핑 지원: 캠페인명, 예산, 클릭수, 전환수, 매출 등 국/영문 자유 매핑)
                </p>
                <div className="d-flex flex-wrap gap-2 justify-content-center align-items-center">
                  <div className="d-inline-block">
                    <input
                      type="file"
                      id="excelUpload"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleExcelUpload}
                      className="form-control"
                      style={{ maxWidth: '350px' }}
                    />
                  </div>
                  <CButton color="outline-primary" size="sm" className="fw-bold" onClick={() => {
                    // Standard industry mock excel builder
                    const sampleHeaders = {
                      utm: [['캠페인명', '소스', '매체', '주소', '예산', '클릭수', '전환수', '매출'], ['여름세일', 'facebook', 'cpc', 'https://amiko.com', '2000', '8500', '400', '12000']],
                      creative: [['소재명', '유형', '타겟', '문구', '예산', '도달수', '클릭수', '전환수'], ['숏폼 캐릭터 댄스', '숏폼 비디오', '1020 학생', '신상 챌린지', '1500', '80000', '6000', '250']],
                      mediamix: [['매체', '예산', '도달수', '클릭수', '전환수', '매출'], ['Meta Ads', '5000', '150000', '8000', '400', '15000']]
                    }
                    
                    const tabKey = activeKey === 'funnel' ? 'utm' : activeKey
                    const ws = XLSX.utils.aoa_to_sheet(sampleHeaders[tabKey])
                    const wb = XLSX.utils.book_new()
                    XLSX.utils.book_append_sheet(wb, ws, `${tabKey}_template`)
                    XLSX.writeFile(wb, `verbos_marketing_${tabKey}_template.xlsx`)
                  }}>
                    📥 표준 엑셀 포맷 템플릿 받기
                  </CButton>
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
                      activeKey === 'utm' ? 'UTM 캠페인 트래커' : 
                      activeKey === 'creative' ? '광고 소재 A/B 분석' : 
                      activeKey === 'mediamix' ? '매체 믹스 시뮬레이터' : '풀퍼널 깔때기 분석'
                    }</strong> 분석 모드가 실시간 기여 갱신 중입니다.
                  </p>
                </div>

                {/* Render tab-specific calculated insights */}
                {renderAiInsights()}
                
              </div>
              <div className="mt-4 pt-3 border-top border-secondary text-center small text-white-50">
                Verbos Live Marketing Core v2.0
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default MarketingDashboard
