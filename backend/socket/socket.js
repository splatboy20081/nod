const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
const DDB = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
const DDBDoc = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

on("join", async (data, socket) => {
  const username = data.username ? data.username : "none";
  const team = data.team ? data.team : "none";

  var params = {
    TableName: process.env.connectionDb,
    Item: {
      connectionId: { S: socket.id },
      meetingId: { S: data.id },
      username: { S: username },
      team: { S: team },
      connectedAt: { S: new Date().toISOString().match(/(\d{2}:){2}\d{2}/)[0] }
    }
  };
  try {
    await DDB.putItem(params).promise();
  } catch (error) {
    throw new Error(error);
  }
});

on("disconnect", async (data, socket) => {
  var params = {
    TableName: process.env.connectionDb,
    Key: {
      connectionId: { S: socket.id },
      meetingId: { S: data.id }
    }
  };
  try {
    await DDB.deleteItem(params).promise();
  } catch (error) {
    throw new Error(error);
  }
});

on("ping", async (data, socket) => {
  await socket.send(JSON.stringify({ action: "PING" }), socket.id);
});

on("default", async (data, socket) => {
  const parsedData = JSON.parse(data);
  try {
    let connectionData = await DDBDoc.scan({
      TableName: process.env.connectionDb,
      ProjectionExpression: "connectionId",
      FilterExpression: "meetingId = :meetingId and connectionId <> :userId",
      ExpressionAttributeValues: {
        ":meetingId": parsedData.message.id,
        ":userId": socket.id
      }
    }).promise();
    connectionData.Items.map(async ({ connectionId }) => {
      await socket.send(data, connectionId);
    });
  } catch (error) {
    throw new Error(error);
  }
});
