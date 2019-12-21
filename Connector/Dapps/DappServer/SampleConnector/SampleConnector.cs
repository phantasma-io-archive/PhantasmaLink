using System;
using LunarLabs.Parser;
using Phantasma.API;
using Phantasma.Cryptography;
using Phantasma.Domain;
using Phantasma.SDK;

namespace Phantasma.Dapps
{
    public class SampleConnector: WalletLink
    {
        private readonly PhantasmaAPI api;
        private PhantasmaKeys keys;

        protected override PhantasmaKeys Keys => keys; 

        public SampleConnector(PhantasmaAPI api) : base("Sample Connector")
        {
            this.api = api;
            this.keys = PhantasmaKeys.FromWIF("L4cMNZPCQACkjVu74jfdstoeJQozg5QEveCUvvw4tAYGoyC5qjEU");
            Console.WriteLine("Wallet address: " + keys.Address);
        }

        protected override void InvokeScript(string script, int id, Action<int, DataNode, bool> callback)
        {
            api.InvokeRawScript("main", script, (x) =>
            {
                var root = APIUtils.FromAPIResult(new Invocation()
                {
                    result = x.result // TODO support multiple results
                });
                callback(id, root, true);

            }, (error, log) =>
            {
                var root = APIUtils.FromAPIResult(new Error() { message = log });
                callback(id, root, false);
            });
        }
    }
}
