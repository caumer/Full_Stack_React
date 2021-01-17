using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace apiLibros.Models
{
    public class libros
    {
        [Key]
        public int id { get; set; }
        public string nombreLibro { get; set; }
        public int lanzamiento { get; set; }
        public string autor { get; set; }
    }
}
