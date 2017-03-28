namespace Kontur.Frontend
{
	public class NancyServer
	{
		public void Configuration(Owin.IAppBuilder app) { Owin.AppBuilderExtensions.UseNancy(app); }
	}
}