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
    new Question(2, 1, "Насколько удобен и понятен для вас интерфейс платформы?", 3),
    new Question(3, 1, "Насколько хорошо работает коллаборативная деятельность?", 4),
    new Question(4, 2, "Хватает ли рекомендаций по грамматике от платформы при прохождении курса?", 5, 5),
    new Question(5, 2, "Вам понравился опрос?", 6, 7),
    new Question(6, 1, "Напишите почему нет(тут нужно поставить чтекствое поле или что-то подобное)", null),
    new Question(7, 1, "Оцените его", null),
] 


const quiz=new Quiz(Questions);
Init();
const buttons=document.getElementById("buttons");


function saveAnswer()
{  
    var answers;
     answers=document.getElementsByName("ans_radio");
    
    var result;

    if(answers!=null){
    for(let rad of answers)
      if(rad.checked){
        result = rad.value;
        quiz.answers.push(new Answer(quiz.questions[quiz.current].type,rad.value));
      }
    }//для развернутого ответа 
    // если будут другие типы ответов изменим этот метод
    else  answers=document.getElementsByName("ans_text");    

    return result;
}


//Обновление теста
function Update()
{   
    console.log(quiz.current);
    //сохраняем ответ на текущий вопрос 
    var answer = saveAnswer();
    document.getElementById("check").innerHTML="Дальше";

    if(quiz.questions[quiz.current].type == 1)
      quiz.current=quiz.questions[quiz.current].nextQuestion;
    else if(quiz.questions[quiz.current].type == 2){
      if(answer == 1)
        quiz.current=quiz.questions[quiz.current].nextQuestion;
      else
        quiz.current=quiz.questions[quiz.current].nextQuestion2;
    }
      //quiz.current++;
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
       }  

       document.getElementById("pages").innerHTML = (quiz.current) + " / " + (quiz.questions.length - 1);  
   } else {
       //alert("заглушка");
       buttons.innerHTML="";
       document.getElementById("head").innerHTML = "Спасибо!"
      console.log(quiz.answers);
   }
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
     radiobutton.setAttribute("type","radio");
     radiobutton.setAttribute("value",value);
     paragraph.appendChild(radiobutton);
     buttons.appendChild(paragraph);
  
}

function CreateAnswers_secondType()
{
  CreateRadio(1,"Да");
  CreateRadio(2,"Нет");
  //и соответственно сделать переадресацию на нужный вопрос
  // переадресация ( в этом контексте) - указать нужный номер след вопроса
}

function CreateAnswers_firstType()
{
    var descript=document.createElement("p");
       descript.innerHTML="1-плохо,зря потратил деньги"+"\n"+"5-лучшее вложение в моей жизни";
     buttons.appendChild(descript);
       for(let i = 0; i < 5;i++)
       {  
         CreateRadio(i,i+1);
       }
     
}


function Init()
{            
       document.getElementById("head").innerHTML="Пожалуйста, пройдите наш опрос"+
       "\n" + "он поможет нам усовершенствовать наше приложение для вас."
       var beginButton=document.getElementById("check");
       beginButton.innerHTML="Начнем!";
       //quiz.current=-1;
      
       //document.getElementById("pages").innerHTML = (quiz.current + 1) + " / " + quiz.questions.length;     
}