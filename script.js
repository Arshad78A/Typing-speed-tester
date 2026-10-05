const COMMON="the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us code design build create function system data network server client interface product user experience logic state component render style layout motion visual focus speed accuracy keyboard typing future invent simple efficient problem solution learn write program language error debug compile deploy branch merge commit review test optimize refactor pattern module package library framework api request response cache memory process thread async await promise callback closure scope variable constant object array string number boolean null while return import export default class extends super static private public interface type light dark theme color neon cyan blue glow sharp clean minimal premium craft detail pixel vector grid space orbit signal pulse current stream flow depth field layer surface element moment energy matter particle quantum binary digital analog virtual reality idea concept vision".split(" ");
const QUOTES=["The best way to predict the future is to invent it.","Code is like humor. When you have to explain it, it's bad.","Simplicity is the soul of efficiency.","First, solve the problem. Then, write the code.","Experience is the name everyone gives to their mistakes.","Programs must be written for people to read, and only incidentally for machines to execute."];
let mode="words",timeOpt=30,words=[],typedWords=[],curIdx=0,curInput="",timeLeft=30,isActive=false,isFinished=false,timer=null;
const $words=document.getElementById("words"),$wrap=document.getElementById("wordsWrap"),$hidden=document.getElementById("hiddenInput"),$wpm=document.getElementById("wpm"),$acc=document.getElementById("acc"),$time=document.getElementById("time"),$timeStat=document.getElementById("timeStat"),$overlay=document.getElementById("resultOverlay");
function genWords(m,c=120){if(m==="quote"){return QUOTES[Math.floor(Math.random()*QUOTES.length)].split(/\s+/)}let a=[];for(let i=0;i<c;i++)a.push(COMMON[Math.floor(Math.random()*COMMON.length)]);return a}
function render(){
 $words.innerHTML="";words.forEach((w,wi)=>{
  let wordEl=document.createElement("div");wordEl.className="word"+(wi===curIdx?" current":"");
  let typed=wi<curIdx?typedWords[wi]:wi===curIdx?curInput:"";
  let max=Math.max(w.length,typed.length);
  for(let i=0;i<max;i++){
   let s=document.createElement("span");s.textContent=w[i]||typed[i]||"";
   if(wi<curIdx){if(i<w.length&&i<typed.length){s.className=typed[i]===w[i]?"correct":"incorrect"}else s.className="incorrect";if(i>=w.length)s.className="extra incorrect"}
   else if(wi===curIdx){if(i<curInput.length)s.className=curInput[i]===w[i]?"correct":"incorrect";else s.className="future";if(i>=w.length&&i<curInput.length)s.className="extra incorrect"}
   else s.className="future";
   if(s.textContent) wordEl.appendChild(s);
  } $words.appendChild(wordEl);
 });update();
}
function update(){
 let cor=0,inc=0,corW=0,total=0;
 for(let i=0;i<curIdx;i++){let w=words[i],t=typedWords[i]||"";total+=t.length+1;if(t===w)corW++;for(let j=0;j<Math.max(w.length,t.length);j++){if(j<w.length&&j<t.length){if(t[j]===w[j])cor++;else inc++}else inc++}}
 for(let j=0;j<curInput.length;j++){if(j<words[curIdx]?.length){if(curInput[j]===words[curIdx][j])cor++;else inc++}else inc++} total+=curInput.length;
 let elapsed=timeOpt-timeLeft;let wpmV=isActive||isFinished?Math.round((cor/5)/(elapsed/60||1)):0;let accV=(cor+inc)?Math.round(cor/(cor+inc)*100):100;
 $wpm.textContent=isActive||isFinished?wpmV:"--";$acc.textContent=isActive||isFinished?accV+"%":"--";$time.textContent=timeLeft+"s";$timeStat.classList.toggle("low",timeLeft<=10&&isActive);
 if(isFinished){document.getElementById("finalWpm").textContent=wpmV;document.getElementById("rAcc").textContent=accV+"%";document.getElementById("rRaw").textContent=Math.round((total/5)/(timeOpt/60));document.getElementById("rCor").textContent=cor;document.getElementById("rInc").textContent=inc;document.getElementById("resultMeta").textContent=`time: ${timeOpt}s • mode: ${mode} • ${corW} words`;}
}
function finish(){isFinished=true;isActive=false;clearInterval(timer);$overlay.classList.add("show");render();}
function restart(m,t){if(m)mode=m;if(t)timeOpt=t;words=genWords(mode,mode==="quote"?0:200);typedWords=new Array(words.length).fill("");curIdx=0;curInput="";timeLeft=timeOpt;isActive=false;isFinished=false;clearInterval(timer);$overlay.classList.remove("show");$wrap.classList.remove("blurred");$hidden.value="";render();$hidden.focus();}
$hidden.addEventListener("keydown",(e)=>{
 if(isFinished&&e.key==="Enter"){restart();return}if(e.key==="Tab"){e.preventDefault();restart();return}
 if(e.key===" "){e.preventDefault();if(!curInput)return;if(!isActive){isActive=true;timer=setInterval(()=>{timeLeft--;if(timeLeft<=0){timeLeft=0;finish()}render()},1000)}typedWords[curIdx]=curInput;curIdx++;curInput="";$hidden.value="";if(mode==="words"&&curIdx>words.length-20){let more=genWords("words",80);words=words.concat(more);typedWords=typedWords.concat(new Array(more.length).fill(""))}render();return}
 if(e.key==="Backspace"){if(curInput.length>0){curInput=curInput.slice(0,-1);$hidden.value=curInput;render()}else if(curIdx>0&&typedWords[curIdx-1]!==words[curIdx-1]){curIdx--;curInput=typedWords[curIdx]||"";$hidden.value=curInput;typedWords[curIdx]="";render()}e.preventDefault();return}
 if(e.key.length===1){if(!isActive){isActive=true;timer=setInterval(()=>{timeLeft--;if(timeLeft<=0){timeLeft=0;finish()}render()},1000)}curInput+=e.key;$hidden.value=curInput;render();e.preventDefault()}
});
document.querySelectorAll("#modePill button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#modePill button").forEach(x=>x.classList.remove("active"));b.classList.add("active");restart(b.dataset.mode)}));
document.querySelectorAll("#timePill button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#timePill button").forEach(x=>x.classList.remove("active"));b.classList.add("active");restart(null,parseInt(b.dataset.time))}));
document.getElementById("restartBtn").onclick=()=>restart();document.getElementById("againBtn").onclick=()=>restart();document.getElementById("newBtn").onclick=()=>restart();
$wrap.onclick=()=>{$hidden.focus();$wrap.classList.remove("blurred")};$hidden.onblur=()=>{if(!isFinished)$wrap.classList.add("blurred")};$hidden.onfocus=()=>{$wrap.classList.remove("blurred")};
restart();