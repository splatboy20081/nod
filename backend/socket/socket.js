const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
const DDB = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
const DDBDoc = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

on("connect", async (data, socket) => {
  socket.send(JSON.stringify({ status: "connected" }));
});

on("join", async (data, socket) => {
  let result;
  var params = {
    TableName: process.env.connectionDb,
    Item: {
      connectionId: { S: socket.id },
      meetingId: { S: data.id }
    }
  };
  try {
    result = await DDB.putItem(params).promise();
  } catch (error) {
    throw new Error(error);
  }
});

on("disconnect", async (data, socket) => {
  let result;
  var params = {
    TableName: process.env.connectionDb,
    Key: {
      connectionId: { S: socket.id }
    }
  };
  try {
    result = await DDB.deleteItem(params).promise();
  } catch (error) {
    throw new Error(error);
  }

  await socket.send({ status: "disconnected" });
});

on("default", async (data, socket) => {
  let connectionData;
  const parsedData = JSON.parse(data);
  const id = parsedData.id;

  try {
    connectionData = await DDBDoc.scan({
      TableName: process.env.connectionDb,
      ProjectionExpression: "connectionId",
      FilterExpression: "meetingId = :id",
      ExpressionAttributeValues: {
        ":id": id
      }
    }).promise();
  } catch (error) {
    throw new Error(error);
  }
  connectionData.Items.map(async ({ connectionId }) => {
    await socket.send(data, connectionId);
  });
});
