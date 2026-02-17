

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col,
    Spinner,
    ListGroup,
    ListGroupItem,
    Label

} from "reactstrap";
// core components
// import UserHeader from "components/Headers/UserHeader.js";
import Header from "components/Headers/Header.js";
import axios from '../../api/axios';
import React, { useState, useEffect } from 'react';
import Select from 'react-select'
const Upload = () => {
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [dropdownDepartmentOptions, setDropdownDepartmentOptions] = useState([]);
    const [docDateValue, setDocDateValue] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [isValidFiles, setIsValidFiles] = useState(false)
    const [isoversize, setIsOverSize] = useState(false);
    const [mergeFileName, setMergeFileName] = useState('')
    const [isloading, setIsLoading] = useState(false)
    const [files, setFiles] = useState([]);
    // Move file up
  const moveUp = (index) => {
    debugger;
    if (index === 0) return;
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
      return newFiles.map((file, i) => ({ ...file, order: i + 1 }));
    });
  };

  // Move file down
  const moveDown = (index) => {
    if (index === files.length - 1) return;
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
      return newFiles.map((file, i) => ({ ...file, order: i + 1 }));
    });
  };
  // Update upload date
  const handleDateChange = (index, date) => {
    setFiles((prevFiles) =>
      prevFiles.map((file, i) => (i === index ? { ...file, uploadDate: date } : file))
    );
  };
    useEffect(() => {

        // Fetch data from the backend
        // Get the current date and time
        const now = new Date();


        // Format the date and time to use in input elements (yyyy-mm-dd and HH:MM)
        const maxDateValue = now.toISOString().split('T')[0];  // yyyy-mm-dd

        setMaxDate(maxDateValue);

        setDocDateValue(maxDateValue)

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


    const handleFileUpload = (e) => {
        e.preventDefault();

        // Create a FormData object
        const formData = new FormData();
        const clickedButton = e.nativeEvent.submitter.value;
        if (clickedButton === "upload") {
            formData.append('buttontype', 'upload')
            // Handle upload action here
        } else if (clickedButton === "uploadandmerge") {
            if (!mergeFileName) {
                alert('Please add a value to the merge file name.');
                return;
            }
            formData.append('mergedfilename', mergeFileName)
            formData.append('buttontype', 'uploadandmerge')
            // Handle upload and merge action here
        }
        // formData.append('uploaddate', docDateValue)
        formData.append('department', selectedDepartment)
        
        if (files && files.length > 0) {
            debugger;
            Array.from(files).forEach((file, index) => {
                formData.append(`files`, file.file);  // Append each file individually
    //             formData.append(`file[${index}][file]`, file.file);
    //   formData.append(`file[${index}][fileName]`, file.file.name);
    //   formData.append(`file[${index}][order]`, file.order);
    //   formData.append(`file[${index}][uploadDate]`, file.uploadDate);
                    
            });
            
            
        }
        const fileMetadata = files.map(({ file, order, uploadDate }) => ({
            fileName: file.name,
            order,
            uploadDate,
          }));
        formData.append('file_order',JSON.stringify(fileMetadata)) 

        



        setIsLoading(true)
        // Perform the POST request with FormData
        axios.post('/documents/', formData, {
            headers: {

                'Content-Type': 'multipart/form-data'  // Ensure this is set for file uploads
            }
        })
            .then(response => {
                setIsLoading(false)
                alert("Files uploaded successfully")
                window.location.reload()
            })
            .catch(error => {
                setIsLoading(false)
                console.error("There was an error saving the campaign!", error);
            });
    }


    const handleFileChange = (e) => {
        setFiles([]);
        const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
        const selectedFiles = Array.from(e.target.files).map((file, index) => ({
            file,
            order: files.length + index + 1, // initial order
            uploadDate: maxDate,                // initial date
          }));
          
        const files_check = Array.from(e.target.files);  // Convert FileList to an array
        // setSelectedFile(files); 
        let totalSize = 0;

        // Calculate the total size of selected files
        files_check.forEach(file => {
            totalSize += file.size;
        });
        // Check if total size exceeds the limit
        if (totalSize > maxFileSize) {
            alert('Total file size exceeds the limit of 10MB.');
            setFiles([]);  // Clear the selected files if the limit is exceeded

            setIsOverSize(true);
            setIsValidFiles(true);
        } else {
            setIsOverSize(false);
            setIsValidFiles(false);
            // Clear any previous error message
            // setSelectedFile(files);
            setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
             // Set files in state if they are valid
        }

        // Iterate through the selected files
        for (let i = 0; i < files_check.length; i++) {
            const file = files_check[i];
            const fileType = file.type;

            // Check if the file type is either image or pdf
            if (!fileType.includes('image') && fileType !== 'application/pdf') {
                setIsValidFiles(true)
                break;
            }


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
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">Upload Files</h3>
                                    </Col>

                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleFileUpload} encType="multipart/form-data">
                                    <div className="pl-lg-4">
                                        <div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <FormGroup>

                                                        <label>Select Department</label>
                                                        <Select options={dropdownDepartmentOptions}
                                                            value={dropdownDepartmentOptions.find(option => option.value === selectedDepartment) || null}
                                                            name="dropdownDepartment"
                                                            id="dropdownDepartment"
                                                            required
                                                            onChange={(e) => { setSelectedDepartment(e.value) }} />
                                                    </FormGroup></div>
                                                {/* <div className="col-6">
                                                    <FormGroup>
                                                        <label>Document Date</label>
                                                        <Input
                                                            type="date"
                                                            value={docDateValue}
                                                            onChange={(e) => setDocDateValue(e.target.value)}

                                                            max={maxDate}
                                                        />
                                                    </FormGroup>
                                                </div> */}
                                                <div className="col-6">
                                                    <FormGroup>

                                                        <label>Documents</label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            type="file"
                                                            name="file"
                                                            onChange={handleFileChange}
                                                            required={true}
                                                            multiple
                                                        />

                                                    </FormGroup>
                                                </div>
                                            </div><div className="row">
                                                {/* <div className="col-6">
                                                    <FormGroup>

                                                        <label>Documents</label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            type="file"
                                                            name="file"
                                                            onChange={handleFileChange}
                                                            required={true}
                                                            multiple
                                                        />

                                                    </FormGroup>
                                                </div> */}
                                                <div className="col-6">
                                                    <FormGroup>

                                                        <label>Merge File Name</label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            type="text"
                                                            placeholder="Enter File Name"
                                                            name="mergefilename"
                                                            onChange={(e) => setMergeFileName(e.target.value)}


                                                        />

                                                    </FormGroup>
                                                </div>
                                            </div>
                                        </div>
                                        <h3>Re Order Files</h3>
                                        <ListGroup>
                                            <ListGroupItem>
                                            <div className="row">
                                                    <div className="col-6">
                                                        <strong>File Name</strong>
                                                    </div>
                                                    <div className="col-3">
                                                    <strong>Upload Date</strong>
                                                    </div>
                                                    <div className="col-3">
                                                    <strong>Re Order</strong>
                                                    </div>
                                                    </div>
                                            </ListGroupItem>
                                            {files.map((fileData, index) => (
                                                <ListGroupItem key={index}>
                                                    <div className="row">
                                                    <div className="col-6">
                                                        {index+1}. {fileData.file.name}
                                                    </div>
                                                    <div className="col-3">
                                                        <Label>
                                                            Upload Date:
                                                            <Input
                                                                type="date"
                                                                value={fileData.uploadDate || maxDate}
                                                                onChange={(e) => handleDateChange(index, e.target.value)}
                                                                max={maxDate}
                                                            />
                                                        </Label>
                                                    </div>
                                                    <div className="col-3">
                                                        <Button className="btn btn btn-warning" type="button" onClick={() => moveUp(index)} disabled={index === 0}>
                                                            Up
                                                        </Button>
                                                        <Button className="btn btn btn-info" type="button" onClick={() => moveDown(index)} disabled={index === files.length - 1}>
                                                            Down
                                                        </Button>
                                                    </div>
                                                    </div>
                                                </ListGroupItem>
                                            ))}
                                        </ListGroup>
                                        <div className="mt-2"></div>
                                        <Button className="btn btn  btn-success" value="upload" disabled={isoversize} type="submit">Upload Files</Button>
                                        <Button className="btn btn  btn-warning" value="uploadandmerge" disabled={isValidFiles} type="submit">Merge and Upload</Button>
                                    </div>
                                                        

                                </Form>

                            </CardBody>
                        </Card>
                    </Col>
                </Row >
            </Container >
        </>
    );
};

export default Upload;
