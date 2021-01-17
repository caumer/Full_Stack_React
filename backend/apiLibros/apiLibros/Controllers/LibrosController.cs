using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using apiLibros.Context;
using apiLibros.Models;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace apiLibros.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibrosController : ControllerBase
    {
        private readonly AppDbContext context;
        public LibrosController(AppDbContext context)
        {
            this.context = context;
        }

        // GET: api/<LibrosController>
        [HttpGet]
        public ActionResult Get()
        {
            try
            {
                return Ok(context.libros.ToList());
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<LibrosController>/5
        [HttpGet("{id}", Name ="GetLibro")]
        public ActionResult Get(int id)
        {
            try
            {
                var libro = context.libros.FirstOrDefault(g => g.id == id);
                return Ok(libro);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<LibrosController>
        [HttpPost]
        public ActionResult Post([FromBody] libros libros )
        {
            try
            {
                context.libros.Add(libros);
                context.SaveChanges();
                return CreatedAtRoute("GetLibros", new { id = libros.id }, libros);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<LibrosController>/5
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] libros libros)
        {
            try
            {
                if(libros.id==id)
                {
                    context.Entry(libros).State = EntityState.Modified;
                    context.SaveChanges();
                    return CreatedAtRoute("GetLibros", new { id = libros.id }, libros);
                }
                else
                {
                    return BadRequest();
                }   
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<LibrosController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            try
            {
                var libro = context.libros.FirstOrDefault(g => g.id == id);
                if(libro != null)
                {
                    context.libros.Remove(libro);
                    context.SaveChanges();
                    return Ok(id);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
