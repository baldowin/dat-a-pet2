import React, { Component } from 'react';
// import SideNav from './components/SideNav/sideNav';
import NavBar from './components/navbar/navbar';
import Card from './components/card/card';
import Footer from './components/footer'
import './dashboard.css'
import API from '../utils/API'
import {Route,Redirect} from 'react-router';

class adminPetsPage extends Component {
    state = {
        owners: "",
        pets: [],
        associatedpets: []
    };
    componentDidMount() {
        this.loadPets();
    }
    loadPets = () => {
        API.adminPets("unique@email.com")
            .then(res => {
                this.setState({ pets: res.data.Pet, owners:res.data.ownerName })
            }
            )
            .catch(err => console.log(err));
        // API.getUserAssociatedPets('TEST@email.com')
        //     .then(res => this.setState({ pets: res.data }))
        //     .catch(err => console.log(err));
    };

    render() {
        if (this.state.pets===undefined){
            return <Redirect to="/"/>
        }
        return (
            <div>
                < NavBar />
                <div className="row">
                    <div className="col s12">
                        {this.state.pets.length ? (<div>
                            <h3>Pets for {this.state.owners}</h3>

                            {this.state.pets.map(pet => (
                                <Card pet={pet} />
                            ))}
                            </div>
                        ) : (
                                <h3>No Results to Display</h3>
                            )}



                        {/* < Card pets={this.state.pets} /> */}
                    </div>
                    {/* <div className="col s12">
                        <h3>Friends Pet</h3>
                        < Card pets={this.state.associatedPets} />
                    </div> */}
                </div>
                < Footer />
            </div>
        )
    }
}
export default adminPetsPage;