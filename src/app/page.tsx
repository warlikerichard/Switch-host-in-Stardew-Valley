//Needs to be fixed: As soon as the names of the players are displayed, the newHost is not imediatly selected, that means that you have to manually select
//one of the players from the list, even if it shows that there's a player already selected. See the function getPlayers.
interface Player{
  content: string,
  name: string
}

'use client'
import styles from "./page.module.css";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [host, setHost] = useState<Player>();
  const [newHost, setNewHost]= useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const optionsRef = useRef<HTMLSelectElement>(null);
  const resultRef = useRef<HTMLTextAreaElement>(null);
  const saveGameInfoRef = useRef<HTMLTextAreaElement>(null);

  //const select : HTMLSelectElement = document.getElementById('player') as HTMLSelectElement;
  //var option = select.options[select.selectedIndex].value;
  //Here, the players will be stored as soon as the user pastes the text into the box, since it reacts when text is changed.
  useEffect(()=>{
    setPlayers(getPlayers(text, setNewHost));
    //setNewHost(players[0]?.name); //It might be necessary to make sure the first element from the list is selected beforehand.
  }, [text])

  return (
    <main className={styles.main}>
      <h1>Switch hosts in stardew valley</h1>
      <h2 className={styles.obs}>It is strongly adviced to keep a backup of your save files before changing them</h2>
      <h2 className={styles.firstRqst}>Press Win+R and type %appdata%\StardewValley\Saves</h2>
      <h2>Paste the content of the file "ServerName123456789" here</h2>
      <textarea className={styles.io} onChange={(event)=>{setText(event.currentTarget.value)}}/>
      <h3>Choose the new host:</h3>
      <div>
        <select name="player" id="player" ref={optionsRef} onChange={(event)=>{setNewHost(event.currentTarget.value)}}>
          {players.map(player=>{
            return(<><option value={player.name}>{player.name}</option></>)
          })}
        </select>
      </div>
      <button className={styles.getResult} onClick={()=>{getResult(text, setHost, players, newHost, setResult, resultRef, saveGameInfoRef)}}>Get Result</button>
      <h2>Copy the code below, and replace the content of "ServerName123456789" with it</h2>
      <textarea className={styles.io} ref={resultRef}/>

      <h2>Now, paste the code below on the file "SaveGameInfo"</h2>
      <textarea className={styles.io} ref={saveGameInfoRef}/>
    </main>
  );
}

//This function changes the host with the selected player
function getResult(text : string, setHost: any, players: Player[], newHost: string, setResult: any, resultRef: RefObject<HTMLTextAreaElement>, saveGameInfoRef: RefObject<HTMLTextAreaElement>){
  //console.log(select.options[select.selectedIndex].value);
  const hostInfo = getTextBetween(text, '<player>', '</player>')[0];
  
  const host = {
    content: hostInfo,
    name: getTextBetween(hostInfo, '<name>', '</name>')[0]
  }
  setHost(host);

  var newText = text;
  players.forEach(player=>{
    if(player.name == newHost){
      newText = newText.replace(player.content, host.content);
      newText = newText.replace(host.content, player.content);

      if(saveGameInfoRef.current != null){
        saveGameInfoRef.current.value = "<?xml version=\"1.0\" encoding=\"utf-8\"?><Farmer xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">"
        + player.content + "</Farmer>";
      }
      //console.log(host.content);
      //console.log(player.content);
    }
  })

  setResult(newText);
  if(resultRef.current != null){
    resultRef.current.value = newText;
  }
}

//Returns a list of all the texts betwee textStart and textEnd
function getTextBetween(text: string, textStart: string, textEnd: string){

  var list = text.split(textStart).slice(1);

  list = list.map(item=>{
    var result = item.split(textEnd)[0];
    return result;
  })

  return list;
}

//Returns a list with objects containing each player's content and name
function getPlayers(text: string, setNewHost: Dispatch<SetStateAction<string>>){
  const fullText = getTextBetween(text, '<Farmer>', '</Farmer>');
  const players = fullText.map(item => {
    return{
      content: item,
      name: getTextBetween(item, '<name>', '</name>')[0]
    }
  })
  //setNewHost(players[0].name);

  return players;
}