import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CFormInput,
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
import { cilPlus, cilTrash, cilPencil, cilSearch, cilFilter, cilSwapHorizontal } from '@coreui/icons'

const Tasks = () => {
  // 1. Initial corporate tasks seed data
  const defaultTasks = [
    {
      id: 1,
      title: 'Amiko 플랫폼 배송 현황 모니터링 자동화 개발',
      desc: '택배사 API 연동 오류 문제를 해결하고, 지연 발생 시 고객 및 관리자 자동 알림 톡 발송 시스템을 백엔드와 연동합니다.',
      status: 'progress', // 'todo' | 'progress' | 'review' | 'done'
      priority: 'high', // 'high' | 'medium' | 'low'
      assignee: '이대리 (개발팀)',
      dueDate: '2026-06-15',
    },
    {
      id: 2,
      title: 'Arirakku 공식 브랜드 몰 결제 모듈 최종 검수',
      desc: 'PG사 결제 카드 승인 및 가상계좌 발급, 그리고 결제 취소 시 자동 환불 프로세스를 모바일 및 PC 뷰포트에서 최종 시나리오 테스트합니다.',
      status: 'review',
      priority: 'high',
      assignee: '김팀장 (경영혁신)',
      dueDate: '2026-06-10',
    },
    {
      id: 3,
      title: '인플루언서 시딩 및 숏폼 바이럴 마케팅 예산안 수립',
      desc: '틱톡과 인스타그램 릴스 크리에이터 20인 대상 협찬 시딩 및 공동 구매 수수료 배분 계약 조건 예산안 기안을 올립니다.',
      status: 'todo',
      priority: 'medium',
      assignee: '박사원 (마케팅팀)',
      dueDate: '2026-06-18',
    },
    {
      id: 4,
      title: '2분기 소셜 광고 퍼포먼스 성과 리포트 정리',
      desc: '메타 및 구글 검색 광고 누적 지출액 대비 ROAS 실적, 그리고 UTM 태그 기반 유입 분석표를 엑셀 취합하여 이사회 공유용으로 마감합니다.',
      status: 'done',
      priority: 'low',
      assignee: '정대리 (마케팅팀)',
      dueDate: '2026-05-28',
    },
    {
      id: 5,
      title: '글로벌 라인업 패키지 한글/영문 라벨 감수',
      desc: '북미 수출용 기초 화장품 라인 패키지의 화장품 전성분 FDA 규격 표기법 준수 여부 및 오타를 번역가와 함께 교차 검수합니다.',
      status: 'todo',
      priority: 'medium',
      assignee: '최대리 (글로벌영업)',
      dueDate: '2026-06-25',
    },
    {
      id: 6,
      title: '물류 파트너사 신규 다이렉트 계약 조율',
      desc: '인천 허브 근교의 물류 보관 단가를 기존 대비 12% 인하하는 조건으로 3PL 신규 파트너사와 MOU 조율 미팅을 갖습니다.',
      status: 'progress',
      priority: 'medium',
      assignee: '김팀장 (경영혁신)',
      dueDate: '2026-06-12',
    },
  ]

  const [tasks, setTasks] = useState(defaultTasks)

  // 2. Filter & Search states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')

  // 3. Modal & Form states
  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState(null)

  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskStatus, setTaskStatus] = useState('todo')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [taskAssignee, setTaskAssignee] = useState('김팀장 (경영혁신)')
  const [taskDueDate, setTaskDueDate] = useState('')

  // List of assignees for selection
  const assigneesList = [
    '김팀장 (경영혁신)',
    '이대리 (개발팀)',
    '박사원 (마케팅팀)',
    '정대리 (마케팅팀)',
    '최대리 (글로벌영업)',
  ]

  // Add task modal trigger
  const handleOpenAddModal = () => {
    setIsEditing(false)
    setTaskTitle('')
    setTaskDesc('')
    setTaskStatus('todo')
    setTaskPriority('medium')
    setTaskAssignee('김팀장 (경영혁신)')
    setTaskDueDate('')
    setModalVisible(true)
  }

  // Edit task modal trigger
  const handleOpenEditModal = (task) => {
    setIsEditing(true)
    setActiveTaskId(task.id)
    setTaskTitle(task.title)
    setTaskDesc(task.desc)
    setTaskStatus(task.status)
    setTaskPriority(task.priority)
    setTaskAssignee(task.assignee)
    setTaskDueDate(task.dueDate)
    setModalVisible(true)
  }

  // Save / Update Task handler
  const handleSaveTask = () => {
    if (!taskTitle.trim()) {
      alert('업무 제목을 입력해 주세요.')
      return
    }

    if (isEditing) {
      // Update
      setTasks(
        tasks.map((t) =>
          t.id === activeTaskId
            ? {
                ...t,
                title: taskTitle,
                desc: taskDesc,
                status: taskStatus,
                priority: taskPriority,
                assignee: taskAssignee,
                dueDate: taskDueDate,
              }
            : t
        )
      )
    } else {
      // Create new
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        desc: taskDesc,
        status: taskStatus,
        priority: taskPriority,
        assignee: taskAssignee,
        dueDate: taskDueDate || new Date().toISOString().split('T')[0],
      }
      setTasks([...tasks, newTask])
    }
    setModalVisible(false)
  }

  // Delete Task handler
  const handleDeleteTask = (id) => {
    if (window.confirm('정말 이 업무 카드를 삭제하시겠습니까?')) {
      setTasks(tasks.filter((t) => t.id !== id))
    }
  }

  // Quick drag/status swap handler
  const handleMoveStatus = (id, newStatus) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          return { ...t, status: newStatus }
        }
        return t
      })
    )
  }

  // 4. Filtering tasks logic
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority
    const matchesAssignee = filterAssignee === 'all' || t.assignee === filterAssignee
    return matchesSearch && matchesPriority && matchesAssignee
  })

  // Priority color tags mapping
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <CBadge color="danger" className="px-2 py-1">긴급업무</CBadge>
      case 'medium':
        return <CBadge color="warning" className="text-dark px-2 py-1">보통</CBadge>
      case 'low':
        return <CBadge color="success" className="text-white px-2 py-1">낮음</CBadge>
      default:
        return <CBadge color="secondary">일반</CBadge>
    }
  }

  // Render task list card component
  const renderTaskCard = (task) => {
    return (
      <CCard key={task.id} className="mb-3 border-0 shadow-sm card-hover bg-white border-start border-3" style={{
        borderLeftColor: task.priority === 'high' ? '#e55353' : task.priority === 'medium' ? '#f9b115' : '#2eb85c',
        borderRadius: '8px'
      }}>
        <CCardBody className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            {getPriorityBadge(task.priority)}
            <div className="d-flex gap-1">
              <CButton
                color="link"
                className="p-0 text-muted"
                onClick={() => handleOpenEditModal(task)}
                style={{ fontSize: '12px' }}
              >
                <CIcon icon={cilPencil} size="sm" />
              </CButton>
              <CButton
                color="link"
                className="p-0 text-danger ms-2"
                onClick={() => handleDeleteTask(task.id)}
                style={{ fontSize: '12px' }}
              >
                <CIcon icon={cilTrash} size="sm" />
              </CButton>
            </div>
          </div>
          
          <h6 className="fw-bold text-dark mb-2 leading-snug">{task.title}</h6>
          <p className="text-muted small mb-3 leading-relaxed text-truncate-3" style={{ fontSize: '11px' }}>
            {task.desc}
          </p>

          <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light flex-wrap gap-2">
            <div className="d-flex align-items-center gap-1">
              <span className="rounded-circle bg-light d-inline-flex justify-content-center align-items-center text-primary fw-bold" style={{ width: '22px', height: '22px', fontSize: '9px' }}>
                👤
              </span>
              <span className="text-secondary fw-semibold" style={{ fontSize: '10px' }}>{task.assignee}</span>
            </div>
            <span className="text-danger fw-bold" style={{ fontSize: '10px' }}>⏳ ~{task.dueDate}</span>
          </div>

          {/* Quick status mover dropdown */}
          <div className="mt-2 text-end">
            <CDropdown direction="dropup">
              <CDropdownToggle size="sm" color="light" className="py-1 px-2 text-muted fw-bold" style={{ fontSize: '9px' }}>
                <CIcon icon={cilSwapHorizontal} className="me-1" size="custom" height={9} /> 단계 변경
              </CDropdownToggle>
              <CDropdownMenu style={{ fontSize: '11px' }}>
                {task.status !== 'todo' && (
                  <CDropdownItem onClick={() => handleMoveStatus(task.id, 'todo')}>대기 단계로 이동</CDropdownItem>
                )}
                {task.status !== 'progress' && (
                  <CDropdownItem onClick={() => handleMoveStatus(task.id, 'progress')}>진행 단계로 이동</CDropdownItem>
                )}
                {task.status !== 'review' && (
                  <CDropdownItem onClick={() => handleMoveStatus(task.id, 'review')}>검토 단계로 이동</CDropdownItem>
                )}
                {task.status !== 'done' && (
                  <CDropdownItem onClick={() => handleMoveStatus(task.id, 'done')}>완료 단계로 이동</CDropdownItem>
                )}
              </CDropdownMenu>
            </CDropdown>
          </div>
        </CCardBody>
      </CCard>
    )
  }

  // Helper to filter tasks by status column
  const getTasksByStatus = (status) => filteredTasks.filter((t) => t.status === status)

  return (
    <>
      {/* 1. Header & Quick Toolbelt Filters */}
      <CCard className="border-0 shadow-sm mb-4">
        <CCardBody className="p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <div>
              <h4 className="fw-bold text-dark mb-1">📋 전사 협업 업무 관리 (Kanban Board)</h4>
              <p className="text-muted small mb-0">부서별 협업 프로젝트 및 핵심 업무 카드를 배치하여 관리하는 실무 표준 칸반 보드입니다.</p>
            </div>
            <CButton color="primary" className="fw-bold text-white d-flex align-items-center gap-1 px-3 py-2" onClick={handleOpenAddModal}>
              <CIcon icon={cilPlus} /> 새 업무 등록
            </CButton>
          </div>

          <CRow className="g-2 pt-2 border-top border-light">
            <CCol md={6} lg={4}>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <CIcon icon={cilSearch} className="text-muted" />
                </span>
                <CFormInput
                  placeholder="업무 검색 (예: 배송, 예산)"
                  className="border-start-0 ps-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CCol>
            
            <CCol md={3} lg={3}>
              <CFormSelect
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">🚦 중요도: 전체보기</option>
                <option value="high">긴급업무</option>
                <option value="medium">보통</option>
                <option value="low">낮음</option>
              </CFormSelect>
            </CCol>

            <CCol md={3} lg={3}>
              <CFormSelect
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
              >
                <option value="all">👤 담당자: 전체보기</option>
                {assigneesList.map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={12} lg={2} className="text-end">
              <CButton
                color="outline-secondary"
                className="w-100 fw-bold"
                onClick={() => {
                  setSearchTerm('')
                  setFilterPriority('all')
                  setFilterAssignee('all')
                }}
              >
                필터 초기화
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* 2. Four Kanban Columns */}
      <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-3">
        {/* Column 1: To Do */}
        <CCol>
          <div className="p-3 bg-light rounded" style={{ minHeight: '600px', border: '1px solid #ebedef' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle bg-secondary d-inline-block" style={{ width: '10px', height: '10px' }}></span>
                <span className="fw-bold text-dark">대기 업무</span>
              </div>
              <CBadge color="secondary" shape="rounded-pill" className="px-2 py-1">
                {getTasksByStatus('todo').length}
              </CBadge>
            </div>
            <div className="kanban-cards-wrapper" style={{ maxHeight: '550px', overflowY: 'auto' }}>
              {getTasksByStatus('todo').map(renderTaskCard)}
              {getTasksByStatus('todo').length === 0 && (
                <div className="text-center py-5 text-muted small border-2 border-dashed bg-white rounded border-light">
                  대기 중인 업무가 없습니다.
                </div>
              )}
            </div>
          </div>
        </CCol>

        {/* Column 2: In Progress */}
        <CCol>
          <div className="p-3 bg-light rounded" style={{ minHeight: '600px', border: '1px solid #ebedef' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle bg-info d-inline-block" style={{ width: '10px', height: '10px' }}></span>
                <span className="fw-bold text-dark">진행 중인 업무</span>
              </div>
              <CBadge color="info" shape="rounded-pill" className="text-white px-2 py-1">
                {getTasksByStatus('progress').length}
              </CBadge>
            </div>
            <div className="kanban-cards-wrapper" style={{ maxHeight: '550px', overflowY: 'auto' }}>
              {getTasksByStatus('progress').map(renderTaskCard)}
              {getTasksByStatus('progress').length === 0 && (
                <div className="text-center py-5 text-muted small border-2 border-dashed bg-white rounded border-light">
                  진행 중인 업무가 없습니다.
                </div>
              )}
            </div>
          </div>
        </CCol>

        {/* Column 3: In Review */}
        <CCol>
          <div className="p-3 bg-light rounded" style={{ minHeight: '600px', border: '1px solid #ebedef' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle bg-warning d-inline-block" style={{ width: '10px', height: '10px' }}></span>
                <span className="fw-bold text-dark">검토/피드백 단계</span>
              </div>
              <CBadge color="warning" shape="rounded-pill" className="text-dark px-2 py-1">
                {getTasksByStatus('review').length}
              </CBadge>
            </div>
            <div className="kanban-cards-wrapper" style={{ maxHeight: '550px', overflowY: 'auto' }}>
              {getTasksByStatus('review').map(renderTaskCard)}
              {getTasksByStatus('review').length === 0 && (
                <div className="text-center py-5 text-muted small border-2 border-dashed bg-white rounded border-light">
                  검토 대기 중인 업무가 없습니다.
                </div>
              )}
            </div>
          </div>
        </CCol>

        {/* Column 4: Done */}
        <CCol>
          <div className="p-3 bg-light rounded" style={{ minHeight: '600px', border: '1px solid #ebedef' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle bg-success d-inline-block" style={{ width: '10px', height: '10px' }}></span>
                <span className="fw-bold text-dark">완료된 업무</span>
              </div>
              <CBadge color="success" shape="rounded-pill" className="text-white px-2 py-1">
                {getTasksByStatus('done').length}
              </CBadge>
            </div>
            <div className="kanban-cards-wrapper" style={{ maxHeight: '550px', overflowY: 'auto' }}>
              {getTasksByStatus('done').map(renderTaskCard)}
              {getTasksByStatus('done').length === 0 && (
                <div className="text-center py-5 text-muted small border-2 border-dashed bg-white rounded border-light">
                  완료된 업무가 없습니다.
                </div>
              )}
            </div>
          </div>
        </CCol>
      </CRow>

      {/* 3. Add / Edit Task Modal Card */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle className="fw-bold text-dark">
            {isEditing ? '📝 업무 카드 정보 수정' : '➕ 신규 업무 카드 등록'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">업무 제목</label>
            <CFormInput
              placeholder="예: 결제 오류 시나리오 최종 테스트"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">업무 설명 (세부 내용)</label>
            <CFormTextarea
              placeholder="상세한 작업 내용이나 체크리스트, 특이 사항을 기록해 주세요."
              rows={3}
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
            />
          </div>

          <CRow className="g-3 mb-3">
            <CCol md={6}>
              <label className="form-label small fw-semibold text-secondary">진행 단계 (Status)</label>
              <CFormSelect
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
              >
                <option value="todo">대기 업무 (Todo)</option>
                <option value="progress">진행 중 (In Progress)</option>
                <option value="review">검토/피드백 (Review)</option>
                <option value="done">완료됨 (Done)</option>
              </CFormSelect>
            </CCol>

            <CCol md={6}>
              <label className="form-label small fw-semibold text-secondary">업무 중요도 (Priority)</label>
              <CFormSelect
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
              >
                <option value="high">긴급업무 (High)</option>
                <option value="medium">보통 (Medium)</option>
                <option value="low">낮음 (Low)</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="g-3">
            <CCol md={6}>
              <label className="form-label small fw-semibold text-secondary">담당자 지정 (Assignee)</label>
              <CFormSelect
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
              >
                {assigneesList.map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={6}>
              <label className="form-label small fw-semibold text-secondary">마감 기한 (Due Date)</label>
              <CFormInput
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" className="fw-bold" onClick={() => setModalVisible(false)}>
            취소
          </CButton>
          <CButton color="primary" className="fw-bold text-white" onClick={handleSaveTask}>
            {isEditing ? '수정 완료' : '업무 등록'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Tasks
