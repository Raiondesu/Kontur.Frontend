using Kontur.Frontend.Models;
using Nancy;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Kontur.Frontend.Controllers
{
	public class CityController : NancyModule
	{
		public CityController()
		{
			Get["/"] = _ => Response.AsFile("content/index.html", "text/html");

			Get["/city/{name?}"] = _ => FindCity(_.name);

			Put["/city/{name}"] = _ => {
				Repository.Cities.Add(new Entity { City = _.name, Id = Repository.Cities.Count });
				return HttpStatusCode.OK;
			};
		}

		public object FindCity(string city)
		{
			if (city == null || city.Length == 0) return HttpStatusCode.BadRequest;

			var result = Repository.Cities.FindAll(c => c.City.ToLower().Contains(city.ToLower()));
			//if (result.Count > 50) result = result.GetRange(0, 50);

			HttpStatusCode statusCode = result?.Count > 0 ? HttpStatusCode.OK : HttpStatusCode.NotFound;
			ResponseBody responseBody = new ResponseBody(result, result?.Count > 0 ? null : "404: Not Found!");

			return Response.AsJson(responseBody, statusCode);
		}
	}
}