import React from 'react'
import Stack from 'react-bootstrap/Stack'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import AddPostForm from './AddPostForm'

const Dashboard: React.FC = () => {
  const [show, setShow] = React.useState(false)
  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)
  return (
    <Stack>
      <Row className="mb-2">
        <Col>
          <h2>Dashboard Page</h2>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <button onClick={handleShow}>ADD POST</button>
          <AddPostForm show={show} onHide={handleClose} setShow={setShow} />
        </Col>
      </Row>
    </Stack>
  )
}

export default Dashboard
