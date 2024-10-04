// https://dictionaryapi.dev/


import React, { useState, useEffect, useRef } from 'react';
import playButton from './assets/play-button.png';
// import stopButton from './assets/stop-button.png';
import soundKeyType from './assets/key-type2.mp3';

function MyComponent() {

  // const wordInput = document.getElementById("word-input");
 // const wordData = wordInput.value;

  const [wordData, setWordData] = useState("");
  
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordData}`;

  const [nameWord, setNameWord] = useState("");
  const [nameFonetic, setNameFonetic] = useState("");
  const [srcAudio, setSrcAudio] = useState(""); 
  const [wordType, setWordType] = useState("");
  const [def, setDef] = useState("");

  const card = document.querySelector(".card");
  
  const audioRef = useRef(null);
  const inputElement = useRef();

  useEffect(() => {
    focusInput();
    getFetchData();
  }, [wordData]); 

  function handleInputChange(event) {
    setWordData(event.target.value);
    if(event.target.value === "") {
      card.style.display = "none";
    }
  }

  async function getFetchData() {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Could not fetch resource");
      }

      const data = await response.json();
     

      console.log(data);
    
      const wordName = data[0].word;
      let wordFonetic = data[0].phonetic;
      if(!wordFonetic) {
           wordFonetic = data[0].phonetics[1].text;
      }
      let audioSrc = data[0].phonetics[0].audio; 
      if(audioSrc ==="") {
        audioSrc = data[0].phonetics[1].audio;
        if(!audioSrc) {
          audioSrc = data[0].phonetics[2].audio;
        }
      }
      const type = data[0].meanings[0].partOfSpeech;
      const definition = data[0].meanings[0].definitions[0].definition;
      
      setNameWord(wordName);
      setNameFonetic(wordFonetic);
      setSrcAudio(audioSrc); 
      setWordType(type);
      setDef(definition);
      card.style.display = "block";

    } catch (error) {
      console.error(error);
    }
  }

  function handleAudio() {
    let audio = document.getElementById("myAudio");
    audio.currentTime = 0;
    audio.play();
}

function playKeySound() {
  if (audioRef.current) {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  }
}

const focusInput = () => {
  inputElement.current.focus();
}



window.addEventListener('keydown', playKeySound); // useEffect e eklenebilir burası?, remove yapmaya gerek var mı listener ı?

  return (
  <div className='container-dictionary'>

       <input className='input-word'
            value={wordData}
            onChange={handleInputChange}
            type='text'
            placeholder='Enter a word'
            ref={inputElement}/>
       <audio className="typing" ref={audioRef} src={soundKeyType}></audio>     

   <div className='card' style={{display: 'none'}}>

          <div className='part-1'>
              
              <h1>{nameWord}</h1>
              <p>{nameFonetic}</p>         
              <audio id='myAudio' src={srcAudio}></audio>
              <img id="audioControl" 
                   src={playButton} 
                   alt="Play Audio"
                   onClick={handleAudio}/>
          </div>

          <div className='part-2'>
              <p className='type'>{wordType}</p> 
              <p className='def'>Definition:</p>
              <p className='word-def'>{def}</p>
          </div>
   </div>
</div>
  
  );
}

export default MyComponent;
