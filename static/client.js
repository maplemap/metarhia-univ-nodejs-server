'use strict';

const API_HOST = '127.0.0.1:3002';
const TRANSPORT_LINK = {
  WS: `ws://${API_HOST}`,
  HTTP: `http://${API_HOST}`,
};

const scaffoldApiMaker = (structure, handler) => {
  const api = {};
  const services = Object.keys(structure);

  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = handler(serviceName, methodName);
    }
  }
  return api;
};

const transport = {
  ws(structure) {
    const socket = new WebSocket(TRANSPORT_LINK.WS);
    
    const getWebSocketHandler =
      (serviceName, methodName) =>
        (...args) =>
          new Promise((resolve) => {
            const packet = {name: serviceName, method: methodName, args};
            socket.send(JSON.stringify(packet));
            socket.onmessage = (event) => {
              const data = JSON.parse(event.data);
              resolve(data);
            };
          });
    
    const scaffoldApi = scaffoldApiMaker(structure, getWebSocketHandler);
    return new Promise(resolve => {
      socket.addEventListener('open', () => resolve(scaffoldApi));
    })
  },
  http(structure) {
    const getHttpHandler =
      (serviceName, methodName) =>
        (...args) =>
          new Promise((resolve, reject) => {
            fetch(`${TRANSPORT_LINK.HTTP}/api/${serviceName}/${methodName}`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({args}),
            }).then((res) => {
              if (res.status === 200) resolve(res.json());
              else reject(new Error(`Status Code: ${res.status}`));
            });
          });
    
    return Promise.resolve(scaffoldApiMaker(structure, getHttpHandler));
  }
}

const scaffold = (url, structure) => {
  const transportHandler = {
    [TRANSPORT_LINK.WS]: transport.ws,
    [TRANSPORT_LINK.HTTP]: transport.http,
  };
  return transportHandler[url](structure);
};

(async () => {
  const api = await scaffold(
    TRANSPORT_LINK.WS,
    {
      user: {
        create: ['record'],
        read: ['id'],
        update: ['id', 'record'],
        delete: ['id'],
        find: ['mask'],
      },
      country: {
        read: ['id'],
        delete: ['id'],
        find: ['mask'],
      },
    }
  );

  const result = await api.user.read();
  console.log(result);
})();

