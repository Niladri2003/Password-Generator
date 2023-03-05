const inputslider=document.querySelector("[data-lengthslider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyMsg=document.querySelector("[data-copyMsg]");
const copyBtn=document.querySelector("[data-copy]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercheck=document.querySelector("#lowercase");
const numbercheck=document.querySelector("#numbers");
const symbolcheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generatebutton=document.querySelector(".generateButton");
const allcheckbox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let password_length=10;
let checkCount =0;

handleSlider();
// ste strength circle color to grey

//set password length
function handleSlider(){
    inputslider.value = password_length;
    lengthDisplay.innerText=password_length;

}

function setIndicator(color){
    indicator.style.backgroundColor=color;

}
// finds a random number between min and max range
function getRandomInteger(min, max){
 return Math.floor(Math.random()*(max-min))+min;   
}
function generateRandomNumber(){
    return getRandomInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}
function generateSymbol(){
    const size=getRandomInteger(0,symbols.length);

    return symbols.charAt(size);
}
function calcStrength(){
    let hasupper=false;
    let haslower=false;
    let hasnum=false;
    let hassymbol=false;
    if(lowercheck.checked) haslower=true;
    if(uppercasecheck.checked) hasupper=true;
    if(numbercheck.checked) hasnum=true;
    if(symbolcheck.checked) hassymbol=true;

    if((hasupper&&haslower&&(hasnum|| hassymbol)&&password_length>=8)){
        setIndicator("#0f0");
    }else if((haslower||hasupper)&&
    (hasnum||hassymbol)&&(
        password_length>=6
    )){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}
// From password display to clipboard copy the password
async function copy(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
   
}
//Counts the how many checkboxes are checked
 function handelcheckboxchange(){
    checkCount=0;
    allcheckbox.forEach((checbox)=>{
        if(checbox.checked)
            checkCount++;
    });
    //special case
    if(password_length<checkCount){
        password_length=checkCount;
        handleSlider();
    }


}
allcheckbox.forEach((checbox)=>{
    checbox.addEventListener('change',handelcheckboxchange)
})


//change the password length on ui using the slider
inputslider.addEventListener('input',(e)=>{
    password_length=e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click',()=>{
if(passwordDisplay.value)
    copy();
});
function shufflePassword(array){
//Fisher Yates Method
for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
let str = "";
array.forEach((el) => (str += el));
return str;
};


// main function
generatebutton.addEventListener('click', ()=>{
//none of the checkbox are selected
if(checkCount == 0) 
return;

if(password_length<checkCount){
    password_length=checkCount;
    handleSlider();
}
//Let's find the future password

//Remove old password
password="";
//lets put the stuff mentioned by the chekbox
// if(uppercasecheck.checked){
//     password+=generateUpperCase();
// }
// if(lowercheck.checked){
//     password+=generateLowerCase();
// }if(numbercheck.checked){
//     password+=generateRandomNumber();
// }if(symbolcheck.checked){
//     password+=generateSymbol();
// }

let funcArr=[];
if(uppercasecheck.checked){
    funcArr.push(generateUpperCase);
}
if(lowercheck.checked){
    funcArr.push(generateLowerCase);
}
if(numbercheck.checked){
    funcArr.push(generateRandomNumber);
}
if(symbolcheck.checked){
    funcArr.push(generateSymbol);
}

//Compulsary Addition
for(let i=0;i<funcArr.length;i++){
    password += funcArr[i]();
}

//remaining addition
for(let i=0;i<password_length-funcArr.length;i++){
    let ranIndex=getRandomInteger(0,funcArr.length);
    password+=funcArr[ranIndex]();
}
//Shuffle the password
password=shufflePassword(Array.from(password));

//Show the password
passwordDisplay.value=password
//calculation strength
calcStrength();
});








