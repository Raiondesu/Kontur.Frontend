using System.Collections.Generic;
using System.IO;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using Kontur.Frontend.Models;

namespace Kontur.Frontend
{
	public class Repository
	{
		public static List<Entity> Cities = JsonConvert.DeserializeObject<List<Entity>>(File.ReadAllText("kladr.json"));
	}
}
