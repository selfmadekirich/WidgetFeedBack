using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace WebApplication1.Models
{
    public class Question
    {

        public int Id { get; set; }

        [DisplayName("тип вопроса")]
        [Required]
       
        public string Type { get; set; }

        [DisplayName("вопрос")]
        [Required]
       
        public string Ques { get; set; }

        [DisplayName("номер следующего  вопроса ")]
        public int? NextQues1 { get; set; }

        [DisplayName("номер следующего вопроса в другой ветке ")]
        public int? NextQues2 { get; set; }

        public virtual ICollection<Answer> Answers { get; set; }

    }
}
