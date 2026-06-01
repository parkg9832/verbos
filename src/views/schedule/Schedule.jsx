import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CButton,
  CFormSelect,
} from '@coreui/react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/ko'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Set moment locale to Korean
moment.locale('ko')
const localizer = momentLocalizer(moment)

const Schedule = () => {
  // Pre-load exactly ONE premium sample event (June 2026)
  const [events, setEvents] = useState([
    {
      id: 1,
      title: '🎯 Arirakku 브랜드 전략 기획 및 2분기 마케팅 킥오프 회의',
      start: new Date(2026, 5, 10, 14, 0),
      end: new Date(2026, 5, 10, 16, 0),
      color: '#321fdb',
    },
  ])

  // Form states for creating a new calendar event
  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [eventCategory, setEventCategory] = useState('#321fdb') // Blue as default

  const handleAddEvent = (e) => {
    e.preventDefault()
    if (!eventTitle.trim() || !eventDate) return

    const parsedDate = new Date(eventDate)
    const [startH, startM] = startTime.split(':').map(Number)
    const [endH, endM] = endTime.split(':').map(Number)

    const startDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), startH, startM)
    const endDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), endH, endM)

    if (startDate >= endDate) {
      alert('종료 시간은 시작 시간보다 늦어야 합니다.')
      return
    }

    const newEvent = {
      id: Date.now(),
      title: eventTitle,
      start: startDate,
      end: endDate,
      color: eventCategory,
    }

    setEvents([...events, newEvent])
    setEventTitle('')
    setEventDate('')
    setStartTime('09:00')
    setEndTime('10:00')
  }

  const handleDeleteEvent = (id) => {
    if (window.confirm('이 일정을 삭제하시겠습니까?')) {
      setEvents(events.filter((e) => e.id !== id))
    }
  }

  // Custom event styles
  const eventPropGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color || '#321fdb',
        borderRadius: '5px',
        color: '#ffffff',
        border: 'none',
        fontSize: '11px',
        fontWeight: 'bold',
      },
    }
  }

  return (
    <CRow>
      {/* Calendar view area */}
      <CCol lg={8} xl={9} className="mb-4">
        <CCard className="h-100 shadow-sm border-0">
          <CCardHeader className="bg-white border-0 pt-4 px-4">
            <h4 className="m-0 fw-bold text-dark">📅 전사 월간 일정 관리</h4>
            <span className="small text-muted">기업의 주요 공식 일정과 회의 시간표를 월간/주간 단위로 한눈에 파악할 수 있습니다.</span>
          </CCardHeader>
          <CCardBody className="p-4" style={{ minHeight: '600px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 550 }}
              defaultDate={new Date(2026, 5, 1)}
              eventPropGetter={eventPropGetter}
              views={['month', 'week', 'day']}
              onSelectEvent={(event) => handleDeleteEvent(event.id)}
              messages={{
                next: '다음',
                previous: '이전',
                today: '오늘',
                month: '월',
                week: '주',
                day: '일',
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* Side event addition form */}
      <CCol lg={4} xl={3} className="mb-4">
        <CCard className="shadow-sm border-0">
          <CCardHeader className="bg-white border-0 pt-4 px-4">
            <h5 className="m-0 fw-bold text-dark">신규 사내 일정 등록</h5>
            <span className="small text-muted">달력에 고정할 새로운 프로젝트 일정을 기입합니다.</span>
          </CCardHeader>
          <CCardBody className="px-4 pb-4">
            <form onSubmit={handleAddEvent}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">일정명</label>
                <CFormInput
                  placeholder="예: 마케팅 전략 주간 리뷰 회의"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">날짜 선택</label>
                <CFormInput
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(eventDate => e.target.value)}
                  required
                />
              </div>

              <CRow className="g-2 mb-3">
                <CCol>
                  <label className="form-label small fw-semibold text-secondary">시작 시간</label>
                  <CFormInput
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </CCol>
                <CCol>
                  <label className="form-label small fw-semibold text-secondary">종료 시간</label>
                  <CFormInput
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </CCol>
              </CRow>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">일정 카테고리</label>
                <CFormSelect
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                >
                  <option value="#321fdb">🟦 공식 업무 / 시스템 (Blue)</option>
                  <option value="#f9b115">🟨 기획 / 마케팅 미팅 (Yellow)</option>
                  <option value="#e1306c">🟥 성과 분석 / 결산 보고 (Pink)</option>
                  <option value="#2eb85c">🟩 기타 부서 간 미팅 (Green)</option>
                </CFormSelect>
              </div>

              <CButton type="submit" color="primary" className="w-100 fw-bold text-white py-2 shadow-sm">
                캘린더 일정 추가
              </CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Schedule
