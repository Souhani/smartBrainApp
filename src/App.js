import React,{ Component } from 'react';
import './App.css';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Navigation from './Components/Navigation/Navigation';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import ParticlesBackground  from "./Components/Particles/ParticlesBackground";

                

const initialState = {
   input:'',
      imgUrl:'',
      box: {},
      route: 'Signin',
      SignedIn: false,
      user: {
            id: '',
            name: '',
            email: '',
            entries: 0,
            joined: ''
    }
};


class App extends  Component {


  constructor(){

    super();
    this.state= initialState;
  } ;


  


 loadUser = (data)=>{
  this.setState({user: {

                    id: data.id,
                    name: data.name,
                    email: data.email,
                    entries: data.entries,
                    joined: data.joined
    }})
 }

  calculateFaceLocation = (data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
             leftCol: clarifaiFace.left_col * width,
             topRow: clarifaiFace.top_row * height,
             rightCol: width - (clarifaiFace.right_col * width),
             bottomRow: height - (clarifaiFace.bottom_row * height)


    }
  }

  faceBox = box => {
    this.setState({box: box})
  }


   onInputChange = (event)=>{
    this.setState({input:event.target.value})
         }
  onButonSubmit = ()=>{
     this.setState({imgUrl : this.state.input });
     fetch(
      'https://smartbrainapi-test.onrender.com/imageUrl',
       {
         method: 'put',
         headers: {'Content-Type': 'application/json'},
         body:JSON.stringify({input:this.state.input})
        }
        )
         .then(data=> data.json()) 
         .then(response => {
              if(response){
                                         fetch('https://smartbrainapi-test.onrender.com/image', {
                                        method: 'put',
                                        headers: {'Content-Type': 'application/json'},
                                        body:JSON.stringify({
                                          id:this.state.user.id            
                                        }
                                        )})
                                            .then(
                                              response => response.json()
                                          )
                                            .then(data => 
                                              
                                              this.setState(Object.assign(this.state.user,{entries: data.entries}))

                                      )
                                        .catch(console.log)    
                                   }

             this.faceBox(this.calculateFaceLocation(response))
                             
                              }
         )
        .catch(err=> console.log(err))


  }
  onRouteChange = (route)=>{

    if(route === 'home'){
      this.setState({SignedIn:true})
    }else if(route === 'SignOut'){
      this.setState(initialState)
    }
    this.setState({route: route})
  ;

}
  render(){

  const {input, imgUrl, box, route, SignedIn} = this.state;
  return (
    <div className="App">
      <ParticlesBackground/>
      <Navigation
       SignedIn = {SignedIn}
       onRouteChange = {this.onRouteChange}
       clearImge = {this.clearImge}/>
     {route === 'home' 
      ?<div>
          <Logo />
          <Rank name = {this.state.user.name} entries = {this.state.user.entries}/>
          < ImageLinkForm onInputChange = {this.onInputChange} onButonSubmit={this.onButonSubmit}/>
          < FaceRecognition box = {box} imgUrl = {imgUrl}/>
        </div>
      :(route === 'Signin'
         ?<Signin loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
         :<Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>)}
         
    </div>
  );}
}

export default App;
