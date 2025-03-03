import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { configHarrier } from "../../../config/configHarrier";

export const initializeEC2Status = async () => {
  const client = new S3Client({ region: configHarrier.region });

  const statusObject = {
    status: "offline",
    lastRun: {
      // timeStamp: "",
      // user: "",
      // organization: "",
      // repository: "",
      // branch: "",
      // workflow: "",
      // job: "",
    },
  };
  const statusString = JSON.stringify(statusObject);

  const EC2InstanceIds = configHarrier.instanceIds;

  const nextIDObject = {
    nextId: EC2InstanceIds.length,
  };
  const nextIDString = JSON.stringify(nextIDObject);

  try {
    for (const instanceId of EC2InstanceIds) {
      const command = new PutObjectCommand({
        Bucket: configHarrier.s3Name,
        Key: `runner-statuses/${instanceId}.json`,
        Body: statusString,
        ContentType: "application/json",
      });

      await client.send(command);
    }

    const command = new PutObjectCommand({
      Bucket: configHarrier.s3Name,
      Key: `runner-statuses/nextId.json`,
      Body: nextIDString,
      ContentType: "application/json",
    });

    await client.send(command);

    console.log(`✅ Successfully initialized S3 with EC2 status "offline".\n`);
  } catch (error) {
    throw new Error(`❌ Error initializing S3 with EC2 status: ${error}`);
  }
};
