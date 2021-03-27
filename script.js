//Класс, который представляет сам тест
class Quiz
{
   constructor(questions)
   {
       //Массив с вопросами
       this.questions = questions;
 
       //Массив c ответами пользователей 
       this.answers =[];
 
       //Номер текущего вопроса
       this.current = 0;

       this.quantity = questions.length;
   }
   
   //метод для получение json строки из массива ответов юзера
     ConvertAnswersToJSON()
     {
         return JSON.stringify(this.answer);
     }
 
}
 
//Класс, представляющий вопрос
class Question
{
  // NextQuestion2 - второй вопрос для ветвления вопростов 2 типа 
  constructor(id,type,text,nextQuestion, nextQuestion2 = null)
   {   
       //id вопроса из бд ,дальше его можно использовать для ответов юзера  
       this.id=id;

        //Тип вопроса: 1 - выбор числа 1 до 10 (условно), 2 -развернутый ответ
       this.type = type;
       //текст вопроса 
       this.text = text;
       //объект след вопроса 
       this.nextQuestion=nextQuestion;
       this.nextQuestion2=nextQuestion2;
   }
 
}
 
//Класс, представляющий ответ
class Answer
{
   constructor(type, value)
   {   
       //type - совпадает с типом вопроса 
       this.type = type;
       //ответ пользователя 
       this.value = value;
   }
}

//нулевой вопрос это костыль чтобы всё работало(надо исправить наверное)
//в конце последнего вопроса обязательно null 
const Questions=[
    new Question(0, 1, "костыль", 1),
    new Question(1, 1, "Насколько сложными для вас являются задания?", 2),
    new Question(2, 3, "Насколько удобен и понятен для вас интерфейс платформы?", 3),
    new Question(3, 1, "Насколько хорошо работает коллаборативная деятельность?", 4),
    new Question(4, 2, "Хватает ли рекомендаций по грамматике от платформы при прохождении курса?", 5, 5),
    new Question(5, 2, "Вам понравился опрос?", 6, 7),
    new Question(6, 1, "Напишите почему нет(тут нужно поставить чтекствое поле или что-то подобное)", null),
    new Question(7, 1, "Оцените его", null),
] 


const quiz=new Quiz(Questions);
const buttons=document.getElementById("rating");
const beginButton=document.getElementById("check");
var gotAnswer=false;

document.getElementById("card").setAttribute("hidden","true");

Init();


function saveAnswer()
{  
    var answers;
     answers=document.getElementsByName("rating");
    
    var result;
    
    
    
    if(answers.length>0)
    {  
      gotAnswer=false;
       for(let rad of answers)
        {
          if(rad.checked)
          {
            gotAnswer=true;
            result = rad.value;
            quiz.answers.push(new Answer(quiz.questions[quiz.current].type,rad.value));
          }
        } 
       
        if(!gotAnswer)
          beginButton.setAttribute("disable","true");
         
    }
    //для развернутого ответа 
    // если будут другие типы ответов изменим этот метод
    else  {
      gotAnswer=true;
       answers=document.getElementsByName("ans_text");    
       if(answers.length > 0){
          quiz.answers.push(new Answer(quiz.questions[quiz.current].type, answers.value));
        }
    }
    console.log(gotAnswer);
    return result;
}


//Обновление теста
function Update()
{   
    
  document.getElementById("card").setAttribute("hidden","false");
    beginButton.setAttribute("disable","false");
     
    console.log(quiz.current);
    //сохраняем ответ на текущий вопрос 
    var answer = saveAnswer();
    console.log(gotAnswer);
    if(!gotAnswer) return;


    beginButton.innerHTML="Дальше";

    if(quiz.questions[quiz.current].type == 2){
      if(answer == 1)
        quiz.current=quiz.questions[quiz.current].nextQuestion;
      else
        quiz.current=quiz.questions[quiz.current].nextQuestion2;
    }
    else {
      quiz.current=quiz.questions[quiz.current].nextQuestion;
    }
     
   //Проверяем, есть ли ещё вопросы
   if(quiz.current){
       
       //меняем вопрос 
       document.getElementById("head").innerHTML = quiz.questions[quiz.current].text;
 
       //Удаляем старые варианты ответов
       
       buttons.innerHTML="";
     /*
     здесь необходима функция , которая по типу вопроса создает нужные поля ответов
     тип 1 - оценка от 1 до 5 (к примеру)
     тип 2 -  направляющий 
     тип 3 - развернутый ответ
     */ 
       //пока так
       switch(quiz.questions[quiz.current].type)
       {
           case 1:CreateAnswers_firstType();break;
           case 2:CreateAnswers_secondType();break;
           case 3:CreateAnswers_thirdType();break;
       }  

    
   } else {
       //alert("заглушка");
       buttons.innerHTML="";
       document.getElementById("head").innerHTML = "Спасибо!"
      console.log(quiz.answers);
   }
   gotAnswer=true;
}
 
/*value - значение аттрибута value radiobutton , innerhtml- текст для отображения в данном случае - номер ответа/или текст ответа */
function CreateRadio(value,innerHtml)
{
     //использую p для вывода текста ,тк у radio нет innerhtml
     var paragraph=document.createElement("p");
     paragraph.innerHTML=innerHtml;
     
     //создаю radio button ,вешаю нужные аттрибуты 
     var radiobutton=document.createElement("input");
     radiobutton.setAttribute("type","radio");
     radiobutton.setAttribute("name","ans_radio");
     radiobutton.setAttribute("value",value+1);
     paragraph.appendChild(radiobutton);
     buttons.appendChild(paragraph);
  
}

