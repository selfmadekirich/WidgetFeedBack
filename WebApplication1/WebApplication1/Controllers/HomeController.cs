using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;
using Microsoft.EntityFrameworkCore;
using WebApplication1.ViewsModel;
using Newtonsoft.Json;

namespace WebApplication1.Controllers
{
    public interface IDBworker
    {
         Task<IEnumerable<Question>> GetAllQuestionsAsync();
         Task<IEnumerable<Answer>> GetAllAnswersAsync();

         Question GetQuestionIdNoTracking(int id);

        void ChangeQuestion(int id, Question new_q);

        void DeleteQuestion(int id);

        void Create(Question q);

        void SaveWidgetAnswers(IEnumerable<Answer> answers);
    }

    public class DBWorker : IDBworker
    {
        private readonly DBContext _dbContext;

        public DBWorker(DBContext db)
        {
            _dbContext = db;
        }

        public async Task<IEnumerable<Answer>> GetAllAnswersAsync()
        {
            return await _dbContext.Answers.ToArrayAsync();           
        }

        public  async Task<IEnumerable<Question>> GetAllQuestionsAsync()
        {
            return await _dbContext.Questions.AsNoTracking().ToArrayAsync();
        }

        public Question GetQuestionIdNoTracking(int id)
        {
            return  _dbContext.Questions.AsNoTracking().FirstOrDefault(x=>x.Id==id);
        }

        public void ChangeQuestion(int id,Question new_q)
        {
           
                var ques =  _dbContext.Questions.Find(id);

                ques.Ques = new_q.Ques;
                ques.NextQues1 = new_q.NextQues1;
                ques.NextQues2 = new_q.NextQues2;
                ques.Type = new_q.Type;

                _dbContext.Questions.Update(ques);
                 _dbContext.SaveChanges();
        }

       public  void DeleteQuestion(int id)
        {   
            var ques= _dbContext.Questions.Find(id);
            _dbContext.Questions.Remove(ques);
            _dbContext.SaveChanges();
        }

       public  void Create(Question q)
        {
            _dbContext.Questions.Add(q);
            _dbContext.SaveChanges();
        }

        public async void SaveWidgetAnswers(IEnumerable<Answer> answers)
        {   

            await _dbContext.AddRangeAsync(answers);
            _dbContext.SaveChanges();
        }
    }



    public class HomeController : Controller
    {
        IDBworker _dbworker;

        public HomeController(IDBworker _db)
        {
            _dbworker = _db;
        }

        public IActionResult ShowQuestions()
        {
            return View(_dbworker.GetAllQuestionsAsync().Result);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create([Bind("Type,Ques,NextQues1,NextQues2")] Question q)
        {
            if (ModelState.IsValid)
            {
                _dbworker.Create(q);
                return RedirectToAction(nameof(ShowQuestions));
            }
            return View();
        }


        public IActionResult ShowResults()
        {
            var answers = _dbworker.GetAllAnswersAsync().Result;
            var questions = _dbworker.GetAllQuestionsAsync().Result;

            foreach (var a in answers)
            {
                a.Question = new Question() { Id = a.QuestionId, Ques = questions.FirstOrDefault(x => x.Id == a.QuestionId).Ques };
            }

            return View(new ShowUsersAnswers(answers));
        }

        [HttpGet]
        public IActionResult Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }


            var QuestionForEdit = _dbworker.GetQuestionIdNoTracking(id.Value);

            if (QuestionForEdit == null)
                return NotFound();

            return View(QuestionForEdit);
        }

        [HttpPost]
        public IActionResult Edit(int Id, [Bind("Type,Ques,NextQues1,NextQues2")] Question q)
        {
            if (q == null)
                return NotFound();
            if (ModelState.IsValid)
            {
                _dbworker.ChangeQuestion(Id, q);
                return RedirectToAction(nameof(ShowQuestions));
            }
            return View(q);
        }

        [HttpGet]
        public IActionResult Delete(int id)
        {
            var q = _dbworker.GetQuestionIdNoTracking(id);
            return PartialView(q);
        }

        [HttpPost]
        public IActionResult Delete([Bind("Id")] Question q)
        {
            _dbworker.DeleteQuestion(q.Id);
            return RedirectToAction(nameof(ShowQuestions));
        }

        [HttpGet]
        public IActionResult widget() => View();

        [HttpPost]
        public bool saveAnswers(string data)
        {
            var ReceivedData = JsonConvert.DeserializeObject<IEnumerable<Answer>>(data);
            _dbworker.SaveWidgetAnswers(ReceivedData);
            return true;
        }
        
        


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
