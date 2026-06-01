import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CFormInput,
  CButton,
  CFormCheck,
  CBadge,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPlus,
  cilTrash,
  cilStar,
  cilCalendar,
  cilCheck,
  cilList,
  cilFilter,
  cilFolder,
  cilSearch,
} from '@coreui/icons'

const TodoList = () => {
  // 1. Initial seeded task as requested (exactly one comprehensive item)
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: '🎯 Arirakku 인스타그램 공식 계정 오픈 및 마케팅 바이럴 캠페인 준비',
      description: '인스타그램 공식 오픈에 앞서 가이드라인 수립 및 카드뉴스 제작, 시딩 태그를 정밀 분석합니다.',
      completed: false,
      date: '2026-06-15',
      status: 'in_progress', // 'backlog' | 'todo' | 'in_progress' | 'done' | 'canceled'
      assignee: '윤용승',
      priority: 'high', // 'high' | 'medium' | 'low'
      starred: true,
      project: 'Arirakku 마케팅',
      subtasks: [
        { id: 101, text: '브랜드 로고 및 프로필 가이드라인 디자인 확정', completed: false },
        { id: 102, text: '오픈 기념 카드뉴스 피드 3세트 및 기획 원고 초안 검수', completed: false },
        { id: 103, text: '시딩용 해시태그 및 글로벌 타깃 분석 태그 취합', completed: false },
      ],
      showSubtasks: true,
    },
  ])

  // UI Control states
  const [viewMode, setViewMode] = useState('board') // 'today' | 'weekly' | 'board' | 'list'
  const [hideCompleted, setHideCompleted] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'backlog' | 'todo' | 'in_progress' | 'done' | 'canceled'
  const [assigneeFilter, setAssigneeFilter] = useState('윤용승') // Default '윤용승' to match screenshot!
  const [searchQuery, setSearchQuery] = useState('')
  const [maskingMode, setMaskingMode] = useState(true) // Masking mode is active by default in the screenshot!

  // Add Task Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newStatus, setNewStatus] = useState('todo')
  const [newAssignee, setNewAssignee] = useState('윤용승')
  const [newDate, setNewDate] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [newProject, setNewProject] = useState('프로젝트 미연결')

  // Quick Inline Add state for each column: { status: text }
  const [quickAddText, setQuickAddText] = useState({
    backlog: '',
    todo: '',
    in_progress: '',
    done: '',
    canceled: '',
  })

  // List of assignees matching the screenshot
  const assigneesList = [
    '김도현',
    '조나단',
    '윤용승',
    '강혁구',
    '박민규',
    '박태윤',
    '여승구',
    '박재현',
  ]

  // Masking Helper Function
  const formatName = (name) => {
    if (!maskingMode) return name
    if (!name) return ''
    return `${name.charAt(0)}ㅇㅇ`
  }

  // 2. Count Calculations for state filters (Dynamic based on selected assignee or overall)
  const getCountsForStatus = (statusKey) => {
    // Counts should be calculated based on the assignee filter to stay consistent with the pills count
    let filtered = todos
    if (assigneeFilter !== 'all') {
      filtered = filtered.filter((t) => t.assignee === assigneeFilter)
    }

    if (statusKey === 'all') return filtered.length
    if (statusKey === 'backlog') return filtered.filter((t) => t.status === 'backlog').length
    if (statusKey === 'todo') return filtered.filter((t) => t.status === 'todo').length
    if (statusKey === 'in_progress') return filtered.filter((t) => t.status === 'in_progress').length
    if (statusKey === 'done') return filtered.filter((t) => t.status === 'done').length
    if (statusKey === 'canceled') return filtered.filter((t) => t.status === 'canceled').length
    return 0
  }

  // Count Calculations for assignees (Dynamic based on selected status filter)
  const getCountsForAssignee = (assigneeName) => {
    let filtered = todos
    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    if (assigneeName === 'all') return filtered.length
    return filtered.filter((t) => t.assignee === assigneeName).length
  }

  // Add a task from the full Modal Dialog
  const handleCreateTask = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newTask = {
      id: Date.now(),
      text: newTitle,
      description: newDesc,
      completed: newStatus === 'done',
      date: newDate || new Date().toISOString().split('T')[0],
      status: newStatus,
      assignee: newAssignee,
      priority: newPriority,
      starred: false,
      project: newProject,
      subtasks: [],
      showSubtasks: false,
    }

    setTodos([...todos, newTask])
    setNewTitle('')
    setNewDesc('')
    setNewStatus('todo')
    setNewAssignee('윤용승')
    setNewDate('')
    setNewPriority('medium')
    setNewProject('프로젝트 미연결')
    setShowAddModal(false)
  }

  // Quick inline add under a column
  const handleQuickAdd = (statusKey) => {
    const text = quickAddText[statusKey]
    if (!text || !text.trim()) return

    const newTask = {
      id: Date.now(),
      text: text,
      description: '',
      completed: statusKey === 'done',
      date: new Date().toISOString().split('T')[0],
      status: statusKey,
      assignee: assigneeFilter === 'all' ? '윤용승' : assigneeFilter,
      priority: 'medium',
      starred: false,
      project: '프로젝트 미연결',
      subtasks: [],
      showSubtasks: false,
    }

    setTodos([...todos, newTask])
    setQuickAddText({ ...quickAddText, [statusKey]: '' })
  }

  // Task operation handlers
  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed
          return {
            ...t,
            completed: nextCompleted,
            status: nextCompleted ? 'done' : 'todo',
          }
        }
        return t
      })
    )
  }

  const handleUpdateStatus = (id, newStatusVal) => {
    setTodos(
      todos.map((t) =>
        t.id === id
          ? { ...t, status: newStatusVal, completed: newStatusVal === 'done' }
          : t
      )
    )
  }

  const handleToggleStar = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, starred: !t.starred } : t))
    )
  }

  const handleDeleteTodo = (id) => {
    if (window.confirm('이 할 일을 삭제하시겠습니까?')) {
      setTodos(todos.filter((t) => t.id !== id))
    }
  }

  const handleAddSubtask = (todoId, subtaskText) => {
    if (!subtaskText || !subtaskText.trim()) return
    setTodos(
      todos.map((t) => {
        if (t.id === todoId) {
          return {
            ...t,
            subtasks: [...t.subtasks, { id: Date.now(), text: subtaskText, completed: false }],
            showSubtasks: true,
          }
        }
        return t
      })
    )
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

  const handleToggleSubtaskCollapse = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, showSubtasks: !t.showSubtasks } : t))
    )
  }

  // 3. Complete Filtering Pipeline
  const filteredTodos = todos.filter((t) => {
    // 1. Search Query filter (matches Title, description, assignee, priority)
    const matchesSearch =
      t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.priority.toLowerCase().includes(searchQuery.toLowerCase())

    // 2. Hide Completed toggle filter
    if (hideCompleted && t.status === 'done') return false

    // 3. Status filter
    if (statusFilter !== 'all' && t.status !== statusFilter) return false

    // 4. Assignee filter
    if (assigneeFilter !== 'all' && t.assignee !== assigneeFilter) return false

    // 5. View Mode Date limits
    const todayStr = new Date().toISOString().split('T')[0]
    if (viewMode === 'today') {
      return matchesSearch && t.date === todayStr
    }

    if (viewMode === 'weekly') {
      // Simple logic: tasks due in next 7 days
      const diffTime = new Date(t.date) - new Date(todayStr)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return matchesSearch && diffDays >= 0 && diffDays <= 7
    }

    return matchesSearch
  })

  // Column details helper
  const columnsList = [
    { key: 'backlog', title: '백로그', color: '#7e22ce', bg: '#f3e8ff' },
    { key: 'todo', title: '할 일', color: '#d97706', bg: '#fef3c7' },
    { key: 'in_progress', title: '진행중', color: '#2563eb', bg: '#dbeafe' },
    { key: 'done', title: '완료', color: '#15803d', bg: '#dcfce7' },
    { key: 'canceled', title: '취소', color: '#4b5563', bg: '#f3f4f6' },
  ]

  return (
    <div className="p-4" style={{ backgroundColor: '#fafbfb', minHeight: '85vh' }}>
      {/* 1. Header Area */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-4 bg-white rounded-3 shadow-sm border border-light">
        <div>
          <h2 className="fw-bold m-0" style={{ color: '#005950', fontSize: '28px' }}>할일관리</h2>
          <p className="text-muted small m-0 mt-1">할일은 적는 순간부터 현실이 됩니다.</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          {/* Masking Mode Switcher */}
          <CButton
            color={maskingMode ? 'warning' : 'light'}
            size="sm"
            className="fw-bold px-3 shadow-sm text-dark border-light"
            onClick={() => setMaskingMode(!maskingMode)}
          >
            🟡 마스킹 모드 {maskingMode ? 'ON' : 'OFF'}
          </CButton>
          <CButton
            className="fw-bold px-4 py-2 text-white shadow-sm border-0"
            style={{ backgroundColor: '#005950', borderRadius: '50px' }}
            onClick={() => setShowAddModal(true)}
          >
            <CIcon icon={cilPlus} className="me-1" /> 할일 추가
          </CButton>
        </div>
      </div>

      {/* 2. Top View Switcher (Today, Weekly, Board, List) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex p-1 bg-white rounded-pill shadow-sm border border-light gap-1" style={{ maxWidth: '420px' }}>
          {[
            { key: 'today', label: '오늘', icon: cilCalendar },
            { key: 'weekly', label: '주간', icon: cilCalendar },
            { key: 'board', label: '보드', icon: cilFilter },
            { key: 'list', label: '목록', icon: cilList },
          ].map((item) => (
            <CButton
              key={item.key}
              className={`rounded-pill px-4 fw-bold border-0 d-flex align-items-center gap-2 ${
                viewMode === item.key ? 'text-white' : 'text-secondary bg-transparent'
              }`}
              style={{
                backgroundColor: viewMode === item.key ? '#005950' : 'transparent',
                transition: 'all 0.2s',
              }}
              onClick={() => setViewMode(item.key)}
            >
              <CIcon icon={item.icon} size="sm" />
              {item.label}
            </CButton>
          ))}
        </div>
      </div>

      {/* 3. Control Search & Hide Completed Bar */}
      <div className="bg-white rounded-3 shadow-sm border border-light p-3 mb-4">
        <CRow className="g-3 align-items-center">
          <CCol md={6} lg={4}>
            <div className="position-relative">
              <CFormInput
                placeholder="제목, 설명, 담당자, 우선순위 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-4 py-2 border-light rounded-pill bg-light"
                style={{ fontSize: '14px' }}
              />
              <CIcon
                icon={cilSearch}
                className="position-absolute text-muted"
                style={{ left: '12px', top: '12px' }}
              />
            </div>
          </CCol>
          <CCol md={6} lg={8} className="d-flex justify-content-md-end">
            <CButton
              color={hideCompleted ? 'danger' : 'light'}
              className="fw-bold rounded-pill px-3 shadow-sm border-light"
              style={{ fontSize: '13px' }}
              onClick={() => setHideCompleted(!hideCompleted)}
            >
              완료 숨김 {hideCompleted ? 'ON' : 'OFF'}
            </CButton>
          </CCol>
        </CRow>

        {/* 4. Filter Pill Belt 1 (Status List) */}
        <div className="d-flex align-items-center gap-2 mt-4 flex-wrap pb-2 border-bottom border-light">
          <CButton
            onClick={() => setStatusFilter('all')}
            className={`rounded-pill py-1 px-3 fw-bold border-light shadow-sm ${
              statusFilter === 'all' ? 'text-white' : 'text-dark bg-light'
            }`}
            style={{
              backgroundColor: statusFilter === 'all' ? '#005950' : '#f8f9fa',
              fontSize: '13px',
            }}
          >
            전체 <CBadge color="secondary" className="ms-1 rounded-pill">{getCountsForStatus('all')}</CBadge>
          </CButton>
          {columnsList.map((col) => (
            <CButton
              key={col.key}
              onClick={() => setStatusFilter(col.key)}
              className={`rounded-pill py-1 px-3 fw-bold border-light shadow-sm ${
                statusFilter === col.key ? 'text-white' : 'text-dark'
              }`}
              style={{
                backgroundColor: statusFilter === col.key ? '#005950' : '#f8f9fa',
                fontSize: '13px',
              }}
            >
              {col.title} <CBadge color="secondary" className="ms-1 rounded-pill">{getCountsForStatus(col.key)}</CBadge>
            </CButton>
          ))}
        </div>

        {/* 5. Filter Pill Belt 2 (Assignee List) */}
        <div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
          <CButton
            onClick={() => setAssigneeFilter('all')}
            className={`rounded-pill py-1 px-3 fw-bold border-light shadow-sm ${
              assigneeFilter === 'all' ? 'text-white' : 'text-dark'
            }`}
            style={{
              backgroundColor: assigneeFilter === 'all' ? '#005950' : '#f8f9fa',
              fontSize: '13px',
            }}
          >
            전체 <CBadge color="secondary" className="ms-1 rounded-pill">{getCountsForAssignee('all')}</CBadge>
          </CButton>
          {assigneesList.map((assignee) => (
            <CButton
              key={assignee}
              onClick={() => setAssigneeFilter(assignee)}
              className={`rounded-pill py-1 px-3 fw-bold border-light shadow-sm ${
                assigneeFilter === assignee ? 'text-white' : 'text-dark'
              }`}
              style={{
                backgroundColor: assigneeFilter === assignee ? '#005950' : '#f8f9fa',
                fontSize: '13px',
              }}
            >
              {formatName(assignee)} <CBadge color="secondary" className="ms-1 rounded-pill">{getCountsForAssignee(assignee)}</CBadge>
            </CButton>
          ))}
        </div>
      </div>

      {/* 6. Main Grid (Board View or List View render) */}
      {viewMode === 'board' ? (
        <CRow className="g-3 flex-nowrap overflow-auto pb-4">
          {columnsList.map((col) => {
            const columnTasks = filteredTodos.filter((t) => t.status === col.key)

            return (
              <CCol key={col.key} style={{ minWidth: '280px', maxWidth: '320px' }}>
                <div className="p-3 rounded-3 shadow-sm border border-light bg-white h-100">
                  {/* Column Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-light">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="d-inline-block rounded-circle"
                        style={{ width: '12px', height: '12px', backgroundColor: col.color }}
                      ></span>
                      <h6 className="fw-bold text-dark m-0" style={{ fontSize: '15px' }}>{col.title}</h6>
                    </div>
                    <CBadge
                      style={{
                        backgroundColor: col.bg,
                        color: col.color,
                        borderRadius: '10px',
                        padding: '4px 8px',
                      }}
                    >
                      {columnTasks.length}
                    </CBadge>
                  </div>

                  {/* Tasks List */}
                  <div className="d-flex flex-column gap-3 mb-3" style={{ minHeight: '120px' }}>
                    {columnTasks.map((todo) => (
                      <CCard
                        key={todo.id}
                        className="shadow-sm border-0 border-start border-3"
                        style={{
                          borderLeftColor:
                            todo.priority === 'high'
                              ? '#e55353'
                              : todo.priority === 'medium'
                              ? '#f9b115'
                              : '#2eb85c',
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.06)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        <CCardBody className="p-3">
                          {/* Card Content & Action header */}
                          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                            <div className="d-flex align-items-start gap-2">
                              <CFormCheck
                                checked={todo.completed}
                                onChange={() => handleToggleTodo(todo.id)}
                                style={{ cursor: 'pointer', marginTop: '3px' }}
                              />
                              <span
                                className="fw-bold text-dark"
                                style={{
                                  fontSize: '14px',
                                  textDecoration: todo.completed ? 'line-through' : 'none',
                                  opacity: todo.completed ? 0.6 : 1,
                                }}
                              >
                                {todo.text}
                              </span>
                            </div>
                            <CButton
                              color="link"
                              className="p-0 text-warning"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleStar(todo.id)
                              }}
                            >
                              <CIcon
                                icon={cilStar}
                                className={todo.starred ? 'text-warning' : 'text-black-50'}
                                style={{
                                  fill: todo.starred ? '#f9b115' : 'transparent',
                                  width: '14px',
                                }}
                              />
                            </CButton>
                          </div>

                          {todo.description && (
                            <p className="text-secondary small mb-2 text-truncate" style={{ fontSize: '12px' }}>
                              {todo.description}
                            </p>
                          )}

                          {/* Detail Meta Belt */}
                          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3 pt-2 border-top border-light">
                            <div className="d-flex align-items-center gap-2">
                              {/* Assignee Avatar */}
                              <div
                                style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  backgroundColor: '#e6f4f2',
                                  color: '#005950',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '9px',
                                  fontWeight: 'bold',
                                  boxShadow: 'inset 0 0 2px rgba(0,0,0,0.1)',
                                }}
                              >
                                {formatName(todo.assignee)}
                              </div>
                              {/* Due Date */}
                              <span className="text-muted" style={{ fontSize: '11px' }}>
                                📅 {todo.date.slice(5).replace('-', '/')}
                              </span>
                            </div>

                            {/* Dropdown status switcher */}
                            <CDropdown className="align-self-end">
                              <CDropdownToggle
                                size="sm"
                                color="light"
                                className="border-light px-2 py-0 fw-bold"
                                style={{ fontSize: '10px' }}
                              >
                                상태 변경
                              </CDropdownToggle>
                              <CDropdownMenu>
                                {columnsList.map((stateItem) => (
                                  <CDropdownItem
                                    key={stateItem.key}
                                    onClick={() => handleUpdateStatus(todo.id, stateItem.key)}
                                    className="small fw-bold"
                                  >
                                    {stateItem.title}
                                  </CDropdownItem>
                                ))}
                                <CDropdownItem divider />
                                <CDropdownItem
                                  className="text-danger small fw-bold"
                                  onClick={() => handleDeleteTodo(todo.id)}
                                >
                                  ❌ 삭제
                                </CDropdownItem>
                              </CDropdownMenu>
                            </CDropdown>
                          </div>

                          {/* Project linkage tag */}
                          <div className="mt-2 d-flex align-items-center justify-content-between">
                            <span className="text-muted small fw-semibold" style={{ fontSize: '10px' }}>
                              <CIcon icon={cilFolder} size="sm" className="me-1" />
                              {todo.project}
                            </span>

                            {todo.subtasks.length > 0 && (
                              <CButton
                                color="link"
                                className="p-0 text-decoration-none small text-secondary"
                                style={{ fontSize: '10px' }}
                                onClick={() => handleToggleSubtaskCollapse(todo.id)}
                              >
                                서브태스크 ({todo.subtasks.filter((s) => s.completed).length}/{todo.subtasks.length})
                              </CButton>
                            )}
                          </div>

                          {/* Subtasks board inline panel */}
                          {todo.showSubtasks && todo.subtasks.length > 0 && (
                            <div className="mt-2 ps-2 border-start border-2 border-light ms-1">
                              {todo.subtasks.map((st) => (
                                <div key={st.id} className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: '11px' }}>
                                  <CFormCheck
                                    size="sm"
                                    checked={st.completed}
                                    onChange={() => handleToggleSubtask(todo.id, st.id)}
                                  />
                                  <span
                                    className="text-secondary text-truncate"
                                    style={{
                                      textDecoration: st.completed ? 'line-through' : 'none',
                                      opacity: st.completed ? 0.5 : 1,
                                    }}
                                  >
                                    {st.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </CCardBody>
                      </CCard>
                    ))}

                    {columnTasks.length === 0 && (
                      <div className="text-center py-4 rounded bg-light text-muted small border-light border border-dashed my-auto">
                        비어 있음
                      </div>
                    )}
                  </div>

                  {/* Quick add in column footer */}
                  <div className="mt-auto border-top border-light pt-2">
                    <div className="d-flex gap-2 align-items-center">
                      <CFormInput
                        size="sm"
                        placeholder="+ 빠른 추가..."
                        className="bg-light border-light"
                        style={{ fontSize: '12px' }}
                        value={quickAddText[col.key]}
                        onChange={(e) =>
                          setQuickAddText({ ...quickAddText, [col.key]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleQuickAdd(col.key)
                        }}
                      />
                      <CButton
                        size="sm"
                        color="light"
                        className="fw-bold border-light py-1 text-dark"
                        style={{ fontSize: '11px' }}
                        onClick={() => handleQuickAdd(col.key)}
                      >
                        추가
                      </CButton>
                    </div>
                  </div>
                </div>
              </CCol>
            )
          })}
        </CRow>
      ) : (
        /* List / Todoist style View */
        <CCard className="shadow-sm border-0 bg-white p-4">
          <h5 className="fw-bold mb-3 text-dark">📋 상세 할 일 목록 ({filteredTodos.length}건)</h5>
          <div className="d-flex flex-column gap-2">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="p-3 rounded border border-light d-flex align-items-center justify-content-between hover-shadow bg-light border-start border-3"
                style={{
                  borderLeftColor:
                    todo.priority === 'high'
                      ? '#e55353'
                      : todo.priority === 'medium'
                      ? '#f9b115'
                      : '#2eb85c',
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <CFormCheck
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <div>
                    <span
                      className="fw-bold text-dark block"
                      style={{
                        fontSize: '15px',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        opacity: todo.completed ? 0.6 : 1,
                      }}
                    >
                      {todo.text}
                    </span>
                    <div className="d-flex gap-3 align-items-center mt-1 flex-wrap">
                      <CBadge
                        style={{
                          backgroundColor:
                            todo.status === 'in_progress'
                              ? '#dbeafe'
                              : todo.status === 'todo'
                              ? '#fef3c7'
                              : todo.status === 'backlog'
                              ? '#f3e8ff'
                              : '#dcfce7',
                          color:
                            todo.status === 'in_progress'
                              ? '#2563eb'
                              : todo.status === 'todo'
                              ? '#d97706'
                              : todo.status === 'backlog'
                              ? '#7e22ce'
                              : '#15803d',
                        }}
                      >
                        {todo.status === 'in_progress'
                          ? '진행중'
                          : todo.status === 'todo'
                          ? '할 일'
                          : todo.status === 'backlog'
                          ? '백로그'
                          : todo.status === 'done'
                          ? '완료'
                          : '취소'}
                      </CBadge>
                      <span className="text-secondary small">👤 {formatName(todo.assignee)}</span>
                      <span className="text-secondary small">📅 마감일: {todo.date}</span>
                      <span className="text-secondary small">📁 {todo.project}</span>
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
                      style={{ fill: todo.starred ? '#f9b115' : 'transparent', width: '16px' }}
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
            ))}

            {filteredTodos.length === 0 && (
              <div className="text-center py-5 text-muted small bg-light rounded border border-light">
                조건에 맞는 할 일 카드가 비어있습니다.
              </div>
            )}
          </div>
        </CCard>
      )}

      {/* 7. Beautiful CModal for adding a new task */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} size="lg">
        <form onSubmit={handleCreateTask}>
          <CModalHeader className="bg-light border-bottom border-light">
            <CModalTitle className="fw-bold text-dark" style={{ fontSize: '18px' }}>🎯 새로운 할일 추가</CModalTitle>
          </CModalHeader>
          <CModalBody className="p-4">
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">할일 제목</label>
              <CFormInput
                placeholder="예: Arirakku 마케팅 기안 결재 서명"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">업무 설명 (선택)</label>
              <CFormTextarea
                placeholder="상세한 업무 요건을 기술하세요..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
              />
            </div>

            <CRow className="g-3 mb-3">
              <CCol md={6}>
                <label className="form-label small fw-semibold text-secondary">담당자 지정</label>
                <CFormSelect
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                >
                  {assigneesList.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <label className="form-label small fw-semibold text-secondary">진행 상태</label>
                <CFormSelect
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="backlog">백로그 (Backlog)</option>
                  <option value="todo">할 일 (To-Do)</option>
                  <option value="in_progress">진행중 (In Progress)</option>
                  <option value="done">완료 (Completed)</option>
                  <option value="canceled">취소 (Cancelled)</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="g-3">
              <CCol md={6}>
                <label className="form-label small fw-semibold text-secondary">마감 기한</label>
                <CFormInput
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </CCol>
              <CCol md={6}>
                <label className="form-label small fw-semibold text-secondary">우선순위</label>
                <CFormSelect
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                >
                  <option value="high">🚨 긴급 (P1)</option>
                  <option value="medium">🟡 보통 (P2)</option>
                  <option value="low">🔵 낮음 (P3)</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <div className="mt-3">
              <label className="form-label small fw-semibold text-secondary">프로젝트 연결</label>
              <CFormSelect
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
              >
                <option value="프로젝트 미연결">📁 프로젝트 미연결</option>
                <option value="Arirakku 마케팅">📁 Arirakku 마케팅</option>
                <option value="사내 인트라넷 리뉴얼">📁 사내 인트라넷 리뉴얼</option>
                <option value="신규 서비스 개발">📁 신규 서비스 개발</option>
              </CFormSelect>
            </div>
          </CModalBody>
          <CModalFooter className="bg-light border-top border-light">
            <CButton
              color="secondary"
              className="fw-bold"
              onClick={() => setShowAddModal(false)}
            >
              닫기
            </CButton>
            <CButton
              type="submit"
              className="fw-bold text-white border-0"
              style={{ backgroundColor: '#005950' }}
            >
              할일 생성
            </CButton>
          </CModalFooter>
        </form>
      </CModal>
    </div>
  )
}

export default TodoList
