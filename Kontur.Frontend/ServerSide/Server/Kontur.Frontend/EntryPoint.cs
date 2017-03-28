using System;
using Microsoft.Owin.Hosting;

namespace Kontur.Frontend
{
    public class EntryPoint
    {
        public static void Main(string[] args)
        {
			var commandLineParser = new Fclp.FluentCommandLineParser<Options>();

            commandLineParser
                .Setup(options => options.Prefix)
                .As("prefix")
                .SetDefault("http://+:8080/")
                .WithDescription("HTTP prefix to listen on");

            commandLineParser
                .SetupHelp("h", "help")
                .WithHeader($"{AppDomain.CurrentDomain.FriendlyName} [--prefix <prefix>]")
                .Callback(text => Console.WriteLine(text));

            if (commandLineParser.Parse(args).HelpCalled)
                return;

            RunServer(commandLineParser.Object);
        }

        private static void RunServer(Options options)
        {
            using (WebApp.Start<NancyServer>(options.Prefix))
            {
	            Console.WriteLine("Server is up on " + options.Prefix);
	            Console.WriteLine("Press Enter to shutdown...");
                Console.ReadLine();
            }
        }

        private class Options
        {
            public string Prefix { get; set; }
        }
    }
}
