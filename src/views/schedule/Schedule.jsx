import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CButton,
  CFormCheck,
  CListGroup,
  CListGroupItem,
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
  // Pre-load some sample events (June 2026 based on mock data time)
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Amiko 플랫폼 전체 시스템 점검',
      start: new Date(2026, 5, 3, 9, 0),
      end: new Date(2026, 5, 3, 12, 0),
    },
    {
      id: 2,
      title: 'Arirakku 브랜드 전략 기획 회의',
      start: new Date(2026, 5, 10, 14, 0),
      end: new Date(2026, 5, 10, 16, 0),
    },
    {
      id: 3,
      title: '물류 운송 트래킹 API 연동 점검',
      start: new Date(2026, 5, 17, 10, 0),
      end: new Date(2026, 5, 17, 12, 0),
    },
    {
      id: 4,
      title: '고객 센터 2분기 문의 통계 마감',
      start: new Date(2026, 5, 24, 15, 0),
      end: new Date(2026, 5, 24, 17, 0),
    },
  ])

  // Pre-load some sample To-Dos
  const [todos, setTodos] = useState([
    { id: 1, text: 'Amiko 신규 입점 프로모션 시안 확정', completed: false, date: '2026-06-03' },
    { id: 2, text: 'Arirakku 인스타그램 공식 계정 오픈 준비', completed: true, date: '2026-06-10' },
    { id: 3, text: '배송 조회 지연 건 고객 알림 톡 발송', completed: false, date: '2026-06-17' },
    { id: 4, text: '사용자 피드백 보고서 작성', completed: false, date: '' },
  ])

  // Form states
  const [todoText, setTodoText] = useState('')
  const [todoDate, setTodoDate] = useState('')
  const [addToCalendar, setAddToCalendar] = useState(false)

  // Handle adding a new To-Do & Calendar event
  const handleAddTodo = (e) => {
    e.preventDefault()
    if (!todoText.trim()) return

    const newTodoId = todos.length + 1
    const newTodo = {
      id: newTodoId,
      text: todoText,
      completed: false,
      date: todoDate,
    }

    setTodos([...todos, newTodo])

    // If due date is entered and add to calendar is checked, create calendar event
    if (todoDate && addToCalendar) {
      const parsedDate = new Date(todoDate)
      // Set start time to 09:00 AM, end to 10:00 AM by default
      const startDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 9, 0)
      const endDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 10, 0)

      const newEvent = {
        id: events.length + 1,
        title: `[할일] ${todoText}`,
        start: startDate,
        end: endDate,
      }

      setEvents([...events, newEvent])
    }

    // Reset inputs
    setTodoText('')
    setTodoDate('')
    setAddToCalendar(false)
  }

  // Toggle todo completion
  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed }
        }
        return todo
      })
    )
  }

  // Delete a To-Do
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <CRow>
      {/* Calendar Area */}
      <CCol lg={7} xl={8} className="mb-4">
        <CCard className="h-100 shadow-sm border-0">
          <CCardHeader className="bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <div>
              <h4 className="m-0 fw-bold text-dark">월간 사내 일정</h4>
              <span className="small text-muted">주요 일정과 회의 현황을 월간 달력에서 관리하세요.</span>
            </div>
          </CCardHeader>
          <CCardBody className="p-4" style={{ minHeight: '550px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              defaultDate={new Date(2026, 5, 1)}
              views={['month', 'week', 'day']}
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

      {/* To-Do List Area */}
      <CCol lg={5} xl={4} className="mb-4">
        <CCard className="shadow-sm border-0 mb-4">
          <CCardHeader className="bg-white border-0 pt-4 px-4">
            <h5 className="m-0 fw-bold text-dark">할 일 (To-Do) 등록</h5>
            <span className="small text-muted">새로운 사내 할 일을 작성하고 달력에 연동할 수 있습니다.</span>
          </CCardHeader>
          <CCardBody className="px-4 pb-4">
            <form onSubmit={handleAddTodo}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">업무 내용</label>
                <CFormInput
                  placeholder="예: 물류 파트너사 계약서 서명"
                  value={todoText}
                  onChange={(e) => setTodoText(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">기한 설정 (선택)</label>
                <CFormInput
                  type="date"
                  value={todoDate}
                  onChange={(e) => setTodoDate(e.target.value)}
                />
              </div>
              {todoDate && (
                <div className="mb-3 d-flex align-items-center">
                  <CFormCheck
                    id="addToCalendarCheck"
                    label="이 업무를 캘린더 일정에도 등록하기"
                    checked={addToCalendar}
                    onChange={(e) => setAddToCalendar(e.target.checked)}
                  />
                </div>
              )}
              <CButton type="submit" color="primary" className="w-100 fw-bold text-white py-2">
                할 일 추가하기
              </CButton>
            </form>
          </CCardBody>
        </CCard>

        <CCard className="shadow-sm border-0">
          <CCardHeader className="bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="m-0 fw-bold text-dark">사내 업무 목록</h5>
              <span className="small text-muted">완료된 업무는 체크하여 상태를 업데이트합니다.</span>
            </div>
          </CCardHeader>
          <CCardBody className="px-4 pb-4">
            <CListGroup flush>
              {todos.map((todo) => (
                <CListGroupItem
                  key={todo.id}
                  className="d-flex justify-content-between align-items-center px-0 py-3 border-bottom"
                  style={{ background: 'transparent' }}
                >
                  <div className="d-flex align-items-start gap-2 flex-grow-1">
                    <CFormCheck
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id)}
                      className="mt-1"
                    />
                    <div className="d-flex flex-column">
                      <span
                        className="fw-semibold text-dark"
                        style={{
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          opacity: todo.completed ? 0.5 : 1,
                        }}
                      >
                        {todo.text}
                      </span>
                      {todo.date && (
                        <span className="small text-primary fw-medium mt-1">
                          기한: {todo.date}
                        </span>
                      )}
                    </div>
                  </div>
                  <CButton
                    color="link"
                    className="text-danger p-0 text-decoration-none fw-bold"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    삭제
                  </CButton>
                </CListGroupItem>
              ))}
              {todos.length === 0 && (
                <div className="text-center py-4 text-muted small">
                  등록된 업무가 없습니다. 새로운 할 일을 추가해 보세요!
                </div>
              )}
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Schedule
