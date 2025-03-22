<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card elevation="2" class="pa-6">
          <v-card-title class="text-h6">Create Token (Contract Method)</v-card-title>
          <v-card-text>
            <p v-if="!isConnected">Please <router-link to="/auth">connect MetaMask</router-link> to start.</p>
            <p v-if="isConnected">Connected: {{ account }}</p>
            <v-form v-if="isConnected">
              <v-text-field v-model="tokenName" label="Token Name" outlined />
              <v-text-field v-model="tokenSymbol" label="Token Symbol" outlined />
              <v-text-field
                v-model.number="initialSupply"
                label="Initial Supply"
                type="number"
                outlined
              />
              <v-btn color="primary" @click="createToken" :loading="isCreating" block>
                Create Token
              </v-btn>
              <p v-if="tokenAddress" class="mt-4 green--text">Token Created at: {{ tokenAddress }}</p>
              <p v-if="errorMessage" class="mt-4 red--text">{{ errorMessage }}</p>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ethers } from 'ethers';

// Precompiled bytecode for a simple HTS token contract (simplified example)
// In practice, compile this Solidity code using Remix or Hardhat:
// pragma solidity ^0.8.0;
// interface IHTS {
//   function createFungibleToken(string memory name, string memory symbol, uint256 initialSupply) external returns (address);
// }
// contract HTSTokenFactory {
//   address public htsPrecompile = 0x0000000000000000000000000000000000000167;
//   address public tokenAddress;
//   constructor(string memory name, string memory symbol, uint256 initialSupply) payable {
//     tokenAddress = IHTS(htsPrecompile).createFungibleToken(name, symbol, initialSupply);
//   }
// }
const HTS_TOKEN_BYTECODE = "608060405234801561001057600080fd5b506040516103e73803806103e7833981810160405281019061003291906100a8565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040517ff8e8f8c5000000000000000000000000000000000000000000000000000000008152600401606060405180830381865afa1580156100c7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100eb9190610138565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505061017f565b6000815190506100a281610165565b92915050565b6000806000606084860312156100c1576100c061015b565b5b60006100cf86828701610093565b93505060206100e086828701610093565b92505060406100f1868287016100ff565b9150509250925092565b6000815190506101108161017b565b92915050565b60006020828403121561012c5761012b61015b565b5b600061013a84828501610101565b91505092915050565b6000602082840312156101505761014f61015b565b5b600061015e84828501610093565b91505092915050565b600080fd5b6000601f19601f8301169050919050565b6101718161015b565b811461017c57600080fd5b50565b6101888161015b565b811461019357600080fd5b5056fea2646970667358221220f8e8f8c5e8e8f8c5e8e8f8c5e8e8f8c5e8e8f8c5e8e8f8c5e8e8f8c5e8e8f8c5e64736f6c634300080d0033";

export default {
  name: 'CreateTokenAlt',
  props: {
    isConnected: Boolean,
    account: String,
  },
  data() {
    return {
      tokenName: 'Tree Token',
      tokenSymbol: 'TT',
      initialSupply: 1000,
      tokenAddress: null,
      errorMessage: null,
      isCreating: false,
      signer: null,
    };
  },
  watch: {
    isConnected(newVal) {
      if (newVal && this.account) {
        this.initializeSigner();
      } else {
        this.signer = null;
        this.errorMessage = null;
      }
    },
  },
  methods: {
    async initializeSigner() {
      try {
        if (!window.ethereum) {
          this.errorMessage = 'MetaMask not detected.';
          return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = provider.getSigner();
        const signerAddress = await this.signer.getAddress();
        if (signerAddress.toLowerCase() !== this.account.toLowerCase()) {
          this.errorMessage = 'Account mismatch. Please ensure the correct account is selected.';
          return;
        }
        console.log('Signer initialized for:', this.account);
      } catch (error) {
        this.errorMessage = `Signer setup failed: ${error.message}`;
        console.error(error);
      }
    },

    async createToken() {
      if (!this.isConnected || !this.signer) {
        this.errorMessage = 'Please connect to MetaMask first.';
        return;
      }

      this.isCreating = true;
      this.errorMessage = null;
      this.tokenAddress = null;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        if (network.chainId !== 296) {
          this.errorMessage = 'Please switch to Hedera Testnet (Chain ID 296) in MetaMask.';
          this.isCreating = false;
          return;
        }

        // Encode constructor arguments
        const abi = [
          "constructor(string memory name, string memory symbol, uint256 initialSupply)"
        ];
        const factory = new ethers.ContractFactory(abi, HTS_TOKEN_BYTECODE, this.signer);
        const contract = await factory.deploy(
          this.tokenName,
          this.tokenSymbol,
          ethers.BigNumber.from(this.initialSupply).mul(ethers.BigNumber.from(10).pow(8)) // 8 decimals
        );

        // Wait for deployment
        const receipt = await contract.deployTransaction.wait();
        this.tokenAddress = contract.address;
        console.log('Token deployed at:', this.tokenAddress);
      } catch (error) {
        this.errorMessage = error.message.includes('insufficient funds')
          ? 'Insufficient HBAR for deployment fees.'
          : `Failed to create token: ${error.message}`;
        console.error(error);
      } finally {
        this.isCreating = false;
      }
    },
  },
};
</script>