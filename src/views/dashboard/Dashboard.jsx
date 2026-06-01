import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const Dashboard = () => {
  return (
    <CRow className="justify-content-center mt-5">
      <CCol md={8} lg={6}>
        <CCard className="border-0 shadow-sm text-center p-4">
          <CCardHeader className="bg-white border-0 pt-4">
            <span className="fs-1">📂</span>
            <h4 className="fw-bold text-dark mt-3">메인 대시보드 (준비 중)</h4>
          </CCardHeader>
          <CCardBody className="pb-4">
            <p className="text-muted leading-relaxed">
              추후 Amiko 플랫폼 및 Arirakku 브랜드의 핵심 요약 데이터가 배치될 공간입니다.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Dashboard
