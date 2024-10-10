import deployedContracts from "~~/contracts/deployedContracts";
import scaffoldConfig from "~~/scaffold.config";

export const CAMPAIGN_FACTORY_CONTRACT = deployedContracts[scaffoldConfig.targetNetworks[0].id].CampaignFactory;
