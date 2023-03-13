import { useContractReads } from 'wagmi';
import { BigNumber } from 'ethers';
import votingABI from '../utils/VotingABI.json';
import { VOTING_CONTRACT } from '../consts/goerli';

const useVoting = (
  voterAddress: string
): {
  isFetching: boolean;
  startTime: number;
  endTime: number;
  registered: boolean;
  voteResult: number;
} => {
  // fetch king and last deposit from contract
  const { data, isFetching } = useContractReads({
    contracts: [
      {
        address: VOTING_CONTRACT,
        abi: votingABI,
        functionName: 'startTime',
      },
      {
        address: VOTING_CONTRACT,
        abi: votingABI,
        functionName: 'endTime',
      },
      {
        address: VOTING_CONTRACT,
        abi: votingABI,
        functionName: 'registered',
        args: [voterAddress],
      },
      {
        address: VOTING_CONTRACT,
        abi: votingABI,
        functionName: 'voteResult',
        args: [voterAddress],
      },
    ],
    watch: true,
  });

  if (data) {
    const [startTime, endTime, registered, voteResult] = data;

    return {
      isFetching,
      startTime: BigNumber.from(startTime || 0).toNumber(),
      endTime: BigNumber.from(endTime || 0).toNumber(),
      registered: registered ? Boolean(registered) : false,
      voteResult: BigNumber.from(voteResult || 0).toNumber(),
    };
  }

  return {
    isFetching,
    startTime: 0,
    endTime: 0,
    registered: false,
    voteResult: 0,
  };
};

export default useVoting;
