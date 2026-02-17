
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import axios from '../api/axios';
import React, { useState, useEffect } from 'react';
const Index = (props) => {
  const token = localStorage.getItem('token');
  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => {

    // Fetch data from the backend

    if (token) {

      axios.get('/schedule-campaign/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => {
          
          setCampaigns(response.data)
        })
        .catch(error => {
          console.error("There was an error fetching the dropdown data!", error);
        });
    }

  }, []);



  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="mt-5">
          <Col className="" xl="">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">All Campaigns</h3>
                  </div>

                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Scheduled Date</th>
                    <th scope="col">Message</th>
                    <th scope="col">Premise</th>
                    <th scope="col">Category</th>
                    <th scope="col">Cuisine</th>
                    <th scope="col">Product Class</th>
                    <th scope="col">Producer</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">CTA</th>
                    <th scope="col">Promo Type</th>
                    <th scope="col">Media</th>
                    
                   
                    {/* <th scope="col">Customer Id's</th> */}

                  </tr>
                </thead>
                <tbody>
                {
                      campaigns.map((campaign)=>(
                        
                      
                  <tr>
                    <th key={campaign.id} scope="row">{campaign.id}</th>
                    <td>{campaign.schedule_date}</td>
                    <td>{campaign.campaign_message}</td>
                    <td>{campaign.premise}</td>
                    <td>{campaign.category}</td>
                    <td>{campaign.cuisine}</td>
                    <td>{campaign.product_class}</td>
                    <td>{campaign.producer}</td>
                    
                    <td>{campaign.product_name}</td>
                    <td>{campaign.cta}</td>
                    <td>{campaign.promotype}</td>
                    <td>
              {campaign.media_file_url ? (
                <img src={campaign.media_file_url} alt="NA" style={{ width: '100px', height: 'auto' }} />
              ) : (
                'No image available'
              )}
            </td>
                    {/* <td>{campaign.customer_ids}</td> */}

                  </tr>
                  ))
                }
                  
                </tbody>
              </Table>
            </Card>
          </Col>

        </Row>
      </Container>
    </>
  );
};

export default Index;