function CreateText()
{
     //использую p для вывода текста ,тк у radio нет innerhtml
     var paragraph=document.createElement("p");
     
     //создаю radio button ,вешаю нужные аттрибуты 
     var textfield=document.createElement("TEXTAREA");
     textfield.setAttribute("maxlength", 500);
     textfield.setAttribute("rows", 10);
     textfield.setAttribute("cols", 45);
     textfield.value = "aaaa";
     textfield.setAttribute("placeholder", "Введите текст...");
     textfield.setAttribute("name","ans_text");
     paragraph.appendChild(textfield);
     buttons.appendChild(paragraph);
     console.log(textfield.value);
}

function CreateAnswers_thirdType()
{
  CreateText();  
}

function CreateAnswers_secondType()
{
  buttons.innerHTML+=
  `<label for="no"> 
  <input type="radio" name="rating" class="no" id="no" value="1" />
  <svg viewBox="0 0 24 24">
  <rect transform="rotate(45, 10, 10)" id="svg_11" height="20" width="2.5" y="0.0" x="9" fill-opacity="null" stroke-opacity="null" stroke-width="NaN" stroke="null" fill="null"/>
  <rect transform="rotate(-45, 10, 10)" id="svg_12" height="20" width="2.5" y="0.0" x="9" fill-opacity="null" stroke-opacity="null" stroke-width="NaN" stroke="null" fill="null"/>
</svg>
  </label>

<label for="yes">
  <input type="radio" name="rating" class="yes" id="yes" value="2" />
  <svg  viewBox="0 0 24 24"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z" /></svg>
  </label>`;
  //и соответственно сделать переадресацию на нужный вопрос
  // переадресация ( в этом контексте) - указать нужный номер след вопроса
}

function CreateAnswers_firstType()
{
  
  buttons.innerHTML+=
  `<label for="super-sad"> 
  <input type="radio" name="rating" class="super-sad" id="super-sad" value="1" />
  <svg viewBox="0 0 24 24"><path d="M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M16.18,7.76L15.12,8.82L14.06,7.76L13,8.82L14.06,9.88L13,10.94L14.06,12L15.12,10.94L16.18,12L17.24,10.94L16.18,9.88L17.24,8.82L16.18,7.76M7.82,12L8.88,10.94L9.94,12L11,10.94L9.94,9.88L11,8.82L9.94,7.76L8.88,8.82L7.82,7.76L6.76,8.82L7.82,9.88L6.76,10.94L7.82,12M12,14C9.67,14 7.69,15.46 6.89,17.5H17.11C16.31,15.46 14.33,14 12,14Z" /></svg>
  </label>

<label for="sad">
  <input type="radio" name="rating" class="sad" id="sad" value="2" />
  <svg  viewBox="0 0 24 24"><path d="M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M12,14C13.75,14 15.29,14.72 16.19,15.81L14.77,17.23C14.32,16.5 13.25,16 12,16C10.75,16 9.68,16.5 9.23,17.23L7.81,15.81C8.71,14.72 10.25,14 12,14Z" /></svg>
  </label>


<label for="neutral">
  <input type="radio" name="rating" class="neutral" id="neutral" value="3" />
  <svg  viewBox="0 0 24 24"><path d="M8.5,11A1.5,1.5 0 0,1 7,9.5A1.5,1.5 0 0,1 8.5,8A1.5,1.5 0 0,1 10,9.5A1.5,1.5 0 0,1 8.5,11M15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8A1.5,1.5 0 0,1 17,9.5A1.5,1.5 0 0,1 15.5,11M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M9,14H15A1,1 0 0,1 16,15A1,1 0 0,1 15,16H9A1,1 0 0,1 8,15A1,1 0 0,1 9,14Z" /></svg>
  </label>

<label for="happy">
  <input type="radio" name="rating" class="happy" id="happy" value="4" />
  <svg  viewBox="0 0 24 24"><path d="M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z" /></svg>
</label>

<label for="super-happy">
  <input type="radio" name="rating" class="super-happy" id="super-happy" value="5" />
  <svg viewBox="0 0 24 24"><path d="M12,17.5C14.33,17.5 16.3,16.04 17.11,14H6.89C7.69,16.04 9.67,17.5 12,17.5M8.5,11A1.5,1.5 0 0,0 10,9.5A1.5,1.5 0 0,0 8.5,8A1.5,1.5 0 0,0 7,9.5A1.5,1.5 0 0,0 8.5,11M15.5,11A1.5,1.5 0 0,0 17,9.5A1.5,1.5 0 0,0 15.5,8A1.5,1.5 0 0,0 14,9.5A1.5,1.5 0 0,0 15.5,11M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
  </label>`;
    
}


function Init()
{            
       document.getElementById("head").innerHTML="Пожалуйста, пройдите наш опрос"+
       "\n" + "он поможет нам усовершенствовать наше приложение для вас."
       beginButton.innerHTML="Начнем!";
       
         
}
