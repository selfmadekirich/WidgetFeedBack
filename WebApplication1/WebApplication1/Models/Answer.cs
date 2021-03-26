using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Result { get; set; }

        public int QuestionId { get; set; }

        public virtual Question Question { get; set; }

    }
}
