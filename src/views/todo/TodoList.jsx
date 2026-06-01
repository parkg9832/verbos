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
  CBadge,
  CFormSelect,
  CProgress,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilTrash, cilStar, cilCalendar, cilCheck, cilList, cilFilter } from '@coreui/icons'

const TodoList = () => {
  // 1. Seed exactly ONE comprehensive To-Do item as requested
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: '🎯 Arirakku 인스타그램 공식 계정 오픈 및 마케팅 바이럴 캠페인 준비',
      completed: false,
      date: '2026-06-15',
      category: 'work', // 'work' | 'personal' | 'study' | 'shopping'
      priority: 'high', // 'high' | 'medium' | 'low'
      starred: true,
      subtasks: [
        { id: 101, text: '브랜드 로고 및 프로필 가이드라인 디자인 확정', completed: false },
        { id: 102, text: '오픈 기념 카드뉴스 피드 3세트 및 기획 원고 초안 검수', completed: false },
        { id: 103, text: '시딩용 해시태그 및 글로벌 타깃 분석 태그 취합', completed: false },
      ],
      showSubtasks: true,
    },
  ])

  // Form input states
  const [todoText, setTodoText] = useState('')
  const [todoDate, setTodoDate] = useState('')
  const [todoCategory, setTodoCategory] = useState('work')
  const [todoPriority, setTodoPriority] = useState('medium')

  // Subtask creation state
  const [subtaskInputs, setSubtaskInputs] = useState({}) // { todoId: 'subtask text' }

  // Filter tabs: 'all' | 'today' | 'starred' | 'completed'
  const [activeTab, setActiveTab] = useState('all')
  // Category filter: 'all' | 'work' | 'personal' | 'study' | 'shopping'
  const [categoryFilter, setCategoryFilter] = useState('all')
  // Search keyword
  const [searchTerm, setSearchTerm] = useState('')

  // 2. To-Do handlers
  const handleAddTodo = (e) => {
    e.preventDefault()
    if (!todoText.trim()) return

    const newTodo = {
      id: Date.now(),
      text: todoText,
      completed: false,
      date: todoDate || new Date().toISOString().split('T')[0],
      category: todoCategory,
      priority: todoPriority,
      starred: false,
      subtasks: [],
      showSubtasks: false,
    }

    setTodos([...todos, newTodo])
    setTodoText('')
    setTodoDate('')
    setTodoCategory('work')
    setTodoPriority('medium')
  }

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const handleToggleStar = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, starred: !t.starred } : t))
    )
  }

  const handleDeleteTodo = (id) => {
    if (window.confirm('정말 이 할 일을 삭제하시겠습니까?')) {
      setTodos(todos.filter((t) => t.id !== id))
    }
  }

  const handleToggleSubtask = (todoId, subtaskId) => {
    setTodos(
      todos.map((t) => {
        if (t.id === todoId) {
          return {
            ...t,
            subtasks: t.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
          }
        }
        return t
      })
    )
  }

  const handleAddSubtask = (todoId) => {
    const text = subtaskInputs[todoId]
    if (!text || !text.trim()) return

    setTodos(
      todos.map((t) => {
        if (t.id === todoId) {
          return {
            ...t,
            subtasks: [...t.subtasks, { id: Date.now(), text: text, completed: false }],
            showSubtasks: true,
          }
        }
        return t
      })
    )

    setSubtaskInputs({ ...subtaskInputs, [todoId]: '' })
  }

  const handleToggleSubtaskCollapse = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, showSubtasks: !t.showSubtasks } : t))
    )
  }

  // 3. Filtering logic
  const filteredTodos = todos.filter((t) => {
    const matchesSearch = t.text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter

    let matchesTab = true
    const todayStr = new Date().toISOString().split('T')[0]
    if (activeTab === 'today') {
      matchesTab = t.date === todayStr && !t.completed
    } else if (activeTab === 'starred') {
      matchesTab = t.starred && !t.completed
    } else if (activeTab === 'completed') {
      matchesTab = t.completed
    } else {
      matchesTab = !t.completed // 'all' shows active ones by default
    }

    return matchesSearch && matchesCategory && matchesTab
  })

  // Completed stats calculation
  const totalCount = todos.length
  const completedCount = todos.filter((t) => t.completed).length
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <>
      {/* Todo Header Analytics Stats */}
      <CRow className="mb-4">
        <CCol lg={12}>
          <CCard className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #1d2731, #0f171e)' }}>
            <CCardBody className="p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h4 className="fw-bold m-0 text-white">📝 할 일 보드 (Todoist Dashboard)</h4>
                <p className="text-white-50 small mb-0 mt-1">개인의 하루 할 일과 세부 업무 체크리스트를 체계적으로 트래킹합니다.</p>
              </div>
              <div className="d-flex align-items-center gap-3" style={{ minWidth: '220px' }}>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between mb-1 small fw-bold text-white-50">
                    <span>진행률</span>
                    <span>{progressPct}% ({completedCount}/{totalCount})</span>
                  </div>
                  <CProgress value={progressPct} color="success" style={{ height: '8px' }} />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        {/* Left Control Panel / New Task Creator */}
        <CCol lg={4} className="mb-4">
          <CCard className="shadow-sm border-0 mb-4">
            <CCardHeader className="bg-white border-0 pt-4 px-4">
              <h5 className="m-0 fw-bold text-dark">🎯 새로운 할 일 추가</h5>
              <span className="small text-muted">기한과 카테고리를 적용하여 새 체크리스트를 만듭니다.</span>
            </CCardHeader>
            <CCardBody className="px-4 pb-4">
              <form onSubmit={handleAddTodo}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">할 일 기입</label>
                  <CFormInput
                    placeholder="예: Arirakku 마케팅 시안 컨펌"
                    value={todoText}
                    onChange={(e) => setTodoText(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">마감 기한</label>
                  <CFormInput
                    type="date"
                    value={todoDate}
                    onChange={(e) => setTodoDate(e.target.value)}
                  />
                </div>

                <CRow className="g-2 mb-3">
                  <CCol>
                    <label className="form-label small fw-semibold text-secondary">중요도</label>
                    <CFormSelect
                      value={todoPriority}
                      onChange={(e) => setTodoPriority(e.target.value)}
                    >
                      <option value="high">🚨 긴급 (P1)</option>
                      <option value="medium">🟡 보통 (P2)</option>
                      <option value="low">🔵 낮음 (P3)</option>
                    </CFormSelect>
                  </CCol>
                  <CCol>
                    <label className="form-label small fw-semibold text-secondary">구분</label>
                    <CFormSelect
                      value={todoCategory}
                      onChange={(e) => setTodoCategory(e.target.value)}
                    >
                      <option value="work">💼 회사 업무</option>
                      <option value="personal">👤 개인 약속</option>
                      <option value="study">📚 개발/공부</option>
                      <option value="shopping">🛒 구매/기타</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CButton type="submit" color="primary" className="w-100 fw-bold text-white py-2 shadow-sm">
                  <CIcon icon={cilPlus} className="me-1" /> 할 일 추가
                </CButton>
              </form>
            </CCardBody>
          </CCard>

          {/* Quick Filters */}
          <CCard className="shadow-sm border-0">
            <CCardHeader className="bg-white border-0 pt-4 px-4">
              <h5 className="m-0 fw-bold text-dark">🔍 스마트 필터</h5>
            </CCardHeader>
            <CCardBody className="p-3">
              <div className="d-flex flex-column gap-1">
                <CButton
                  color={activeTab === 'all' ? 'primary' : 'light'}
                  className={`text-start fw-bold ${activeTab === 'all' ? 'text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('all')}
                >
                  📥 진행 중인 할 일 전체
                </CButton>
                <CButton
                  color={activeTab === 'today' ? 'primary' : 'light'}
                  className={`text-start fw-bold ${activeTab === 'today' ? 'text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('today')}
                >
                  📅 오늘 예정된 할 일
                </CButton>
                <CButton
                  color={activeTab === 'starred' ? 'primary' : 'light'}
                  className={`text-start fw-bold ${activeTab === 'starred' ? 'text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('starred')}
                >
                  ⭐ 별표한 주요 할 일
                </CButton>
                <CButton
                  color={activeTab === 'completed' ? 'primary' : 'light'}
                  className={`text-start fw-bold ${activeTab === 'completed' ? 'text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('completed')}
                >
                  ✅ 이미 완료한 할 일
                </CButton>
              </div>

              <div className="mt-4 pt-3 border-top border-light">
                <label className="form-label small fw-semibold text-secondary">카테고리 필터</label>
                <CFormSelect
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">📂 카테고리: 전체보기</option>
                  <option value="work">💼 회사 업무</option>
                  <option value="personal">👤 개인 약속</option>
                  <option value="study">📚 개발/공부</option>
                  <option value="shopping">🛒 구매/기타</option>
                </CFormSelect>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Right Todo List render panel */}
        <CCol lg={8} className="mb-4">
          <CCard className="shadow-sm border-0 h-100">
            <CCardHeader className="bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h5 className="m-0 fw-bold text-dark">📋 상세 할 일 리스트</h5>
                <span className="small text-muted">체크하면 완료 상태가 되며 서브 체크리스트를 펼쳐 관리할 수 있습니다.</span>
              </div>
              <div style={{ maxWidth: '250px' }}>
                <CFormInput
                  placeholder="할 일 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CCardHeader>
            <CCardBody className="p-4">
              {filteredTodos.map((todo) => {
                // Completed subtasks stats
                const totalSub = todo.subtasks.length
                const completedSub = todo.subtasks.filter((st) => st.completed).length

                return (
                  <div
                    key={todo.id}
                    className="p-3 mb-3 rounded border border-light shadow-sm bg-white card-hover border-start border-3"
                    style={{
                      borderLeftColor: todo.priority === 'high' ? '#e55353' : todo.priority === 'medium' ? '#f9b115' : '#2eb85c',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div className="d-flex align-items-start gap-2 flex-grow-1">
                        <CFormCheck
                          checked={todo.completed}
                          onChange={() => handleToggleTodo(todo.id)}
                          className="mt-1"
                          style={{ cursor: 'pointer' }}
                        />
                        <div>
                          <span
                            className="fw-bold fs-6 text-dark"
                            style={{
                              textDecoration: todo.completed ? 'line-through' : 'none',
                              opacity: todo.completed ? 0.5 : 1,
                            }}
                          >
                            {todo.text}
                          </span>
                          
                          <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                            <CBadge color="light" className="text-secondary border small">
                              {todo.category === 'work' ? '💼 회사' : todo.category === 'personal' ? '👤 개인' : todo.category === 'study' ? '📚 공부' : '🛒 쇼핑'}
                            </CBadge>
                            <span className="text-muted small" style={{ fontSize: '11px' }}>
                              ⏳ 기한: {todo.date}
                            </span>
                            {totalSub > 0 && (
                              <CButton
                                color="link"
                                className="p-0 text-decoration-none small font-semibold"
                                onClick={() => handleToggleSubtaskCollapse(todo.id)}
                                style={{ fontSize: '11px' }}
                              >
                                <CIcon icon={cilList} className="me-1" />
                                세부 할 일 ({completedSub}/{totalSub})
                              </CButton>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <CButton
                          color="link"
                          className="p-0 text-warning"
                          onClick={() => handleToggleStar(todo.id)}
                        >
                          <CIcon
                            icon={cilStar}
                            className={todo.starred ? 'text-warning' : 'text-black-50'}
                            style={{ fill: todo.starred ? '#f9b115' : 'transparent' }}
                          />
                        </CButton>
                        <CButton
                          color="link"
                          className="p-0 text-danger"
                          onClick={() => handleDeleteTodo(todo.id)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </div>
                    </div>

                    {/* Subtasks board panel */}
                    {todo.showSubtasks && (
                      <div className="mt-3 ps-4 border-start border-2 border-light ms-2">
                        <div className="d-flex flex-column gap-2 mb-3">
                          {todo.subtasks.map((sub) => (
                            <div key={sub.id} className="d-flex align-items-center gap-2 small">
                              <CFormCheck
                                checked={sub.completed}
                                onChange={() => handleToggleSubtask(todo.id, sub.id)}
                              />
                              <span
                                className="text-secondary"
                                style={{
                                  textDecoration: sub.completed ? 'line-through' : 'none',
                                  opacity: sub.completed ? 0.5 : 1,
                                }}
                              >
                                {sub.text}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Add subtask input */}
                        <div className="d-flex gap-2">
                          <CFormInput
                            size="sm"
                            placeholder="세부 할 일 추가..."
                            value={subtaskInputs[todo.id] || ''}
                            onChange={(e) =>
                              setSubtaskInputs({ ...subtaskInputs, [todo.id]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddSubtask(todo.id)
                            }}
                          />
                          <CButton
                            size="sm"
                            color="outline-primary"
                            className="fw-bold"
                            onClick={() => handleAddSubtask(todo.id)}
                          >
                            추가
                          </CButton>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {filteredTodos.length === 0 && (
                <div className="text-center py-5 text-muted small bg-light rounded border border-light">
                  해당 보드 및 조건에 맞는 할 일 카드가 비어있습니다. 왼쪽에서 추가해 보세요!
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default TodoList
