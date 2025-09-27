const { ethers } = require('ethers');
const CONTRACT_ABI = require('../config/abi.json');

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x1234567890123456789012345678901234567890"; // Replace with actual contract address


class SmartContractService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.initialize();
    }

    initialize() {
        try {
            const rpcUrl = process.env.RPC_URL || "";
            this.provider = new ethers.JsonRpcProvider(rpcUrl);

            const privateKey = process.env.PRIVATE_KEY;
            if (privateKey) {
                this.signer = new ethers.Wallet(privateKey, this.provider);
                this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
            } else {
                console.warn("No private key provided. Smart contract functions will not be available.");
                this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
            }
        } catch (error) {
            console.error("Failed to initialize smart contract service:", error);
        }
    }

    async recordHiringOutcome(candidateAddress, isHired) {
        try {
            if (!this.signer) {
                throw new Error("No signer available. Cannot execute transaction.");
            }

            if (!ethers.isAddress(candidateAddress)) {
                throw new Error("Invalid candidate address format");
            }

            console.log(`Recording hiring outcome for ${candidateAddress}: ${isHired ? 'HIRED' : 'NOT HIRED'}`);

            const tx = await this.contract.recordHiringOutcome(candidateAddress, isHired);

            console.log(`Transaction sent: ${tx.hash}`);

            const receipt = await tx.wait();

            console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);

            return {
                success: true,
                transactionHash: tx.hash,
                blockNumber: receipt.blockNumber,
                candidateAddress,
                isHired
            };
        } catch (error) {
            console.error("Error recording hiring outcome:", error);
            return {
                success: false,
                error: error.message,
                candidateAddress,
                isHired
            };
        }
    }

    async recordMultipleHiringOutcomes(hiringOutcomes) {
        const results = [];

        for (const outcome of hiringOutcomes) {
            try {
                const result = await this.recordHiringOutcome(
                    outcome.candidateAddress,
                    outcome.isHired
                );
                results.push({
                    ...outcome,
                    smartContractResult: result
                });

                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Failed to record outcome for ${outcome.candidateAddress}:`, error);
                results.push({
                    ...outcome,
                    smartContractResult: {
                        success: false,
                        error: error.message,
                        candidateAddress: outcome.candidateAddress,
                        isHired: outcome.isHired
                    }
                });
            }
        }

        return results;
    }

    async getContractInfo() {
        try {
            const network = await this.provider.getNetwork();
            return {
                contractAddress: CONTRACT_ADDRESS,
                network: network.name,
                chainId: network.chainId
            };
        } catch (error) {
            console.error("Error getting contract info:", error);
            return {
                error: error.message
            };
        }
    }
}

module.exports = new SmartContractService();
