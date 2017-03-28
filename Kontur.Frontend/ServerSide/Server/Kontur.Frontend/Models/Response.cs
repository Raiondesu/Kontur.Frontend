using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kontur.Frontend.Models
{
	class ResponseBody
	{
		public ResponseBody(dynamic result = null, string error = null)
		{
			this.Result = result;
			this.Error = error;
		}

		public dynamic Result { get; }
		public string Error { get; }
	}
}
