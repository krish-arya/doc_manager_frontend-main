

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,

  Input,
  Container,
  Row,
  Col,

  Table,

  UncontrolledAlert,
  Spinner,
  Modal, ModalHeader, ModalBody, ModalFooter

} from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "../../api/axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const SearchDocument = () => {

  const [searchTextBoxValue, setSearchTextBoxValue] = useState('');
  const [startDateValue, setStartDateValue] = useState('');
  const [endDateValue, setEndDateValue] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [dropdownDepartmentOptions, setDropdownDepartmentOptions] = useState([]);
  const [maxDate, setMaxDate] = useState('');
  const [isloading, setIsLoading] = useState(false)

  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Toggle Modal
  const toggle = () => setModal(!modal);

  // Open the modal with the selected row
  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    toggle();
  };

  // fetch dropdown values for Departments
  useEffect(() => {
    // Get the current date and time
    const now = new Date();


    // Format the date and time to use in input elements (yyyy-mm-dd and HH:MM)
    const maxDateValue = now.toISOString().split('T')[0];  // yyyy-mm-dd

    setMaxDate(maxDateValue);


    // Fetch data from the backend



    axios.get('/departments', {

    })
      .then(response => {

        const data = response.data;
        console.log(data)
        setDropdownDepartmentOptions(data);


      })
      .catch(error => {
        console.error("There was an error fetching the dropdown data!", error);
      });


  }, []);
  // handle filter clear button
  const handleClearButton = (event) => {
    setSearchTextBoxValue('');
    setSelectedDepartment(null);
    setEndDateValue('');
    setStartDateValue('');
  };
  // Handle form submission
  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    setError(''); // Reset the error

    try {
      setIsLoading(true)
      // Make an API request with the search query
      const response = await axios.get('documents', {
        params: {
          search: searchTextBoxValue,
          department: selectedDepartment,
          startdate: startDateValue,
          enddate: endDateValue
        },
      });
      setIsLoading(false)
      // Set the results from the response
      setResults(response.data);
      if (response.data.length === 0) {
        setError('No Results found, try a different Search');
      }
    } catch (err) {
      // Set error if the API request fails
      setError('Something went wrong while fetching results.');
      setIsLoading(false)
    }
  };

  const handleDelete = async () => {
    setIsLoading(true)
    
    try {
      const response = await axios.delete('documents', {

        params: {
          documentId: selectedRow
        }  // Add additional parameters here
      });

      if (response.status === 204) {
        setIsLoading(false)
        alert("Document deleted successfully");
        toggle();
        handleSubmit();

      }
    } catch (error) {
      setIsLoading(false)
      console.error("Failed to delete document:", error.response ? error.response.data : error.message);
    }
  }
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {isloading && (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)', position: 'absolute', top: 0, left: 0, zIndex: 9999 }}><Spinner></Spinner></div>)}
        <Row>

          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">


                <h1>Search Document</h1>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <FormGroup className="col-12">
                      <label>Search Query <span color="red">*</span></label>
                      <Input
                        type="text"
                        value={searchTextBoxValue}
                        onChange={(e) => setSearchTextBoxValue(e.target.value)}
                        placeholder="Enter for Document name"

                      />
                    </FormGroup>
                    <FormGroup className="col-3">

                      <label>Select Department</label>
                      <Select options={dropdownDepartmentOptions}
                        value={dropdownDepartmentOptions.find(option => option.value === selectedDepartment) || null}
                        name="dropdownDepartment"
                        id="dropdownDepartment"

                        onChange={(e) => { setSelectedDepartment(e.value) }} />
                    </FormGroup>
                    <FormGroup className="col-3">
                      <label>Start Date</label>
                      <Input
                        type="date"
                        value={startDateValue}
                        onChange={(e) => setStartDateValue(e.target.value)}

                        max={maxDate}
                      />
                    </FormGroup>
                    <FormGroup className="col-3">
                      <label>End Date</label>
                      <Input
                        type="date"
                        value={endDateValue}
                        onChange={(e) => setEndDateValue(e.target.value)}
                        max={maxDate}

                      />
                    </FormGroup><FormGroup className="col-3">
                      <Button type="button"
                        className="mt-5  btn-sm  btn-danger" onClick={handleClearButton}>Clear Filters</Button>

                    </FormGroup>
                  </div>
                  <Button type="submit"
                    className=" mt-3 btn  btn-info">Search</Button>
                </form>
                {error &&
                  <UncontrolledAlert className="mt-2" color="warning">

                    <span className="alert-inner--text">
                      <strong>Warning!</strong> {error}
                    </span>
                  </UncontrolledAlert>
                }
                <div>
                  {results.length > 0 && (
                    <div className="mt-3">
                      <h2>Search Results</h2>
                      <Table striped="true" style={{ color: "black" }}>
                        <thead>
                          <tr>
                            <th>Number</th>
                            <th>Title</th>
                            <th>Department</th>
                            <th>Upload Date</th>
                            <th>Download</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((result, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td style={{ /* Adjust to your requirement */
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "wrap"
                              }}>{result.title}</td>
                              <td>{result.department_name}</td>
                              <td>{result.upload_date}</td> {/* Assuming you have an 'uploaded_at' field */}
                              <td>
                                <a className="btn btn-sm btn-info" href={result.signed_url} download target="_blank" rel="noreferrer">
                                  Download
                                </a> {/* Assuming you have a 'download_url' field */}
                              </td>
                              <td><Button onClick={() => handleDeleteClick(result.id)} className="btn btn-sm btn-danger">Delete</Button></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      {/* Modal */}
                      <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle}>Warning</ModalHeader>
                        <ModalBody>
                          Are you sure you want to delete document ?
                        </ModalBody>
                        <ModalFooter>
                          <Button color="danger" onClick={handleDelete}>
                            Yes, Delete
                          </Button>
                          <Button color="secondary" onClick={toggle}>
                            Cancel
                          </Button>
                        </ModalFooter>
                      </Modal>

                      {/* Pagination Controls */}
                      {/* <div className="mt-2">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>

                        <span> Page {currentPage} of {totalPages} </span>

                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div> */}
                    </div>
                  )}
                </div>

              </CardHeader>
              <CardBody>


              </CardBody>
            </Card>
          </Col>
        </Row >
      </Container >
    </>
  );
};

export default SearchDocument;
