using Nancy;
using Nancy.Conventions;

namespace Kontur.Frontend
{
	public class CustomBootstraper : DefaultNancyBootstrapper
	{
		protected override void ConfigureConventions(NancyConventions nancyConventions)
		{
			Nancy.Json.JsonSettings.MaxJsonLength = int.MaxValue;
			nancyConventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("/", "content"));
			base.ConfigureConventions(nancyConventions);
		}
	}
}