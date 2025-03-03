import {
  EC2Client,
  ModifySubnetAttributeCommandInput,
  ModifySubnetAttributeCommand,
} from "@aws-sdk/client-ec2";
import { configHarrier } from "../../../config/configHarrier";

const ec2Client = new EC2Client({ region: configHarrier.region });

export const autoAssignPublicIp = async (subnetId: string) => {
  try {
    const params: ModifySubnetAttributeCommandInput = {
      SubnetId: subnetId,
      MapPublicIpOnLaunch: { Value: true }, // Enable auto-assign public IPv4
    };

    const command = new ModifySubnetAttributeCommand(params);
    await ec2Client.send(command); // Returns empty {} on success or throws reject error if fails

    console.log(
      "   Auto-assign public IPv4 enabled for Subnet:",
      subnetId,
      "\n"
    );
  } catch (error: unknown) {
    throw new Error(
      `Error enabling auto-assign public IPv4 on ${subnetId}: ${error}`
    );
  }
};
