using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
namespace WebApplication1.Models
{
    public class Answer
    {  
        [JsonIgnore]
        public int Id { get; set; }

        [JsonPropertyAttribute("type")]
        public string Type { get; set; }

        [JsonPropertyAttribute("value")]
        public string Result { get; set; }

        [JsonPropertyAttribute("id")]
        public int QuestionId { get; set; }

        [JsonIgnore]
        public virtual Question Question { get; set; }

    }
}
