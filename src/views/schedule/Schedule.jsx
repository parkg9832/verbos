import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CFormInput,
  CButton,
  CFormSelect,
  CFormCheck,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/ko'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import CIcon from '@coreui/icons-react'
import { cilBell, cilPlus, cilCalendar, cilLocationPin, cilFolder } from '@coreui/icons'

// Set moment locale to Korean
moment.locale('ko')
const localizer = momentLocalizer(moment)

const Schedule = () => {
  // 1. Seed events across June 2026 to populate counts and look active
  const [events, setEvents] = useState([
    {
      id: 1,
      title: '🎯 Arirakku 브랜드 전략 기획 및 2분기 마케팅 킥오프 회의',
      start: new Date(2026, 5, 10, 14, 0),
      end: new Date(2026, 5, 10, 16, 0),
      color: 'blue', // Category
      assignee: '윤용승',
      project: 'Arirakku 마케팅',
      location: '본사 대회의실',
      allDay: false,
    },
    {
      id: 2,
      title: '솔루션 빌드 및 AWS 배포 아키텍처 점검 회의',
      start: new Date(2026, 5, 3, 9, 0),
      end: new Date(2026, 5, 3, 10, 30),
      color: 'yellow',
      assignee: '윤용승',
      project: '사내 인트라넷 리뉴얼',
      location: '화상 회의실',
      allDay: false,
    },
    {
      id: 3,
      title: 'MoNOs 프로젝트 백엔드 API 연동 스펙 검토',
      start: new Date(2026, 5, 3, 13, 30),
      end: new Date(2026, 5, 3, 15, 0),
      color: 'green',
      assignee: '강혁구',
      project: '신규 서비스 개발',
      location: '3층 미팅룸 B',
      allDay: false,
    },
    {
      id: 4,
      title: '아리라꾸 글로벌 SNS 콘텐츠 광고 집행 품의',
      start: new Date(2026, 5, 4, 11, 0),
      end: new Date(2026, 5, 4, 12, 0),
      color: 'blue',
      assignee: '박태윤',
      project: 'Arirakku 마케팅',
      location: '본사 마케팅실',
      allDay: false,
    },
    {
      id: 5,
      title: '현충일 전사 휴무일',
      start: new Date(2026, 5, 6, 0, 0),
      end: new Date(2026, 5, 6, 23, 59),
      color: 'pink',
      assignee: '전체',
      project: '공통 행사',
      location: '전사',
      allDay: true,
    },
    {
      id: 6,
      title: '개발 파트 주간 스크럼 및 스프린트 계획 회의',
      start: new Date(2026, 5, 8, 10, 0),
      end: new Date(2026, 5, 8, 11, 30),
      color: 'green',
      assignee: '김도현',
      project: '신규 서비스 개발',
      location: '개발 본부 회의실',
      allDay: false,
    },
    {
      id: 7,
      title: '마케팅 바이럴 캠페인 디자인 피드백 미팅',
      start: new Date(2026, 5, 12, 13, 30),
      end: new Date(2026, 5, 12, 15, 0),
      color: 'yellow',
      assignee: '조나단',
      project: 'Arirakku 마케팅',
      location: '디자인 연구실',
      allDay: false,
    },
    {
      id: 8,
      title: '전사 2분기 성과 분석 및 실적 보고회',
      start: new Date(2026, 5, 18, 16, 0),
      end: new Date(2026, 5, 18, 18, 0),
      color: 'pink',
      assignee: '윤용승',
      project: '공통 행사',
      location: '본사 대강당',
      allDay: false,
    },
    {
      id: 9,
      title: 'Arirakku 공식 브랜드 시안 최종 서명 및 체결식',
      start: new Date(2026, 5, 15, 14, 0),
      end: new Date(2026, 5, 15, 15, 30),
      color: 'blue',
      assignee: '박재현',
      project: 'Arirakku 마케팅',
      location: '임원 회의실',
      allDay: false,
    },
    {
      id: 10,
      title: '서비스 운영 인프라 비용 절감 대책 회의',
      start: new Date(2026, 5, 17, 10, 0),
      end: new Date(2026, 5, 17, 11, 0),
      color: 'green',
      assignee: '박민규',
      project: '사내 인트라넷 리뉴얼',
      location: '3층 미팅룸 A',
      allDay: false,
    },
  ])

  // UI Control states
  const [selectedAssignee, setSelectedAssignee] = useState('all') // Assignee filter
  const [maskingMode, setMaskingMode] = useState(true) // Masking mode on by default!

  // Add Event Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [eventTitle, setEventTitle] = useState('')
  const [isAllDay, setIsAllDay] = useState(false)
  const [startDate, setStartDate] = useState('2026-06-10')
  const [startTime, setStartTime] = useState('14:30')
  const [endDate, setEndDate] = useState('2026-06-10')
  const [endTime, setEndTime] = useState('15:30')
  const [repeatType, setRepeatType] = useState('none') // 'none' | 'daily' | 'weekly' | 'monthly'
  const [location, setLocation] = useState('')
  const [googleMeetEnabled, setGoogleMeetEnabled] = useState(true)
  const [eventProject, setEventProject] = useState('프로젝트 미연결')
  const [eventAssignee, setEventAssignee] = useState('윤용승')
  const [eventColor, setEventColor] = useState('blue')

  // Assignee list for filtering
  const assignees = [
    '윤용승',
    '강혁구',
    '박태윤',
    '박재현',
    '박민규',
    '김도현',
    '조나단',
    '여승구',
  ]

  // Dynamic Count helper for each assignee
  const getEventCountForAssignee = (name) => {
    if (name === 'all') return events.length
    return events.filter((e) => e.assignee === name || e.assignee === '전체').length
  }

  // Masking functions
  const maskTitle = (title) => {
    if (!maskingMode) return title
    if (!title) return ''
    return title
      .split('')
      .map((char, index) => {
        if (
          char === ' ' ||
          char === '🎯' ||
          char === ':' ||
          char === '[' ||
          char === ']' ||
          char === '(' ||
          char === ')'
        )
          return char
        if (/[0-9]/.test(char)) return char
        return index % 2 === 1 ? 'ㅇ' : char
      })
      .join('')
  }

  const maskName = (name) => {
    if (!maskingMode) return name
    if (!name || name === '전체') return name
    return `${name.charAt(0)}ㅇㅇ`
  }

  // Time Quick Add Adjustment
  const adjustDuration = (minutes) => {
    if (!startDate || !startTime) return
    const [h, m] = startTime.split(':').map(Number)
    const startDateTime = new Date(2020, 0, 1, h, m) // Dummy date
    const endDateTime = new Date(startDateTime.getTime() + minutes * 60000)
    const formattedEnd = `${String(endDateTime.getHours()).padStart(2, '0')}:${String(
      endDateTime.getMinutes()
    ).padStart(2, '0')}`
    setEndTime(formattedEnd)
    setEndDate(startDate) // Set same day by default
  }

  // Add Event Form handler
  const handleAddEventSubmit = (e) => {
    e.preventDefault()
    if (!eventTitle.trim()) return

    const parsedStart = new Date(startDate)
    const parsedEnd = new Date(endDate)

    let startObj, endObj
    if (isAllDay) {
      startObj = new Date(parsedStart.getFullYear(), parsedStart.getMonth(), parsedStart.getDate(), 0, 0)
      endObj = new Date(parsedEnd.getFullYear(), parsedEnd.getMonth(), parsedEnd.getDate(), 23, 59)
    } else {
      const [sH, sM] = startTime.split(':').map(Number)
      const [eH, eM] = endTime.split(':').map(Number)
      startObj = new Date(parsedStart.getFullYear(), parsedStart.getMonth(), parsedStart.getDate(), sH, sM)
      endObj = new Date(parsedEnd.getFullYear(), parsedEnd.getMonth(), parsedEnd.getDate(), eH, eM)
    }

    if (startObj >= endObj) {
      alert('종료 시간은 시작 시간보다 늦어야 합니다.')
      return
    }

    const newEventObj = {
      id: Date.now(),
      title: eventTitle,
      start: startObj,
      end: endObj,
      color: eventColor,
      assignee: eventAssignee,
      project: eventProject,
      location: location || '장소 미등록',
      allDay: isAllDay,
    }

    setEvents([...events, newEventObj])
    setEventTitle('')
    setIsAllDay(false)
    setStartDate('2026-06-10')
    setStartTime('14:30')
    setEndDate('2026-06-10')
    setEndTime('15:30')
    setRepeatType('none')
    setLocation('')
    setEventProject('프로젝트 미연결')
    setEventAssignee('윤용승')
    setEventColor('blue')
    setShowAddModal(false)
  }

  const handleDeleteEvent = (id) => {
    if (window.confirm('이 일정을 삭제하시겠습니까?')) {
      setEvents(events.filter((ev) => ev.id !== id))
    }
  }

  // Filtering Events based on pill selection
  const filteredEvents = events.filter((e) => {
    if (selectedAssignee === 'all') return true
    return e.assignee === selectedAssignee || e.assignee === '전체'
  })

  // Calendar Event Custom Stylings
  const eventPropGetter = (event) => {
    let backgroundColor = '#dbeafe'
    let color = '#1e40af'
    let border = '1px solid #321fdb'

    if (event.allDay || event.color === 'pink') {
      backgroundColor = '#ffeef0'
      color = '#e1306c'
      border = '1px solid #ffaec1'
    } else if (event.color === 'yellow') {
      backgroundColor = '#fef3c7'
      color = '#b45309'
      border = '1px solid #f9b115'
    } else if (event.color === 'green') {
      backgroundColor = '#dcfce7'
      color = '#166534'
      border = '1px solid #2eb85c'
    }

    return {
      style: {
        backgroundColor,
        color,
        border,
        borderRadius: '4px',
        fontSize: '11px',
        padding: '2px 4px',
        fontWeight: 'bold',
        display: 'block',
      },
    }
  }

  // Custom event renderer within the cell grid
  const CustomEventComponent = ({ event }) => {
    const timeStr = event.allDay ? '' : moment(event.start).format('HH:mm')
    return (
      <div
        className="d-flex align-items-center gap-1 overflow-hidden"
        style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {!event.allDay && (
          <span className="fw-bold text-black-50" style={{ fontSize: '9px', minWidth: '28px' }}>
            {timeStr}
          </span>
        )}
        <span style={{ fontSize: '11px' }}>{maskTitle(event.title)}</span>
      </div>
    )
  }

  // Custom Big Calendar Toolbar to match the screenshot controls
  const CustomToolbarComponent = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV')
    }
    const goToNext = () => {
      toolbar.onNavigate('NEXT')
    }
    const goToCurrent = () => {
      toolbar.onNavigate('TODAY')
    }

    const labelStr = () => {
      const date = toolbar.date
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
    }

    const handleViewChange = (view) => {
      toolbar.onView(view)
    }

    return (
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        {/* Date navigations */}
        <div className="d-flex align-items-center gap-2">
          <CButton color="light" size="sm" className="border-light fw-bold" onClick={goToBack}>
            &lt;
          </CButton>
          <CButton color="light" size="sm" className="border-light fw-bold px-3" onClick={goToCurrent}>
            오늘
          </CButton>
          <CButton color="light" size="sm" className="border-light fw-bold" onClick={goToNext}>
            &gt;
          </CButton>
          <CBadge
            color="light"
            className="ms-3 border border-light text-dark fs-6 fw-bold px-3 py-2 d-flex align-items-center gap-2 shadow-sm"
          >
            📅 {labelStr()}
          </CBadge>
        </div>

        {/* View switch buttons */}
        <div className="d-flex bg-white rounded-pill shadow-sm border border-light p-1" style={{ gap: '2px' }}>
          {[
            { key: 'month', label: '월' },
            { key: 'week', label: '주' },
            { key: 'day', label: '일' },
          ].map((v) => (
            <CButton
              key={v.key}
              size="sm"
              className={`rounded-pill px-4 py-1 fw-bold border-0 ${
                toolbar.view === v.key ? 'text-white' : 'text-secondary bg-transparent'
              }`}
              style={{
                backgroundColor: toolbar.view === v.key ? '#005950' : 'transparent',
                fontSize: '13px',
                transition: 'all 0.2s',
              }}
              onClick={() => handleViewChange(v.key)}
            >
              {v.label}
            </CButton>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4" style={{ backgroundColor: '#fafbfb', minHeight: '85vh' }}>
      {/* 1. Header Block */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-4 bg-white rounded-3 shadow-sm border border-light">
        <div>
          <h2 className="fw-bold m-0" style={{ color: '#005950', fontSize: '28px' }}>
            일정관리
          </h2>
          <p className="text-muted small m-0 mt-1">회의는 짧게, 성과는 길게 가면 좋겠습니다.</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          {/* Masking Toggle */}
          <CButton
            color={maskingMode ? 'warning' : 'light'}
            size="sm"
            className="fw-bold px-3 shadow-sm text-dark border-light"
            onClick={() => setMaskingMode(!maskingMode)}
          >
            🟡 마스킹 모드 {maskingMode ? 'ON' : 'OFF'}
          </CButton>
          <CButton color="light" className="fw-bold px-3 border-light shadow-sm d-flex align-items-center gap-1">
            <CIcon icon={cilBell} /> 알림설정
          </CButton>
          <CButton
            className="fw-bold px-4 py-2 text-white shadow-sm border-0"
            style={{ backgroundColor: '#005950', borderRadius: '50px' }}
            onClick={() => setShowAddModal(true)}
          >
            <CIcon icon={cilPlus} className="me-1" /> 일정 등록
          </CButton>
        </div>
      </div>

      {/* 2. Dynamic Assignee Filter Pill Belt */}
      <div className="bg-white rounded-3 shadow-sm border border-light p-3 mb-4">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="small fw-semibold text-secondary me-2">👤 담당자별 조회:</span>
          <CButton
            onClick={() => setSelectedAssignee('all')}
            className={`rounded-pill py-1 px-3 fw-bold border-light shadow-sm ${
              selectedAssignee === 'all' ? 'text-white' : 'text-dark bg-light'
            }`}
            style={{
              backgroundColor: selectedAssignee === 'all' ? '#005950' : '#f8f9fa',
              fontSize: '13px',
            }}
          >
            전체 <CBadge color="secondary" className="ms-1 rounded-pill">{getEventCountForAssignee('all')}</CBadge>
          </CButton>
          {assignees.map((name) => (
            <CButton
              key={name}
              onClick={() => setSelectedAssignee(name)}
              className={`rounded-pill py-1 px-3 fw-bold border-light shadow-sm ${
                selectedAssignee === name ? 'text-white' : 'text-dark'
              }`}
              style={{
                backgroundColor: selectedAssignee === name ? '#005950' : '#f8f9fa',
                fontSize: '13px',
              }}
            >
              {maskName(name)}{' '}
              <CBadge color="secondary" className="ms-1 rounded-pill">
                {getEventCountForAssignee(name)}
              </CBadge>
            </CButton>
          ))}
        </div>
      </div>

      {/* 3. Main Custom Calendar Rendering Panel */}
      <CCard className="shadow-sm border-0 bg-white p-4 rounded-3">
        <div style={{ minHeight: '650px' }}>
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            defaultDate={new Date(2026, 5, 1)}
            eventPropGetter={eventPropGetter}
            views={['month', 'week', 'day']}
            onSelectEvent={(event) => handleDeleteEvent(event.id)}
            components={{
              toolbar: CustomToolbarComponent,
              event: CustomEventComponent,
            }}
            messages={{
              next: '다음',
              previous: '이전',
              today: '오늘',
              month: '월',
              week: '주',
              day: '일',
            }}
          />
        </div>
      </CCard>

      {/* 4. Beautiful Add Event CModal (Screenshot 2 Match) */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} size="lg">
        <form onSubmit={handleAddEventSubmit}>
          <CModalHeader className="bg-light border-bottom border-light">
            <CModalTitle className="fw-bold text-dark" style={{ fontSize: '18px' }}>
              📅 일정 등록
            </CModalTitle>
          </CModalHeader>
          <CModalBody className="p-4">
            {/* Title Block */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">
                제목 <span className="text-danger">*</span>
              </label>
              <CFormInput
                placeholder="일정 제목"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
                className="py-2"
              />
            </div>

            {/* All Day Checkbox */}
            <div className="mb-4">
              <CFormCheck
                id="isAllDayCheck"
                label="종일 일정"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
                className="fw-bold text-dark"
              />
            </div>

            {/* Start and End Date Time Picker grid */}
            <CRow className="g-3 mb-2">
              <CCol md={6}>
                <label className="form-label small fw-semibold text-secondary">시작</label>
                <div className="d-flex gap-2">
                  <CFormInput
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  {!isAllDay && (
                    <CFormInput
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  )}
                </div>
              </CCol>
              <CCol md={6}>
                <label className="form-label small fw-semibold text-secondary">종료</label>
                <div className="d-flex gap-2">
                  <CFormInput
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                  {!isAllDay && (
                    <CFormInput
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  )}
                </div>
              </CCol>
            </CRow>

            {/* Quick Duration Buttons (Start Time based calculation) */}
            {!isAllDay && (
              <div className="d-flex gap-2 mb-4">
                {[
                  { label: '30분', min: 30 },
                  { label: '1시간', min: 60 },
                  { label: '2시간', min: 120 },
                ].map((item) => (
                  <CButton
                    key={item.label}
                    type="button"
                    color="light"
                    size="sm"
                    className="border-light fw-bold px-3 py-1 shadow-sm text-dark bg-white"
                    onClick={() => adjustDuration(item.min)}
                  >
                    {item.label}
                  </CButton>
                ))}
              </div>
            )}

            {/* Repeat Selector Buttons */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">반복</label>
              <div className="d-flex gap-2">
                {[
                  { key: 'none', label: '반복 없음' },
                  { key: 'daily', label: '매일' },
                  { key: 'weekly', label: '매주' },
                  { key: 'monthly', label: '매월' },
                ].map((item) => (
                  <CButton
                    key={item.key}
                    type="button"
                    color={repeatType === item.key ? 'success' : 'light'}
                    className={`rounded-pill px-4 fw-bold text-dark border-light ${
                      repeatType === item.key ? 'bg-success text-white' : 'bg-white'
                    }`}
                    style={{ fontSize: '13px' }}
                    onClick={() => setRepeatType(item.key)}
                  >
                    {item.label}
                  </CButton>
                ))}
              </div>
            </div>

            {/* Location Input */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">장소</label>
              <div className="position-relative">
                <CFormInput
                  placeholder="장소"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="ps-4 py-2"
                />
                <CIcon
                  icon={cilLocationPin}
                  className="position-absolute text-muted"
                  style={{ left: '12px', top: '12px' }}
                />
              </div>
            </div>

            {/* Google Meet Toggle Description */}
            <div className="mb-4 p-3 bg-light rounded border border-light">
              <CFormCheck
                id="googleMeetCheck"
                label="미팅은 Google Meet 링크가 자동 생성됩니다."
                checked={googleMeetEnabled}
                onChange={(e) => setGoogleMeetEnabled(e.target.checked)}
                className="fw-bold text-success"
              />
            </div>

            {/* Project linkage Dropdown */}
            <CRow className="g-3">
              <CCol md={6}>
                <label className="form-label small fw-semibold text-secondary">프로젝트 연결</label>
                <CFormSelect value={eventProject} onChange={(e) => setEventProject(e.target.value)}>
                  <option value="프로젝트 미연결">📁 프로젝트 미연결</option>
                  <option value="Arirakku 마케팅">📁 Arirakku 마케팅</option>
                  <option value="사내 인트라넷 리뉴얼">📁 사내 인트라넷 리뉴얼</option>
                  <option value="신규 서비스 개발">📁 신규 서비스 개발</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <label className="form-label small fw-semibold text-secondary">캘린더 등록 구분 (색상)</label>
                <CFormSelect value={eventColor} onChange={(e) => setEventColor(e.target.value)}>
                  <option value="blue">🟦 공식 업무 / 시스템 (Blue)</option>
                  <option value="yellow">🟨 기획 / 마케팅 미팅 (Yellow)</option>
                  <option value="green">🟩 기타 부서 간 미팅 (Green)</option>
                  <option value="pink">🟥 휴일 / 전사 휴무 / 보고회 (Pink)</option>
                </CFormSelect>
              </CCol>
            </CRow>

            {/* Assignee selection */}
            <div className="mt-3">
              <label className="form-label small fw-semibold text-secondary">담당 참여자</label>
              <CFormSelect value={eventAssignee} onChange={(e) => setEventAssignee(e.target.value)}>
                {assignees.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </CFormSelect>
            </div>
          </CModalBody>

          <CModalFooter className="bg-light border-top border-light">
            <CButton color="secondary" className="fw-bold" onClick={() => setShowAddModal(false)}>
              닫기
            </CButton>
            <CButton type="submit" className="fw-bold text-white border-0" style={{ backgroundColor: '#005950' }}>
              저장
            </CButton>
          </CModalFooter>
        </form>
      </CModal>
    </div>
  )
}

export default Schedule
