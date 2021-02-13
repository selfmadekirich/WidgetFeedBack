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
   }
   
   // метод для получение json строки из массива ответов юзера
     ConvertAnswersToJSON()
     {
         return JSON.stringify(this.answer);
     }
 
}
 
//Класс, представляющий вопрос
class Question
{
   constructor(id,type,text,nextQuestion)
   {   
       //id вопроса из бд ,дальше его можно использовать для ответов юзера  
       this.id=id;

        //Тип вопроса: 1 - выбор числа 1 до 10 (условно), 2 -развернутый ответ
       this.type = type;
       //текст вопроса 
       this.text = text;
       //объект след вопроса 
       this.nextQuestion=nextQuestion;
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

const Questions=[
    new Question(1,1,"любите ли вы печенье?",2),
    new Question(2,1,"любите ли вы молоко?",3),
    new Question(3,1,"why are you gay?",4),
    new Question(4,1,"занимались ли вы гачи-борьбой?",null),
]

const quiz=new Quiz(Questions);
Init();

function saveAnswer()
{  
    var answers;
     answers=document.getElementsByName("ans_radio");
    
    if(answers!=null){
    for(let rad of answers)
      if(rad.checked)
        quiz.answers.push(new Answer(quiz.questions[quiz.current].type,rad.value));
    }//для развернутого ответа 
    // если будут другие типы ответов изменим этот метод
    else  answers=document.getElementsByName("ans_text");    
}


//Обновление теста
function Update()
{   
    console.log(quiz.current);
    //сохраняем ответ на текущий вопрос 
    saveAnswer();

    quiz.current++;
   //Проверяем, есть ли ещё вопросы
   if(quiz.current<quiz.questions.length){
       
       //меняем вопрос 
       document.getElementById("head").innerHTML = quiz.questions[quiz.current].text;
 
       //Удаляем старые варианты ответов
       var temp=document.getElementById("buttons");
       temp.innerHTML="";
     /*
     здесь необходима функция , которая по типу вопроса создает нужные поля ответов
     тип 1 - оценка от 1 до 5 (к примеру)
     тип 2 - развернутый ответ
     */ 
       //пока так  
       for(let i = 0; i < 5;i++)
       {  
          //использую p для вывода текста ,тк у radio нет innerhtml
          var paragraph=document.createElement("p");
          paragraph.innerHTML=(i+1);
          
          //создаю radio button ,вешаю нужные аттрибуты 
          var radiobutton=document.createElement("input");
          radiobutton.setAttribute("type","radio");
          radiobutton.setAttribute("name","ans_radio");
          radiobutton.setAttribute("type","radio");
          radiobutton.setAttribute("value",i);
          paragraph.appendChild(radiobutton);
          temp.appendChild(paragraph);
       }
     
       document.getElementById("pages").innerHTML = (quiz.current + 1) + " / " + quiz.questions.length;  
   } else {
       alert("заглушка");
      console.log(quiz.answers);
   }
}
 
function Init()
{  
  document.getElementById("head").innerHTML = quiz.questions[quiz.current].text;
  var temp=document.getElementById("buttons");
   /*
     здесь необходима функция , которая по типу вопроса создает нужные поля ответов
     тип 1 - оценка от 1 до 5 (к примеру)
     тип 2 - развернутый ответ
     */ 
       //пока так  
       for(let i = 0; i < 5;i++)
       {  
          //использую p для вывода текста ,тк у radio нет innerhtml
          var paragraph=document.createElement("p");
          paragraph.innerHTML=(i+1);
          
          //создаю radio button ,вешаю нужные аттрибуты 
          var radiobutton=document.createElement("input");
          radiobutton.setAttribute("type","radio");
          radiobutton.setAttribute("name","ans_radio");
          radiobutton.setAttribute("type","radio");
          radiobutton.setAttribute("value",i);
          paragraph.appendChild(radiobutton);
          temp.appendChild(paragraph);
       }
     
       document.getElementById("pages").innerHTML = (quiz.current + 1) + " / " + quiz.questions.length;     
}