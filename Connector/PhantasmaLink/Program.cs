using System;
using System.Text;
using LunarLabs.Parser;
using LunarLabs.Parser.JSON;
using LunarLabs.WebServer.Core;
using LunarLabs.WebServer.HTTP;
using LunarLabs.WebSockets;
using Phantasma.API;
using Phantasma.Cryptography;
using Phantasma.SDK;

namespace PhantasmaLink
{
    public class CustomLink: WalletLink
    {
        private readonly API api;
        private PhantasmaKeys keys;

        protected override PhantasmaKeys Keys => keys; 

        public CustomLink(API api)
        {
            this.api = api;
            this.keys = PhantasmaKeys.FromWIF("L4cMNZPCQACkjVu74jfdstoeJQozg5QEveCUvvw4tAYGoyC5qjEU");
            Console.WriteLine("Wallet address: " + keys.Address);
        }

        protected override void InvokeScript(string script, int id, Action<int, DataNode, bool> callback)
        {
            api.InvokeRawScript("main", script, (x) =>
            {
                var root = Phantasma.API.APIUtils.FromAPIResult(new Invocation()
                {
                    result = x.result // TODO support multiple results
                });
                callback(id, root, true);

            }, (error, log) =>
            {
                var root = Phantasma.API.APIUtils.FromAPIResult(new Error() { message = log });
                callback(id, root, false);
            });
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            // either parse the settings from the program args or initialize them manually
            var settings = ServerSettings.Parse(args);

            settings.Port = 7707;

            var api = new API("localhost");

            var server = new HTTPServer(settings, ConsoleLogger.Write);

            var link = new CustomLink(api);

            Console.WriteLine("Starting Phantasma Link sample wallet at port " + settings.Port);

            server.Get("/", (request) =>
            {
                return HTTPResponse.FromString("Phantasma LINK API");
            });

            /*
            server.Get("/authorize/{dapp}", (request) =>
            {
                return link.Execute(request.url);
            });

            server.Get("/getAccount/{dapp}/{token}", (request) =>
            {
                return link.Execute(request.url);
            });

            server.Get("/invokeScript/{script}/{dapp}/{token}", (request) =>
            {
                return link.Execute(request.url);
            });*/

            server.WebSocket("/", (socket) =>
            {
                while (socket.IsOpen)
                {
                    var msg = socket.Receive();

                    if (msg.CloseStatus == WebSocketCloseStatus.None)
                    {
                        var str = Encoding.UTF8.GetString(msg.Bytes);

                        link.Execute(str, (id, root, success) =>
                        {
                            root.AddField("id", id);
                            root.AddField("success", success);

                            var json = JSONWriter.WriteToString(root);
                            socket.Send(json);
                        });

                    }
                }
            });

            server.Run();
        }
    }
}
