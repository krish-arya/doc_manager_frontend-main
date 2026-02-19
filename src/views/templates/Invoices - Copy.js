  import React, { useState, useRef } from 'react';
  import Header from "components/Headers/Header.js";
  import "../styles/invoices.css"
  import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Input,
    Button,
    Table,
    Spinner
  } from 'reactstrap';

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://164.52.203.8:8081/api';

  function InvoiceViewer() {
  

  const [invoices, setInvoices] = useState([]);
  const [isloading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [popup, setPopup] = useState(false);
    const [action, setAction] = useState('grwaiver');
    const [template, setTemplate] = useState('grwaiver');

    const fileInputRef = useRef(null);

    const limit = 10;

    const fetchInvoices = async (pageNumber = 1) => {
      setIsLoading(false)
      try {
        const response = await fetch(`${API_BASE}/fetch-invoice-numbers/?from_date=${fromDate}&to_date=${toDate}&limit=${limit}&page=${pageNumber}`);
        const data = await response.json();
        setInvoices(data.invoices);
        setTotalPages(Math.ceil(data.total / limit));
        setPage(pageNumber);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    const handleSearchSubmit = (e) => {
      e.preventDefault();

      if (invoiceNumber.trim()) {
        handleActionRedirect(invoiceNumber, action);
      } else {
        fetchInvoices(1);
      }
    };

    const handleActionRedirect = (invoice, selectedAction) => {
      let url;
      switch (selectedAction) {
        case 'open':
          url = `${API_BASE}/export-invoice?invoice_number=${invoice}`;
          break;
        case 'export_bank_invoice':
          url = `${API_BASE}/export-bank-invoice?invoice_number=${invoice}`;
          break;
        case 'grwaiver':
          url = `${API_BASE}/grwaiver?invoice_number=${invoice}`;
          break;
        default:
          return;
      }
      window.location.href = url;
    };

    const handleUploadExtract = async () => {
      setPopup(true)
      const file = fileInputRef.current.files[0];
      if (!file) return alert('Please select a PDF file to upload.');

      const formData = new FormData();
      formData.append('pdf', file);

      try {
        const uploadResponse = await fetch(`${API_BASE}/upload-pdf`, {
          method: 'POST',
          body: formData,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        });

        const result = await uploadResponse.json();
        if (result.message && result.filename) {
          const renderResponse = await fetch(`${API_BASE}/extract-and-render?template=${template}&filename=${encodeURIComponent(result.filename)}`);
          const html = await renderResponse.text();

          const newWindow = window.open();
          newWindow.document.write(html);
        } else {
          alert('Upload failed: ' + (result.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('Upload/Extract Error:', err);
        alert('Error: ' + err.message);
      }
    };

    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const handleReset = () => {
      setFromDate('');
      setToDate('');
      setInvoiceNumber('');
      setInvoices([]);  
    };

    return (
    <>
    <Header />
    <Container className="mt--7" fluid>
      {isloading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 9999,
          }}
        >
          <Spinner />
        </div>
      )}
      <Row>
        <Col className="order-xl-1" xl="12">
          <Card className="bg-secondary shadow">
            <CardHeader className="bg-white border-0">
              <h1>Invoice Viewer</h1>
              <form onSubmit={handleSearchSubmit}>
                <div className="row">
                  <FormGroup className="col-md-3 col-sm-6">
                    <label>From Date:</label>
                    <Input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      required={!invoiceNumber}
                    />
                  </FormGroup>
                  <FormGroup className="col-md-3 col-sm-6">
                    <label>To Date:</label>
                    <Input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      required={!invoiceNumber}
                    />
                  </FormGroup>
                  <FormGroup className="col-md-3 col-sm-6">
                    <label>Invoice Number:</label>
                    <Input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      disabled={fromDate || toDate}
                      placeholder="Enter Invoice Number"
                    />
                  </FormGroup>
                  <FormGroup className="col-md-3 col-sm-6">
                    <label>Upload PDF:</label>
                    <Input
                      type="file"
                      innerRef={fileInputRef}
                      accept="application/pdf"
                    />
                  </FormGroup>
                </div>

                <div className="row mt-3">
                <FormGroup className="col-md-4">
          <label>Action:</label>
          <Input
            type="select"
            value={action}
            onChange={(e) => {
              const val = e.target.value;
              setAction(val);
              setTemplate(
                val === 'export_bank_invoice' ? 'bank' :
                val === 'open' ? 'customs' :
                'grwaiver'
              );
            }}
          >
            <option value="grwaiver">GR Waiver</option>
            <option value="export_bank_invoice">Export Invoice - Bank</option>
            <option value="open">Export Invoice - Customs</option>
          </Input>
        </FormGroup>

                  <FormGroup className="col-md-4 d-flex align-items-end gap-2">
                    <Button type="submit" className="btn-sm btn-info">
                      Search / Process
                    </Button>
                    <Button type="button" className="btn-sm btn-success" onClick={handleUploadExtract}>
                      Upload & Extract
                    </Button>
                    <Button type="button" className="btn-sm btn-danger" onClick={handleReset}>
                      Reset
                    </Button>
                  </FormGroup>
                </div>

                {popup && (
                  <div className="mt-2 text-warning">
                    ⚠️ Please unblock pop-ups for this site
                  </div>
                )}
              </form>
            </CardHeader>
            <CardBody>
              <div className="invoice-list">
                <Table striped style={{ color: 'black' }}>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Invoice Number</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length > 0 ? (
                      invoices.map((inv, i) => (
                        <tr key={inv.invoice_number}>
                          <td>{(page - 1) * limit + i + 1}</td>
                          <td>{inv.invoice_number}</td>
                          <td>{inv.date}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Input
                                type="select"
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                              >
                                <option value="grwaiver">GR Waiver</option>
                                <option value="open">Export Invoice - Customs</option>
                                <option value="export_bank_invoice">Export Invoice - Bank</option>
                              </Input>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleActionRedirect(inv.invoice_number, action)}
                              >
                                Go
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          No invoices found. Try adjusting your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Button disabled={page <= 1} onClick={() => fetchInvoices(page - 1)}>
                    Prev
                  </Button>
                  <span>Page {page}</span>
                  <Button disabled={page >= totalPages} onClick={() => fetchInvoices(page + 1)}>
                    Next
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  </>

    );
  }

  export default InvoiceViewer;