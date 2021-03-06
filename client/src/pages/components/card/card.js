import React from 'react';
import './card.css'



function Card(pet) {
    let neuteredValue;
   if(pet.pet.Dog.neutered === true){
neuteredValue = "true"
   }else{
       neuteredValue = "false"
   }
    return (
            <div className="card">
                <div className="card-image waves-effect waves-block waves-light">
                    <img className="activator" src="http://4.bp.blogspot.com/_VmZpep1KUeg/TT-ZYxvRGqI/AAAAAAAAAIA/lInvcvqOkBY/s1600/cute-puppy-dog-wallpapers.jpg" />
                </div>
                <div className="card-content">
                    <span className="card-title activator grey-text text-darken-4">{pet.pet.Dog.petName}<a class="btn-floating waves-effect waves-light red right"><i class="material-icons">add</i></a></span>
                    <a class="waves-effect waves-light btn">Update</a>
                    <a class="waves-effect waves-light btn">Delete</a>
                </div>
                <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">Pet Info<i class="material-icons right">close</i></span>
                <br></br>
                    <ul className="collection">
                        <li className="collection-item">birth Year: {pet.pet.Dog.birthYear}</li>
                        <li className="collection-item">Gender: {pet.pet.Dog.gender}</li>
                        <li className="collection-item">Breed: {pet.pet.Dog.petSubtype}</li>
                        <li className="collection-item">Neutered: {neuteredValue}</li>
                    </ul>
                </div>
            </div>
        
    )
}

export default Card;