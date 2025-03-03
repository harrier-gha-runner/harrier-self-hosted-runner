import {
  EC2Client,
  CreateRouteCommand,
  CreateRouteCommandInput,
} from "@aws-sdk/client-ec2";
import { configHarrier } from "../../../config/configHarrier";

const ec2Client = new EC2Client({ region: configHarrier.region });

export const createRoute = async (
  routeTableId: string,
  internetGatewayId: string
): Promise<void> => {
  try {
    const params: CreateRouteCommandInput = {
      RouteTableId: routeTableId,
      DestinationCidrBlock: "0.0.0.0/0",
      GatewayId: internetGatewayId,
    };

    const command = new CreateRouteCommand(params);
    await ec2Client.send(command);

    console.log(
      `   Route to Internet Gateway ${internetGatewayId} created in Route Table ${routeTableId}\n`
    );
  } catch (error) {
    throw new Error(`Error creating route: ${error}`);
  }
};
