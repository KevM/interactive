﻿define({
    createDotnetInteractiveClient: function (address, global) {
        let rootUrl = address;
        if (!address.endsWith("/")) {
            rootUrl = `${rootUrl}/`;
        }

        async function clientFetch(url, init) {
            let address = url;
            if (!address.startsWith("http")) {
                address = `${rootUrl}${url}`;
            }
            let response = await fetch(address, init);
            return response;
        };

       

        let client = {};

        client.fetch = clientFetch;

        client.getVariable = async (kernel, variable) => {
            let response = await clientFetch(`variables/${kernel}/${variable}`);
            let variableValue = await response.json();
            return variableValue;
        };

        client.getReource = async (resource) => {
            let response = await clientFetch(`resources/${resource}`);
            return response;
        };

        client.getReourceUrl = (resource) => {
            let resourceUrl = `${rootUrl}resources/${resource}`;
            return resourceUrl;
        };

        client.loadKernels = () => {
            clientFetch("kernels")
                .then(r => {
                    return r.json();
                })
                .then(kernelNames => {
                    global.kernels = {};
                    if (Array.isArray(kernelNames) && kernelNames.length > 0) {
                        for (let index = 0; index < kernelNames.length; index++) {
                            let kernelName = kernelNames[index];
                            global.kernels[kernelName] = {
                                getVariable: (variableName) => {
                                    return client.getVariable(kernelName, variableName);
                                }
                            }
                        }
                    }
                });
        }

        global.dotnet = client;
        global.kernels = { };

        client.loadKernels();

    }

});