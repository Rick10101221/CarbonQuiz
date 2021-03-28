/* global data */

// Display a quiz event
import { useState, useEffect } from 'react';
import RadioQ from './RadioQ';
import CheckQ from './CheckQ';

import bg_noon from '../assets/bg-afternoon.png';
import bg_evening from '../assets/bg-evening.png';
import bg_morning from '../assets/bg-morning.png';

import Button from '@material-ui/core/Button';
import createPalette from '@material-ui/core/styles/createPalette';

export default function Question(props) {
  const [main_bg, setMainBg] = useState(bg_morning);
  const [refresh, setRefresh] = useState(0);

  // create initial q state
  let init = props.data.radio ? "0" : {};
  
  // Store responses
  const [res, setRes] = useState(init);

  useEffect(() => {
    console.log(props.data);
    console.log(props.question)
    const modulo = props.question % 3;
    if (props.question === 0 || modulo === 1) {
      setMainBg(bg_morning);
    } else if (modulo === 2) {
      setMainBg(bg_noon);
    } else {
      setMainBg(bg_evening);
    }
  }, [refresh])
  


  // Handle response
  const handleChange = (event) => {
    if(props.data.radio){
      setRes(event.target.value);
    } else{
      setRes({ ...res, [event.target.name]: event.target.checked });
    }
  };

  // Question submission
  const handleNext = () => {
    // console.log("start", data.score);

    // Add choice impact to sum
    if(props.data.radio){

      // Add max question impact to total
      let max = 0;
      for(let i = 0; i < props.data.choices.length; i++){
         max = Math.max(props.data.choices[i].impact, max);
      }
      data.score[props.data.category].total += max;

      data.score[props.data.category].sum += props.data.choices[res].impact;
    } else{

      // Add all question impacts to total
      for(let i = 0; i < props.data.choices.length; i++){
        data.score[props.data.category].total += props.data.choices[i].impact;
      }

      for(let key in res){
        if (res[key]){
          for(let i = 0; i < props.data.choices.length; i++){

            if( props.data.choices[i].text === key ){
              data.score[props.data.category].sum += props.data.choices[i].impact;
            }
          }
        }
      }
    }
    // console.log("end", data.score);

    // Transition to next Q here
    // console.log(props.question + 1);
    // console.log(data.story.length);
    if (props.question + 1 < data.story.length) {
      props.setQuestion(props.question + 1);
      setRefresh(prev => !prev);
      console.log('wtf');
    } else {
      data.nav = 2;
      props.setPage(2);
    }
  }

  // Map choices to their idx, used to access score on q submit
  return (
    <div className='outer-question-container' style={{
      backgroundImage: `url(${main_bg})`,
    }}>
      <div id="question">
        {/* icon */}
        <p className="question-text">
          {props.data.text}
        </p>

        {
          props.data.radio 
          ? 
          <RadioQ val={res} handle={handleChange} data={props.data}/>
          :
          <CheckQ val={res} handle={handleChange} data={props.data}/>
        }

        <Button className='next-button' onClick={handleNext} variant="contained" color="primary">
          {">>"}
        </Button>
        
      </div>
    </div>
  )
}