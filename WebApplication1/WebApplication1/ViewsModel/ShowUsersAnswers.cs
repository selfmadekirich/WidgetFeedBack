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
            var temp = ans.Where(x=>x.Type.Contains("1")).Select(x => x.QuestionId).Distinct();
             rates = temp.Select(x =>
                             new UserAnswersRates(
                                ans.Where(y => (x == y.QuestionId) && y.Type.Contains("1")))).ToList();
            
        }
        public IEnumerable<UserAnswersRates> rates { get;private set; }

    }

    public class UserAnswersRates
    {
        public int? Id { get; set; }

        public int Amount { get; set; }

        private int Sum { get; set; }

        public string Average
        {
            get {if(Amount>0) return (Sum*1.0 / Amount).ToString("0.00"); return 0+""; }
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
