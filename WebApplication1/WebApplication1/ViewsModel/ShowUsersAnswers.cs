using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.ViewsModel
{
    public class ShowUsersAnswers
    {

        public ShowUsersAnswers(IEnumerable<Answer> ans)
        {
            var temp = ans.Select(x => x.QuestionId).Distinct();
             rates = temp.Select(x =>
                             new UserAnswersRates(
                                ans.Where(y => x == y.QuestionId))).ToList();
            
        }
        public IEnumerable<UserAnswersRates> rates { get;private set; }

    }

    public class UserAnswersRates
    {
        public int? Id { get; set; }

        public int Amount { get; set; }

        private int Sum { get; set; }

        public double Average
        {
            get {if(Amount>0) return Sum / Amount; return 0; }
        }

        public string Question { get; set; }

        public UserAnswersRates(IEnumerable<Answer> lst)
        {
            if (lst.Count() != 0)
            {   
                Amount = lst.Count();
                Sum = lst.Sum(x => int.Parse(x.Result));
                Question = lst.FirstOrDefault()?.Question.Ques;
                Id = lst.FirstOrDefault()?.QuestionId;
            }
                
        }
    }

}
