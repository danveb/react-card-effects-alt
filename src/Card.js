import React from 'react' 

// destructure name and image from props 
const Card = ({name, image}) => {
    return (
        // set up the image of each card 
        <img src={image} alt={name} /> 
    )
}

export default Card 